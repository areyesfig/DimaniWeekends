# DimaniWeekends - App de Catálogo y Carrito de Compras

## 📱 Descripción

DimaniWeekends es una aplicación móvil desarrollada en React Native que permite a los usuarios explorar un catálogo de productos (empanadas y cachitos) y realizar pedidos a través de un carrito de compras integrado con sistema de pago Webpay Plus.

## ✨ Funcionalidades Implementadas

### 🛍️ Catálogo de Productos
- **Productos disponibles:**
  - Empanada de Pino ($1,200)
  - Empanada Napolitana ($1,300)
  - Empanada de Queso y Jamón ($1,400)
  - Cachito de Jamón ($800)
  - Cachito de Queso ($900)

- **Características del catálogo:**
  - Filtros por categoría (Todos, Empanadas, Cachitos)
  - Información detallada de cada producto
  - Stock en tiempo real
  - Precios formateados en pesos chilenos
  - Indicador de productos en el carrito

### 🛒 Carrito de Compras
- **Funcionalidades:**
  - Agregar productos con validación de stock
  - Modificar cantidades (+ y -)
  - Eliminar productos automáticamente
  - Cálculo automático del total
  - Persistencia de datos en AsyncStorage
  - Badge visual con cantidad de items

### 📋 Checkout y Validaciones
- **Formulario de entrega:**
  - Nombre completo, dirección, comuna, teléfono
  - Selector de fecha y hora de entrega
  - Validación de horarios (sábados y domingos 10:00-14:00)
  - Validación de tiempo mínimo de anticipación (2 horas)

- **Restricciones de fin de semana:**
  - Solo pedidos para sábados y domingos
  - Horario restringido de 10:00 a 14:00
  - Validación en cliente y servidor

### 💳 Sistema de Pago
- **Webpay Plus Sandbox:**
  - Integración completa con Transbank
  - WebView para formulario de pago
  - Manejo de callbacks y resultados
  - Pantalla de resultado de pago

### 🔄 Reserva de Stock
- **Sistema de reservas:**
  - Validación de ventana de pedidos
  - Reserva automática de stock
  - Expiración de reservas (15 minutos)
  - Liberación automática de stock expirado

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ProductCard.tsx   # Tarjeta de producto
│   ├── CartItem.tsx      # Item del carrito
│   └── CartBadge.tsx     # Badge del carrito
├── context/
│   └── CartContext.tsx   # Contexto global del carrito
├── screens/              # Pantallas de la aplicación
│   ├── CatalogScreen.tsx # Pantalla del catálogo
│   ├── CartScreen.tsx    # Pantalla del carrito
│   ├── CheckoutScreen.tsx # Pantalla de checkout
│   ├── PaymentScreen.tsx # Pantalla de pago
│   └── PaymentResultScreen.tsx # Resultado de pago
├── services/
│   ├── firebaseService.ts # Servicios de Firebase
│   ├── webpayService.ts   # Servicios de Webpay
│   ├── productService.ts  # Servicio de productos
│   └── dateValidationService.ts # Validación de fechas
└── types/
    └── index.ts          # Tipos TypeScript
```

## 🛠️ Tecnologías Utilizadas

- **React Native:** Framework principal
- **TypeScript:** Tipado estático
- **React Navigation:** Navegación entre pantallas
- **AsyncStorage:** Persistencia de datos
- **Context API:** Estado global
- **Firebase:** Backend y servicios
- **Webpay Plus:** Sistema de pagos
- **React Native Vector Icons:** Iconografía

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)
- Firebase CLI
- Cuenta de Transbank (para Webpay)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/areyesfig/DimaniWeekends.git
cd DimaniWeekends

# Instalar dependencias
npm install

# Para iOS (macOS)
cd ios && pod install && cd ..
```

### Configuración de Firebase

1. **Crear proyecto en Firebase Console**
2. **Habilitar servicios:**
   - Firestore Database
   - Cloud Functions
   - Authentication (opcional)

3. **Configurar Firestore:**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inicializar proyecto
firebase init

# Seleccionar servicios:
# - Firestore
# - Functions
# - Hosting (opcional)
```

4. **Configurar Remote Config:**
```bash
# Crear configuración de ventana de pedidos
firebase functions:config:set orderwindow.starttime="10:00"
firebase functions:config:set orderwindow.endtime="14:00"
firebase functions:config:set orderwindow.alloweddays="[6,0]"
firebase functions:config:set orderwindow.reservationttl="15"
```

### Despliegue de Cloud Functions

```bash
# Desplegar funciones
firebase deploy --only functions

# Verificar funciones desplegadas
firebase functions:list
```

### Configuración de Webpay Sandbox

1. **Obtener credenciales de Transbank:**
   - Commerce Code: `597055555532`
   - API Key: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C`

2. **Configurar URL de retorno:**
   - URL: `dimaniweekends://payment-result`

### Ejecución
```bash
# Iniciar Metro bundler
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## 📋 Checkpoints del Proyecto

### ✅ Checkpoint 1: Catálogo y Carrito (Commit: cdd4f1e)
- Sistema completo de catálogo de productos
- Carrito de compras funcional
- Navegación entre pantallas
- Persistencia de datos
- Interfaz moderna y responsive

### ✅ Checkpoint 2: Checkout y Pago (Commit: feature/mejoras-app)
- Sistema de checkout completo
- Validaciones de fecha y horario
- Integración con Webpay Plus
- Reserva de stock
- Cloud Functions para validaciones

## 🧪 Pruebas Unitarias

### Ejecutar pruebas:
```bash
npm test
```

### Pruebas implementadas:
- Validación de fechas de entrega
- Generación de fechas disponibles
- Formateo de fechas
- Validaciones de formulario

## 🔧 Configuración de Desarrollo

### Variables de entorno:
```bash
# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id

# Webpay
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=your_webpay_api_key
```

### Estructura de Firestore:
```
/settings
  /orderWindow
    - startTime: "10:00"
    - endTime: "14:00"
    - allowedDays: [6, 0]
    - reservationTtlMinutes: 15

/orders
  /{orderId}
    - userId: string
    - items: array
    - total: number
    - status: string
    - checkoutData: object
    - createdAt: timestamp
    - expiresAt: timestamp
```

## 🎯 Próximas Funcionalidades

- [ ] Sistema de autenticación de usuarios
- [ ] Historial de pedidos
- [ ] Notificaciones push
- [ ] Geolocalización para delivery
- [ ] Sistema de reseñas y calificaciones
- [ ] Dashboard administrativo
- [ ] Reportes de ventas

## 📄 Licencia

Este proyecto es privado y desarrollado para DimaniWeekends.

## 👨‍💻 Desarrollador

Desarrollado con ❤️ usando React Native, TypeScript y Firebase.
