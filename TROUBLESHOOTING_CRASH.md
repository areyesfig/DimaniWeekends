# 🔧 Guía de Troubleshooting - Problemas de Crash

## 🚨 **Problema: La aplicación se cierra al hacer clic**

### ✅ **Soluciones Implementadas**

#### 1. **ErrorBoundary Agregado**
- ✅ Componente `ErrorBoundary` para capturar errores de JavaScript
- ✅ Manejo de errores en tiempo de ejecución
- ✅ Interfaz de usuario para mostrar errores

#### 2. **AuthContext Simplificado**
- ✅ Eliminación de llamadas a Firestore que podrían causar crash
- ✅ Uso solo de Firebase Auth para datos básicos
- ✅ Manejo robusto de errores en `onAuthStateChanged`

#### 3. **Configuración Mejorada**
- ✅ Firebase actualizado a v12.0.0
- ✅ Android SDK actualizado a 35
- ✅ Gradle actualizado a 8.7

### 🔍 **Posibles Causas del Crash**

#### 1. **Problemas de Firebase**
```javascript
// ❌ Problema: Llamadas a Firestore sin manejo de errores
const userDoc = await firestore().collection('users').doc(uid).get();

// ✅ Solución: Manejo robusto de errores
try {
  const userDoc = await firestore().collection('users').doc(uid).get();
} catch (error) {
  console.error('Error:', error);
  // Fallback
}
```

#### 2. **Problemas de Navegación**
```javascript
// ❌ Problema: Navegación sin verificar estado
navigation.navigate('Screen');

// ✅ Solución: Verificar estado antes de navegar
if (navigation.isFocused()) {
  navigation.navigate('Screen');
}
```

#### 3. **Problemas de Context**
```javascript
// ❌ Problema: Context no inicializado
const { user } = useAuth();

// ✅ Solución: Verificar estado de carga
const { user, isLoading } = useAuth();
if (isLoading) return <LoadingScreen />;
```

### 🛠️ **Herramientas de Debugging**

#### 1. **ErrorBoundary**
```javascript
// Captura errores de JavaScript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### 2. **Logs de Desarrollo**
```bash
# Ver logs de Metro
npx react-native start --reset-cache

# Ver logs de Android
adb logcat | grep -i "dimaniweekends"

# Ver logs de la aplicación
npx react-native log-android
```

#### 3. **Debugging en Chrome**
```javascript
// Agregar en el código para debugging
console.log('Debug info:', data);
debugger; // Pausa la ejecución
```

### 📱 **Verificación de Estado**

#### 1. **Verificar Firebase**
```javascript
// En la consola de desarrollo
console.log('Firebase initialized:', !!firebase.apps.length);
console.log('Auth state:', auth().currentUser);
```

#### 2. **Verificar Navegación**
```javascript
// Verificar rutas disponibles
console.log('Navigation state:', navigation.getState());
```

#### 3. **Verificar Context**
```javascript
// Verificar estado del contexto
console.log('Auth context:', { user, isLoading });
console.log('Cart context:', { items, total });
```

### 🔧 **Soluciones Adicionales**

#### 1. **Limpiar Caché**
```bash
# Limpiar caché de Metro
npx react-native start --reset-cache

# Limpiar caché de Android
cd android && ./gradlew clean

# Limpiar caché de npm
npm cache clean --force
```

#### 2. **Reinstalar Dependencias**
```bash
# Eliminar node_modules
rm -rf node_modules

# Reinstalar dependencias
npm install --legacy-peer-deps
```

#### 3. **Verificar Configuración**
```bash
# Verificar configuración de React Native
npx react-native doctor

# Verificar configuración de Android
cd android && ./gradlew assembleDebug
```

### 🎯 **Prevención de Crashes**

#### 1. **Validación de Datos**
```javascript
// Validar datos antes de usarlos
const safeUser = user || { id: '', email: '', displayName: '' };
```

#### 2. **Manejo de Estados de Carga**
```javascript
// Mostrar loading mientras se cargan datos
if (isLoading) return <LoadingComponent />;
```

#### 3. **Try-Catch en Operaciones Críticas**
```javascript
try {
  await criticalOperation();
} catch (error) {
  console.error('Error:', error);
  // Manejar error apropiadamente
}
```

### 📊 **Monitoreo**

#### 1. **Logs de Error**
- ✅ ErrorBoundary captura errores
- ✅ Console.log para debugging
- ✅ Logs de Metro para errores de JavaScript

#### 2. **Métricas de Rendimiento**
- ✅ Tiempo de carga de componentes
- ✅ Uso de memoria
- ✅ Tiempo de respuesta de Firebase

### 🚀 **Estado Actual**

- ✅ **ErrorBoundary implementado**
- ✅ **AuthContext simplificado**
- ✅ **Firebase actualizado**
- ✅ **Configuración optimizada**
- ✅ **Aplicación estable**

### 📝 **Próximos Pasos**

1. **Monitorear logs** durante el uso de la aplicación
2. **Implementar analytics** para tracking de errores
3. **Agregar más validaciones** en componentes críticos
4. **Optimizar rendimiento** de componentes pesados

---

**Última actualización**: $(date)
**Estado**: ✅ RESUELTO 