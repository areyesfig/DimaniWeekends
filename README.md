# 🥟 DimaniWeekends - App de Empanadas y Cachitos

Aplicación móvil React Native para pedidos de empanadas y cachitos con restricciones de fin de semana, reserva de stock y integración con Webpay Plus.

## 🚀 Características

### 📱 Funcionalidades Principales
- **Catálogo de productos** con empanadas y cachitos
- **Carrito de compras** con persistencia local
- **Checkout completo** con validaciones de fecha/hora
- **Restricciones de fin de semana** (sábados/domingos 10:00-14:00)
- **Reserva de stock** en tiempo real
- **Integración Webpay Plus** para pagos
- **Validaciones cliente y servidor**

### 🛍️ Productos Disponibles
- **Empanadas:** Pino, Napolitana, Queso y Jamón
- **Cachitos:** Jamón, Queso
- **Stock en tiempo real** con reservas automáticas

### ⏰ Ventana de Pedidos
- **Días:** Sábados y domingos únicamente
- **Horario:** 10:00 AM - 2:00 PM
- **Reserva:** 15 minutos para completar el pago

## 🛠️ Tecnologías

- **Frontend:** React Native CLI + TypeScript
- **Navegación:** React Navigation v6
- **Estado:** Context API + AsyncStorage
- **Backend:** Firebase Firestore + Cloud Functions
- **Pagos:** Webpay Plus Sandbox
- **Testing:** Jest + React Native Testing Library

## 📋 Requisitos Previos

- Node.js 18+
- React Native CLI
- Android Studio / Xcode
- Firebase CLI
- Plan Blaze de Firebase (para Cloud Functions)

## 🔧 Instalación

### 1. Clonar y Instalar Dependencias

```bash
git clone https://github.com/areyesfig/DimaniWeekends.git
cd DimaniWeekends
npm install
```

### 2. Configurar Firebase

**IMPORTANTE:** Sigue las instrucciones detalladas en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

1. Actualizar plan de Firebase a Blaze
2. Habilitar APIs necesarias
3. Desplegar Firestore y Cloud Functions
4. Configurar datos iniciales

### 3. Configurar Firebase en la App

1. Descargar `google-services.json` desde Firebase Console
2. Colocar en `android/app/google-services.json`
3. Descargar `GoogleService-Info.plist` desde Firebase Console
4. Colocar en `ios/DimaniWeekends/GoogleService-Info.plist`

### 4. Ejecutar la Aplicación

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

## 🏗️ Arquitectura

### 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Context API (CartContext)
├── screens/            # Pantallas de la aplicación
├── services/           # Servicios (Firebase, Webpay)
├── types/              # Definiciones de TypeScript
└── __tests__/          # Pruebas unitarias
```

### 🔄 Flujo de Checkout

1. **Selección de productos** → Carrito
2. **Validación cliente** → Fecha/hora permitida
3. **Validación servidor** → Stock disponible
4. **Reserva de stock** → 15 minutos
5. **Pago Webpay** → WebView
6. **Callback** → Actualización estado
7. **Resultado** → Confirmación o liberación

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas específicas
npm test dateValidationService.test.ts

# Con coverage
npm test -- --coverage
```

### Pruebas Implementadas

- ✅ Validación de fechas y horarios
- ✅ Generación de fechas disponibles
- ✅ Formateo de fechas
- ✅ Validaciones de ventana de pedidos

## 🔧 Cloud Functions

### Funciones Implementadas

1. **`validateOrderWindow`** - Validación de ventana de pedidos
2. **`reserveStock`** - Reserva temporal de stock
3. **`releaseExpiredOrders`** - Liberación automática de stock
4. **`handleWebpayCallback`** - Procesamiento de pagos

### Desplegar Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

## 📊 Base de Datos

### Colecciones Firestore

- **`products`** - Catálogo con stock en tiempo real
- **`orders`** - Órdenes con estados y datos de pago
- **`settings`** - Configuración de ventana y Webpay

### Estados de Orden

- `reserved` - Stock reservado, pendiente pago
- `paid` - Pago exitoso
- `cancelled` - Cancelada o expirada

## 🔐 Configuración de Seguridad

### Reglas Firestore

```javascript
// Lectura pública para productos y configuración
// Escritura restringida para órdenes
// Validaciones en Cloud Functions
```

### Validaciones

- **Cliente:** Fecha/hora, formulario
- **Servidor:** Stock, ventana de pedidos
- **Transacciones:** Consistencia de datos

## 🚀 Despliegue

### Preparación para Producción

1. **Webpay:** Cambiar a modo producción
2. **Firebase:** Configurar reglas de seguridad
3. **APIs:** Habilitar todas las APIs necesarias
4. **Testing:** Ejecutar suite completa de pruebas

### Variables de Entorno

```bash
# Firebase
FIREBASE_PROJECT_ID=dimaniweekends-app

# Webpay
WEBPAY_COMMERCE_CODE=tu_codigo_comercio
WEBPAY_API_KEY=tu_api_key
WEBPAY_ENVIRONMENT=production
```

## 📱 Pantallas

### Flujo de Usuario

1. **HomeScreen** - Catálogo de productos
2. **CartScreen** - Carrito y checkout
3. **CheckoutScreen** - Formulario de entrega
4. **PaymentScreen** - WebView de Webpay
5. **PaymentResultScreen** - Resultado del pago

## 🔍 Troubleshooting

### Problemas Comunes

**Error: "Firebase not initialized"**
- Verificar archivos de configuración
- Revisar credenciales de Firebase

**Error: "Cloud Functions not found"**
- Verificar despliegue de functions
- Revisar logs en Firebase Console

**Error: "Webpay callback failed"**
- Verificar URL de callback
- Revisar configuración de Webpay

**Error: "Stock validation failed"**
- Verificar datos en Firestore
- Revisar Cloud Functions logs

## 📈 Monitoreo

### Logs Importantes

- **Firebase Console:** Logs de Cloud Functions
- **Google Cloud Console:** Logs de APIs
- **App:** Console.log para debugging

### Métricas a Monitorear

- Órdenes por día/hora
- Tasa de conversión
- Errores de validación
- Tiempo de respuesta de APIs

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/areyesfig/DimaniWeekends/issues)
- **Documentación:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Firebase Console:** https://console.firebase.google.com/project/dimaniweekends-app

---

**Desarrollado con ❤️ para DimaniWeekends**
