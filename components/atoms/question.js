/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import enUS from 'date-fns/locale/en-US';
import Comment from './comment';
import { getRankByLevel, getLevelInfo } from '../molecules/levelProgress.js'; // Importa la función de rangos
import { auth } from '../../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import config from '../../config';
import { useUser } from '../atoms/UserContext';

export default function Question({
  forumId,
  questionId,
  userId,
  user,
  date,
  text,
  points,
}) {
  // namespace 'foro', además extraemos i18n.language
  const { t, i18n } = useTranslation('foro');
  const { userData, getUserData, updateUserPoints } = useUser();

  const [showAnswers, setShowAnswers] = useState(false);
  const [showNewAnswer, setShowNewAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);
  const [userRank, setUserRank] = useState(
    getRankByLevel(getLevelInfo(points).currentLevel, true),
  );
  const currentUser = auth.currentUser;
  const idCurrentUser = currentUser.uid;

  // Elegimos el locale de date-fns según el idioma activo
  const locale = i18n.language === 'es' ? es : enUS;
  // formateo con sufijo ("hace X" o "X ago")
  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale,
  });

  const getUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `***REMOVED***/users/${userId}`,
      );
      const json = await response.json();

      if (json.success && json.usuario) {
        const { firstName, userLocation, points } = json.usuario;
        return {
          user: firstName || 'Desconocido',
          nationality: userLocation || 'Desconocido',
          points: points.current || 0,
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
        `***REMOVED***/forums/${forumId}/preguntas/${questionId}/respuestas/${answerId}`,
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
        `***REMOVED***/forums/${forumId}/preguntas/${questionId}/respuestas`,
      );
      const json = await response.json();
      if (json.success) {
        const respuestas = await Promise.all(
          json.respuestas.map(async (a) => {
            const { user, nationality, points } = await getUserInfo(a.Author);
            return {
              id: a.id,
              userId: a.Author,
              answer: a.text,
              date: new Date(a.date._seconds * 1000).toISOString(),
              nationality,
              user,
              points,
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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (currentUser && currentUser.uid) {
          await getUserData();
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      }
    };
    loadUserData();
  }, [currentUser]);

  // Añadir nueva respuesta
  const handleAddAnswer = async () => {
    if (newAnswer.trim() !== '') {
      try {
        const response = await fetch(
          `***REMOVED***/forums/${forumId}/preguntas/${questionId}/respuestas`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Author: idCurrentUser, // Reemplaza con el ID del usuario autenticado
              text: newAnswer,
            }),
          },
        );

        print('aaa');

        const json = await response.json();

        if (!response.ok) {
          console.error('Error al enviar la pregunta:', json);
          return;
        }

        if (json.success) {
          updateUserPoints(100);
          const { user, nationality, points } =
            await getUserInfo(idCurrentUser); // Reemplaza con el ID del usuario autenticado

          const firstName = userData.firstName;
          console.log(userData.firstName);
          const newAnswerObject = {

            id: json.preguntaId,
            userId: idCurrentUser,
            answer: newAnswer,
            date: new Date().toISOString(),
            user: firstName,
            nationality,
            points,
          };
          setAllAnswers([...allAnswers, newAnswerObject]);
          setNewAnswer('');
        } else {
          console.error('Error al enviar la pregunta:', json.message);
        }
      } catch (error) {
        console.error('Error en la solicitud POST:', error);
      }
    }
  };

  return (
    <View
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{user}</Text>
            {userRank && (
              <Image
                source={userRank.icon}
                style={{ width: 20, height: 20, marginLeft: 5 }}
                resizeMode='contain'
              />
            )}
          </View>
          <Text style={{ color: 'gray' }}>{relativeTime}</Text>
        </View>
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
            {showAnswers ? t('hide') : `${allAnswers.length} ${t('answers')}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowNewAnswer((v) => !v)}>
          <Text style={{ color: '#572364' }}>
            {showNewAnswer ? t('no-reply') : t('reply')}
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
            placeholder={t('answer')}
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

      {/* Renderiza las respuestas si showAnswers es true */}
      {showAnswers && (
        <View>
          {allAnswers.map((answer, answerIndex) => (
            <View key={answerIndex}>
              <Comment
                user={answer.user}
                date={answer.date}
                text={answer.answer}
                points={answer.points}
                locale={locale}
              />
              {answer.userId === idCurrentUser ? (
                <TouchableOpacity onPress={() => deleteAnswer(answer.id)}>
                  <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              ) : (
                ''
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
