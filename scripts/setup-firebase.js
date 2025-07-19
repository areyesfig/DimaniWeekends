const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupFirebase() {
  try {
    console.log('🚀 Configurando Firebase...');

    // 1. Configurar ventana de pedidos
    console.log('📅 Configurando ventana de pedidos...');
    await db.collection('settings').doc('orderWindow').set({
      startTime: '10:00',
      endTime: '14:00',
      allowedDays: [0, 6], // 0 = domingo, 6 = sábado
      reservationTtlMinutes: 15
    });

    // 2. Configurar productos
    console.log('🛍️ Configurando productos...');
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

    for (const product of products) {
      await db.collection('products').doc(product.id).set(product);
    }

    // 3. Configurar configuración de Webpay
    console.log('💳 Configurando Webpay...');
    await db.collection('settings').doc('webpay').set({
      commerceCode: '597055555532',
      apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      environment: 'integration', // integration para sandbox
      returnUrl: 'https://dimaniweekends-app.web.app/webpay-callback'
    });

    console.log('✅ Firebase configurado exitosamente!');
    console.log('');
    console.log('📋 Datos configurados:');
    console.log('- Ventana de pedidos: Sábados y domingos 10:00-14:00');
    console.log('- 5 productos con stock inicial');
    console.log('- Configuración de Webpay Sandbox');
    console.log('');
    console.log('🔗 Consola de Firebase: https://console.firebase.google.com/project/dimaniweekends-app');

  } catch (error) {
    console.error('❌ Error configurando Firebase:', error);
  }
}

setupFirebase(); 