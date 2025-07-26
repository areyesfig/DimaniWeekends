import { jest } from '@jest/globals';

// Mock de @react-native-firebase/app
jest.mock('@react-native-firebase/app', () => {
  const mockFirebaseApp = {
    name: '[DEFAULT]',
    options: {
      apiKey: 'mock-api-key',
      authDomain: 'mock-project.firebaseapp.com',
      projectId: 'mock-project',
      storageBucket: 'mock-project.firebasestorage.app',
      messagingSenderId: '123456789',
      appId: '1:123456789:android:abcdef123456',
    },
  };

  return {
    __esModule: true,
    default: () => mockFirebaseApp,
  };
});

// Mock de @react-native-firebase/auth
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  }),
  FirebaseAuthTypes: {
    User: jest.fn(),
  },
}));

// Mock de @react-native-firebase/firestore
jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
      })),
      where: jest.fn(),
      orderBy: jest.fn(),
      get: jest.fn(),
    })),
    runTransaction: jest.fn(),
    Timestamp: {
      now: jest.fn(() => ({ toDate: jest.fn() })),
    },
  }),
  FirebaseFirestoreTypes: {
    Timestamp: jest.fn(),
  },
}));



describe('Firebase App Configuration', () => {
  it('should have default app name', async () => {
    // Importar después de los mocks
    const firebaseApp = require('@react-native-firebase/app').default();
    
    // Verificar que el nombre de la app es '[DEFAULT]'
    expect(firebaseApp.name).toBe('[DEFAULT]');
  });

  it('should have required configuration options', async () => {
    const firebaseApp = require('@react-native-firebase/app').default();
    
    // Verificar que tiene las opciones de configuración requeridas
    expect(firebaseApp.options).toBeDefined();
    expect(firebaseApp.options.apiKey).toBe('mock-api-key');
    expect(firebaseApp.options.authDomain).toBe('mock-project.firebaseapp.com');
    expect(firebaseApp.options.projectId).toBe('mock-project');
  });

  it('should not throw errors when accessing app properties', () => {
    expect(() => {
      const firebaseApp = require('@react-native-firebase/app').default();
      const appName = firebaseApp.name;
      const appOptions = firebaseApp.options;
      
      expect(appName).toBeDefined();
      expect(appOptions).toBeDefined();
    }).not.toThrow();
  });
});

describe('Firebase Services Import', () => {
  it('should import firebase services without errors', () => {
    expect(() => {
      // Importar los servicios de Firebase
      require('../firebase');
    }).not.toThrow();
  });

  it('should have all required exports', () => {
    const firebaseServices = require('../firebase');
    
    // Verificar que existen las funciones principales
    expect(firebaseServices.signUp).toBeDefined();
    expect(firebaseServices.signIn).toBeDefined();
    expect(firebaseServices.signOut).toBeDefined();
    expect(firebaseServices.getCurrentUser).toBeDefined();
    expect(firebaseServices.placeOrder).toBeDefined();
    expect(firebaseServices.getProducts).toBeDefined();
    expect(firebaseServices.getUserOrders).toBeDefined();
  });
}); 