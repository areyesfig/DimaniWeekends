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
import { signInSchema, SignInFormData } from '../validation/authSchema';
import { signIn } from '../../../shared/services/firebase';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      // Navegación exitosa - el AuthContext manejará el estado
    } catch (error: any) {
      Alert.alert(
        'Error de inicio de sesión',
        error.message || 'Ocurrió un error al iniciar sesión'
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
            Bienvenido
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
            Inicia sesión en tu cuenta
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
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ marginBottom: 20 }}
        >
          <Text style={{ color: '#4CAF50', textAlign: 'center', fontSize: 14 }}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: '#666', fontSize: 14 }}>
            ¿No tienes cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: '#4CAF50', fontSize: 14, fontWeight: 'bold' }}>
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 