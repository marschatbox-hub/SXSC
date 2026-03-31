import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '@/pages/Home';

type Product = typeof PRODUCTS[0];

interface UserActivityContextType {
  favorites: Product[];
  history: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export function UserActivityProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [history, setHistory] = useState<Product[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('web3_favorites');
    const savedHistory = localStorage.getItem('web3_history');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('web3_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('web3_history', JSON.stringify(history));
  }, [history]);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const isFavorite = useCallback((productId: number) => {
    return favorites.some(p => p.id === productId);
  }, [favorites]);

  const addToHistory = useCallback((product: Product) => {
    setHistory(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 50); // Keep last 50
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <UserActivityContext.Provider value={{ favorites, history, toggleFavorite, isFavorite, addToHistory, clearHistory }}>
      {children}
    </UserActivityContext.Provider>
  );
}

export function useUserActivity() {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error('useUserActivity must be used within a UserActivityProvider');
  }
  return context;
}
