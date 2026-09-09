import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCheck,
  FileCheck2,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { User, Client } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  clientsList: Client[];
  onSwitchRole: (role: 'admin' | 'client', clientId?: string) => void;
  onResetDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  clientsList,
  onSwitchRole,
  onResetDemo,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Órdenes y Calibración', icon: ClipboardList },
    { id: 'profile', label: 'Perfil Técnico', icon: UserCheck },
  ];

  const clientNavItems = [
    { id: 'my-orders', label: 'Mis Órdenes y Certificados', icon: FileCheck2 },
    { id: 'my-profile', label: 'Mi Perfil', icon: Lock },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm shrink-0">
            <div className="w-4 h-4 border-2 border-slate-900"></div>
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-bold text-sm tracking-tight text-white uppercase block leading-tight">
                Sistema Metrología
              </span>
              <span
                className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                  isAdmin ? 'bg-slate-800 text-slate-300' : 'bg-emerald-900 text-emerald-200'
                }`}
              >
                {isAdmin ? 'Admin Interno' : 'Portal Cliente'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0 ml-1"
          title={isCollapsed ? 'Expandir Menú' : 'Colapsar Menú'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Modules */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Módulos
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Role Switcher & User Profile Info */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              <div className="flex items-center space-x-2 truncate">
                {isAdmin ? <Shield className="w-3.5 h-3.5 text-white" /> : <Building2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="truncate text-[11px]">{currentUser.name || currentUser.username}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
            </button>

            {showRoleMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-white text-slate-900 border border-slate-200 rounded-lg shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  Cambiar Vista de Prueba
                </div>
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    onSwitchRole('admin');
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    isAdmin ? 'bg-slate-100 font-bold text-slate-900' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-slate-900" />
                    <span>Ulises Martínez (Admin)</span>
                  </div>
                  {isAdmin && <span className="text-[10px] text-slate-900 font-bold uppercase">ACTIVO</span>}
                </button>

                <div className="px-3 py-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 border-t">
                  Probar como Cliente
                </div>
                {clientsList.map((c) => {
                  const isSelected = !isAdmin && currentUser.clientId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setShowRoleMenu(false);
                        onSwitchRole('client', c.id);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between truncate ${
                        isSelected ? 'bg-emerald-50 font-bold text-emerald-900' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0 pr-2">
                        <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="truncate">{c.razonSocial}</span>
                      </div>
                      {isSelected && <span className="text-[10px] text-emerald-700 font-bold shrink-0 uppercase">ACTIVO</span>}
                    </button>
                  );
                })}

                <div className="border-t border-slate-100 mt-2 pt-1 px-2">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onResetDemo();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-amber-700 hover:bg-amber-50 flex items-center space-x-1.5 text-[11px] font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Datos Demo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          className={`w-full flex items-center space-x-2 px-3 py-2 rounded bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white transition text-xs font-bold uppercase tracking-wider ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
