import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

interface CartBadgeProps {
  size?: number;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ size = 20 }) => {
  const { state } = useCart();
  
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  if (itemCount === 0) {
    return null;
  }

  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Text style={[styles.badgeText, { fontSize: size * 0.6 }]}>
        {itemCount > 99 ? '99+' : itemCount.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    minHeight: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 