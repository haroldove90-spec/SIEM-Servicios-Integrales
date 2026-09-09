import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCheck,
  FileCheck2,
  Lock,
  LogOut
} from 'lucide-react';
import { User } from '../types';

interface MobileBottomBarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const isAdmin = currentUser.role === 'admin';

  const adminNavItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'orders', label: 'Órdenes', icon: ClipboardList },
    { id: 'profile', label: 'Perfil', icon: UserCheck },
  ];

  const clientNavItems = [
    { id: 'my-orders', label: 'Órdenes', icon: FileCheck2 },
    { id: 'my-profile', label: 'Perfil', icon: Lock },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-16 flex items-center justify-around shadow-lg px-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              isActive
                ? 'text-slate-900 border-t-2 border-slate-900 bg-slate-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
            <span className="truncate max-w-[64px]">{item.label}</span>
          </button>
        );
      })}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-800 hover:bg-red-50 transition"
        title="Cerrar Sesión"
      >
        <LogOut className="w-4 h-4 mb-0.5 text-red-600" />
        <span>Salir</span>
      </button>
    </div>
  );
};
