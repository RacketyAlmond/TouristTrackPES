/* eslint-disable prettier/prettier */
import React, { useEffect, useContext } from 'react';
import {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
} from './notifications';
import i18n from './i18n';
import { useNavigation } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from './components/organisms/generalChat';
import Map from './components/organisms/map';
import Forum from './components/organisms/forum';
import IndexForos from './components/organisms/indexForos';
import Estadisticas from './components/organisms/estadisticas';
import NavBar from './components/organisms/navBar';
import Valoraciones from './components/organisms/ratings';
import ValoracionesUsuario from './components/organisms/userRatings';

import AddChat from './components/organisms/addChat';
import PersonalChat from './components/organisms/personalChat';
import UserStack from './components/organisms/UserStack';
import SettingsScreen from './components/organisms/SettingsScreen';
import UserForumComments from './components/molecules/userForumComments';
import { AuthProvider } from './components/atoms/AuthContext';
import { UserProvider } from './components/atoms/UserContext';
import { UserContext } from './components/atoms/UserContext';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function App() {
  const { t, i18n } = useTranslation('profile');

  function NotificationHandler() {
    const navigation = useNavigation();
    const { userData } = useContext(UserContext); // Your user context

    useEffect(() => {
      if (userData?.id) {
        // Register for push tokens
        registerForPushNotificationsAsync(userData.id);

        // Set up notification listeners
        const { notificationListener, responseListener } =
          setupNotificationListeners(navigation);

        // Clean up
        return () => {
          notificationListener?.remove();
          responseListener?.remove();
        };
      }
    }, [userData, navigation]);

    return null; // This component doesn't render anything
  }

  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <AuthProvider>
          <NavigationContainer>
            <NotificationHandler />
            <Stack.Navigator
              initialRouteName='Mapa'
              screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right',
              }}
              options={{ headerShown: false }}
            >
              <Stack.Screen
                name='Foros'
                component={IndexForos}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Forum'
                component={Forum}
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name='Chats'
                component={Chats}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='PersonalChat'
                component={PersonalChat}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='AddChat'
                component={AddChat}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Estadisticas'
                component={Estadisticas}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Valoraciones'
                component={Valoraciones}
                options={{ headerShown: false }}
              />
              <Stack.Screen name='Mapa' component={Map} />
              <Stack.Screen
                name={t('mis-valoraciones')}
                component={ValoracionesUsuario}
              />
              <Stack.Screen
                name='Settings'
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
              <Stack.Screen
                name='User'
                component={UserStack}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='UserForumComments'
                component={UserForumComments}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
            <NavBar />
          </NavigationContainer>
        </AuthProvider>
      </UserProvider>
    </I18nextProvider>
  );
}
