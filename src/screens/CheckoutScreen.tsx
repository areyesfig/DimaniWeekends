import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from 'react-native-date-picker';
import { useCart } from '../context/CartContext';
import { getOrderWindowConfig } from '../services/firebaseService';
import { generateAvailableDates, formatDeliveryDate, validateDeliveryDateTime } from '../services/dateValidationService';
import { CheckoutForm, OrderWindow } from '../types';

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, checkout, isCheckingOut, checkoutError } = useCart();
  const [orderWindow, setOrderWindow] = useState<OrderWindow | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    addressLine: '',
    commune: '',
    phone: '',
    deliveryDateTime: new Date(),
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => {
    loadOrderWindowConfig();
  }, []);

  useEffect(() => {
    if (orderWindow) {
      const dates = generateAvailableDates(orderWindow);
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
        setFormData(prev => ({ ...prev, deliveryDateTime: dates[0] }));
      }
    }
  }, [orderWindow]);

  const loadOrderWindowConfig = async () => {
    try {
      const config = await getOrderWindowConfig();
      setOrderWindow(config as OrderWindow);
    } catch (error) {
      console.error('Error loading order window config:', error);
      Alert.alert('Error', 'No se pudo cargar la configuración de horarios');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'La dirección es requerida';
    }

    if (!formData.commune.trim()) {
      newErrors.commune = 'La comuna es requerida';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[0-9]{8,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El teléfono debe tener entre 8 y 12 dígitos';
    }

    if (!selectedDate) {
      newErrors.deliveryDateTime = 'Debe seleccionar una fecha de entrega';
    } else if (orderWindow) {
      const validation = validateDeliveryDateTime(selectedDate, orderWindow);
      if (!validation.isValid) {
        newErrors.deliveryDateTime = validation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !orderWindow) {
      return;
    }

    const result = await checkout(formData, orderWindow);
    
    if (result.success && result.orderId) {
      Alert.alert(
        'Pedido Confirmado',
        `Tu pedido ha sido reservado exitosamente.\nID: ${result.orderId}`,
        [
          {
            text: 'Continuar al Pago',
            onPress: () => navigation.navigate('Payment', { orderId: result.orderId })
          }
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Error en el proceso de checkout');
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const renderFormField = (
    label: string,
    field: keyof CheckoutForm,
    placeholder: string,
    keyboardType: 'default' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field] as string || ''}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, [field]: text }));
          if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
          }
        }}
        keyboardType={keyboardType}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Información de Entrega</Text>
          <Text style={styles.subtitle}>Completa los datos para tu pedido</Text>
        </View>

        <View style={styles.formContainer}>
          {renderFormField('Nombre Completo', 'fullName', 'Ingresa tu nombre completo')}
          {renderFormField('Dirección', 'addressLine', 'Ingresa tu dirección')}
          {renderFormField('Comuna', 'commune', 'Ingresa tu comuna')}
          {renderFormField('Teléfono', 'phone', 'Ingresa tu teléfono', 'phone-pad')}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fecha y Hora de Entrega</Text>
            <TouchableOpacity
              style={[styles.dateButton, errors.deliveryDateTime && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {selectedDate ? formatDeliveryDate(selectedDate) : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
            {errors.deliveryDateTime && (
              <Text style={styles.errorText}>{errors.deliveryDateTime}</Text>
            )}
          </View>

          {orderWindow && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Horarios Disponibles:</Text>
              <Text style={styles.infoText}>
                • Sábados y domingos de {orderWindow.startTime} a {orderWindow.endTime}
              </Text>
              <Text style={styles.infoText}>
                • Mínimo 2 horas de anticipación
              </Text>
            </View>
          )}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          {state.items.map((item, index) => (
            <View key={index} style={styles.summaryItem}>
              <Text style={styles.summaryItemName}>{item.product.name}</Text>
              <Text style={styles.summaryItemQuantity}>x{item.quantity}</Text>
              <Text style={styles.summaryItemPrice}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>{formatPrice(state.total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isCheckingOut && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>
      </View>

      <DateTimePicker
        modal
        open={showDatePicker}
        date={selectedDate || new Date()}
        mode="datetime"
        onConfirm={(date) => {
          setSelectedDate(date);
          setFormData(prev => ({ ...prev, deliveryDateTime: date }));
          setShowDatePicker(false);
          if (errors.deliveryDateTime) {
            setErrors(prev => ({ ...prev, deliveryDateTime: undefined }));
          }
        }}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
        minuteInterval={30}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  formContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  summaryItemQuantity: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 