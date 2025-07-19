import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { updateOrderStatus } from '../services/firebaseService';
import { getWebpayErrorMessage } from '../services/webpayService';

interface PaymentResultScreenProps {
  navigation: any;
  route: {
    params: {
      token?: string;
      orderId?: string;
      response?: string;
      success: boolean;
    };
  };
}

export const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({ navigation, route }) => {
  const { token, orderId, response, success } = route.params;

  useEffect(() => {
    handlePaymentResult();
  }, []);

  const handlePaymentResult = async () => {
    try {
      if (orderId) {
        // Actualizar estado de la orden
        const newStatus = success ? 'paid' : 'cancelled';
        await updateOrderStatus(orderId, newStatus);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Catalog');
  };

  const handleRetry = () => {
    if (orderId) {
      navigation.navigate('Payment', { orderId });
    } else {
      navigation.navigate('Catalog');
    }
  };

  const getResultMessage = () => {
    if (success) {
      return {
        title: '¡Pago Exitoso!',
        message: 'Tu pedido ha sido confirmado y será procesado.',
        icon: '✅',
        color: '#4CAF50'
      };
    } else {
      const errorMessage = response ? getWebpayErrorMessage(response) : 'Error en el pago';
      return {
        title: 'Pago Fallido',
        message: errorMessage,
        icon: '❌',
        color: '#F44336'
      };
    }
  };

  const result = getResultMessage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{result.icon}</Text>
        </View>

        <Text style={[styles.title, { color: result.color }]}>
          {result.title}
        </Text>

        <Text style={styles.message}>
          {result.message}
        </Text>

        {orderId && (
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>ID de Orden:</Text>
            <Text style={styles.orderId}>{orderId}</Text>
          </View>
        )}

        {token && (
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Token de Transacción:</Text>
            <Text style={styles.orderId}>{token}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {success ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
              <Text style={styles.primaryButtonText}>Volver al Catálogo</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
                <Text style={styles.primaryButtonText}>Reintentar Pago</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
                <Text style={styles.secondaryButtonText}>Volver al Catálogo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  orderInfo: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 