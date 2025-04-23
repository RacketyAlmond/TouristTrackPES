import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export default function Chats({ data }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.avatar}
        resizeMode='cover'
      />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Este View crea espacio fijo arriba del scroll */}
      <View style={styles.fixedTopSpacer} />

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedTopSpacer: {
    height: 40, // espacio fijo arriba
    backgroundColor: '#fff', // mismo color que el fondo para que no se note el corte
  },
  listContent: {
    paddingHorizontal: 12,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: '#555',
    fontSize: 14,
  },
});
