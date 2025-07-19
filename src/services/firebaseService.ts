import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { 
  ValidateOrderWindowParams, 
  ValidateOrderWindowResult, 
  ReserveStockParams, 
  ReserveStockResult,
  Order,
  CheckoutForm,
  CartItem
} from '../types';

const functions = getFunctions();
const firestore = getFirestore();

// Cloud Function: validateOrderWindow
export const validateOrderWindow = async (
  params: ValidateOrderWindowParams
): Promise<ValidateOrderWindowResult> => {
  try {
    const validateOrderWindowFunction = httpsCallable<
      ValidateOrderWindowParams, 
      ValidateOrderWindowResult
    >(functions, 'validateOrderWindow');
    
    const result = await validateOrderWindowFunction(params);
    return result.data;
  } catch (error: any) {
    console.error('Error validating order window:', error);
    return {
      ok: false,
      message: error.message || 'Error al validar la ventana de pedidos'
    };
  }
};

// Cloud Function: reserveStock
export const reserveStock = async (
  params: ReserveStockParams
): Promise<ReserveStockResult> => {
  try {
    const reserveStockFunction = httpsCallable<
      ReserveStockParams, 
      ReserveStockResult
    >(functions, 'reserveStock');
    
    const result = await reserveStockFunction(params);
    return result.data;
  } catch (error: any) {
    console.error('Error reserving stock:', error);
    return {
      orderId: '',
      reserved: false
    };
  }
};

// Firestore: Obtener configuración de ventana de pedidos
export const getOrderWindowConfig = async () => {
  try {
    const orderWindowDoc = doc(firestore, 'settings', 'orderWindow');
    const orderWindowSnapshot = await getDoc(orderWindowDoc);
    
    if (orderWindowSnapshot.exists()) {
      return orderWindowSnapshot.data();
    }
    
    // Configuración por defecto si no existe
    const defaultConfig = {
      startTime: '10:00',
      endTime: '14:00',
      allowedDays: [6, 0], // Sábado y domingo
      reservationTtlMinutes: 15
    };
    
    await setDoc(orderWindowDoc, defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error('Error getting order window config:', error);
    throw error;
  }
};

// Firestore: Crear orden
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const ordersRef = collection(firestore, 'orders');
    const newOrderRef = doc(ordersRef);
    
    const order: Order = {
      ...orderData,
      id: newOrderRef.id,
      createdAt: new Date()
    };
    
    await setDoc(newOrderRef, order);
    return newOrderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Firestore: Actualizar estado de orden
export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Firestore: Obtener orden por ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(firestore, 'orders', orderId);
    const orderSnapshot = await getDoc(orderRef);
    
    if (orderSnapshot.exists()) {
      return orderSnapshot.data() as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Firestore: Obtener órdenes expiradas
export const getExpiredOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(firestore, 'orders');
    const now = new Date();
    
    const q = query(
      ordersRef,
      where('status', '==', 'reserved'),
      where('expiresAt', '<', now)
    );
    
    const querySnapshot = await getDocs(q);
    const expiredOrders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      expiredOrders.push(doc.data() as Order);
    });
    
    return expiredOrders;
  } catch (error) {
    console.error('Error getting expired orders:', error);
    throw error;
  }
}; 