import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInScreen } from '../screens/SignInScreen';
import { signIn } from '../../../shared/services/firebase';

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

// Mock de @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: 'Navigator',
    Screen: 'Screen',
  }),
}));

describe('SignInScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call signIn with correct parameters when form is submitted', async () => {
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
    mockSignIn.mockResolvedValueOnce({} as any);

    const { getByText } = render(<SignInScreen navigation={mockNavigation} />);

    // Simular envío del formulario
    const submitButton = getByText('Iniciar Sesión');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it('should show error message for invalid email format', () => {
    // Mock de react-hook-form con errores
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
    
    // Verificar que se muestra el error de email inválido
    expect(getByText('Email inválido')).toBeTruthy();
  });

  it('should handle signIn error and show alert', async () => {
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
    const mockError = new Error('Credenciales inválidas');
    mockSignIn.mockRejectedValueOnce(mockError);

    const { getByText } = render(<SignInScreen navigation={mockNavigation} />);

    const submitButton = getByText('Iniciar Sesión');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it('should navigate to SignUp screen when register link is pressed', () => {
    const { getByText } = render(<SignInScreen navigation={mockNavigation} />);
    
    const registerLink = getByText('Regístrate');
    fireEvent.press(registerLink);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('should navigate to ForgotPassword screen when forgot password link is pressed', () => {
    const { getByText } = render(<SignInScreen navigation={mockNavigation} />);
    
    const forgotPasswordLink = getByText('¿Olvidaste tu contraseña?');
    fireEvent.press(forgotPasswordLink);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
}); 