/* eslint-disable prettier/prettier */
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Register for push notifications and save token to server
export async function registerForPushNotificationsAsync(userId) {
  let token;

  if (!Device.isDevice) {
    console.log('Must use physical device for push notifications');
    //return null;
  }

  // Check if we have permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  // Get Expo push token
  token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  // Save to server
  try {
    const response = await fetch(
      `***REMOVED***/users/${userId}/push-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: token,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to save push token');
    }
  } catch (error) {
    console.error('Error saving push token:', error);
  }

  // Additional setup for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#572364',
    });
  }

  return token;
}

export function setupNotificationListeners(navigation) {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Foreground notification received:', notification);
      // Agrega un log visible
      Alert.alert('Debug', 'Notificación recibida en primer plano!');
    },
  );

  // Handle notification when user taps on it
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      // Navigate to chat if message notification
      if (data.type === 'message' && data.senderId) {
        navigation.navigate('PersonalChat', {
          User: {
            id: data.senderId,
            name: data.senderName || 'User',
            avatar: data.senderAvatar || 'https://via.placeholder.com/150',
            about: '',
          },
          currentUser: { id: data.recipientId },
          state: 0,
        });
      }
    });

  return { notificationListener, responseListener };
}
