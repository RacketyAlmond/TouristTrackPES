import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const loggedInUser = {
  id: '1',
  username: 'mgimor',
  avatar:
    'https://media.licdn.com/dms/image/v2/D4D03AQGCT0QZTTCUkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732472771264?e=2147483647&v=beta&t=6lzmddSAK92B5eku-PTZL4jeAwaOUvAt3myspirOwLM',
};

const RatingScreen = () => {
  const [expandedRatings, setExpandedRatings] = useState({});
  const [textOverflowMap, setTextOverflowMap] = useState({});
  const [ratings, setRatings] = useState([]);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editStars, setEditStars] = useState(0);

  useEffect(() => {
    fetchRatings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRatings();
    }, []),
  );

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.50:3001/ratings/author/${loggedInUser.id}`,
      );
      if (!response.ok) throw new Error('Error fetching ratings');
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Eliminar reseña',
      '¿Estás seguro de que quieres eliminar esta reseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await fetch(`http://192.168.1.50:3001/ratings/${id}`, {
              method: 'DELETE',
            });
            setRatings((prev) => prev.filter((r) => r.id !== id));
          },
        },
      ],
    );
  };

  const handleEdit = (rating) => {
    setEditingRatingId(rating.id);
    setEditContent(rating.content);
    setEditStars(rating.stars);
  };

  const handleUpdate = async () => {
    const ratingToUpdate = ratings.find((r) => r.id === editingRatingId);
    if (!ratingToUpdate) return;

    const updatedRating = {
      authorID: loggedInUser.id,
      location: ratingToUpdate.location,
      stars: editStars,
      content: editContent,
    };

    try {
      const response = await fetch(
        `http://192.168.1.50:3001/ratings/${ratingToUpdate.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRating),
        },
      );

      if (!response.ok) throw new Error('Error actualizando reseña');

      const updatedData = {
        ...(await response.json()),
        authorAvatar: loggedInUser.avatar,
        authorFirstName: loggedInUser.username,
      };

      setRatings((prev) =>
        prev.map((r) => (r.id === ratingToUpdate.id ? updatedData : r)),
      );

      setEditingRatingId(null);
      setEditContent('');
      setEditStars(0);
    } catch (error) {
      console.error('Error al actualizar reseña:', error);
    }
  };

  const cancelEdit = () => {
    setEditingRatingId(null);
    setEditContent('');
    setEditStars(0);
  };

  const renderStars = (rating, editable = false, onRate = () => {}) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      const iconName =
        i <= fullStars
          ? 'star'
          : i === fullStars + 1 && halfStar
            ? 'star-half-full'
            : 'star-o';

      stars.push(
        <TouchableOpacity
          key={i}
          disabled={!editable}
          onPress={() => editable && onRate(i)}
        >
          <FontAwesome
            name={iconName}
            size={20}
            color={editable ? '#572364' : '#F5A623'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>,
      );
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const toggleRatingExpand = (id) => {
    setExpandedRatings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTextLayout = (id, e) => {
    const { lines } = e.nativeEvent;
    const isOverflowing = lines.length > 2;
    setTextOverflowMap((prev) => ({ ...prev, [id]: isOverflowing }));
  };

  const renderItem = ({ item }) => {
    // Verifica si item.postedAt es el objeto con _seconds y _nanoseconds
    if (item.postedAt && item.postedAt._seconds !== undefined) {
      // Convertir el _seconds a un objeto Date
      const postedAtDate = new Date(item.postedAt._seconds * 1000);

      // Formatear la fecha
      const formattedDate = `${postedAtDate.getDate()}/${postedAtDate.getMonth() + 1}/${postedAtDate.getFullYear()}`;

      return (
        <View style={styles.reviewAndLocationContainer}>
          {/* Nombre de la localidad encima del contenido */}
          <View style={styles.locationContainer}>
            <Text style={styles.title}>{item.location}</Text>
          </View>
          <View style={styles.reviewContainer}>
            <Image source={{ uri: item.authorAvatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.reviewHeader}>
                <Text style={styles.username}>{item.authorFirstName}</Text>
                <View style={styles.starsRight}>
                  {item.id === editingRatingId
                    ? renderStars(editStars, true, setEditStars)
                    : renderStars(item.stars)}
                </View>
              </View>

              {item.id === editingRatingId ? (
                <>
                  <TextInput
                    value={editContent}
                    onChangeText={setEditContent}
                    multiline
                    style={[
                      styles.textInput,
                      { marginTop: 8, backgroundColor: '#f1f1f1' },
                    ]}
                  />
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={handleUpdate}>
                      <Text style={[styles.actionText, { color: '#572364' }]}>
                        Guardar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEdit}>
                      <Text style={[styles.actionText, { color: '#999' }]}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => toggleRatingExpand(item.id)}>
                    <Text
                      style={styles.text}
                      numberOfLines={expandedRatings[item.id] ? 0 : 2}
                      onTextLayout={(e) => handleTextLayout(item.id, e)}
                    >
                      {item.content}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.dateAndExpandRow}>
                    <View style={{ flex: 1 }}>
                      {textOverflowMap[item.id] && (
                        <TouchableOpacity
                          onPress={() => toggleRatingExpand(item.id)}
                        >
                          <Text style={styles.expandText}>
                            {expandedRatings[item.id] ? 'ver menos' : 'ver más'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.dateText}>
                      Publicado el: {formattedDate}
                    </Text>
                  </View>

                  {item.authorID === loggedInUser.id && (
                    <View style={styles.rightActions}>
                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Text style={[styles.actionText, { color: '#572364' }]}>
                          Editar
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Text style={[styles.actionText, { color: 'red' }]}>
                          Eliminar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      );
    } else {
      // Si no está presente o no es válido, no mostramos nada
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps='handled'
      >
        <FlatList
          data={ratings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 18, // tamaño del texto
    fontWeight: 'bold', // si quieres que el nombre de la localidad se vea más destacado
    color: '#572364', // color del texto
    marginLeft: -10,
  },
  subtitle: { color: '#999' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  reviewAverage: { marginLeft: 4, color: '#572364', fontSize: 16 },
  reviewCount: { marginLeft: 4, color: '#999', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 12 },
  inputContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputUser: { flexDirection: 'row', alignItems: 'center' },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    textAlignVertical: 'top',
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#572364',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  reviewContainer: { flexDirection: 'row', marginBottom: 8 },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsRight: { flexDirection: 'row' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 14 },
  text: { color: '#555', marginVertical: 2 },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionText: {
    marginRight: 12,
    color: '#572364',
    fontWeight: 'bold',
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rightActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  dateText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  dateAndExpandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  expandText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#572364',
  },
  locationContainer: {
    marginBottom: 8, // espacio entre la localidad y el contenido de la reseña
    marginLeft: 10, // o el margen que desees
  },
  reviewAndLocationContainer: { flexDirection: 'column'},
});

export default RatingScreen;
