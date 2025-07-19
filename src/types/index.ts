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

// Tipos para datos del usuario en checkout
export interface UserData {
  fullName: string;
  addressLine: string;
  commune: string;
  phone: string;
  deliveryDate: Date;
  paymentMethod: string;
}

// Tipos para órdenes
export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  userData: UserData;
  status: 'pending' | 'confirmed' | 'delivered' | 'lled';
  createdAt?: Date;
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