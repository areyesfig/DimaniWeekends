#!/usr/bin/env node

/**
 * Script para limpiar la sesión local de Supabase
 * Útil cuando se elimina un usuario de la base de datos pero la app sigue funcionando
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (debe coincidir con src/config/supabase.ts)
const supabaseUrl = 'https://pijjdldsyeqiobugwkuv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpampkbGRzeWVxaW9idWd3a3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjgwNzgsImV4cCI6MjA2OTUwNDA3OH0.JrlGMYV9Cak7V1KuyGXa5pZ91rY1PQnWD9iyUU9PuVo';

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