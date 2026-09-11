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
  ChevronDown,
  Database,
  BookOpen,
  X
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
  onOpenSupabaseModal?: () => void;
  onOpenUserManual?: () => void;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
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
  onOpenSupabaseModal,
  onOpenUserManual,
  isDrawer = false,
  onCloseDrawer,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Órdenes y Calibración', icon: ClipboardList },
    { id: 'staff', label: 'Registro de Personal', icon: Users },
    { id: 'clients', label: 'Directorio de Clientes', icon: Building2 },
    { id: 'profile', label: 'Perfil Técnico', icon: UserCheck },
  ];

  const clientNavItems = [
    { id: 'my-orders', label: 'Mis Órdenes y Certificados', icon: FileCheck2 },
    { id: 'my-profile', label: 'Mi Perfil', icon: Lock },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (isDrawer && onCloseDrawer) {
      onCloseDrawer();
    }
  };

  return (
    <aside
      className={
        isDrawer
          ? 'flex flex-col bg-[#022B47] text-white w-72 max-w-[85vw] h-full shadow-2xl z-50'
          : `hidden xl:flex flex-col bg-[#022B47] text-white border-r border-[#03395d] transition-all duration-300 z-30 shrink-0 h-screen sticky top-0 ${
              isCollapsed ? 'w-20' : 'w-64'
            }`
      }
    >
      {/* Sidebar Header */}
      <div className="min-h-[5.5rem] py-3 flex items-center justify-between px-3 border-b border-[#03395d]">
        {!isCollapsed || isDrawer ? (
          <div className="flex items-center justify-center min-w-0 flex-1 pr-1">
            {/* Logo Vertical en tamaño original sin encapsular para fullscreen y drawer */}
            <img
              src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siemlogo.png"
              alt="Logo SIEM"
              className="max-h-24 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-1">
            {/* Icono SIEM oficial cuando la barra está colapsada en desktop */}
            <img
              src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siemicono.png"
              alt="Icono SIEM"
              className="w-9 h-9 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Action Button: X para cerrar en drawer, o botón de colapsar en desktop */}
        {isDrawer ? (
          <button
            onClick={onCloseDrawer}
            className="p-1.5 rounded bg-[#237781] hover:bg-[#1b5e66] text-white transition shrink-0 ml-1 cursor-pointer"
            title="Cerrar Menú"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded bg-[#03395d] hover:bg-[#237781] text-white/90 hover:text-white transition shrink-0 ml-1 cursor-pointer"
            title={isCollapsed ? 'Expandir Menú' : 'Colapsar Menú'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Modules */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {(!isCollapsed || isDrawer) && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">
            Módulos
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              title={isCollapsed && !isDrawer ? item.label : undefined}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                isActive
                  ? 'bg-[#237781] text-white font-extrabold shadow-sm'
                  : 'text-white/85 hover:bg-[#03395d] hover:text-white'
              } ${isCollapsed && !isDrawer ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/90'}`} />
              {(!isCollapsed || isDrawer) && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* User Manual Button */}
        {onOpenUserManual && (
          <div className="pt-3 border-t border-[#03395d] mt-3">
            {(!isCollapsed || isDrawer) && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1.5">
                Ayuda y Guías
              </p>
            )}
            <button
              onClick={() => {
                onOpenUserManual();
                if (isDrawer && onCloseDrawer) onCloseDrawer();
              }}
              title={isCollapsed && !isDrawer ? 'Manual de Usuario (PDF)' : undefined}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer text-white hover:bg-[#1b5e66] bg-[#237781] border border-[#237781]/60 shadow-xs ${
                isCollapsed && !isDrawer ? 'justify-center px-0' : ''
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-amber-300" />
              {(!isCollapsed || isDrawer) && <span className="truncate">Manual de Usuario</span>}
            </button>
          </div>
        )}
      </div>

      {/* Role Switcher & User Profile Info */}
      <div className="p-3 border-t border-[#03395d] space-y-2">
        {!isCollapsed || isDrawer ? (
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between p-2 rounded bg-[#03395d] hover:bg-[#237781] text-white text-xs font-semibold transition cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                {isAdmin ? <Shield className="w-3.5 h-3.5 text-white" /> : <Building2 className="w-3.5 h-3.5 text-emerald-300" />}
                <span className="truncate text-[11px]">{currentUser.name || currentUser.username}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-white/80 shrink-0 ml-1" />
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
                    if (isDrawer && onCloseDrawer) onCloseDrawer();
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    isAdmin ? 'bg-sky-50 font-bold text-[#022B47]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#237781]" />
                    <span>Ulises Contreras (Admin)</span>
                  </div>
                  {isAdmin && <span className="text-[10px] text-[#237781] font-bold uppercase">ACTIVO</span>}
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
                        if (isDrawer && onCloseDrawer) onCloseDrawer();
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
                      if (isDrawer && onCloseDrawer) onCloseDrawer();
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

        {/* Supabase Cloud Connection & SQL Button */}
        {onOpenSupabaseModal && (
          <button
            onClick={() => {
              onOpenSupabaseModal();
              if (isDrawer && onCloseDrawer) onCloseDrawer();
            }}
            title="Supabase Cloud & SQL"
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-800/50 transition text-xs font-semibold uppercase tracking-wider ${
              isCollapsed && !isDrawer ? 'justify-center px-0' : ''
            }`}
          >
            <Database className="w-4 h-4 shrink-0 text-emerald-400" />
            {(!isCollapsed || isDrawer) && <span>Supabase Cloud</span>}
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          className={`w-full flex items-center space-x-2 px-3 py-2 rounded bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white transition text-xs font-bold uppercase tracking-wider ${
            isCollapsed && !isDrawer ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isDrawer) && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
