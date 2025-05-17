import React, { useEffect, useState } from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Title from '../atoms/title';
import DetailsAct from '../atoms/detailsAct';
import Question from '../atoms/question';
import ForoSearchBar from '../molecules/foroSearchBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../../config';

export default function Forum({ route }) {
  const { forumId, localityName } = route.params;
  const [actDescription, setActDescription] = useState('');
  const [isActividad, setIsActividad] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]); // Estado para los países seleccionados

  /*obtiene la información de la actividad*/
  const getForumDetails = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/forums/${forumId}`);
      const json = await response.json();
      if (json.success && json.forum) {
        const forum = json.forum;
        const actividad = forum.Actividad?.trim();
        const descripcion = forum.Descripcion ? forum.Descripcion : '';

        setIsActividad(!!actividad);
        setActDescription(actividad ? descripcion : '');
      }
    } catch (error) {
      console.error('Error al obtener detalles del foro:', error);
    }
  };

  /* obtiene los datos de usuario, Nombre y Nacionalidad a través de su docId en Users */
  const getUserInfo = async (userId) => {
    try {
      const response = await fetch(`${config.BASE_URL}/users/${userId}`);
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

  /* llama a la api para obtener las preguntas del foro a través del docId: forumId */
  const getQuestions = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/forums/${forumId}/preguntas`,
      );

      const json = await response.json();
      if (json.success) {
        const preguntas = await Promise.all(
          json.preguntas.map(async (q) => {
            const { user, nationality } = await getUserInfo(q.Author);
            return {
              id: q.id,
              userId: q.Author,
              question: q.text,
              date: new Date(q.date._seconds * 1000).toISOString(),
              nationality,
              user,
            };
          }),
        );
        setQuestions(preguntas);
        setFilteredQuestions(preguntas);
      }
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
    }
  };

  useEffect(() => {
    getForumDetails();
    getQuestions();
  }, []);

  // Extraer las nacionalidades únicas de las preguntas
  const availableNationalities = Array.from(
    new Set(questions.map((q) => q.nationality)),
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

  const handleAddQuestion = async () => {
    if (newQuestion.trim() !== '') {
      try {
        const response = await fetch(
          `${config.BASE_URL}/forums/${forumId}/preguntas/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Author: 'NewUserId', // Reemplaza con el ID del usuario autenticado
              text: newQuestion,
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

          const newQuestionObject = {
            id: json.preguntaId,
            userId: 'NewUserId', // Reemplaza con el ID del usuario autenticado
            question: newQuestion,
            date: new Date().toISOString(),
            user,
            nationality,
          };

          const updatedQuestions = [...questions, newQuestionObject];
          setQuestions(updatedQuestions);
          filterQuestions('', selectedCountries, updatedQuestions);
          setNewQuestion('');
        } else {
          console.error('Error al enviar la pregunta:', json.message);
        }
      } catch (error) {
        console.error('Error en la solicitud POST:', error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../public/mapa.png')}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        resizeMode='cover'
      >
        {/* Barra de búsqueda */}
        <View style={{ flex: 1, marginTop: 40, padding: 20 }}>
          <ForoSearchBar
            onSearch={handleSearch}
            availableNationalities={availableNationalities} // Pasar las nacionalidades únicas
            selectedCountries={selectedCountries} // Pasar los países seleccionados
            setSelectedCountries={handleFilterByCountries} // Actualizar los países seleccionados
          />

          <View
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
            <Title title={localityName} />

            {isActividad && actDescription ? (
              <DetailsAct descriptionText={actDescription} />
            ) : null}

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
                placeholderTextColor='#888'
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
                <View key={index} style={{ marginVertical: 0 }}>
                  <Question
                    forumId={forumId}
                    questionId={question.id}
                    userId={question.userId}
                    text={question.question}
                    user={question.user}
                    date={question.date}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
