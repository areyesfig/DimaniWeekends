#!/usr/bin/env node

/**
 * Script para limpiar la sesión local de Supabase
 * Útil cuando se elimina un usuario de la base de datos pero la app sigue funcionando
 */
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (debe coincidir con src/config/supabase.ts)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY no configuradas');
  console.error('🔧 Asegúrate de crear el archivo .env con las variables necesarias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

async function clearSession() {
  try {
    console.log('🔄 Limpiando sesión local de Supabase...');
    
    // Obtener usuario actual
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError) {
      console.log('❌ Error obteniendo usuario:', getUserError.message);
    } else if (user) {
      console.log('👤 Usuario actual:', user.email);
    } else {
      console.log('ℹ️ No hay usuario autenticado');
    }
    
    // Cerrar sesión
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.log('❌ Error cerrando sesión:', signOutError.message);
    } else {
      console.log('✅ Sesión cerrada exitosamente');
    }
    
    // Verificar que se cerró la sesión
    const { data: { user: userAfterSignOut }, error: verifyError } = await supabase.auth.getUser();
    
    if (verifyError) {
      console.log('❌ Error verificando sesión:', verifyError.message);
    } else if (userAfterSignOut) {
      console.log('⚠️ La sesión aún está activa');
    } else {
      console.log('✅ Sesión limpiada completamente');
    }
    
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  clearSession();
}

module.exports = { clearSession }; 