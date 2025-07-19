"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebpayCallback = exports.releaseExpiredOrders = exports.reserveStock = exports.validateOrderWindow = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// Función auxiliar para validar ventana de pedidos
async function validateOrderWindowInternal(data) {
    const { deliveryDateTime, items } = data;
    // Obtener configuración de ventana de pedidos
    const orderWindowDoc = await db.collection('settings').doc('orderWindow').get();
    if (!orderWindowDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Configuración de ventana de pedidos no encontrada');
    }
    const orderWindow = orderWindowDoc.data();
    const deliveryDate = new Date(deliveryDateTime);
    // Validar día de la semana
    const dayOfWeek = deliveryDate.getDay();
    if (!orderWindow.allowedDays.includes(dayOfWeek)) {
        throw new functions.https.HttpsError('out-of-range', 'Solo se permiten pedidos para sábados y domingos');
    }
    // Validar horario
    const deliveryTime = deliveryDate.toTimeString().slice(0, 5);
    if (deliveryTime < orderWindow.startTime || deliveryTime > orderWindow.endTime) {
        throw new functions.https.HttpsError('out-of-range', `El horario de entrega debe ser entre ${orderWindow.startTime} y ${orderWindow.endTime}`);
    }
    // Validar que no sea en el pasado
    const now = new Date();
    if (deliveryDate <= now) {
        throw new functions.https.HttpsError('invalid-argument', 'La fecha de entrega no puede ser en el pasado');
    }
    // Validar stock disponible
    for (const item of items) {
        const productDoc = await db.collection('products').doc(item.product.id).get();
        if (!productDoc.exists) {
            throw new functions.https.HttpsError('not-found', `Producto ${item.product.name} no encontrado`);
        }
        const product = productDoc.data();
        if (product.stock < item.quantity) {
            throw new functions.https.HttpsError('resource-exhausted', `Stock insuficiente para ${item.product.name}`);
        }
    }
    return { ok: true };
}
// Cloud Function: validateOrderWindow
exports.validateOrderWindow = functions.https.onCall(async (data, context) => {
    try {
        return await validateOrderWindowInternal(data);
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Error validando ventana de pedidos');
    }
});
// Cloud Function: reserveStock
exports.reserveStock = functions.https.onCall(async (data, context) => {
    try {
        const { items, orderData, userId } = data;
        // Validar ventana de pedidos primero
        const validateData = {
            deliveryDateTime: orderData.deliveryDateTime,
            items
        };
        const validateResult = await validateOrderWindowInternal(validateData);
        if (!validateResult.ok) {
            throw new functions.https.HttpsError('failed-precondition', 'Validación de ventana de pedidos falló');
        }
        // Crear orden con transacción
        const result = await db.runTransaction(async (transaction) => {
            // Verificar stock disponible
            for (const item of items) {
                const productRef = db.collection('products').doc(item.product.id);
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists) {
                    throw new Error(`Producto ${item.product.name} no encontrado`);
                }
                const product = productDoc.data();
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para ${item.product.name}`);
                }
            }
            // Crear orden
            const orderRef = db.collection('orders').doc();
            const orderId = orderRef.id;
            const order = {
                id: orderId,
                userId,
                items,
                total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
                status: 'reserved',
                checkoutData: orderData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
            };
            transaction.set(orderRef, order);
            // Reservar stock
            for (const item of items) {
                const productRef = db.collection('products').doc(item.product.id);
                transaction.update(productRef, {
                    stock: admin.firestore.FieldValue.increment(-item.quantity)
                });
            }
            return { orderId, reserved: true };
        });
        return result;
    }
    catch (error) {
        console.error('Error reservando stock:', error);
        throw new functions.https.HttpsError('internal', 'Error reservando stock');
    }
});
// Cloud Function: releaseExpiredOrders (Scheduled)
exports.releaseExpiredOrders = functions.pubsub
    .schedule('every 5 minutes')
    .onRun(async (context) => {
    try {
        const now = new Date();
        // Buscar órdenes expiradas
        const expiredOrders = await db
            .collection('orders')
            .where('status', '==', 'reserved')
            .where('expiresAt', '<', now)
            .get();
        for (const orderDoc of expiredOrders.docs) {
            const order = orderDoc.data();
            // Revertir stock
            for (const item of order.items) {
                const productRef = db.collection('products').doc(item.product.id);
                await db.runTransaction(async (transaction) => {
                    transaction.update(productRef, {
                        stock: admin.firestore.FieldValue.increment(item.quantity)
                    });
                });
            }
            // Actualizar estado de la orden
            await orderDoc.ref.update({
                status: 'cancelled',
                cancelledAt: admin.firestore.FieldValue.serverTimestamp()
            });
            // Enviar notificación (implementar FCM si es necesario)
            console.log(`Orden ${order.id} expirada y stock liberado`);
        }
        return null;
    }
    catch (error) {
        console.error('Error liberando órdenes expiradas:', error);
        return null;
    }
});
// Cloud Function: handleWebpayCallback (HTTP)
exports.handleWebpayCallback = functions.https.onRequest(async (req, res) => {
    try {
        const { token_ws, tbk_orden_compra, tbk_respuesta } = req.body;
        if (!token_ws || !tbk_orden_compra) {
            res.status(400).send('Parámetros requeridos faltantes');
            return;
        }
        // Actualizar estado de la orden
        const orderRef = db.collection('orders').doc(tbk_orden_compra);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            res.status(404).send('Orden no encontrada');
            return;
        }
        const newStatus = tbk_respuesta === '0' ? 'paid' : 'cancelled';
        await orderRef.update({
            status: newStatus,
            paymentResult: {
                token: token_ws,
                response: tbk_respuesta,
                processedAt: admin.firestore.FieldValue.serverTimestamp()
            }
        });
        // Redirigir según el resultado
        if (newStatus === 'paid') {
            res.redirect('dimaniweekends://payment-result?success=true&orderId=' + tbk_orden_compra);
        }
        else {
            res.redirect('dimaniweekends://payment-result?success=false&orderId=' + tbk_orden_compra);
        }
    }
    catch (error) {
        console.error('Error procesando callback de Webpay:', error);
        res.status(500).send('Error interno');
    }
});
//# sourceMappingURL=index.js.map