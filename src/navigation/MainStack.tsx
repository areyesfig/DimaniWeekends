import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { CatalogScreen } from '../screens/CatalogScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { PaymentResultScreen } from '../screens/PaymentResultScreen';
import { CartBadge } from '../components/CartBadge';

type MainStackParamList = {
  Catalog: undefined;
  Cart: undefined;
  Checkout: undefined;
  Payment: { orderId: string };
  PaymentResult: {
    token?: string;
    orderId?: string;
    response?: string;
    success: boolean;
  };
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Catalog"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={({ navigation }) => ({
          title: 'DimaniWeekends',
          headerRight: () => (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.cartButtonText}>🛒</Text>
              <CartBadge />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Carrito',
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Información de Entrega',
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Pago Seguro',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
        options={{
          title: 'Resultado del Pago',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 16,
    padding: 8,
    position: 'relative',
  },
  cartButtonText: {
    fontSize: 24,
  },
  signOutButton: {
    marginLeft: 16,
    padding: 8,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
}); 