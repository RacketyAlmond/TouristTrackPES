import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import config from '../../config';

const EXTERNAL_API = config.EXTERNAL_API; // Pon aquí la URL externa real
const BASE_URL = config.BASE_URL;

export default function CrearForosActividades() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /*Obtener actividades de la API externa*/
  const fetchActividades = async () => {
    try {
      const response = await fetch(`${EXTERNAL_API}`); // Ajusta endpoint real de actividades externas
      const data = await response.json();
      console.log('📥 Actividades recibidas:', data);
      if (!response.ok) {
        const msg = data?.message || 'Error al obtener actividades';
        throw new Error(msg);
      }
      return data;
    } catch (err) {
      console.error('Error fetchActividades:', err);
      setError(err.message);
      return [];
    }
  };

  /*Obtener foros de tu backend*/
  const fetchForos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/forums`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Error al obtener foros');
      return data.forums || [];
    } catch (err) {
      console.error('Error fetchForos:', err);
      setError(err.message);
      return [];
    }
  };

  /*Crear foro en tu backend*/
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
      console.error('Error crearForo:', err);
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
      console.error('Error en sincronización:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('▶️ Ejecutando sincronización de foros...');
    sincronizarForosActividades();

    const interval = setInterval(() => {
      sincronizarForosActividades();
    }, 604800000); // 7 días en milisegundos

    return () => clearInterval(interval);
  }, []);

  if (loading) return <ActivityIndicator size='large' color='#572364' />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <Text>
        Sincronización de Foros de Actividades realizada correctamente.
      </Text>
    </View>
  );
}
