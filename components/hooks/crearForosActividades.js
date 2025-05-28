import { useEffect, useState } from 'react';
import config from '../../config';

const EXTERNAL_API = config.EXTERNAL_API;
const BASE_URL = config.BASE_URL;

export default function useSyncForosActividades() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActividades = async () => {
    try {
      const response = await fetch(EXTERNAL_API);
      const data = await response.json();
      if (!response.ok) {
        const msg = data?.message || 'Error al obtener actividades';
        throw new Error(msg);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const fetchForos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/forums`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Error al obtener foros');
      return data.forums || [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const crearForo = async (actividad) => {
    try {
      const response = await fetch(`${BASE_URL}/forums`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Actividad: actividad.nom,
          Descripcion: actividad.descripcio,
          Ubicacion: {
            latitud: actividad.ubicacio.latitud,
            longitud: actividad.ubicacio.longitud,
          },
          DataIni: actividad.dataInici,
          DataFi: actividad.dataFi,
          Creador: actividad.creador,
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || 'Error al crear foro');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const sincronizarForosActividades = async () => {
    try {
      setLoading(true);
      setError(null);

      const actividades = await fetchActividades();
      const foros = await fetchForos();

      const forosActividad = foros.filter(
        (foro) =>
          foro.Actividad && foro.Actividad.trim().toLowerCase() !== 'null',
      );

      const nombresForosExistentes = new Set(
        forosActividad.map((foro) => foro.Actividad?.trim().toLowerCase()),
      );

      for (const actividad of actividades) {
        const nombreActividad = actividad.nom?.trim().toLowerCase();
        if (!nombreActividad || nombresForosExistentes.has(nombreActividad))
          continue;
        await crearForo(actividad);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sincronizarForosActividades();

    const interval = setInterval(() => {
      sincronizarForosActividades();
    }, 604800000); // 7 días

    return () => clearInterval(interval);
  }, []);

  return { loading, error };
}
