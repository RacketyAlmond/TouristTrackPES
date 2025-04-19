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
import ForoSearchBar from '../molecules/foroSearchBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlEarphones } from 'react-icons/sl';

const data = {
  city: 'Madrid',
  questions: [
    {
      id: 1,
      user: 'Usuario1',
      nationality: 'España',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      question: '¿Qué es la ciudad de Madrid?',
      date: '2025-4-01',
      answers: [
        {
          id: 2,
          user: 'Usuario2',
          nationality: 'Francia',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          answer:
            'La ciudad de Madrid es una ciudad española ubicada en el centro de España.',
          date: '2023-10-02',
        },
        {
          id: 3,
          user: 'Usuario3',
          nationality: 'Francia',
          avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
          answer: 'Madrid es la capital de España y de la comunidad de Madrid.',
          date: '2023-10-03',
        },
      ],
    },
    {
      id: 4,
      user: 'Usuario4',
      nationality: 'Alemania',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      question: '¿Qué lugares turísticos hay en Madrid?',
      date: '2023-10-04',
      answers: [
        {
          id: 5,
          user: 'Usuario5',
          nationality: 'Alemania',
          avatar: 'https://randomuser.me/api/portraits/men/97.jpg',
          answer: 'El Palacio Real de Madrid.',
          date: '2023-10-05',
        },
        {
          id: 6,
          user: 'Usuario6',
          nationality: 'Francia',
          avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          answer: 'La Plaza Mayor de Madrid.',
          date: '2023-10-06',
        },
      ],
    },
  ],
};

export default function Forum() {
  const [questions, setQuestions] = useState(data.questions);
  const [filteredQuestions, setFilteredQuestions] = useState(data.questions);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]); // Estado para los países seleccionados

  // Extraer las nacionalidades únicas de las preguntas
  const availableNationalities = Array.from(
    new Set(data.questions.map((q) => q.nationality)),
  );

  const handleSearch = (query) => {
    filterQuestions(query, selectedCountries);
  };

  const handleFilterByCountries = (countries) => {
    setSelectedCountries(countries);
    filterQuestions('', countries);
  };

  const filterQuestions = (query, countries, questionsToFilter = questions) => {
    let filtered = questionsToFilter;

    // Filtrar por texto de búsqueda
    if (query.trim() !== '') {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Filtrar por países seleccionados
    if (countries.length > 0) {
      const countryNames = countries.map((country) => country.name); // Extraer nombres de los países
      filtered = filtered.filter((q) => countryNames.includes(q.nationality));
    }

    setFilteredQuestions(filtered);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== '') {
      const newQuestionObject = {
        user: 'Nuevo Usuario', // Puedes reemplazar esto con el usuario actual
        question: newQuestion,
        date: new Date().toISOString(),
        answers: [],
        nationality: 'España', // Puedes reemplazar esto con la nacionalidad del usuario actual
      };

      // Actualiza las preguntas
      const updatedQuestions = [...questions, newQuestionObject];
      setQuestions(updatedQuestions);

      // Aplica los filtros actuales usando la lista actualizada
      filterQuestions('', selectedCountries, updatedQuestions);

      // Limpia el campo de texto
      setNewQuestion('');
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
      {/* Barra de búsqueda */}
      <View style={{ flex: 1, marginTop: 40, padding: 20 }}>
        <ForoSearchBar
          onSearch={handleSearch}
          availableNationalities={availableNationalities} // Pasar las nacionalidades únicas
          selectedCountries={selectedCountries} // Pasar los países seleccionados
          setSelectedCountries={handleFilterByCountries} // Actualizar los países seleccionados
        />

        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            width: '100%',
            padding: 20,
            alignSelf: 'center',
            marginTop: 60,
            position: 'relative',
            borderRadius: 20,
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
              placeholderTextColor={'#888'}
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
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Lista de preguntas */}
            {filteredQuestions.map((question, index) => (
              <View key={index} style={{ marginVertical: 10 }}>
                <Question
                  user={question.user}
                  date={question.date}
                  text={question.question}
                  answers={question.answers}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
