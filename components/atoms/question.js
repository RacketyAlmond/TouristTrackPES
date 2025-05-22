// components/molecules/Question.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import enUS from 'date-fns/locale/en-US';
import Comment from './comment';
import { useTranslation } from 'react-i18next';
import config from '../../config';

export default function Question({
  forumId,
  questionId,
  userId,
  user,
  date,
  text,
}) {
  // namespace 'foro', además extraemos i18n.language
  const { t, i18n } = useTranslation('foro');

  const [showAnswers, setShowAnswers] = useState(false);
  const [showNewAnswer, setShowNewAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);

  // Elegimos el locale de date-fns según el idioma activo
  const locale = i18n.language === 'es' ? es : enUS;
  // formateo con sufijo ("hace X" o "X ago")
  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale,
  });

  /* obtiene los datos de usuario, Nombre y Nacionalidad a través de su docId en Users */
  const getUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `https://touristrack.vercel.app/users/${userId}`,
      );
      const json = await response.json();

      if (json.success && json.usuario) {
        const { firstName, userLocation } = json.usuario;
        return {
          user: firstName || 'Desconocido',
          nationality: userLocation || 'Desconocido',
        };
      }
    } catch (error) {
      console.error(`Error al obtener datos del usuario ${userId}:`, error);
    }

    return { user: 'Desconocido', nationality: 'Desconocido' };
  };

  const deleteAnswer = async (answerId) => {
    try {
      const response = await fetch(
        `https://touristrack.vercel.app/forums/${forumId}/preguntas/${questionId}/respuestas/${answerId}`,
        {
          method: 'DELETE',
        },
      );

      const json = await response.json();
      if (json.success) {
        setAllAnswers((prev) => prev.filter((a) => a.id !== answerId));
      } else {
        console.error('No se pudo eliminar la respuesta:', json.error);
      }
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
    }
  };

  const getAnswers = useCallback(async () => {
    try {
      const response = await fetch(
        `https://touristrack.vercel.app/forums/${forumId}/preguntas/${questionId}/respuestas`,
      );
      const json = await response.json();
      if (json.success) {
        const respuestas = await Promise.all(
          json.respuestas.map(async (a) => {
            const { user, nationality } = await getUserInfo(a.Author);
            return {
              id: a.id,
              userId: a.Author,
              answer: a.text,
              date: new Date(a.date._seconds * 1000).toISOString(),
              nationality,
              user,
            };
          }),
        );
        setAllAnswers(respuestas);
      }
    } catch (error) {
      console.error('Error al obtener las respuestas:', error);
    }
  }, [forumId, questionId]);

  useEffect(() => {
    getAnswers();
  }, [getAnswers]);

  // Añadir nueva respuesta
  const handleAddAnswer = async () => {
    if (newAnswer.trim() !== '') {
      try {
        const response = await fetch(
          `https://touristrack.vercel.app/forums/${forumId}/preguntas/${questionId}/respuestas`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Author: 'NewUserId', // Reemplaza con el ID del usuario autenticado
              text: newAnswer,
            }),
          },
        );

        const json = await response.json();

        if (!response.ok) {
          console.error('Error al enviar la pregunta:', json);
          return;
        }

        if (json.success) {
          const { user, nationality } = await getUserInfo('NewUserId'); // Reemplaza con el ID del usuario autenticado

          const newAnswerObject = {
            id: json.preguntaId,
            userId: 'NewUserId', // Reemplaza con el ID del usuario autenticado
            answer: newAnswer,
            date: new Date().toISOString(),
            user,
            nationality,
          };

          setAllAnswers([...allAnswers, newAnswerObject]);
          setNewAnswer('');
        } else {
          console.error('Error al enviar la pregunta:', json.message);
        }
      } catch (error) {
        console.error('Error en la solicitud POST:', error);
      }
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
    }
  };

  return (
    <View
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold' }}>{user}</Text>
        <Text style={{ color: 'gray' }}>{relativeTime}</Text>
      </View>

      <Text style={{ marginVertical: 8 }}>{text}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
        }}
      >
        <TouchableOpacity onPress={() => setShowAnswers((v) => !v)}>
          <Text style={{ color: '#572364' }}>
            {showAnswers
              ? t('hideAnswers')
              : `${allAnswers.length} ${t('answers')}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowNewAnswer((v) => !v)}>
          <Text style={{ color: '#572364' }}>
            {showNewAnswer ? t('noReply') : t('reply')}
          </Text>
        </TouchableOpacity>
      </View>

      {showNewAnswer && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 5,
            }}
            placeholder={t('writeAnswer')}
            value={newAnswer}
            onChangeText={setNewAnswer}
          />
          <TouchableOpacity
            onPress={handleAddAnswer}
            style={{
              marginLeft: 10,
              backgroundColor: '#572364',
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {showAnswers &&
        allAnswers.map((answer, idx) => (
          <View key={idx}>
            <Comment
              user={answer.user}
              date={answer.date}
              text={answer.answer}
            />
            <TouchableOpacity onPress={() => deleteAnswer(answer.id)}>
              <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                {t('delete')}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
    </View>
  );
}
