import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../pages/Home';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selected: boolean;
  specs: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, specs: string) => void;
  removeFromCart: (id: number) => void;
  removeItems: (ids: number[]) => void;
  updateQuantity: (id: number, delta: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number, specs: string) => {
    setCartItems(items => {
      const existingItem = items.find(item => item.product.id === product.id && item.specs === specs);
      if (existingItem) {
        return items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { id: Date.now(), product, quantity, selected: true, specs }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const removeItems = (ids: number[]) => {
    setCartItems(items => items.filter(item => !ids.includes(item.id)));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const toggleSelect = (id: number) => {
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, selected: !item.selected } : item)
    );
  };

  const toggleSelectAll = () => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    setCartItems(items => items.map(item => ({ ...item, selected: !allSelected })));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, removeItems, updateQuantity, toggleSelect, toggleSelectAll, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
