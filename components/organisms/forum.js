/* eslint-disable prettier/prettier */
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
import { useUser } from '../atoms/UserContext.js';
import { auth, db } from '../../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import config from '../../config';

export default function Forum({ route }) {
  const { t } = useTranslation('foro');
  const { userData, getUserData, updateUserPoints } = useUser();
  const { forumId, localityName } = route.params;
  const [actividadInfo, setActividadInfo] = useState('');
  const [isActividad, setIsActividad] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [fname, setFname] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const currentUser = auth.currentUser;
  const idCurrentUser = currentUser.uid;

  const getForumDetails = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/forums/${forumId}`);
      const json = await response.json();

      if (json.success && json.forum) {
        const forum = json.forum;

        const isActividadForum =
          forum.Actividad !== undefined && forum.Actividad !== null;
        setIsActividad(isActividadForum);

        if (isActividadForum) {
          const actividadData = {
            Titulo: forum.Actividad,
            Descripcion: forum.Descripcion ?? '',
            Ubicacion: forum.Ubicacion ?? { latitud: 0, longitud: 0 },
            DataIni: forum.DataIni ?? '',
            DataFi: forum.DataFi ?? '',
            Creador: forum.Creador ?? '',
          };
          setActividadInfo(actividadData);
        } else {
          setActividadInfo(null);
        }
      }
    } catch (error) {
      console.error('Error al obtener detalles del foro:', error);
    }
  };

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

  const getQuestions = async () => {
    try {
      const response = await fetch(
        `***REMOVED***/forums/${forumId}/preguntas`,
      );

      const json = await response.json();
      if (json.success) {
        const preguntas = await Promise.all(
          json.preguntas.map(async (q) => {
            const { user, nationality, points } = await getUserInfo(q.Author);
            return {
              id: q.id,
              userId: q.Author,
              question: q.text,
              date: new Date(q.date._seconds * 1000).toISOString(),
              user,
              nationality,
              points,
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

    if (query.trim() !== '') {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (countries.length > 0) {
      const countryNames = countries.map((country) => country.name);
      filtered = filtered.filter((q) => countryNames.includes(q.nationality));
    }

    setFilteredQuestions(filtered);
  };
  const getter = async () => {

    if (!currentUser) {
      return Promise.reject(new Error('No user is signed in'));
    }

    return getDoc(doc(db, 'Users', idCurrentUser))
      .then((userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();

          setFname(data.firstName);
          setUserLocation(data.userLocation);
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  useEffect(() => {
    getter();
  }, []);
  const handleAddQuestion = async () => {
    if (newQuestion.trim() !== '') {
      try {
        const response = await fetch(
          `***REMOVED***/forums/${forumId}/preguntas/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Author: idCurrentUser,
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
          updateUserPoints(50);
          const newQuestionObject = {
            id: json.preguntaId,
            Author: idCurrentUser,
            question: newQuestion,
            date: new Date().toISOString(),
            user: userData.firstName,
            userLocation,
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
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode='cover'
      >
        <View style={{ flex: 1, marginTop: 40, padding: 20 }}>
          <ForoSearchBar
            onSearch={handleSearch}
            availableNationalities={availableNationalities}
            selectedCountries={selectedCountries}
            setSelectedCountries={handleFilterByCountries}
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

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps='handled'
            >
              {isActividad && actividadInfo ? (
                <>
                  <DetailsAct actividadInfo={actividadInfo} />

                  <View style={{ marginVertical: 20, alignItems: 'center' }}>
                    <View
                      style={{
                        marginTop: 5,
                        height: 2,
                        width: '1000%',
                        backgroundColor: '#572364',
                        borderRadius: 1,
                      }}
                    />
                  </View>
                </>
              ) : null}

              {filteredQuestions.map((question, index) => (
                <View key={index} style={{ marginVertical: 0 }}>
                  <Question
                    forumId={forumId}
                    questionId={question.id}
                    userId={question.userId}
                    text={question.question}
                    user={question.user}
                    date={question.date}
                    points={question.points}
                  />
                </View>
              ))}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: 'white',
                }}
                placeholder={t('write')}
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
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
