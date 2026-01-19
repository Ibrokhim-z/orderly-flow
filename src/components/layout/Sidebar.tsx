import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Wallet,
  Warehouse,
  QrCode,
  Settings,
  LogOut,
  Factory,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Warehouse, label: 'Warehouse', href: '/warehouse' },
  { icon: Users, label: 'Employees', href: '/employees' },
  { icon: Wallet, label: 'Expenses', href: '/expenses' },
  { icon: QrCode, label: 'Work Station', href: '/workstation' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-sidebar fixed left-0 top-0 flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Factory className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">WorkShop</h1>
            <p className="text-xs text-sidebar-foreground/60">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'nav-link',
                isActive && 'nav-link-active'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link to="/settings" className="nav-link">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <button className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
