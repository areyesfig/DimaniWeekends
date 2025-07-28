/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { CartProvider, AuthProvider } from './src/context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Importar configuración de Firebase
import './src/config/firebase';

function App(): React.JSX.Element {
  useEffect(() => {
    // Asegurar que Firebase se inicialice al cargar la app
    console.log('🚀 DimaniWeekends App iniciando...');
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
