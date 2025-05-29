import React, { useState, useEffect } from 'react';
import { getRankByLevel, getLevelInfo } from '../molecules/levelProgress';
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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { auth } from '../../firebaseConfig.js';
import { useUser } from '../atoms/UserContext';
import { useTranslation } from 'react-i18next';

const RatingScreen = ({ route }) => {
  const { t } = useTranslation('ratings');
  const { userData, getUserData, updateUserPoints } = useUser();
  const currentUser = auth.currentUser;

  const defaultAvatar = require('../../public/user.png');
  const [ratingContent, setRatingContent] = useState('');
  const [ratingStars, setRatingStars] = useState(0);
  const [inputHeight, setInputHeight] = useState(40);
  const [expandedRatings, setExpandedRatings] = useState({});
  const [textOverflowMap, setTextOverflowMap] = useState({});
  const [ratings, setRatings] = useState([]);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editStars, setEditStars] = useState(0);

  const { localidad } = route.params;

  const [loggedRank, setLoggedRank] = useState(0);

  const [localidadRating, setLocalidadRating] = useState({
    rating: localidad.rating,
    ratingCount: localidad.ratingCount,
  });

  const isSendDisabled = ratingStars === 0;

  useEffect(() => {
    fetchRatings(localidad.name);
  }, []);

  useEffect(() => {
    if (ratings.length === 0) {
      setLocalidadRating({ rating: 0, ratingCount: 0 });
      return;
    }

    const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
    const avgRating = totalStars / ratings.length;

    setLocalidadRating({
      rating: parseFloat(avgRating.toFixed(1)),
      ratingCount: ratings.length,
    });
  }, [ratings]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (currentUser && currentUser.uid) {
          await getUserData();
          if (userData && userData.points) {
            setLoggedRank(
              getRankByLevel(
                getLevelInfo(userData.points.current).currentLevel,
                true,
              ),
            );
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      fetchRatings(localidad.name);
    }, []),
  );

  const fetchRatings = async (city) => {
    try {
      const response = await fetch(
        `***REMOVED***/ratings/location/${city}`,
      );
      if (!response.ok) throw new Error('Error fetching ratings');
      const data = await response.json();
      setRatings(data);
      const userRating = data.find((r) => r.authorID === currentUser.uid);
      setHasUserRated(!!userRating);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(t('eliminarReseña'), t('eliminarReseñaDesc'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await fetch(`***REMOVED***/ratings/${id}`, {
            method: 'DELETE',
          });
          setRatings((prev) => prev.filter((r) => r.id !== id));
          setHasUserRated(false);
        },
      },
    ]);
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
      authorID: currentUser.uid,
      location: localidad.name,
      stars: editStars,
      content: editContent,
    };

    try {
      const response = await fetch(
        `***REMOVED***/ratings/${ratingToUpdate.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRating),
        },
      );

      if (!response.ok) throw new Error('Error actualizando reseña');

      const updatedData = {
        ...(await response.json()),
        authorAvatar: userData.profileImage || defaultAvatar || '',
        authorFirstName: userData.firstName,
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

  const handleSend = async () => {
    if (hasUserRated) {
      Alert.alert(t('calificadoYa'), t('calificadoYaDesc'));
      return;
    }

    updateUserPoints(100);
    const newRatingData = {
      authorID: currentUser.uid,
      location: localidad.name,
      stars: ratingStars,
      content: ratingContent,
    };

    try {
      const response = await fetch('***REMOVED***/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRatingData),
      });

      if (!response.ok) throw new Error('Error posting rating');

      const postedRating = {
        ...(await response.json()),
        authorAvatar:
          userData?.profileImage || userData?.avatar || defaultAvatar,
        authorFirstName: userData?.firstName,
      };

      setRatings((prev) => [postedRating, ...prev]);
      setRatingContent('');
      setRatingStars(0);
      setInputHeight(40);
      setHasUserRated(true);
    } catch (error) {
      console.error('Error:', error);
    }
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
    if (item.postedAt && item.postedAt._seconds !== undefined) {
      const postedAtDate = new Date(item.postedAt._seconds * 1000);
      const formattedDate = `${postedAtDate.getDate()}/${postedAtDate.getMonth() + 1}/${postedAtDate.getFullYear()}`;

      const userRank = getRankByLevel(
        getLevelInfo(item.authorPoints).currentLevel,
        true,
      );

      const avatarSource =
        item.authorAvatar ||
        (item.authorID === currentUser.uid && userData?.profileImage) ||
        null;

      return (
        <View style={styles.reviewContainer}>
          <Image
            source={
              avatarSource && typeof avatarSource === 'string'
                ? { uri: avatarSource }
                : defaultAvatar
            }
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <View style={styles.reviewHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.username}>{item.authorFirstName}</Text>
                {userRank && (
                  <Image
                    source={userRank.icon}
                    style={styles.rankIcon}
                    resizeMode='contain'
                  />
                )}
              </View>
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
                      {t('save')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cancelEdit}>
                    <Text style={[styles.actionText, { color: '#999' }]}>
                      {t('cancel')}
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
                    {t('published')} {formattedDate}
                  </Text>
                </View>

                {item.authorID === currentUser.uid && (
                  <View style={styles.rightActions}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Text style={[styles.actionText, { color: '#572364' }]}>
                        {t('edit')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={[styles.actionText, { color: 'red' }]}>
                        {t('delete')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      );
    } else {
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
        <Text style={styles.title}>{localidad.name}</Text>

        <View style={styles.ratingRow}>
          {renderStars(localidadRating.rating)}
          <Text style={styles.reviewAverage}>{localidadRating.rating}</Text>
          <Text style={styles.reviewCount}>
            ({localidadRating.ratingCount})
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <View style={styles.inputUser}>
              <Image
                source={
                  userData?.profileImage &&
                  typeof userData?.profileImage === 'string'
                    ? { uri: userData.profileImage }
                    : defaultAvatar
                }
                style={styles.avatar}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.username}>{userData?.firstName}</Text>
                {loggedRank && (
                  <Image
                    source={loggedRank.icon}
                    style={styles.rankIcon}
                    resizeMode='contain'
                  />
                )}
              </View>
            </View>
            {renderStars(ratingStars, true, setRatingStars)}
          </View>

          <View style={styles.textInputWrapper}>
            <TextInput
              placeholder={t('writeReview')}
              style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
              multiline
              value={ratingContent}
              onChangeText={setRatingContent}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:
      Platform.OS === 'android'
        ? Math.min(StatusBar.currentHeight || 30, 30)
        : 0,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#572364' },
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
  reviewContainer: { flexDirection: 'row', marginBottom: 16 },
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
  rankIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default RatingScreen;
