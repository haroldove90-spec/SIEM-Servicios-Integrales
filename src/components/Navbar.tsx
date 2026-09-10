import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCheck,
  FileCheck2,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Building2,
  Lock,
  RotateCcw
} from 'lucide-react';
import { User, Client } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onSwitchRole: (targetRole: 'admin' | 'client', targetClientId?: string) => void;
  clientsList: Client[];
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onSwitchRole,
  clientsList,
  onResetDemo,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo & title */}
          <div className="flex items-center space-x-3">
            <div className="h-9 flex items-center shrink-0">
              <img
                src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siem.png"
                alt="SIEM Logo"
                className="h-8 w-auto object-contain max-w-[120px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 uppercase hidden sm:inline">
                  SIEM
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                    isAdmin
                      ? 'bg-[#0A6EA2] text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Cliente'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isAdmin
                  ? 'Gestión de Laboratorio & Certificados ISO/IEC 17025'
                  : currentUser.name || 'Acceso Corporativo de Cliente'}
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#0A6EA2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('clients')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition cursor-pointer ${
                    activeTab === 'clients'
                      ? 'bg-[#0A6EA2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Clientes (CRM)</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#0A6EA2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Órdenes de Servicio</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#0A6EA2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Perfil Técnico</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('my-orders')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition cursor-pointer ${
                    activeTab === 'my-orders'
                      ? 'bg-[#0A6EA2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Mis Órdenes y Certificados</span>
                </button>

                <button
                  onClick={() => setActiveTab('my-profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition cursor-pointer ${
                    activeTab === 'my-profile'
                      ? 'bg-[#0A6EA2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Mi Cuenta y Seguridad</span>
                </button>
              </>
            )}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-semibold transition"
                title="Cambiar vista de prueba rápida"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-900" />
                <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Cambiar Rol</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 text-xs text-slate-800">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Probar como Administrador
                  </div>
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onSwitchRole('admin');
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      isAdmin ? 'bg-slate-100 text-slate-900 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-slate-900" />
                      <span>Ulises Martínez (Admin)</span>
                    </div>
                    {isAdmin && <span className="text-[10px] text-slate-900 font-bold uppercase">ACTIVO</span>}
                  </button>

                  <div className="px-3 py-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 border-t">
                    Probar como Cliente Final
                  </div>
                  {clientsList.map((client) => {
                    const isSelected = !isAdmin && currentUser.clientId === client.id;
                    return (
                      <button
                        key={client.id}
                        onClick={() => {
                          setShowRoleMenu(false);
                          onSwitchRole('client', client.id);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between truncate ${
                          isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0 pr-2">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{client.razonSocial}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] text-emerald-700 font-bold shrink-0 uppercase">ACTIVO</span>
                        )}
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-100 mt-2 pt-1 px-2">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onResetDemo();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded text-amber-700 hover:bg-amber-50 flex items-center space-x-1.5 text-[11px] font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer Datos Demo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 space-x-1 no-scrollbar">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === 'dashboard' ? 'bg-[#0A6EA2] text-white' : 'text-slate-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === 'clients' ? 'bg-[#0A6EA2] text-white' : 'text-slate-600'
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === 'orders' ? 'bg-[#0A6EA2] text-white' : 'text-slate-600'
                }`}
              >
                Órdenes
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === 'profile' ? 'bg-[#0A6EA2] text-white' : 'text-slate-600'
                }`}
              >
                Perfil
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('my-orders')}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === 'my-orders' ? 'bg-[#0A6EA2] text-white' : 'text-slate-600'
                }`}
              >
                Mis Órdenes
              </button>
              <button
                onClick={() => setActiveTab('my-profile')}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === 'my-profile' ? 'bg-[#0A6EA2] text-white' : 'text-slate-600'
                }`}
              >
                Mi Cuenta
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
