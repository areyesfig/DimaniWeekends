# 🔥 Configuración de Firebase para DimaniWeekends

## 📋 Pasos para Configurar Firebase

### 1. Actualizar Plan de Firebase

**IMPORTANTE:** Las Cloud Functions requieren el plan Blaze (pay-as-you-go).

1. Ve a: https://console.firebase.google.com/project/dimaniweekends-app/usage/details
2. Haz clic en "Upgrade to Blaze"
3. Configura tu método de pago
4. **Nota:** El plan Blaze tiene un tier gratuito generoso para desarrollo

### 2. Habilitar APIs de Google Cloud

Ve a la consola de Google Cloud y habilita estas APIs:

1. **Cloud Firestore API:**
   - https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=dimaniweekends-app

2. **Cloud Functions API:**
   - https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=dimaniweekends-app

3. **Cloud Build API:**
   - https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=dimaniweekends-app

### 3. Desplegar Firestore

```bash
firebase deploy --only firestore
```

### 4. Desplegar Cloud Functions

```bash
firebase deploy --only functions
```

### 5. Configurar Datos Iniciales

#### Opción A: Usando el Script (Recomendado)

1. Descarga la clave de servicio desde Firebase Console:
   - Ve a: https://console.firebase.google.com/project/dimaniweekends-app/settings/serviceaccounts/adminsdk
   - Haz clic en "Generate new private key"
   - Guarda el archivo como `serviceAccountKey.json` en la raíz del proyecto

2. Ejecuta el script de configuración:
```bash
node scripts/setup-firebase.js
```

#### Opción B: Configuración Manual

Ejecuta estos comandos en la consola de Firebase:

```javascript
// Configurar ventana de pedidos
db.collection('settings').doc('orderWindow').set({
  startTime: '10:00',
  endTime: '14:00',
  allowedDays: [0, 6], // 0 = domingo, 6 = sábado
  reservationTtlMinutes: 15
});

// Configurar productos
const products = [
  {
    id: 'empanada-pino',
    name: 'Empanada de Pino',
    description: 'Empanada tradicional de pino con carne, cebolla, huevo y aceitunas',
    price: 1200,
    stock: 50,
    category: 'empanadas',
    image: 'https://via.placeholder.com/300x200?text=Empanada+Pino'
  },
  {
    id: 'empanada-napolitana',
    name: 'Empanada Napolitana',
    description: 'Empanada con jamón, queso y tomate',
    price: 1300,
    stock: 40,
    category: 'empanadas',
    image: 'https://via.placeholder.com/300x200?text=Empanada+Napolitana'
  },
  {
    id: 'empanada-queso-jamon',
    name: 'Empanada de Queso y Jamón',
    description: 'Empanada con queso y jamón premium',
    price: 1400,
    stock: 35,
    category: 'empanadas',
    image: 'https://via.placeholder.com/300x200?text=Empanada+Queso+Jamon'
  },
  {
    id: 'cachito-jamon',
    name: 'Cachito de Jamón',
    description: 'Cachito relleno con jamón premium',
    price: 800,
    stock: 60,
    category: 'cachitos',
    image: 'https://via.placeholder.com/300x200?text=Cachito+Jamon'
  },
  {
    id: 'cachito-queso',
    name: 'Cachito de Queso',
    description: 'Cachito relleno con queso derretido',
    price: 700,
    stock: 70,
    category: 'cachitos',
    image: 'https://via.placeholder.com/300x200?text=Cachito+Queso'
  }
];

products.forEach(product => {
  db.collection('products').doc(product.id).set(product);
});

// Configurar Webpay
db.collection('settings').doc('webpay').set({
  commerceCode: '597055555532',
  apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  environment: 'integration',
  returnUrl: 'https://dimaniweekends-app.web.app/webpay-callback'
});
```

### 6. Configurar Firebase en la App

1. Descarga el archivo `google-services.json` desde Firebase Console
2. Colócalo en `android/app/google-services.json`
3. Descarga el archivo `GoogleService-Info.plist` desde Firebase Console
4. Colócalo en `ios/DimaniWeekends/GoogleService-Info.plist`

### 7. Verificar Configuración

1. Ejecuta la app: `npx react-native run-android`
2. Verifica que los productos se cargan desde Firebase
3. Prueba el flujo de checkout
4. Verifica que las validaciones de fecha funcionan

## 🔧 Cloud Functions Implementadas

### 1. `validateOrderWindow`
- Valida que la fecha/hora de entrega esté dentro de la ventana permitida
- Verifica stock disponible
- Retorna error si no cumple las condiciones

### 2. `reserveStock`
- Reserva stock temporalmente (15 minutos)
- Crea orden con estado "reserved"
- Usa transacciones para garantizar consistencia

### 3. `releaseExpiredOrders`
- Se ejecuta cada 5 minutos
- Libera stock de órdenes expiradas
- Cancela órdenes que no se pagaron

### 4. `handleWebpayCallback`
- Procesa callbacks de Webpay
- Actualiza estado de la orden según resultado del pago
- Redirige a la app con el resultado

## 📊 Estructura de Datos

### Colección: `settings`
- `orderWindow`: Configuración de ventana de pedidos
- `webpay`: Configuración de Webpay

### Colección: `products`
- Productos con stock en tiempo real
- Categorías: empanadas, cachitos

### Colección: `orders`
- Órdenes con estado: reserved, paid, cancelled
- Incluye datos de checkout y resultado de pago

## 🚀 URLs Importantes

- **Consola de Firebase:** https://console.firebase.google.com/project/dimaniweekends-app
- **Consola de Google Cloud:** https://console.cloud.google.com/project/dimaniweekends-app
- **Logs de Functions:** https://console.firebase.google.com/project/dimaniweekends-app/functions/logs

## 💡 Notas Importantes

1. **Plan Blaze:** Requerido para Cloud Functions
2. **APIs:** Asegúrate de habilitar todas las APIs necesarias
3. **Webpay:** Configurado en modo sandbox para desarrollo
4. **Stock:** Se reserva temporalmente durante el checkout
5. **Validaciones:** Tanto en cliente como en servidor

## 🔍 Troubleshooting

### Error: "Cloud Functions API not enabled"
- Ve a Google Cloud Console y habilita la API

### Error: "Project must be on Blaze plan"
- Actualiza el plan en Firebase Console

### Error: "Firestore API not enabled"
- Habilita la API de Firestore en Google Cloud Console

### Las funciones no se despliegan
- Verifica que todas las APIs estén habilitadas
- Espera unos minutos después de habilitar las APIs
- Revisa los logs en Firebase Console 