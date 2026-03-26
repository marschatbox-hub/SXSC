import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HashrateOrder {
  id: string;
  type: 'linear' | '100percent';
  tier: number;
  count: number;
  status: 'active' | 'completed';
  currentDay: number;
  totalDays: number;
  totalHashrate: number;
  releasedHashrate: number;
}

interface Order {
  id: string;
  status: string;
  shop: string;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    scny: number;
    qty: number;
  };
  total: number;
  paidScny: number;
  paidPoints: number;
}

interface AssetContextType {
  scnyBalance: number;
  pointsBalance: number;
  sxtBalance: number;
  xscnyBalance: number;
  sPower: number;
  veMint: number;
  hashrateOrders: HashrateOrder[];
  isMerchant: boolean;
  orders: Order[];
  setIsMerchant: (status: boolean) => void;
  updateBalance: (asset: 'scny' | 'points' | 'sxt' | 'xscny' | 'sPower' | 'veMint', amount: number) => void;
  addHashrateOrder: (order: Omit<HashrateOrder, 'id'>) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [scnyBalance, setScnyBalance] = useState(12500);
  const [pointsBalance, setPointsBalance] = useState(3200);
  const [sxtBalance, setSxtBalance] = useState(150);
  const [xscnyBalance, setXscnyBalance] = useState(16);
  const [sPower, setSPower] = useState(3000);
  const [veMint, setVeMint] = useState(32);
  const [isMerchant, setIsMerchant] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD20260320001",
      status: "待发货",
      shop: "随喜自营旗舰店",
      product: {
        id: 1,
        name: "Apple iPhone 16 Pro Max 256GB 原色钛金属",
        image: "https://picsum.photos/seed/iphone/200/200",
        price: 9999,
        scny: 4999,
        qty: 1
      },
      total: 9999,
      paidScny: 5000,
      paidPoints: 4999
    },
    {
      id: "ORD20260318042",
      status: "已完成",
      shop: "戴森官方旗舰店",
      product: {
        id: 2,
        name: "Dyson 戴森 HD15 新一代吹风机",
        image: "https://picsum.photos/seed/dyson/200/200",
        price: 3299,
        scny: 1649,
        qty: 1
      },
      total: 3299,
      paidScny: 1650,
      paidPoints: 1649
    }
  ]);
  const [hashrateOrders, setHashrateOrders] = useState<HashrateOrder[]>([
    {
      id: '1',
      type: '100percent',
      tier: 2000,
      count: 1,
      status: 'active',
      currentDay: 20,
      totalDays: 100,
      totalHashrate: 3000,
      releasedHashrate: 600
    }
  ]);

  const updateBalance = (asset: 'scny' | 'points' | 'sxt' | 'xscny' | 'sPower' | 'veMint', amount: number) => {
    switch (asset) {
      case 'scny': setScnyBalance(prev => prev + amount); break;
      case 'points': setPointsBalance(prev => prev + amount); break;
      case 'sxt': setSxtBalance(prev => prev + amount); break;
      case 'xscny': setXscnyBalance(prev => prev + amount); break;
      case 'sPower': setSPower(prev => prev + amount); break;
      case 'veMint': setVeMint(prev => prev + amount); break;
    }
  };

  const addHashrateOrder = (order: Omit<HashrateOrder, 'id'>) => {
    const newOrder = { ...order, id: Date.now().toString() };
    setHashrateOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: `ORD${Date.now()}` };
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <AssetContext.Provider value={{
      scnyBalance, pointsBalance, sxtBalance, xscnyBalance, sPower, veMint, hashrateOrders, isMerchant, orders,
      setIsMerchant, updateBalance, addHashrateOrder, updateOrderStatus, addOrder
    }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAsset() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAsset must be used within an AssetProvider');
  }
  return context;
}
