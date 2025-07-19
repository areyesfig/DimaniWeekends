import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { addItem, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addItem(product);
      Alert.alert('Éxito', `${product.name} agregado al carrito`);
    } else {
      Alert.alert('Sin stock', 'Este producto no está disponible');
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.stockContainer}>
            <Text style={[styles.stock, product.stock === 0 && styles.outOfStock]}>
              Stock: {product.stock}
            </Text>
            {quantityInCart > 0 && (
              <Text style={styles.cartQuantity}>
                En carrito: {quantityInCart}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.addButton,
              product.stock === 0 && styles.disabledButton
            ]}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Text style={styles.addButtonText}>
              {product.stock === 0 ? 'Sin stock' : 'Agregar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockContainer: {
    flex: 1,
  },
  stock: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  outOfStock: {
    color: '#F44336',
  },
  cartQuantity: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 