import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { SignInScreen } from '../features/auth/screens/SignInScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Catalog') {
            iconName = 'store';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else {
            iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Catalog" 
        component={CatalogScreen}
        options={{ title: 'Productos' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { user, isConnected } = useAuth();

  // Navegación simple basada en estado
  if (!isConnected) {
    return <SignInScreen />;
  }

  if (!user) {
    return <SignInScreen />;
  }

  return <MainTabs />;
};

export default AppNavigator; 