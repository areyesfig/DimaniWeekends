import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { API_KEY } from '@env';

// Tipos para la aplicación
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

// Inicialización de Firebase (opcional, ya que auto-linking lo hace automáticamente)
// Firebase se inicializa automáticamente con el google-services.json/GoogleService-Info.plist

// Referencias a las colecciones
const usersCollection = firestore().collection('users');
const productsCollection = firestore().collection('products');
const ordersCollection = firestore().collection('orders');

// ===== SERVICIOS DE AUTENTICACIÓN =====

/**
 * Registra un nuevo usuario con email y contraseña
 */
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    const user = userCredential.user;

    // Actualizar displayName si se proporciona
    if (displayName) {
      await user.updateProfile({ displayName });
    }

    // Crear documento de usuario en Firestore
    const userData: Omit<User, 'id'> = {
      email: user.email!,
      displayName: displayName || user.displayName || undefined,
      createdAt: firestore.Timestamp.now(),
    };

    await usersCollection.doc(user.uid).set(userData);

    return {
      id: user.uid,
      ...userData,
    };
  } catch (error) {
    console.error('Error en signUp:', error);
    throw error;
  }
};

/**
 * Inicia sesión con email y contraseña
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );

    const user = userCredential.user;

    // Obtener datos del usuario desde Firestore
    const userDoc = await usersCollection.doc(user.uid).get();

    if (!userDoc.exists) {
      throw new Error('Usuario no encontrado en la base de datos');
    }

    const userData = userDoc.data() as Omit<User, 'id'>;

    return {
      id: user.uid,
      ...userData,
    };
  } catch (error) {
    console.error('Error en signIn:', error);
    throw error;
  }
};

/**
 * Cierra la sesión actual
 */
export const signOut = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error('Error en signOut:', error);
    throw error;
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

/**
 * Escucha cambios en el estado de autenticación
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};

// ===== SERVICIOS DE PRODUCTOS =====

/**
 * Obtiene todos los productos
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await productsCollection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 */
export const getProduct = async (productId: string): Promise<Product> => {
  try {
    const doc = await productsCollection.doc(productId).get();
    
    if (!doc.exists) {
      throw new Error('Producto no encontrado');
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Product;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    throw error;
  }
};

// ===== SERVICIOS DE PEDIDOS =====

/**
 * Crea un pedido con transacción que descuenta stock
 */
export const placeOrder = async (
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>,
  total: number
): Promise<Order> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const result = await firestore().runTransaction(async (transaction) => {
      // Verificar stock y calcular totales
      const orderItems = [];
      let calculatedTotal = 0;

      for (const item of products) {
        const productRef = productsCollection.doc(item.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists) {
          throw new Error(`Producto ${item.name} no encontrado`);
        }

        const productData = productDoc.data() as Product;
        
        if (productData.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.name}`);
        }

        // Calcular nuevo stock
        const newStock = productData.stock - item.quantity;
        
        // Actualizar stock del producto
        transaction.update(productRef, { stock: newStock });
        
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        });

        calculatedTotal += item.price * item.quantity;
      }

      // Verificar que el total calculado coincida
      if (Math.abs(calculatedTotal - total) > 0.01) {
        throw new Error('El total no coincide con los productos');
      }

      // Crear el pedido
      const orderData: Omit<Order, 'id'> = {
        userId: currentUser.uid,
        products: orderItems,
        total: calculatedTotal,
        status: 'pending',
        createdAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      };

      const orderRef = ordersCollection.doc();
      transaction.set(orderRef, orderData);

      return {
        id: orderRef.id,
        ...orderData,
      } as Order;
    });

    return result;
  } catch (error) {
    console.error('Error creando pedido:', error);
    throw error;
  }
};

/**
 * Obtiene los pedidos del usuario actual
 */
export const getUserOrders = async (): Promise<Order[]> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const snapshot = await ordersCollection
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de un pedido
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  try {
    await ordersCollection.doc(orderId).update({
      status,
      updatedAt: firestore.Timestamp.now(),
    });
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error);
    throw error;
  }
};

// ===== UTILIDADES =====

/**
 * Formatea un timestamp de Firestore a Date
 */
export const formatTimestamp = (
  timestamp: FirebaseFirestoreTypes.Timestamp
): Date => {
  return timestamp.toDate();
};

/**
 * Formatea un precio a string con formato de moneda
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
}; 