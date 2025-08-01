import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase para React Native
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// Crear cliente de Supabase con configuración específica para React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'dimaniweekends-react-native'
    }
  }
});

// Función para verificar la conexión
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('settings').select('count').limit(1);
    if (error) {
      console.error('❌ Error de conexión con Supabase:', error);
      return false;
    }
    console.log('✅ Conexión con Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión con Supabase:', error);
    return false;
  }
};

export default supabase; 