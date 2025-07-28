import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validation/authSchema';
// Mock auth for temporary use without Firebase
const auth = () => ({
  sendPasswordResetEmail: async (email: string) => {
    // Simulate password reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Mock: Password reset email sent to', email);
  }
});

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await auth().sendPasswordResetEmail(data.email);
      Alert.alert(
        'Email enviado',
        'Se ha enviado un email con instrucciones para restablecer tu contraseña.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Ocurrió un error al enviar el email de recuperación'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
            Recuperar Contraseña
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666', lineHeight: 24 }}>
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.email ? '#ff4444' : '#ddd',
                  borderRadius: 8,
                  padding: 15,
                  fontSize: 16,
                  marginBottom: 10,
                  backgroundColor: '#fff',
                }}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
          {errors.email && (
            <Text style={{ color: '#ff4444', fontSize: 14, marginBottom: 10 }}>
              {errors.email.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50',
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
            opacity: isLoading ? 0.7 : 1,
          }}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
              Enviar Email
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20 }}
        >
          <Text style={{ color: '#4CAF50', textAlign: 'center', fontSize: 14 }}>
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 