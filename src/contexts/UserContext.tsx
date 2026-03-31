import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  nickname: string;
  bio: string;
  avatarUrl: string;
  email: string | null;
  hasPaymentPassword: boolean;
  smallAmountPasswordFree: boolean;
  currencyDisplay: 'CNY' | 'USD';
  language: string;
  defaultPaymentCurrency: string;
  gasPreference: string;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  nickname: "Web3 Explorer",
  bio: "Exploring the decentralized world.",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  email: null,
  hasPaymentPassword: false,
  smallAmountPasswordFree: false,
  currencyDisplay: 'CNY',
  language: 'zh-CN',
  defaultPaymentCurrency: 'SCNY',
  gasPreference: 'standard',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const savedProfile = localStorage.getItem('web3_user_profile');
    if (savedProfile) {
      try {
        setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      localStorage.setItem('web3_user_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
