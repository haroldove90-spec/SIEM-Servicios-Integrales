import React, { useState } from 'react';
import { UserCheck, Shield, Key, CheckCircle2, User as UserIcon, Mail, Phone, Users, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { User } from '../../types';
import { INITIAL_ADMIN_USERS } from '../../data/initialData';
import { PasswordInput } from '../Common/PasswordInput';
import { generateSecurePassword, getPasswordStrength } from '../../utils/credentialsHelper';

interface AdminProfileProps {
  currentUser: User;
  onUpdateProfile: (updatedUser: User) => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({
  currentUser,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '81-1982-3344');
  const [position, setPosition] = useState(currentUser.position || 'Líder de Metrología');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name,
      email,
      phone,
      position,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!newPassword || newPassword.length < 6) {
      setPassError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('La confirmación de contraseña no coincide.');
      return;
    }

    setPassSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Perfil del Técnico & Configuración de Seguridad
          </h2>
          <p className="text-xs text-slate-500">
            Actualización de datos personales, clave de acceso e información del equipo interno.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form 1: Profile info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              <span>Datos de Contacto Técnico</span>
            </h3>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
              Perfil Activo
            </span>
          </div>

          {profileSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Perfil actualizado con éxito!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Puesto o Especialidad
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow transition"
            >
              Guardar Datos de Contacto
            </button>
          </form>
        </div>

        {/* Form 2: Password change */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Key className="w-4 h-4 text-teal-600" />
              <span>Cambio de Contraseña</span>
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Seguridad
            </span>
          </div>

          {passError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Contraseña modificada correctamente!</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña Actual
              </label>
              <PasswordInput
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    const secure = generateSecurePassword(12);
                    setNewPassword(secure);
                    setConfirmPassword(secure);
                  }}
                  className="text-[11px] text-[#237781] hover:text-[#1b5e66] font-semibold flex items-center space-x-1 cursor-pointer"
                  title="Generar contraseña segura con letras, números y símbolos"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Generar Contraseña Segura</span>
                </button>
              </div>
              <PasswordInput
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
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
                className="w-full py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#237781] hover:bg-[#1b5e66] text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>

      {/* Team Directory (Equipo de 5 personas para Ulises) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#022B47]" />
            <h3 className="font-bold text-slate-900 text-base">
              Equipo de Trabajo Interno de Metrología (5 Integrantes)
            </h3>
          </div>
          <span className="text-xs font-bold bg-sky-50 text-[#022B47] px-2.5 py-1 rounded-full">
            Técnicos Autorizados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_ADMIN_USERS.map((member) => (
            <div
              key={member.id}
              className={`p-4 rounded-xl border transition flex items-center space-x-3 ${
                member.name === currentUser.name
                  ? 'bg-sky-50/70 border-sky-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#022B47] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-xs truncate">
                  {member.name} {member.name === currentUser.name && '(Tú)'}
                </p>
                <p className="text-indigo-600 text-[11px] font-semibold truncate">
                  {member.position}
                </p>
                <p className="text-slate-500 text-[10px] truncate mt-0.5">
                  {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
