import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getOrderById } from '../services/firebaseService';
import { generateWebpayConfig, createWebpayUrl } from '../services/webpayService';
import { Order } from '../types';

interface PaymentScreenProps {
  navigation: any;
  route: {
    params: {
      orderId: string;
    };
  };
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [webpayUrl, setWebpayUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadOrderAndGeneratePayment();
  }, [orderId]);

  const loadOrderAndGeneratePayment = async () => {
    try {
      setLoading(true);
      
      // Cargar orden
      const orderData = await getOrderById(orderId);
      if (!orderData) {
        setError('Orden no encontrada');
        return;
      }
      
      setOrder(orderData);
      
      // Generar configuración de Webpay
      const webpayConfig = generateWebpayConfig(
        orderData.total,
        orderData.id
      );
      
      // Crear URL de Webpay
      const url = createWebpayUrl(webpayConfig);
      setWebpayUrl(url);
      
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Error cargando la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    // Detectar cuando el usuario regresa de Webpay
    if (url.includes('dimaniweekends://payment-result')) {
      // Extraer parámetros de la URL
      const urlParams = new URL(url);
      const token = urlParams.searchParams.get('token_ws');
      const orderId = urlParams.searchParams.get('tbk_orden_compra');
      const response = urlParams.searchParams.get('tbk_respuesta');
      
      // Navegar a la pantalla de resultado
      navigation.replace('PaymentResult', {
        token,
        orderId,
        response,
        success: response === '0'
      });
    }
  };

  const handleWebViewError = (error: any) => {
    console.error('WebView error:', error);
    setError('Error cargando el formulario de pago');
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Preparando pago...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pago Seguro</Text>
        <Text style={styles.subtitle}>Webpay Plus</Text>
      </View>

      {order && (
        <View style={styles.orderSummary}>
          <Text style={styles.orderTitle}>Resumen de la Orden</Text>
          <Text style={styles.orderId}>ID: {order.id}</Text>
          <Text style={styles.orderTotal}>
            Total: {formatPrice(order.total)}
          </Text>
        </View>
      )}

      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: webpayUrl }}
          style={styles.webview}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webviewLoading}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.webviewLoadingText}>
                Cargando formulario de pago...
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  webviewContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 