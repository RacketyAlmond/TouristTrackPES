import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const reviewsData = [
  {
    id: '1',
    username: 'nataalia',
    avatar:
      'https://media.licdn.com/dms/image/v2/D4D03AQGCT0QZTTCUkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732472771264?e=2147483647&v=beta&t=6lzmddSAK92B5eku-PTZL4jeAwaOUvAt3myspirOwLM',
    rating: 5,
    text: 'Una ciudad increíble, con muchas posibilidades y cosas que ver. Este texto es muy largo para poder ser recortado correctamente en la interfaz, ¡espero que sea visible correctamente!',
  },
  {
    id: '2',
    username: 'zuckk_777',
    avatar:
      'https://media.licdn.com/dms/image/v2/D4D03AQGCT0QZTTCUkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732472771264?e=2147483647&v=beta&t=6lzmddSAK92B5eku-PTZL4jeAwaOUvAt3myspirOwLM',
    rating: 5,
    text: 'Esta ciudad lo tiene TODO. Gente maja, bares con cañas y ¡mucho más! No puedes dejar de visitar todos los monumentos y disfrutar de la vida aquí.',
  },
  {
    id: '3',
    username: 'eR_xULo_',
    avatar:
      'https://media.licdn.com/dms/image/v2/D4D03AQGCT0QZTTCUkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732472771264?e=2147483647&v=beta&t=6lzmddSAK92B5eku-PTZL4jeAwaOUvAt3myspirOwLM',
    rating: 2,
    text: 'Buenas',
  },
];

const loggedInUser = {
  username: 'you_user',
  avatar:
    'https://media.licdn.com/dms/image/v2/D4D03AQGCT0QZTTCUkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732472771264?e=2147483647&v=beta&t=6lzmddSAK92B5eku-PTZL4jeAwaOUvAt3myspirOwLM',
};

const ReviewScreen = () => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [inputHeight, setInputHeight] = useState(40);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);

  const isSendDisabled = newReview.trim() === '' || newRating === 0;

  const handleSend = () => {
    if (isSendDisabled) return;
    setNewReview('');
    setNewRating(0);
    setInputHeight(40);
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

  const toggleReviewExpand = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    setIsTextOverflowing(lines.length > 2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.reviewHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.starsRight}>{renderStars(item.rating)}</View>
        </View>
        <TouchableOpacity onPress={() => toggleReviewExpand(item.id)}>
          <Text
            style={styles.text}
            numberOfLines={expandedReviews[item.id] ? 0 : 2}
            onTextLayout={handleTextLayout}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
        {/* Mostrar "ver más" solo si el texto se recorta */}
        {isTextOverflowing && !expandedReviews[item.id] && (
          <TouchableOpacity onPress={() => toggleReviewExpand(item.id)}>
            <Text style={styles.expandText}>...ver más</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
        <Text style={styles.title}>Barcelona</Text>
        <Text style={styles.subtitle}>Cataluña</Text>

        <View style={styles.ratingRow}>
          {renderStars(4.5)}
          <Text style={styles.reviewCount}>(16.7k)</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <View style={styles.inputUser}>
              <Image
                source={{ uri: loggedInUser.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{loggedInUser.username}</Text>
            </View>
            {renderStars(newRating, true, setNewRating)}
          </View>

          <View style={styles.textInputWrapper}>
            <TextInput
              placeholder='Escribe aquí tu reseña...'
              style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
              multiline
              value={newReview}
              onChangeText={setNewReview}
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
            />
            <TouchableOpacity
              disabled={isSendDisabled}
              onPress={handleSend}
              style={[styles.sendButton, { opacity: isSendDisabled ? 0.5 : 1 }]}
            >
              <Ionicons name='send' size={20} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={reviewsData}
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#572364' },
  subtitle: { color: '#999' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  reviewCount: { marginLeft: 8, color: '#999' },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
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
  inputUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsRight: {
    flexDirection: 'row',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 14 },
  text: { color: '#555', marginVertical: 2 },
  expandText: { color: '#572364', fontSize: 12, marginTop: 4 },
});

export default ReviewScreen;
