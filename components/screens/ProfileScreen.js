import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../contexts/UserContext.js';
import logo from './logo.png';
import map from './map.png';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig.js';

const ProfileScreen = ({ onSignOut }) => {
  const { updateUserData, getUserData } = useUser();

  const [fname, setFname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [about, setAbout] = useState('');

  const getter = async () => {
    const user = auth.currentUser;
    console.log(`user = ${user.uid}`);

    if (!user) {
      return Promise.reject(new Error('No user is signed in'));
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
        }
        console.log('User profile created successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  useEffect(() => {
    getter();
  }, []);

  const [editingField, setEditingField] = useState(null);

  const handleSend = async () => {
    try {
      await updateUserData(fname, birthdate, userLocation, about);
      setEditingField(null);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background map image */}
      <Image
        source={map} // Replace with actual map URL
        style={styles.mapBackground}
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Icon name='arrow-back' size={24} color='black' />
      </TouchableOpacity>

      {/* Profile Picture with Edit Icon */}
      <View style={styles.profileContainer}>
        <Image source={logo} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon}>
          <Icon name='edit' size={18} color='white' />
        </TouchableOpacity>
      </View>

      {/* Username */}
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

      {/* Location */}

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

      {/* About */}
      <Text style={styles.sectionTitle}>Sobre mí</Text>
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

      {/* Birthdate */}
      <Text style={styles.sectionTitle}>Fecha de nacimiento</Text>
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

      {/* Buttons for Comments & Reviews */}
      <TouchableOpacity style={styles.actionButton}>
        <Icon name='visibility' size={16} color='black' />
        <Text style={styles.actionButtonText}>Ver mis comentarios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Icon name='star-border' size={16} color='black' />
        <Text style={styles.actionButtonText}>Ver mis reseñas</Text>
      </TouchableOpacity>

      {/* Save Button (Only visible in edit mode) */}
      {editingField && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSend}>
          <Text style={styles.saveText}>Guardar cambios</Text>
        </TouchableOpacity>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={onSignOut}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  mapBackground: {
    width: '100%',
    height: 160,
    position: 'absolute',
    top: 120,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  profileContainer: {
    marginTop: 120,
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
    marginTop: 10,
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
    marginTop: 10,
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
