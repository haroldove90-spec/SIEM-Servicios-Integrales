import React, { useState } from 'react';
import { Shield, Building2, KeyRound, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { User, Client } from '../types';

interface HomeRoleSelectorProps {
  onLoginSuccess: (user: User) => void;
  clients: Client[];
  adminUsers: User[];
}

export const HomeRoleSelector: React.FC<HomeRoleSelectorProps> = ({
  onLoginSuccess,
  clients,
  adminUsers,
}) => {
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [manualTab, setManualTab] = useState<'admin' | 'client'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Ingrese su usuario o correo.');
      return;
    }

    if (manualTab === 'admin') {
      const match = adminUsers.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          u.email.toLowerCase() === username.trim().toLowerCase()
      );
      if (match) {
        onLoginSuccess(match);
      } else {
        const demoAdmin: User = {
          id: 'user-admin-' + Date.now(),
          name: username.split('@')[0] || 'Técnico Metrólogo',
          email: username.includes('@') ? username : `${username}@metrologia.com.mx`,
          username: username,
          role: 'admin',
          position: 'Técnico Interno',
        };
        onLoginSuccess(demoAdmin);
      }
    } else {
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
          position: 'Contacto Principal',
        };
        onLoginSuccess(clientUser);
      } else {
        setError('Usuario de cliente no encontrado.');
      }
    }
  };

  const loginAdmin = () => {
    const admin = adminUsers[0] || {
      id: 'user-admin-1',
      name: 'Ulises Martínez',
      email: 'ulises.martinez@metrologia.com.mx',
      username: 'ulises.admin',
      role: 'admin',
      position: 'Líder de Metrología / Admin',
    };
    onLoginSuccess(admin);
  };

  const loginClient = () => {
    const client = clients[0];
    if (client) {
      const clientUser: User = {
        id: 'user-client-' + client.id,
        name: client.contactName,
        email: client.email,
        username: client.username,
        role: 'client',
        clientId: client.id,
        position: 'Contacto Principal',
      };
      onLoginSuccess(clientUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl space-y-10 animate-in fade-in duration-300">
        
        {/* Minimal System Header: Only Logo & System Name */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-sm shadow-md">
            <div className="w-8 h-8 border-2 border-white"></div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
            Sistema Metrología
          </h1>
        </div>

        {/* Minimal Separated Role Access Buttons */}
        {!showManualLogin ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* ROLE 1: ADMINISTRADOR */}
              <button
                onClick={loginAdmin}
                className="bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 rounded-lg p-8 shadow-sm hover:shadow-md transition duration-200 flex flex-col items-center justify-center text-center group space-y-4"
              >
                <div className="p-4 bg-slate-100 group-hover:bg-slate-800 rounded-md transition">
                  <Shield className="w-8 h-8 text-slate-900 group-hover:text-white transition" />
                </div>
                <span className="text-base font-extrabold text-slate-900 group-hover:text-white uppercase tracking-wider">
                  Administrador
                </span>
              </button>

              {/* ROLE 2: CLIENTE */}
              <button
                onClick={loginClient}
                className="bg-white hover:bg-emerald-900 border border-slate-200 hover:border-emerald-900 rounded-lg p-8 shadow-sm hover:shadow-md transition duration-200 flex flex-col items-center justify-center text-center group space-y-4"
              >
                <div className="p-4 bg-emerald-50 group-hover:bg-emerald-800 rounded-md transition">
                  <Building2 className="w-8 h-8 text-emerald-800 group-hover:text-white transition" />
                </div>
                <span className="text-base font-extrabold text-slate-900 group-hover:text-white uppercase tracking-wider">
                  Cliente
                </span>
              </button>

            </div>

            {/* Password Login Option */}
            <div className="text-center pt-2">
              <button
                onClick={() => setShowManualLogin(true)}
                className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Ingreso con Contraseña</span>
              </button>
            </div>
          </div>
        ) : (
          /* Manual Username / Password View */
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase">
                Acceso {manualTab === 'admin' ? 'Administrador' : 'Cliente'}
              </h3>
              <button
                onClick={() => setShowManualLogin(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold uppercase"
              >
                Volver
              </button>
            </div>

            <div className="flex rounded border border-slate-200 p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => setManualTab('admin')}
                className={`flex-1 py-1.5 text-xs font-bold uppercase rounded ${
                  manualTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Administrador
              </button>
              <button
                type="button"
                onClick={() => setManualTab('client')}
                className={`flex-1 py-1.5 text-xs font-bold uppercase rounded ${
                  manualTab === 'client' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                Cliente
              </button>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Usuario / Correo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={manualTab === 'admin' ? 'ulises.admin' : 'empresa'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded transition"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
