# 🔧 Guía de Solución de Problemas - DimaniWeekends

## 🚨 Problema: Usuario eliminado de BD pero app sigue funcionando

### **Descripción del Problema**
Cuando eliminas un usuario de la base de datos de Supabase, pero la aplicación iOS sigue funcionando y saltándose la validación de inicio de sesión.

### **Causa Raíz**
Supabase mantiene la sesión localmente en el dispositivo iOS debido a:
- `persistSession: true` en la configuración
- `autoRefreshToken: true` que renueva tokens automáticamente
- Validación local antes de consultar la base de datos

## 🛠️ Soluciones Implementadas

### **1. Validación Mejorada de Usuario**
Se mejoró la función `getCurrentUser()` para validar que el usuario realmente existe en la base de datos:

```typescript
// En src/services/supabaseService.ts
export const getCurrentUser = async () => {
  // ... obtener usuario local
  if (user) {
    // Validar que existe en la BD
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
      
    if (!profile) {
      await clearLocalSession();
      return null;
    }
  }
};
```

### **2. Función de Limpieza de Sesión**
Se agregó `clearLocalSession()` para limpiar completamente la sesión local:

```typescript
export const clearLocalSession = async () => {
  await supabase.auth.signOut();
  // Limpia todos los datos locales
};
```

### **3. Pantalla de Configuración**
Se creó una nueva pantalla con opción para forzar logout:
- Navega a la pestaña "Configuración"
- Presiona "Forzar Logout y Limpiar Datos"

### **4. Script de Línea de Comandos**
Ejecuta desde la terminal:

```bash
npm run clear-session
```

## 🔄 Cómo Usar las Soluciones

### **Opción A: Desde la App (Recomendado)**
1. Abre la aplicación
2. Ve a la pestaña "Configuración"
3. Presiona "Forzar Logout y Limpiar Datos"
4. Confirma la acción

### **Opción B: Desde la Terminal**
```bash
# Limpiar sesión local
npm run clear-session

# Reinstalar la app
npx react-native run-ios
```

### **Opción C: Limpieza Manual**
```bash
# Detener la app
# Eliminar datos del simulador
xcrun simctl erase all

# Reinstalar
npm run ios
```

## 🧪 Verificación

Después de aplicar cualquier solución:

1. **Verifica que la app te redirija al login**
2. **Intenta iniciar sesión con el usuario eliminado**
3. **Deberías recibir un error de credenciales inválidas**

## 📝 Notas Importantes

- **Persistencia de Sesión**: Supabase guarda tokens localmente por seguridad
- **Validación Dual**: La app ahora valida tanto local como en la BD
- **Limpieza Automática**: Si el usuario no existe en BD, se limpia automáticamente

## 🚀 Prevención

Para evitar este problema en el futuro:

1. **Usa la función `forceLogout()`** cuando elimines usuarios
2. **Implementa webhooks** en Supabase para notificar cambios
3. **Considera usar RLS (Row Level Security)** para mayor seguridad

## 📞 Soporte

Si el problema persiste:
1. Revisa los logs de la consola
2. Verifica la conexión con Supabase
3. Ejecuta `npm run clear-session` y reinstala la app 