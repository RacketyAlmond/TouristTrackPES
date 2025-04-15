import React from 'react';
import { View, Image, ScrollView } from 'react-native';
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
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            width: '90%',
            padding: 20,
            alignSelf: 'center',
            marginTop: 20,
            position: 'relative',
          }}
        >
          <Title title={data.city} />
          {data.questions.map((question, index) => (
            <View key={index} style={{ marginVertical: 10 }}>
              <Question
                user={question.user}
                date={question.date}
                text={question.question}
                answers={question.answers}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
