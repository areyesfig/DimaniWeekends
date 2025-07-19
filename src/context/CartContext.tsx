import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, Product, CheckoutForm, Order } from '../types';
import { validateOrderWindow, reserveStock } from '../services/firebaseService';
import { validateDeliveryDateTime, validatePreparationTime } from '../services/dateValidationService';

interface CartState {
  items: CartItem[];
  total: number;
  isCheckingOut: boolean;
  checkoutError?: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'START_CHECKOUT' }
  | { type: 'CHECKOUT_SUCCESS'; payload: { orderId: string } }
  | { type: 'CHECKOUT_ERROR'; payload: string }
  | { type: 'RESET_CHECKOUT' };

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  checkout: (checkoutData: CheckoutForm, orderWindow: any) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  isCheckingOut: boolean;
  checkoutError?: string;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };
      } else {
        const newItem: CartItem = {
          product: action.payload,
          quantity: 1
        };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        isCheckingOut: false,
        checkoutError: undefined
      };
      
    case 'LOAD_CART':
      return action.payload;
      
    case 'START_CHECKOUT':
      return {
        ...state,
        isCheckingOut: true,
        checkoutError: undefined
      };
      
    case 'CHECKOUT_SUCCESS':
      return {
        ...state,
        isCheckingOut: false,
        items: [],
        total: 0
      };
      
    case 'CHECKOUT_ERROR':
      return {
        ...state,
        isCheckingOut: false,
        checkoutError: action.payload
      };
      
    case 'RESET_CHECKOUT':
      return {
        ...state,
        isCheckingOut: false,
        checkoutError: undefined
      };
      
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isCheckingOut: false
  });

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [state.items, state.total]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { ...cartData, isCheckingOut: false } });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      const cartData = {
        items: state.items,
        total: state.total
      };
      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addItem = (product: Product) => {
    if (product.stock > 0) {
      dispatch({ type: 'ADD_ITEM', payload: product });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const checkout = async (
    checkoutData: CheckoutForm, 
    orderWindow: any
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      dispatch({ type: 'START_CHECKOUT' });

      // Validar que hay items en el carrito
      if (state.items.length === 0) {
        dispatch({ type: 'CHECKOUT_ERROR', payload: 'El carrito está vacío' });
        return { success: false, error: 'El carrito está vacío' };
      }

      // Validar fecha y horario de entrega
      const dateValidation = validateDeliveryDateTime(checkoutData.deliveryDateTime, orderWindow);
      if (!dateValidation.isValid) {
        dispatch({ type: 'CHECKOUT_ERROR', payload: dateValidation.message || 'Fecha inválida' });
        return { success: false, error: dateValidation.message };
      }

      // Validar tiempo de preparación
      if (!validatePreparationTime(checkoutData.deliveryDateTime)) {
        dispatch({ type: 'CHECKOUT_ERROR', payload: 'Se requiere mínimo 2 horas de anticipación' });
        return { success: false, error: 'Se requiere mínimo 2 horas de anticipación' };
      }

      // Validar ventana de pedidos en el servidor
      const validateResult = await validateOrderWindow({
        deliveryDateTime: checkoutData.deliveryDateTime.toISOString(),
        items: state.items
      });

      if (!validateResult.ok) {
        dispatch({ type: 'CHECKOUT_ERROR', payload: validateResult.message || 'Error validando pedido' });
        return { success: false, error: validateResult.message };
      }

      // Reservar stock
      const reserveResult = await reserveStock({
        items: state.items,
        orderData: checkoutData,
        userId: 'user123' // En un entorno real, esto vendría del auth
      });

      if (!reserveResult.reserved) {
        dispatch({ type: 'CHECKOUT_ERROR', payload: 'Error reservando stock' });
        return { success: false, error: 'Error reservando stock' };
      }

      // Éxito
      dispatch({ type: 'CHECKOUT_SUCCESS', payload: { orderId: reserveResult.orderId } });
      return { success: true, orderId: reserveResult.orderId };

    } catch (error: any) {
      const errorMessage = error.message || 'Error en el proceso de checkout';
      dispatch({ type: 'CHECKOUT_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
      checkout,
      isCheckingOut: state.isCheckingOut,
      checkoutError: state.checkoutError
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 