import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider, useWallet } from "./contexts/WalletContext";
import { AssetProvider } from "./contexts/AssetContext";
import { CartProvider } from "./contexts/CartContext";
import { UserActivityProvider } from "./contexts/UserActivityContext";
import { UserProvider } from "./contexts/UserContext";
import ConnectWallet from "./pages/ConnectWallet";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ScanToPay from "./pages/ScanToPay";
import Checkout from "./pages/Checkout";
import Wealth from "./pages/Wealth";
import AddressList from "./pages/AddressList";
import OrderList from "./pages/OrderList";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantProductEdit from "./pages/MerchantProductEdit";
import AssetHistory from "./pages/AssetHistory";
import MerchantApply from "./pages/MerchantApply";
import Vouchers from "./pages/Vouchers";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Support from "./pages/Support";
import Logistics from "./pages/Logistics";
import CategoryDetail from "./pages/CategoryDetail";
import FlashSale from "./pages/FlashSale";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Search from "./pages/Search";

function AppRoutes() {
  const { isAuthenticated } = useWallet();

  if (!isAuthenticated) {
    return <ConnectWallet />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="profile" element={<Profile />} />
        <Route path="scan" element={<ScanToPay />} />
        <Route path="wealth" element={<Wealth />} />
        <Route path="vouchers" element={<Vouchers />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="history" element={<History />} />
        <Route path="support" element={<Support />} />
        <Route path="addresses" element={<AddressList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="logistics" element={<Logistics />} />
        <Route path="merchant" element={<MerchantDashboard />} />
        <Route path="merchant/apply" element={<MerchantApply />} />
        <Route path="merchant/product/add" element={<MerchantProductEdit />} />
        <Route path="asset/:type/history" element={<AssetHistory />} />
        <Route path="category/:id" element={<CategoryDetail />} />
        <Route path="flash-sale" element={<FlashSale />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AssetProvider>
        <CartProvider>
          <UserActivityProvider>
            <UserProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </UserProvider>
          </UserActivityProvider>
        </CartProvider>
      </AssetProvider>
    </WalletProvider>
  );
}
