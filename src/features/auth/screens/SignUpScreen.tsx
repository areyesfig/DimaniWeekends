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
import { signUpSchema, SignUpFormData } from '../validation/authSchema';
import { signUp } from '../../../shared/services/firebase';

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.displayName);
      Alert.alert(
        'Cuenta creada',
        'Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error al crear cuenta',
        error.message || 'Ocurrió un error al crear tu cuenta'
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
            Crear Cuenta
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
            Completa tus datos para registrarte
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.displayName ? '#ff4444' : '#ddd',
                  borderRadius: 8,
                  padding: 15,
                  fontSize: 16,
                  marginBottom: 10,
                  backgroundColor: '#fff',
                }}
                placeholder="Nombre completo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
            )}
          />
          {errors.displayName && (
            <Text style={{ color: '#ff4444', fontSize: 14, marginBottom: 10 }}>
              {errors.displayName.message}
            </Text>
          )}

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.password ? '#ff4444' : '#ddd',
                  borderRadius: 8,
                  padding: 15,
                  fontSize: 16,
                  marginBottom: 10,
                  backgroundColor: '#fff',
                }}
                placeholder="Contraseña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={{ color: '#ff4444', fontSize: 14, marginBottom: 10 }}>
              {errors.password.message}
            </Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.confirmPassword ? '#ff4444' : '#ddd',
                  borderRadius: 8,
                  padding: 15,
                  fontSize: 16,
                  marginBottom: 10,
                  backgroundColor: '#fff',
                }}
                placeholder="Confirmar contraseña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={{ color: '#ff4444', fontSize: 14, marginBottom: 10 }}>
              {errors.confirmPassword.message}
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
              Crear Cuenta
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: '#666', fontSize: 14 }}>
            ¿Ya tienes cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={{ color: '#4CAF50', fontSize: 14, fontWeight: 'bold' }}>
              Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 