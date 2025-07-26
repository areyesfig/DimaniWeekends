import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInScreen } from '../screens/SignInScreen';
import { signInSchema } from '../validation/authSchema';

// Mock de react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => fn,
    formState: { errors: {} },
  }),
  Controller: ({ render }: any) => render({ field: { onChange: jest.fn(), onBlur: jest.fn(), value: '' } }),
}));

// Mock de @hookform/resolvers/yup
jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(),
}));

// Mock de los servicios de Firebase
jest.mock('../../../shared/services/firebase', () => ({
  signIn: jest.fn(),
}));

// Mock de react-native
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Platform: { OS: 'ios' },
  ScrollView: 'ScrollView',
  Alert: {
    alert: jest.fn(),
  },
  ActivityIndicator: 'ActivityIndicator',
}));

describe('Auth Validation', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Email Validation', () => {
    it('should validate email format correctly', async () => {
      // Test con email válido
      const validEmail = 'test@example.com';
      const result = await signInSchema.validate({ email: validEmail, password: 'password123' });
      expect(result.email).toBe(validEmail);
    });

    it('should reject invalid email format', async () => {
      // Test con email inválido
      const invalidEmail = 'invalid-email';
      
      try {
        await signInSchema.validate({ email: invalidEmail, password: 'password123' });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });

    it('should reject empty email', async () => {
      try {
        await signInSchema.validate({ email: '', password: 'password123' });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('El email es requerido');
      }
    });

    it('should reject email without @ symbol', async () => {
      try {
        await signInSchema.validate({ email: 'testexample.com', password: 'password123' });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });

    it('should reject email without domain', async () => {
      try {
        await signInSchema.validate({ email: 'test@', password: 'password123' });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });
  });

  describe('Password Validation', () => {
    it('should validate password with minimum 6 characters', async () => {
      const validPassword = 'password123';
      const result = await signInSchema.validate({ email: 'test@example.com', password: validPassword });
      expect(result.password).toBe(validPassword);
    });

    it('should reject password with less than 6 characters', async () => {
      try {
        await signInSchema.validate({ email: 'test@example.com', password: '12345' });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('La contraseña debe tener al menos 6 caracteres');
      }
    });

    it('should reject empty password', async () => {
      try {
        await signInSchema.validate({ email: 'test@example.com', password: '' });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('La contraseña es requerida');
      }
    });
  });

  describe('Component Error Display', () => {
    it('should show error message for invalid email in component', () => {
      // Mock de react-hook-form con errores específicos
      jest.doMock('react-hook-form', () => ({
        useForm: () => ({
          control: {},
          handleSubmit: (fn: any) => fn,
          formState: { 
            errors: { 
              email: { message: 'Email inválido' } 
            } 
          },
        }),
        Controller: ({ render }: any) => render({ field: { onChange: jest.fn(), onBlur: jest.fn(), value: '' } }),
      }));

      const { getByText } = render(<SignInScreen navigation={mockNavigation} />);
      
      // Verificar que se muestra el error específico de email inválido
      const errorMessage = getByText('Email inválido');
      expect(errorMessage).toBeTruthy();
    });

    it('should show error message for password too short in component', () => {
      // Mock de react-hook-form con errores de password
      jest.doMock('react-hook-form', () => ({
        useForm: () => ({
          control: {},
          handleSubmit: (fn: any) => fn,
          formState: { 
            errors: { 
              password: { message: 'La contraseña debe tener al menos 6 caracteres' } 
            } 
          },
        }),
        Controller: ({ render }: any) => render({ field: { onChange: jest.fn(), onBlur: jest.fn(), value: '' } }),
      }));

      const { getByText } = render(<SignInScreen navigation={mockNavigation} />);
      
      // Verificar que se muestra el error específico de password
      const errorMessage = getByText('La contraseña debe tener al menos 6 caracteres');
      expect(errorMessage).toBeTruthy();
    });
  });
}); 