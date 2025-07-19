/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './src/context/CartContext';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { CartScreen } from './src/screens/CartScreen';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { CartBadge } from './src/components/CartBadge';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <CartProvider>
      <NavigationContainer>
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
            })}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{
              title: 'Carrito',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 16,
    padding: 8,
    position: 'relative',
  },
  cartButtonText: {
    fontSize: 24,
  },
});

export default App;
