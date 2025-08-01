import { supabase } from '../config/supabase';
import { Product, Order, CheckoutForm } from '../types';

// Funciones de autenticación
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    console.log('🔄 Supabase: Registrando usuario...', email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        }
      }
    });

    if (error) {
      console.error('❌ Error en signUp:', error);
      throw error;
    }

    console.log('✅ Usuario registrado exitosamente');
    return data;
  } catch (error: any) {
    console.error('❌ Error en signUp con Supabase:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔄 Supabase: Iniciando sesión...', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Error en signIn:', error);
      
      // Manejar errores específicos
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Por favor, confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email o contraseña incorrectos');
      } else {
        throw error;
      }
    }

    console.log('✅ Inicio de sesión exitoso');
    return data;
  } catch (error: any) {
    console.error('❌ Error en signIn con Supabase:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('🔄 Supabase: Cerrando sesión...');

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Error en signOut:', error);
      throw error;
    }

    console.log('✅ Sesión cerrada exitosamente');
  } catch (error: any) {
    console.error('❌ Error en signOut con Supabase:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('🔄 Supabase: Obteniendo usuario actual...');

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Error obteniendo usuario:', error);
      throw error;
    }

    if (user) {
      console.log('✅ Usuario obtenido:', user.email);
      
      // Validar que el usuario existe en la base de datos
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (profileError || !profile) {
          console.log('⚠️ Usuario no existe en la base de datos, limpiando sesión local');
          await clearLocalSession();
          return null;
        }
        
        console.log('✅ Usuario validado en la base de datos');
      } catch (validationError) {
        console.log('⚠️ Error validando usuario en BD, limpiando sesión local');
        await clearLocalSession();
        return null;
      }
    } else {
      console.log('✅ No hay usuario autenticado');
    }

    return user;
  } catch (error: any) {
    console.error('❌ Error obteniendo usuario actual:', error);
    throw error;
  }
};

// ===== PRODUCTOS Y STOCK =====

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('🔄 Supabase: Obteniendo productos...');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw error;
    }

    console.log('✅ Productos obtenidos:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('❌ Error obteniendo productos:', error);
    throw error;
  }
};

// Obtener productos por categoría
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    console.log('🔄 Supabase: Obteniendo productos de categoría:', category);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('available', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo productos por categoría:', error);
      throw error;
    }

    console.log('✅ Productos de categoría obtenidos:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('❌ Error obteniendo productos por categoría:', error);
    throw error;
  }
};

// Actualizar stock de un producto
export const updateProductStock = async (productId: string, newStock: number): Promise<void> => {
  try {
    console.log('🔄 Supabase: Actualizando stock del producto:', productId, 'a', newStock);

    const { error } = await supabase
      .from('products')
      .update({ 
        stock_quantity: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) {
      console.error('❌ Error actualizando stock:', error);
      throw error;
    }

    console.log('✅ Stock actualizado exitosamente');
  } catch (error: any) {
    console.error('❌ Error actualizando stock:', error);
    throw error;
  }
};

// Verificar disponibilidad de stock
export const checkStockAvailability = async (items: Array<{productId: string, quantity: number}>): Promise<boolean> => {
  try {
    console.log('🔄 Supabase: Verificando disponibilidad de stock...');

    for (const item of items) {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, name')
        .eq('id', item.productId)
        .single();

      if (error) {
        console.error('❌ Error verificando stock:', error);
        throw error;
      }

      if (!data || data.stock_quantity < item.quantity) {
        console.log(`❌ Stock insuficiente para ${data?.name}: disponible ${data?.stock_quantity}, solicitado ${item.quantity}`);
        return false;
      }
    }

    console.log('✅ Stock disponible para todos los productos');
    return true;
  } catch (error: any) {
    console.error('❌ Error verificando disponibilidad de stock:', error);
    throw error;
  }
};

// ===== ÓRDENES =====

// Crear orden
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  try {
    console.log('🔄 Supabase: Creando orden...');

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        items: orderData.items,
        total: orderData.total,
        status: orderData.status,
        checkout_data: orderData.checkoutData,
        expires_at: orderData.expiresAt?.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando orden:', error);
      throw error;
    }

    console.log('✅ Orden creada exitosamente:', data.id);
    return data.id;
  } catch (error: any) {
    console.error('❌ Error creando orden:', error);
    throw error;
  }
};

// Obtener orden por ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    console.log('🔄 Supabase: Obteniendo orden:', orderId);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('❌ Error obteniendo orden:', error);
      throw error;
    }

    console.log('✅ Orden obtenida exitosamente');
    return data;
  } catch (error: any) {
    console.error('❌ Error obteniendo orden:', error);
    throw error;
  }
};

// Actualizar estado de orden
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    console.log('🔄 Supabase: Actualizando estado de orden:', orderId, 'a', status);

    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('❌ Error actualizando estado de orden:', error);
      throw error;
    }

    console.log('✅ Estado de orden actualizado exitosamente');
  } catch (error: any) {
    console.error('❌ Error actualizando estado de orden:', error);
    throw error;
  }
};

// ===== CONFIGURACIÓN =====

// Obtener configuración
export const getOrderWindowConfig = async () => {
  try {
    console.log('🔄 Supabase: Obteniendo configuración de ventana de pedidos...');

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'order_window')
      .single();

    if (error) {
      console.error('❌ Error obteniendo configuración:', error);
      throw error;
    }

    console.log('✅ Configuración obtenida:', data?.value);
    return data?.value || { start: "08:00", end: "18:00", enabled: true };
  } catch (error: any) {
    console.error('❌ Error obteniendo configuración:', error);
    throw error;
  }
};

// ===== FUNCIONES SIMULADAS (para compatibilidad) =====

export const validateOrderWindow = async (): Promise<boolean> => {
  try {
    const config = await getOrderWindowConfig();
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    return config.enabled && currentTime >= config.start && currentTime <= config.end;
  } catch (error) {
    console.error('❌ Error validando ventana de pedidos:', error);
    return false;
  }
};

export const reserveStock = async (
  params: { userId: string; items: any[]; orderData: CheckoutForm }
): Promise<{ orderId: string; reserved: boolean }> => {
  try {
    console.log('🔄 Reservando stock...');

    // Verificar disponibilidad
    const isAvailable = await checkStockAvailability(params.items);
    if (!isAvailable) {
      console.log('❌ Stock no disponible');
      return { orderId: '', reserved: false };
    }

    // Calcular total
    const total = params.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Crear orden con estado reservado
    const orderId = await createOrder({
      userId: params.userId,
      items: params.items,
      total: total,
      status: 'reserved',
      checkoutData: params.orderData,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    });

    console.log('✅ Stock reservado exitosamente:', orderId);
    return {
      orderId,
      reserved: true
    };
  } catch (error: any) {
    console.error('❌ Error reserving stock:', error);
    return {
      orderId: '',
      reserved: false
    };
  }
};

export const getExpiredOrders = async (): Promise<Order[]> => {
  try {
    console.log('🔄 Supabase: Obteniendo órdenes expiradas...');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .lt('expires_at', new Date().toISOString())
      .eq('status', 'reserved');

    if (error) {
      console.error('❌ Error obteniendo órdenes expiradas:', error);
      throw error;
    }

    console.log('✅ Órdenes expiradas obtenidas:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('❌ Error obteniendo órdenes expiradas:', error);
    throw error;
  }
}; 

export const clearLocalSession = async () => {
  try {
    console.log('🔄 Supabase: Limpiando sesión local...');

    // Cerrar sesión
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
    
    console.log('✅ Sesión local limpiada exitosamente');
  } catch (error: any) {
    console.error('❌ Error limpiando sesión local:', error);
    throw error;
  }
}; 