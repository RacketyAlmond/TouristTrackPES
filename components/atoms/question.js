import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale.cjs';
import Comment from './comment';
import Avatar from './avatar';

export default function Question({
  avatar,
  user,
  nationality,
  date,
  text,
  answers,
}) {
  // Estado para mostrar u ocultar las respuestas
  const [showAnswers, setShowAnswers] = useState(false);

  // Estado para manejar la nueva respuesta
  const [showNewAnswer, setShowNewAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [allAnswers, setAllAnswers] = useState(answers);

  // Calcula el tiempo relativo
  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });

  // Función para añadir una nueva respuesta
  const handleAddAnswer = () => {
    setShowNewAnswer(false); // Oculta el campo de texto después de enviar la respuesta
    if (newAnswer.trim() !== '') {
      const newAnswerObject = {
        user: 'Nuevo Usuario', // Puedes reemplazar esto con el usuario actual
        date: new Date().toISOString(),
        answer: newAnswer,
      };
      setAllAnswers([...allAnswers, newAnswerObject]);
      setNewAnswer(''); // Limpia el campo de texto
    }
  };

  return (
    <View
      style={{
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <Avatar avatar={avatar} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ fontWeight: 'bold' }}>{user}</Text>
            <Text style={{ color: 'gray' }}>{relativeTime}</Text>
          </View>
          <Text>{text}</Text>
        </View>
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
            <Comment
              key={answerIndex}
              user={answer.user}
              date={answer.date}
              text={answer.answer}
            />
          ))}
        </View>
      )}
    </View>
  );
}
