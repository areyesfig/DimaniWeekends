# Módulo de Autenticación

Este módulo proporciona una solución completa de autenticación para React Native usando Firebase Auth.

## Características

- ✅ **SignInScreen**: Inicio de sesión con email/password
- ✅ **SignUpScreen**: Registro de nuevos usuarios
- ✅ **ForgotPasswordScreen**: Recuperación de contraseña
- ✅ **AuthStack**: Navegación entre pantallas de auth
- ✅ **Validación Yup**: Esquemas de validación robustos
- ✅ **React Hook Form**: Manejo eficiente de formularios
- ✅ **KeyboardAvoidingView**: UX optimizada para teclado
- ✅ **Tests Jest**: Cobertura completa de tests

## Estructura

```
src/features/auth/
├── screens/
│   ├── SignInScreen.tsx
│   ├── SignUpScreen.tsx
│   └── ForgotPasswordScreen.tsx
├── navigation/
│   └── AuthStack.tsx
├── validation/
│   └── authSchema.ts
├── __tests__/
│   ├── SignInScreen.test.tsx
│   └── authValidation.test.tsx
└── index.ts
```

## Uso

### Importar el módulo completo

```typescript
import { AuthStack, SignInScreen, signInSchema } from '../features/auth';
```

### Usar en navegación principal

```typescript
import { AuthStack } from '../features/auth';

// En tu navegación principal
<Stack.Screen name="Auth" component={AuthStack} />
```

### Validaciones disponibles

```typescript
import { signInSchema, signUpSchema, forgotPasswordSchema } from '../features/auth/validation/authSchema';

// Validaciones incluidas:
// - Email válido
// - Password mínimo 6 caracteres
// - Confirmación de password
// - Nombre requerido para registro
```

## Tests

Ejecutar tests del módulo:

```bash
npm test -- --testPathPattern=auth
```

### Tests incluidos:

1. **SignInScreen.test.tsx**:
   - ✅ Verifica que `signIn` dispara `auth().signInWithEmailAndPassword`
   - ✅ Verifica navegación entre pantallas
   - ✅ Manejo de errores

2. **authValidation.test.tsx**:
   - ✅ Verifica validación de email malformado
   - ✅ Verifica validación de password mínimo 6 caracteres
   - ✅ Verifica que se muestran errores en componentes

## Dependencias

- `react-hook-form`: Manejo de formularios
- `@hookform/resolvers/yup`: Integración con Yup
- `yup`: Validaciones
- `@react-native-firebase/auth`: Autenticación Firebase
- `@testing-library/react-native`: Tests de componentes

## Configuración

Asegúrate de tener configurado Firebase en tu proyecto:

1. Archivo `google-services.json` en `android/app/`
2. Archivo `GoogleService-Info.plist` en `ios/`
3. Variables de entorno en `.env`

## Estilos

El módulo usa estilos inline modernos con:
- Colores consistentes (#4CAF50 como primario)
- Bordes redondeados (8px)
- Espaciado consistente
- Estados de loading
- Manejo de errores visual 