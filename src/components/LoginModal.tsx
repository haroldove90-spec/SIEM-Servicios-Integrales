import React, { useState } from 'react';
import { Shield, Building2, Lock, User as UserIcon, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, Client } from '../types';
import { PasswordInput } from './Common/PasswordInput';

interface LoginModalProps {
  onLoginSuccess: (user: User) => void;
  clients: Client[];
  adminUsers: User[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  clients,
  adminUsers,
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Por favor ingrese su usuario/correo y contraseña.');
      return;
    }

    if (activeTab === 'admin') {
      const cleanUser = username.trim().toLowerCase();
      const admin = adminUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          u.email.toLowerCase() === cleanUser ||
          ((cleanUser === 'haroldo90@hotmail.com' || cleanUser === 'haroldove90@gmail.com') && u.username === 'haroldo90')
      );
      if (admin) {
        onLoginSuccess(admin);
      } else {
        // Fallback for demo: allow any credentials with admin role
        const demoAdmin: User = {
          id: 'user-admin-' + Date.now(),
          name: username.split('@')[0] || 'Técnico Metrólogo',
          email: username.includes('@') ? username : `${username}@metrologia.com.mx`,
          username: username,
          role: 'admin',
          position: 'Técnico Interno'
        };
        onLoginSuccess(demoAdmin);
      }
    } else {
      // Client portal authentication
      const clientMatch = clients.find(
        (c) =>
          c.username.toLowerCase() === username.trim().toLowerCase() ||
          c.email.toLowerCase() === username.trim().toLowerCase()
      );

      if (clientMatch) {
        const clientUser: User = {
          id: 'user-client-' + clientMatch.id,
          name: clientMatch.contactName,
          email: clientMatch.email,
          username: clientMatch.username,
          role: 'client',
          clientId: clientMatch.id,
          position: 'Contacto Principal'
        };
        onLoginSuccess(clientUser);
      } else {
        setError('Credenciales de cliente no encontradas. Verifique su usuario o pida credenciales a Ulises/Técnico.');
      }
    }
  };

  const quickLoginAdmin = (admin: User) => {
    onLoginSuccess(admin);
  };

  const quickLoginClient = (client: Client) => {
    const clientUser: User = {
      id: 'user-client-' + client.id,
      name: client.contactName,
      email: client.email,
      username: client.username,
      role: 'client',
      clientId: client.id,
      position: 'Contacto Principal'
    };
    onLoginSuccess(clientUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#022B47] px-6 py-6 text-white text-center relative">
          <div className="flex justify-center mb-2">
            <img
              src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siemlogo.png"
              alt="SIEM"
              className="max-h-24 w-auto object-contain drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs text-sky-100/80 mt-1">
            Acceso Seguro al Sistema
          </p>

          {/* Role selector tabs */}
          <div className="mt-5 grid grid-cols-2 gap-1 p-1 bg-[#012137] rounded-xl border border-white/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-[#022B47] font-bold shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#237781]" />
              <span>Personal Interno</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('client');
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-white text-[#022B47] font-bold shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#237781]" />
              <span>Portal Cliente</span>
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {activeTab === 'admin' ? 'Usuario o Correo' : 'Usuario o Correo Asignado'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    activeTab === 'admin' ? 'ucontreras o correo' : 'usuario asignado'
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237781] focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <PasswordInput
                showLockIcon={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237781] focus:bg-white text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-[#237781] hover:bg-[#1b5e66] shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {activeTab === 'admin' ? 'Iniciar Sesión' : 'Acceder al Portal'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
