import React, { useState } from 'react';
import { Lock, User as UserIcon, AlertCircle, Eye, EyeOff, LogIn, CheckCircle2 } from 'lucide-react';
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

  // Active credentials mapping for priority users
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
        email: 'haroldo90@hotmail.com',
        username: 'haroldo90',
        password: 'Chevropar#1970',
        role: 'admin',
        position: 'Administrador Metrología SIEM',
        phone: '81-1823-9901',
      },
    },
    'haroldo90@hotmail.com': {
      pass: 'Chevropar#1970',
      user: {
        id: 'user-admin-harold',
        name: 'Harold Anguiano Morales',
        email: 'haroldo90@hotmail.com',
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
        email: 'haroldo90@hotmail.com',
        username: 'haroldo90',
        password: 'Chevropar#1970',
        role: 'admin',
        position: 'Administrador Metrología SIEM',
        phone: '81-1823-9901',
      },
    },
    'haroldove90@gmail.com': {
      pass: 'Chevropar#1970',
      user: {
        id: 'user-admin-harold',
        name: 'Harold Anguiano Morales',
        email: 'haroldo90@hotmail.com',
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

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased selection:bg-[#0A6EA2] selection:text-white">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        
        {/* LOGO DE SIEM - Arriba del formulario de acceso, sin encapsular, tamaño original (Vertical en fullscreen y tablet, Horizontal en móvil) */}
        <div className="text-center flex flex-col items-center justify-center">
          {/* Versión Fullscreen y Tablet: Logo Vertical sin encapsular en proporción original */}
          <img
            src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siemlogo.png"
            alt="Logo SIEM"
            className="hidden sm:block w-auto max-h-52 object-contain"
            referrerPolicy="no-referrer"
          />
          {/* Versión Móvil: Logo Horizontal */}
          <img
            src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siemlogohorizontal.png"
            alt="Logo SIEM"
            className="block sm:hidden w-auto max-h-14 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* FORMULARIO DE ACCESO AL SISTEMA */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden">
          <div className="bg-[#0A6EA2] px-6 py-4 text-white">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center space-x-2">
              <LogIn className="w-4 h-4 text-white shrink-0" />
              <span>Acceso al Sistema</span>
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
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
                    placeholder="Usuario o correo electrónico"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] focus:border-[#0A6EA2] focus:bg-white text-slate-900 font-medium transition"
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
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] focus:border-[#0A6EA2] focus:bg-white text-slate-900 font-medium transition"
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

              {/* Botón de envío con tono azul #0A6EA2 */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0A6EA2] hover:bg-[#085a85] active:bg-[#06476b] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
              </button>
            </form>
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
