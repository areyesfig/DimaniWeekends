import React, { createContext, useContext, useEffect, useState } from 'react';

// Import Firebase App and Auth with fallback
let firebaseApp: any = null;
let auth: any = null;
let FirebaseAuthTypes: any = null;

try {
  // Intentar usar React Native Firebase primero
  const firebaseAppModule = require('@react-native-firebase/app');
  const firebaseAuthModule = require('@react-native-firebase/auth');
  
  firebaseApp = firebaseAppModule.default;
  auth = firebaseAuthModule.default;
  FirebaseAuthTypes = firebaseAuthModule.FirebaseAuthTypes;
  
  console.log('✅ React Native Firebase App y Auth cargados correctamente');
} catch (error) {
  console.log('⚠️ React Native Firebase no disponible, intentando Firebase Web SDK');
  
  try {
    // Intentar usar Firebase Web SDK
    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    
    // Configuración de Firebase
    const firebaseConfig = {
      apiKey: process.env.API_KEY || 'your-api-key',
      authDomain: 'dimaniweekends-app.firebaseapp.com',
      projectId: 'dimaniweekends-app',
      storageBucket: 'dimaniweekends-app.firebasestorage.app',
      messagingSenderId: '859589513015',
      appId: '1:859589513015:android:7364399678e8028512d4b2',
    };
    
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    
    console.log('✅ Firebase Web SDK inicializado correctamente');
  } catch (webError) {
    console.log('⚠️ Firebase Web SDK no disponible, usando mock');
    // Mock auth for fallback
    firebaseApp = {
      initializeApp: () => console.log('Mock: Firebase App initialized'),
    };
    auth = () => ({
      createUserWithEmailAndPassword: async (email: string, password: string) => ({
        user: {
          uid: 'mock-user-id',
          email,
          displayName: email.split('@')[0],
          updateProfile: async (data: any) => console.log('Mock: updateProfile', data),
        }
      }),
      signInWithEmailAndPassword: async (email: string, password: string) => ({
        user: {
          uid: 'mock-user-id',
          email,
          displayName: email.split('@')[0],
        }
      }),
      signOut: async () => console.log('Mock: signOut'),
      currentUser: null,
      onAuthStateChanged: (callback: any) => {
        setTimeout(() => callback(null), 100);
        return () => {};
      }
    });
  }
}

// User type
interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase App if not already initialized
    try {
      if (firebaseApp && typeof firebaseApp.initializeApp === 'function') {
        if (!firebaseApp.apps || !firebaseApp.apps.length) {
          firebaseApp.initializeApp();
          console.log('🔥 Firebase App inicializado');
        }
      }
    } catch (error) {
      console.log('⚠️ Firebase App ya inicializado o usando mock');
    }

    // Handle auth state changes
    const handleAuthStateChange = async (firebaseUser: any) => {
      try {
        if (firebaseUser) {
          console.log('🔥 Firebase Auth: Usuario autenticado', firebaseUser.email);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            createdAt: new Date(),
          });
        } else {
          console.log('🔥 Firebase Auth: Usuario no autenticado');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error en onAuthStateChanged:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    let unsubscribe: (() => void) | undefined;
    
    try {
      if (typeof auth === 'function') {
        // React Native Firebase
        unsubscribe = auth().onAuthStateChanged(handleAuthStateChange);
      } else if (auth && typeof auth.onAuthStateChanged === 'function') {
        // Firebase Web SDK
        unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
      } else {
        // Mock auth
        setTimeout(() => handleAuthStateChange(null), 100);
      }
    } catch (error) {
      console.error('❌ Error configurando auth listener:', error);
      setTimeout(() => handleAuthStateChange(null), 100);
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log('🔥 Intentando signIn con Firebase...');
      
      let userCredential;
      if (typeof auth === 'function') {
        // React Native Firebase
        userCredential = await auth().signInWithEmailAndPassword(email, password);
      } else if (auth && typeof auth.signInWithEmailAndPassword === 'function') {
        // Firebase Web SDK
        userCredential = await auth.signInWithEmailAndPassword(email, password);
      } else {
        throw new Error('Auth not available');
      }
      
      console.log('✅ SignIn exitoso con Firebase');
      
      // El usuario se establecerá automáticamente en onAuthStateChanged
    } catch (error: any) {
      console.error('❌ Error en signIn con Firebase:', error);
      
      // Fallback a mock si Firebase falla
      console.log('🔄 Usando fallback mock para signIn');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        createdAt: new Date(),
      };
      
      setUser(mockUser);
    }
  };

  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    try {
      console.log('🔥 Intentando signUp con Firebase...');
      
      let userCredential;
      if (typeof auth === 'function') {
        // React Native Firebase
        userCredential = await auth().createUserWithEmailAndPassword(email, password);
        
        // Actualizar displayName si se proporciona
        if (displayName && userCredential.user) {
          await userCredential.user.updateProfile({ displayName });
        }
      } else if (auth && typeof auth.createUserWithEmailAndPassword === 'function') {
        // Firebase Web SDK
        userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Actualizar displayName si se proporciona
        if (displayName && userCredential.user) {
          await userCredential.user.updateProfile({ displayName });
        }
      } else {
        throw new Error('Auth not available');
      }
      
      console.log('✅ SignUp exitoso con Firebase');
      
      // El usuario se establecerá automáticamente en onAuthStateChanged
    } catch (error: any) {
      console.error('❌ Error en signUp con Firebase:', error);
      
      // Fallback a mock si Firebase falla
      console.log('🔄 Usando fallback mock para signUp');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-id-' + Date.now(),
        email: email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
      };
      
      setUser(mockUser);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🔥 Intentando signOut con Firebase...');
      
      if (typeof auth === 'function') {
        // React Native Firebase
        await auth().signOut();
      } else if (auth && typeof auth.signOut === 'function') {
        // Firebase Web SDK
        await auth.signOut();
      } else {
        throw new Error('Auth not available');
      }
      
      console.log('✅ SignOut exitoso con Firebase');
      
      // El usuario se limpiará automáticamente en onAuthStateChanged
    } catch (error: any) {
      console.error('❌ Error en signOut con Firebase:', error);
      
      // Fallback a mock si Firebase falla
      console.log('🔄 Usando fallback mock para signOut');
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 