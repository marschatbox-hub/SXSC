import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  connect: () => Promise<void>;
  signMessage: (message: string) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const connect = async () => {
    // Simulate wallet connection (e.g., MetaMask window.ethereum.request)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAddress('0x1234567890abcdef1234567890abcdef12345678');
    setIsConnected(true);
  };

  const signMessage = async (message: string) => {
    // Simulate personal_sign
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Signed message:", message);
    setIsAuthenticated(true);
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setIsAuthenticated(false);
  };

  return (
    <WalletContext.Provider value={{ address, isConnected, isAuthenticated, connect, signMessage, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
