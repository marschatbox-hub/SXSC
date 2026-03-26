import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, QrCode, ShoppingCart, User } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Layout() {
  const location = useLocation();
  const mainTabs = ["/", "/scan", "/cart", "/profile"];
  const isMainTab = mainTabs.includes(location.pathname);

  return (
    <div className="min-h-[100dvh] bg-charcoal flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <main className={cn("flex-1 flex flex-col relative z-10", isMainTab ? "pb-[calc(4rem+env(safe-area-inset-bottom))]" : "pb-safe")}>
        <Outlet />
      </main>
      
      {isMainTab && (
        <nav className="fixed bottom-0 w-full max-w-md bg-royal/80 backdrop-blur-xl border-t border-glass-border flex justify-around items-center h-16 px-2 z-50 pb-safe box-content">
          <NavItem to="/" icon={<Home size={24} />} label="首页" />
          <NavItem to="/scan" icon={<QrCode size={24} />} label="扫码" />
          <NavItem to="/cart" icon={<ShoppingCart size={24} />} label="购物车" />
          <NavItem to="/profile" icon={<User size={24} />} label="我的" />
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-16 h-full transition-all duration-300",
          isActive ? "text-cyan drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" : "text-gray-800"
        )
      }
    >
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </NavLink>
  );
}
