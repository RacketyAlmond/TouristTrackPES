import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale.cjs';
import Comment from './comment';

export default function Question({
  forumId,
  questionId,
  userId,
  user,
  date,
  text,
}) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [showNewAnswer, setShowNewAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);

  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
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

  const getAnswers = React.useCallback(async () => {
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
              nationality, //--> de momento no se filtra por nacionalidad de respuesta
              user,
            };
          }),
        );
        setAllAnswers(respuestas);
      }
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
    }
  }, [forumId, questionId]);

  useEffect(() => {
    getAnswers();
  }, []);

  // Función para añadir una nueva respuesta
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
    }
  };

  return (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold' }}>{user}</Text>
          <Text style={{ color: 'gray' }}>{relativeTime}</Text>
        </View>
        <Text>{text}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}
      >
        <TouchableOpacity onPress={() => setShowAnswers(!showAnswers)}>
          <Text style={{ color: '#572364' }}>
            {showAnswers ? 'Ocultar' : `${allAnswers.length} respuestas`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowNewAnswer(!showNewAnswer)}>
          <Text style={{ color: '#572364' }}>
            {showNewAnswer ? 'No Responder' : 'Responder'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renderiza el campo de texto para la nueva respuesta si showNewAnswer es true */}
      {showNewAnswer && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 5,
            }}
            placeholder='Escribe tu respuesta...'
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
              />
              <TouchableOpacity onPress={() => deleteAnswer(answer.id)}>
                <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
