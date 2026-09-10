import React, { useState } from 'react';
import { Shield, Building2, Lock, User as UserIcon, AlertCircle, Eye, EyeOff, LogIn, CheckCircle2 } from 'lucide-react';
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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active hardcoded credentials mapping for priority users
  const SPECIAL_CREDENTIALS: Record<string, { pass: string; user: User }> = {
    ucontreras: {
      pass: 'Cuch#960303',
      user: {
        id: 'user-admin-ulises',
        name: 'Ulises Contreras',
        email: 'ucontreras@siemmx.com',
        username: 'ucontreras',
        password: 'Cuch#960303',
        role: 'admin',
        position: 'Líder de Metrología / Admin SIEM',
        phone: '81-1982-3344',
      },
    },
    'ucontreras@siemmx.com': {
      pass: 'Cuch#960303',
      user: {
        id: 'user-admin-ulises',
        name: 'Ulises Contreras',
        email: 'ucontreras@siemmx.com',
        username: 'ucontreras',
        password: 'Cuch#960303',
        role: 'admin',
        position: 'Líder de Metrología / Admin SIEM',
        phone: '81-1982-3344',
      },
    },
    haroldo90: {
      pass: 'Chevropar#1970',
      user: {
        id: 'user-admin-harold',
        name: 'Harold Anguiano Morales',
        email: 'haroldo90@hotmtmail.com',
        username: 'haroldo90',
        password: 'Chevropar#1970',
        role: 'admin',
        position: 'Administrador Metrología SIEM',
        phone: '81-1823-9901',
      },
    },
    'haroldo90@hotmtmail.com': {
      pass: 'Chevropar#1970',
      user: {
        id: 'user-admin-harold',
        name: 'Harold Anguiano Morales',
        email: 'haroldo90@hotmtmail.com',
        username: 'haroldo90',
        password: 'Chevropar#1970',
        role: 'admin',
        position: 'Administrador Metrología SIEM',
        phone: '81-1823-9901',
      },
    },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setError('Por favor ingrese su usuario o correo electrónico.');
      return;
    }

    if (!cleanPassword) {
      setError('Por favor ingrese su contraseña.');
      return;
    }

    // 1. Check priority special credentials (Ulises & Harold)
    if (SPECIAL_CREDENTIALS[cleanIdentifier]) {
      const entry = SPECIAL_CREDENTIALS[cleanIdentifier];
      if (cleanPassword === entry.pass) {
        setSuccessMessage(`Bienvenido al sistema SIEM, ${entry.user.name}`);
        setTimeout(() => {
          onLoginSuccess(entry.user);
        }, 200);
        return;
      } else {
        setError('Contraseña incorrecta para el usuario.');
        return;
      }
    }

    // 2. Check admin users from props/storage
    const matchedAdmin = adminUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanIdentifier ||
        u.email.toLowerCase() === cleanIdentifier
    );

    if (matchedAdmin) {
      // If user has a defined password, check it; otherwise fallback
      if (matchedAdmin.password && matchedAdmin.password !== cleanPassword) {
        setError('Contraseña incorrecta.');
        return;
      }
      setSuccessMessage(`Bienvenido al sistema SIEM, ${matchedAdmin.name}`);
      setTimeout(() => {
        onLoginSuccess(matchedAdmin);
      }, 200);
      return;
    }

    // 3. Check client users
    const matchedClient = clients.find(
      (c) =>
        c.username.toLowerCase() === cleanIdentifier ||
        c.email.toLowerCase() === cleanIdentifier
    );

    if (matchedClient) {
      if (matchedClient.passwordHash && matchedClient.passwordHash !== cleanPassword) {
        setError('Contraseña incorrecta.');
        return;
      }

      const clientUser: User = {
        id: 'user-client-' + matchedClient.id,
        name: matchedClient.contactName,
        email: matchedClient.email,
        username: matchedClient.username,
        role: 'client',
        clientId: matchedClient.id,
        position: 'Contacto Principal',
      };

      setSuccessMessage(`Bienvenido, ${matchedClient.razonSocial}`);
      setTimeout(() => {
        onLoginSuccess(clientUser);
      }, 200);
      return;
    }

    // 4. If neither matched
    setError('Usuario o correo no registrado en el sistema SIEM.');
  };

  const fillCredentials = (userOrEmail: string, pass: string) => {
    setIdentifier(userOrEmail);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased selection:bg-slate-900 selection:text-white">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        
        {/* LOGO DE SIEM - Ubicado arriba del formulario de acceso */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-200/90 transition-transform duration-200 hover:scale-[1.02]">
            <img
              src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siem.png"
              alt="Logo SIEM Metrología"
              className="h-16 w-auto object-contain max-w-[260px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              SIEM
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Sistema de Metrología & Calibración
            </p>
          </div>
        </div>

        {/* FORMULARIO DE ACCESO AL SISTEMA */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 text-white">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-100 flex items-center space-x-2">
              <LogIn className="w-4 h-4 text-white shrink-0" />
              <span>Acceso al Sistema</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Ingrese con su usuario o correo electrónico y contraseña
            </p>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Usuario o Correo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Usuario o Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ucontreras, haroldo90 o correo"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-medium transition"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-medium transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
              </button>
            </form>

            {/* Credenciales activas autorizadas */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Credenciales Activas Autorizadas
              </p>

              <div className="grid grid-cols-1 gap-2">
                {/* Ulises Contreras */}
                <button
                  type="button"
                  onClick={() => fillCredentials('ucontreras', 'Cuch#960303')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-800 shrink-0" />
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Ulises Contreras
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      ucontreras • ucontreras@siemmx.com
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-900 text-white px-2 py-1 rounded shrink-0 group-hover:bg-slate-800 transition">
                    Cargar
                  </span>
                </button>

                {/* Harold Anguiano Morales */}
                <button
                  type="button"
                  onClick={() => fillCredentials('haroldo90', 'Chevropar#1970')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-800 shrink-0" />
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Harold Anguiano Morales
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      haroldo90 • haroldo90@hotmtmail.com
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-900 text-white px-2 py-1 rounded shrink-0 group-hover:bg-slate-800 transition">
                    Cargar
                  </span>
                </button>

                {/* Cliente Ejemplo (Portal Cliente) */}
                {clients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => fillCredentials(clients[0].username, clients[0].passwordHash)}
                    className="w-full p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <p className="text-xs font-bold text-emerald-950 truncate">
                          {clients[0].razonSocial} (Portal Cliente)
                        </p>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-mono truncate">
                        {clients[0].username} • {clients[0].email}
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-700 text-white px-2 py-1 rounded shrink-0 group-hover:bg-emerald-800 transition">
                      Cargar
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer info ISO/IEC 17025 */}
        <div className="text-center text-[11px] text-slate-400 font-medium">
          <p>© 2026 SIEM • Laboratorio de Calibración Acreditado ISO/IEC 17025</p>
        </div>

      </div>
    </div>
  );
};
