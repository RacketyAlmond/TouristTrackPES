// filepath: /home/natalia/Documentos/Asignaturas/3 2/PES/TourisTrack-Front-End/Profile.js
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Profile = ({ username, emailUser }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{
          uri: 'https://images.unsplash.com/photo-1741332966417-6fd611ab5a5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5M3x8fGVufDB8fHx8fA%3D%3D',
        }} // URL de la imagen de perfil
      />
      <Text style={styles.name}> {username} </Text>
      <Text style={styles.email}> {emailUser} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'right',
    justifyContent: 'up',
    backgroundColor: '#fff',
    marginLeft: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    margin: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    color: 'gray',
  },
});

export default Profile;
