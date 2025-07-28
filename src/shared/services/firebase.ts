// Mock Firebase services for temporary use without Firebase
import { API_KEY } from '@env';

// Mock types
interface FirebaseAuthTypes {
  User: any;
}

interface FirebaseFirestoreTypes {
  Timestamp: any;
}

// Tipos para la aplicación
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: any; // Mock timestamp
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
  createdAt: any; // Mock timestamp
  updatedAt: any; // Mock timestamp
}

// Mock Firebase services
const mockAuth = () => ({
  createUserWithEmailAndPassword: async (email: string, password: string) => ({
    user: {
      uid: 'mock-user-id',
      email,
      updateProfile: async (data: any) => console.log('Mock: updateProfile', data),
    }
  }),
  signInWithEmailAndPassword: async (email: string, password: string) => ({
    user: {
      uid: 'mock-user-id',
      email,
    }
  }),
  signOut: async () => console.log('Mock: signOut'),
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    // Mock auth state change
    setTimeout(() => callback(null), 100);
    return () => {}; // Mock unsubscribe
  }
});

const mockFirestore = () => ({
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async (data: any) => console.log('Mock: set', data),
      update: async (data: any) => console.log('Mock: update', data),
    }),
    get: async () => ({ docs: [] }),
    where: (field: string, op: string, value: any) => ({
      orderBy: (field: string, direction: string) => ({
        get: async () => ({ docs: [] })
      })
    }),
  }),
  runTransaction: async (updateFunction: any) => {
    return await updateFunction({
      get: async (ref: any) => ({ exists: false, data: () => null }),
      update: async (ref: any, data: any) => console.log('Mock: transaction update', data),
      set: async (ref: any, data: any) => console.log('Mock: transaction set', data),
    });
  },
  Timestamp: {
    now: () => new Date(),
  }
});

// Mock auth and firestore
const auth = mockAuth;
const firestore = mockFirestore;

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
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'mock-user-id-' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date(),
    };

    console.log('Mock: User registered', mockUser);
    return mockUser;
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
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      displayName: email.split('@')[0],
      createdAt: new Date(),
    };

    console.log('Mock: User signed in', mockUser);
    return mockUser;
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
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock: User signed out');
  } catch (error) {
    console.error('Error en signOut:', error);
    throw error;
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = (): any => {
  return auth().currentUser;
};

/**
 * Escucha cambios en el estado de autenticación
 */
export const onAuthStateChanged = (
  callback: (user: any) => void
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};

// ===== SERVICIOS DE PRODUCTOS =====

/**
 * Obtiene todos los productos
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Return mock products
    return [
      {
        id: '1',
        name: 'Producto Mock 1',
        description: 'Descripción del producto mock 1',
        price: 10000,
        stock: 10,
        category: 'mock',
      },
      {
        id: '2',
        name: 'Producto Mock 2',
        description: 'Descripción del producto mock 2',
        price: 20000,
        stock: 5,
        category: 'mock',
      }
    ];
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
    const mockProduct: Product = {
      id: productId,
      name: `Producto Mock ${productId}`,
      description: `Descripción del producto mock ${productId}`,
      price: 15000,
      stock: 8,
      category: 'mock',
    };

    return mockProduct;
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
  try {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOrder: Order = {
      id: 'mock-order-' + Date.now(),
      userId: 'mock-user-id',
      products,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Mock: Order placed', mockOrder);
    return mockOrder;
  } catch (error) {
    console.error('Error creando pedido:', error);
    throw error;
  }
};

/**
 * Obtiene los pedidos del usuario actual
 */
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    // Return mock orders
    return [
      {
        id: 'mock-order-1',
        userId: 'mock-user-id',
        products: [
          {
            productId: '1',
            quantity: 2,
            price: 10000,
            name: 'Producto Mock 1',
          }
        ],
        total: 20000,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
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
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock: Order status updated', { orderId, status });
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
  timestamp: any
): Date => {
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
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