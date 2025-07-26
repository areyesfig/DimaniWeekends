// Tipos para productos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'empanadas' | 'cachitos';
  image?: string;
  isAvailable: boolean;
}

// Tipos para items del carrito
export interface CartItem {
  product: Product;
  quantity: number;
}



// Tipos para el contexto del carrito
export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}

// Tipos para el sistema de checkout
export interface OrderWindow {
  startTime: string; // "10:00"
  endTime: string; // "14:00"
  allowedDays: number[]; // [6, 0] para sábado y domingo
  reservationTtlMinutes: number; // 15 minutos
}

export interface CheckoutForm {
  fullName: string;
  addressLine: string;
  commune: string;
  phone: string;
  deliveryDateTime: Date;
}

export interface CheckoutFormErrors {
  fullName?: string;
  addressLine?: string;
  commune?: string;
  phone?: string;
  deliveryDateTime?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'reserved' | 'paid' | 'confirmed' | 'delivered' | 'cancelled';
  checkoutData: CheckoutForm;
  createdAt: Date;
  expiresAt?: Date;
  paymentId?: string;
  webpayToken?: string;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  error?: string;
}

export interface ValidateOrderWindowResult {
  ok: boolean;
  message?: string;
}

export interface ReserveStockResult {
  orderId: string;
  reserved: boolean;
}

export interface WebpayConfig {
  commerceCode: string;
  apiKey: string;
  returnUrl: string;
  sessionId: string;
  amount: number;
  buyOrder: string;
}

// Tipos para Firebase Functions
export interface ValidateOrderWindowParams {
  deliveryDateTime: string;
  items: CartItem[];
}

export interface ReserveStockParams {
  items: CartItem[];
  orderData: CheckoutForm;
  userId: string;
}

export interface WebpayCallbackParams {
  token_ws: string;
  tbk_orden_compra: string;
  tbk_respuesta: string;
} 