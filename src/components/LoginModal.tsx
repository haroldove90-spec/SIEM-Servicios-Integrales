import React, { useState } from 'react';
import { Shield, Building2, Lock, User as UserIcon, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, Client } from '../types';

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
      const admin = adminUsers.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          u.email.toLowerCase() === username.trim().toLowerCase()
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
        <div className="bg-slate-900 px-6 py-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 p-0.5 shadow-xl shadow-indigo-950/60 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-teal-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Sistema Metrología
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Plataforma de Órdenes de Servicio y Certificados de Calibración
          </p>

          {/* Role selector tabs */}
          <div className="mt-5 grid grid-cols-2 gap-1 p-1 bg-slate-800 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Personal Interno</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('client');
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'client'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
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
                {activeTab === 'admin' ? 'Usuario o Correo Técnico' : 'Usuario o Correo de Empresa'}
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
                    activeTab === 'admin' ? 'ej. ulises.admin' : 'ej. autonorte'
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition flex items-center justify-center space-x-2 ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {activeTab === 'admin' ? 'Iniciar Sesión Técnica' : 'Acceder al Portal Cliente'}
              </span>
            </button>
          </form>

          {/* Quick Access Demo Buttons */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Acceso Rápido de Prueba (Demo 1-Clic)
            </p>

            {activeTab === 'admin' ? (
              <div className="space-y-1.5">
                {adminUsers.slice(0, 2).map((admin) => (
                  <button
                    key={admin.id}
                    type="button"
                    onClick={() => quickLoginAdmin(admin)}
                    className="w-full p-2 text-left bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-lg transition text-xs flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-semibold text-indigo-950 group-hover:text-indigo-900">
                        {admin.name}
                      </p>
                      <p className="text-[11px] text-indigo-700">{admin.position}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                      Ingresar
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {clients.slice(0, 3).map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => quickLoginClient(client)}
                    className="w-full p-2 text-left bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition text-xs flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-emerald-950 group-hover:text-emerald-900 truncate">
                        {client.razonSocial}
                      </p>
                      <p className="text-[11px] text-emerald-700 truncate">
                        Usuario: <code className="font-mono">{client.username}</code>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shrink-0">
                      Entrar
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
