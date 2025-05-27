/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../atoms/UserContext.js';
import logo from '../../public/logo.png';
import map from '../../public/mapa.png';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LevelProgress from '../molecules/levelProgress';

import LanguageModal from '../molecules/LanguageModal';

const ProfileScreen = ({ onSignOut }) => {
  const navigation = useNavigation();
  const { t } = useTranslation('profile');
  const { updateUserData, getUserPoints } = useUser();

  // Campos de usuario
  const [fname, setFname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [about, setAbout] = useState('');
  const [points, setPoints] = useState(null);

  // Estado para saber qué campo estamos editando
  const [editingField, setEditingField] = useState(null);

  // 2. Estado para controlar el modal de idioma
  const [langModalVisible, setLangModalVisible] = useState(false);

  // Función para cargar los datos de Firebase
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userPoints = await getUserPoints();
        setPoints(userPoints);
      } catch (err) {
        console.error('Failed to load user points:', err);
      }
    };

    fetchPoints();
  }, [points]);
  const getter = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFname(data.firstName);
        setBirthdate(data.birthday);
        setUserLocation(data.userLocation);
        setAbout(data.about);
        setPoints(data.points.current);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }

    return getDoc(doc(db, 'Users', user.uid))
      .then((userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          // console.log(`data = ${data.firstName}`);
          // console.log(`userData.firstName = ${data.firstName}`);
          // console.log(`userData.birthday = ${data.birthday}`);

          setFname(data.firstName);
          setBirthdate(data.birthday);
          setUserLocation(data.userLocation);
          setAbout(data.about);
          setPoints(data.points.current);
        }
        console.log('User profile fetched successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  useEffect(() => {
    getter();
  }, []);

  // Guarda los cambios en Firebase
  const handleSend = async () => {
    try {
      await updateUserData(fname, birthdate, userLocation, about);
      setEditingField(null);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        paddingBottom: 20,
        flex: 1,
        backgroundColor: 'white',
      }} // Mueve aquí los estilos relacionados con el contenido
    >
      <Image source={map} style={styles.mapBackground} />

      <TouchableOpacity style={styles.backButton}>
        <Icon name='arrow-back' size={24} color='black' />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <Image source={logo} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon}>
          <Icon name='edit' size={18} color='white' />
        </TouchableOpacity>
      </View>

      <View style={styles.mainRow}>
        {editingField === 'fname' ? (
          <TextInput
            value={fname}
            onChangeText={setFname}
            style={styles.mainRow}
            autoFocus
          />
        ) : (
          <Text style={styles.mainRow}>{fname}</Text>
        )}
        <TouchableOpacity onPress={() => setEditingField('fname')}>
          <Icon name='edit' size={20} color='gray' />
        </TouchableOpacity>
      </View>

      <LevelProgress points={points} />

      <View style={styles.secoundRow}>
        <Icon name='location-on' size={20} color='gray' />
        {editingField === 'userLocation' ? (
          <TextInput
            value={userLocation}
            onChangeText={setUserLocation}
            style={styles.secoundRow}
            autoFocus
          />
        ) : (
          <Text style={styles.secoundRow}>{userLocation}</Text>
        )}
        <TouchableOpacity onPress={() => setEditingField('userLocation')}>
          <Icon name='edit' size={20} color='gray' />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t('about-me')}</Text>
      <View style={styles.infoRow}>
        {editingField === 'about' ? (
          <TextInput
            value={about}
            onChangeText={setAbout}
            style={styles.input}
            multiline
            autoFocus
          />
        ) : (
          <Text style={styles.infoText}>{about}</Text>
        )}
        <TouchableOpacity onPress={() => setEditingField('about')}>
          <Icon name='edit' size={20} color='gray' />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t('birthdate')}</Text>
      <View style={styles.infoRow}>
        {editingField === 'birthdate' ? (
          <TextInput
            value={birthdate}
            onChangeText={setBirthdate}
            style={styles.input}
            autoFocus
          />
        ) : (
          <Text style={styles.infoText}>{birthdate}</Text>
        )}
        <TouchableOpacity onPress={() => setEditingField('birthdate')}>
          <Icon name='edit' size={20} color='gray' />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UserForumComments')}>
        <Icon name='visibility' size={16} color='black' />
        <Text style={styles.actionButtonText}>{t('see-comments')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Mis valoraciones')}>
        <Icon name='star-border' size={16} color='black' />
        <Text style={styles.actionButtonText}>{t('see-reviews')}</Text>
      </TouchableOpacity>

      {/* 3. Botón “Change Language” */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setLangModalVisible(true)}
      >
        <MaterialCommunityIcons
          name='translate' // o "translate-variant" si lo prefieres
          size={16}
          color='black'
        />
        <Text style={styles.actionButtonText}>{t('change-language')}</Text>
      </TouchableOpacity>

      {editingField && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSend}>
          <Text style={styles.saveText}>{t('save-changes')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={onSignOut}>
        <Text style={styles.logoutText}>{t('log-out')}</Text>
      </TouchableOpacity>

      {/* 4. Renderiza el modal de idioma */}
      <LanguageModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  mapBackground: {
    width: '100%',
    height: 160,
    position: 'absolute',
    top: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  profileContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: 90,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#7B1FA2',
    borderRadius: 15,
    padding: 5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
    fontSize: 20,
  },
  secoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'grey',
    gap: 7,
    fontSize: 15,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    padding: 10,
    borderRadius: 10,
    marginTop: 0,
  },
  infoText: {
    fontSize: 16,
    color: 'grey',
    flex: 1,
  },
  input: {
    fontSize: 16,
    flex: 1,
    color: 'black',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
