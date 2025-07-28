# Guía de Autenticación de Firebase - DimaniWeekends

## 📋 Resumen

Se ha implementado un sistema completo de autenticación de Firebase con email y password en la aplicación DimaniWeekends. El sistema incluye:

- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ Recuperación de contraseña
- ✅ Manejo de estado de autenticación
- ✅ Navegación automática basada en autenticación

## 🏗️ Arquitectura

### 1. Contexto de Autenticación (`AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Funcionalidades:**
- Maneja el estado global de autenticación
- Escucha cambios en el estado de Firebase Auth
- Proporciona funciones de autenticación a toda la app

### 2. Servicios de Firebase (`firebase.ts`)

**Funciones implementadas:**
- `signUp()` - Registro de usuarios
- `signIn()` - Inicio de sesión
- `signOut()` - Cierre de sesión
- `getCurrentUser()` - Obtener usuario actual
- `onAuthStateChanged()` - Escuchar cambios de estado

### 3. Navegación Inteligente

**AppNavigator.tsx:**
- Muestra pantallas de autenticación si no hay usuario
- Muestra pantallas principales si hay usuario autenticado
- Indicador de carga durante la verificación

## 🎯 Flujo de Autenticación

### Registro de Usuario
1. Usuario llena formulario en `SignUpScreen`
2. Se valida con Yup schema
3. Se llama a `signUp()` del contexto
4. Se crea usuario en Firebase Auth
5. Se crea documento en Firestore
6. Usuario es redirigido automáticamente

### Inicio de Sesión
1. Usuario llena formulario en `SignInScreen`
2. Se valida con Yup schema
3. Se llama a `signIn()` del contexto
4. Se verifica credenciales en Firebase
5. Se obtienen datos de Firestore
6. Usuario es redirigido automáticamente

### Cierre de Sesión
1. Usuario presiona "Cerrar Sesión" en header
2. Se llama a `signOut()` del contexto
3. Se cierra sesión en Firebase
4. Usuario es redirigido a pantallas de auth

## 📱 Pantallas de Autenticación

### SignInScreen
- Formulario de email y password
- Validación en tiempo real
- Manejo de errores
- Navegación a registro y recuperación

### SignUpScreen
- Formulario completo de registro
- Validación de contraseñas
- Campo de nombre opcional
- Navegación a inicio de sesión

### ForgotPasswordScreen
- Recuperación de contraseña
- Envío de email de reset
- Navegación de regreso

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
API_KEY=tu_firebase_api_key_aqui
```

**⚠️ IMPORTANTE:** Nunca subas el archivo `.env` a GitHub. Está incluido en `.gitignore`.

### Firebase Config
```typescript
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'dimaniweekends-app.firebaseapp.com',
  projectId: 'dimaniweekends-app',
  storageBucket: 'dimaniweekends-app.firebasestorage.app',
  messagingSenderId: '859589513015',
  appId: '1:859589513015:android:7364399678e8028512d4b2',
};
```

## 🛡️ Seguridad

### Validación de Formularios
- **Yup schemas** para validación robusta
- **React Hook Form** para manejo eficiente
- Validación en tiempo real
- Mensajes de error personalizados

### Manejo de Errores
- Try-catch en todas las operaciones
- Alertas informativas para el usuario
- Logs de error para debugging
- Fallbacks apropiados

## 🎨 UI/UX

### Diseño Consistente
- Colores corporativos (#4CAF50)
- Tipografía clara y legible
- Espaciado consistente
- Indicadores de carga

### Experiencia de Usuario
- Navegación intuitiva
- Feedback inmediato
- Estados de carga claros
- Mensajes de error útiles

## 🧪 Testing

### Archivos de Test
- `SignInScreen.test.tsx`
- `SignUpScreen.test.tsx`
- `authValidation.test.tsx`

### Cobertura
- Validación de formularios
- Manejo de errores
- Navegación
- Integración con Firebase

## 🚀 Uso

### Para Desarrolladores

1. **Acceder al contexto de auth:**
```typescript
import { useAuth } from '../context/AuthContext';

const { user, signIn, signOut } = useAuth();
```

2. **Verificar estado de autenticación:**
```typescript
if (user) {
  // Usuario autenticado
} else {
  // Usuario no autenticado
}
```

3. **Realizar operaciones de auth:**
```typescript
// Iniciar sesión
await signIn(email, password);

// Registrar usuario
await signUp(email, password, displayName);

// Cerrar sesión
await signOut();
```

### Para Usuarios

1. **Registrarse:**
   - Ir a "Crear Cuenta"
   - Llenar formulario
   - Confirmar registro

2. **Iniciar Sesión:**
   - Ir a "Iniciar Sesión"
   - Ingresar credenciales
   - Acceder a la app

3. **Cerrar Sesión:**
   - Presionar "Cerrar Sesión" en header
   - Volver a pantallas de auth

## 🔄 Estado Actual

✅ **Implementado:**
- Sistema completo de autenticación
- Navegación automática
- Manejo de errores
- UI/UX optimizada
- Integración con Firebase

🔄 **En Desarrollo:**
- Mejoras en UX
- Tests adicionales
- Funcionalidades avanzadas

## 📞 Soporte

Para dudas o problemas con la autenticación:
1. Revisar logs de Firebase Console
2. Verificar configuración de variables de entorno
3. Comprobar conectividad de red
4. Validar credenciales de Firebase

---

**DimaniWeekends** - Sistema de Autenticación Firebase v1.0 