import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from './components/organisms/generalChat';
import Map from './components/organisms/map';
import Forum from './components/organisms/forum';
import IndexForos from './components/organisms/indexForos';
import Estadisticas from './components/organisms/estadisticas';
import NavBar from './components/organisms/navBar';
import AddChat from './components/organisms/addChat';
import PersonalChat from './components/molecules/personalChat';
import UserStack from './components/organisms/UserStack';
import SettingsScreen from './components/organisms/SettingsScreen';
import { AuthProvider } from './components/atoms/AuthContext';
import { UserProvider } from './components/atoms/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName='Mapa'
              screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right',
              }}
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
              <Stack.Screen name='Mapa' component={Map} />
              <Stack.Screen name='Estadisticas' component={Estadisticas} />
              <Stack.Screen name='Chats' component={Chats} />
              <Stack.Screen name='PersonalChat' component={PersonalChat} />
              <Stack.Screen name='AddChat' component={AddChat} />
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
            </Stack.Navigator>
            <NavBar />
          </NavigationContainer>
        </AuthProvider>
      </UserProvider>
    </I18nextProvider>
  );
}
