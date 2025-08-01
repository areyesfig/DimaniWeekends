import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, testSupabaseConnection } from '../config/supabase';
import { signUp, signIn, signOut, getCurrentUser, clearLocalSession } from '../services/supabaseService';

// User type
interface AppUser {
  id: string;
  email: string;
  displayName?: string;
  createdAt: any;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isConnected: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  forceLogout: () => Promise<void>;
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
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🚀 DimaniWeekends App iniciando con Supabase...');

    // Verificar conexión con Supabase
    const checkConnection = async () => {
      try {
        const connected = await testSupabaseConnection();
        setIsConnected(connected);
        
        if (connected) {
          console.log('✅ Supabase conectado correctamente');
        } else {
          console.log('❌ Supabase no conectado');
        }
      } catch (error) {
        console.error('❌ Error verificando conexión:', error);
        setIsConnected(false);
      }
    };

    // Obtener usuario inicial
    const getInitialUser = async () => {
      try {
        if (!isConnected) {
          console.log('⚠️ No hay conexión con Supabase, saltando verificación de usuario');
          setUser(null);
          return;
        }

        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('🔥 Supabase Auth: Usuario autenticado', currentUser.email);
          setUser({
            id: currentUser.id,
            email: currentUser.email!,
            displayName: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0],
            createdAt: currentUser.created_at,
          });
        } else {
          console.log('🔥 Supabase Auth: Usuario no autenticado');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error obteniendo usuario inicial:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Inicializar
    const initialize = async () => {
      await checkConnection();
      await getInitialUser();
    };

    initialize();

    // Escuchar cambios de autenticación solo si hay conexión
    let subscription: any = null;
    
    if (isConnected) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Supabase Auth State Change:', event);
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('🔥 Supabase Auth: Usuario autenticado', session.user.email);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
              createdAt: session.user.created_at,
            });
          } else if (event === 'SIGNED_OUT') {
            console.log('🔥 Supabase Auth: Usuario cerrado sesión');
            setUser(null);
          }
          
          setIsLoading(false);
        }
      );
      
      subscription = authSubscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isConnected]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      if (!isConnected) {
        throw new Error('No hay conexión con Supabase');
      }

      console.log('🔥 Intentando signIn con Supabase...');
      await signIn(email, password);
      console.log('✅ SignIn exitoso con Supabase');
    } catch (error: any) {
      console.error('❌ Error en signIn con Supabase:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    try {
      if (!isConnected) {
        throw new Error('No hay conexión con Supabase');
      }

      console.log('🔥 Intentando signUp con Supabase...');
      await signUp(email, password, displayName);
      console.log('✅ SignUp exitoso con Supabase');
    } catch (error: any) {
      console.error('❌ Error en signUp con Supabase:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      if (!isConnected) {
        throw new Error('No hay conexión con Supabase');
      }

      console.log('🔥 Intentando signOut con Supabase...');
      await signOut();
      console.log('✅ SignOut exitoso con Supabase');
    } catch (error: any) {
      console.error('❌ Error en signOut con Supabase:', error);
      throw error;
    }
  };

  const handleForceLogout = async () => {
    try {
      console.log('🔥 Forzando logout y limpiando sesión local...');
      await clearLocalSession();
      setUser(null);
      console.log('✅ Logout forzado exitoso');
    } catch (error: any) {
      console.error('❌ Error en forceLogout:', error);
      // Aún así, limpiar el estado local
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isConnected,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    forceLogout: handleForceLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 