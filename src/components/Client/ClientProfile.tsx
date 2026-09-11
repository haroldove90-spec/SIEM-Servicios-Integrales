import React, { useState } from 'react';
import { Lock, Building2, Key, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Client } from '../../types';
import { PasswordInput } from '../Common/PasswordInput';
import { generateSecurePassword, getPasswordStrength } from '../../utils/credentialsHelper';

interface ClientProfileProps {
  client: Client;
  onUpdateClientPassword: (clientId: string, newPassword: string) => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({
  client,
  onUpdateClientPassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('La confirmación de la nueva contraseña no coincide.');
      return;
    }

    onUpdateClientPassword(client.id, newPassword);
    setSuccessMsg(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Perfil Corporativo & Seguridad de la Cuenta
          </h2>
          <p className="text-xs text-slate-500">
            Consulta de información registrada de su empresa y actualización de contraseña del portal.
          </p>
        </div>
      </div>

      {/* Company Information Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Información Registrada de la Empresa</span>
          </h3>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Portal Activo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Razón Social
            </p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{client.razonSocial}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              RFC Registrado
            </p>
            <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{client.rfc}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Contacto Principal
            </p>
            <p className="font-semibold text-slate-800 mt-0.5">{client.contactName}</p>
            <p className="text-slate-500">{client.email} • {client.phone}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Usuario de Portal
            </p>
            <p className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-1 rounded inline-block mt-0.5 border border-indigo-100">
              {client.username}
            </p>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Actualización de Contraseña de Acceso</span>
          </h3>
          <span className="text-[10px] font-semibold text-slate-500">
            Seguridad Corporativa
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>¡Su contraseña ha sido modificada con éxito!</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña Actual
            </label>
            <PasswordInput
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Nueva Contraseña
              </label>
              <button
                type="button"
                onClick={() => {
                  const sec = generateSecurePassword(12);
                  setNewPassword(sec);
                  setConfirmPassword(sec);
                }}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center space-x-1 cursor-pointer"
                title="Generar contraseña segura"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Generar Contraseña Segura</span>
              </button>
            </div>
            <PasswordInput
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            {newPassword && (
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-slate-500">Fortaleza:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${getPasswordStrength(newPassword).colorClass}`}>
                  {getPasswordStrength(newPassword).label}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <PasswordInput
              placeholder="Repita la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer"
          >
            Guardar Nueva Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};
