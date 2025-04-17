import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Title from '../atoms/title';
import Question from '../atoms/question';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = {
  city: 'Madrid',
  questions: [
    {
      user: 'Usuario1',
      question: '¿Qué es la ciudad de Madrid?',
      date: '2025-4-01',
      answers: [
        {
          user: 'Usuario2',
          answer:
            'La ciudad de Madrid es una ciudad española ubicada en el centro de España.',
          date: '2023-10-02',
        },
        {
          user: 'Usuario3',
          answer: 'Madrid es la capital de España y de la comunidad de Madrid.',
          date: '2023-10-03',
        },
      ],
    },
    {
      user: 'Usuario4',
      question: '¿Qué lugares turísticos hay en Madrid?',
      date: '2023-10-04',
      answers: [
        {
          user: 'Usuario5',
          answer: 'El Palacio Real de Madrid.',
          date: '2023-10-05',
        },
        {
          user: 'Usuario6',
          answer: 'La Plaza Mayor de Madrid.',
          date: '2023-10-06',
        },
      ],
    },
  ],
};

export default function Forum() {
  const [questions, setQuestions] = useState(data.questions);
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== '') {
      const newQuestionObject = {
        user: 'Nuevo Usuario', // Puedes reemplazar esto con el usuario actual
        question: newQuestion,
        date: new Date().toISOString(),
        answers: [],
      };
      setQuestions([...questions, newQuestionObject]);
      setNewQuestion(''); // Limpia el campo de texto
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={require('../../public/mapa.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            width: '90%',
            padding: 20,
            alignSelf: 'center',
            marginTop: 60,
            position: 'relative',
          }}
        >
          <Title title={data.city} />

          {/* Campo para escribir una nueva pregunta */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 10,
              }}
              placeholder='Escribe tu pregunta...'
              value={newQuestion}
              onChangeText={setNewQuestion}
            />
            <TouchableOpacity
              onPress={handleAddQuestion}
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

          {/* Lista de preguntas */}
          {questions.map((question, index) => (
            <View key={index} style={{ marginVertical: 10 }}>
              <Question
                user={question.user}
                date={question.date}
                text={question.question}
                answers={question.answers}
              />
            </View>
          ))}
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
