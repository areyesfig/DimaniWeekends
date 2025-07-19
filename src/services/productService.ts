import { Product } from '../types';

// Datos mock de productos
export const products: Product[] = [
  {
    id: '1',
    name: 'Empanada de Pino',
    description: 'Deliciosa empanada rellena con carne de res, cebolla, huevo duro y aceitunas',
    price: 1200,
    stock: 50,
    category: 'empanadas',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Empanada Napolitana',
    description: 'Empanada con queso mozzarella, tomate y albahaca',
    price: 1300,
    stock: 30,
    category: 'empanadas',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Empanada de Queso y Jamón',
    description: 'Empanada rellena con queso gouda y jamón ahumado',
    price: 1400,
    stock: 25,
    category: 'empanadas',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Cachito de Jamón',
    description: 'Cachito de jamón ahumado con mantequilla',
    price: 800,
    stock: 40,
    category: 'cachitos',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Cachito de Queso',
    description: 'Cachito de queso gouda con mantequilla',
    price: 900,
    stock: 35,
    category: 'cachitos',
    isAvailable: true,
  },
];

export const getProducts = (): Product[] => {
  return products;
};

export const getProductsByCategory = (category: 'empanadas' | 'cachitos'): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const updateProductStock = (productId: string, quantity: number): void => {
  const product = products.find(p => p.id === productId);
  if (product && product.stock >= quantity) {
    product.stock -= quantity;
    if (product.stock === 0) {
      product.isAvailable = false;
    }
  }
}; 