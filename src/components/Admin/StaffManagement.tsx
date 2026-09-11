import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  Share2,
  Sparkles,
  Phone,
  Mail,
  Shield,
  Award,
  Edit2,
  X,
  Lock,
  ExternalLink,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types';
import { PasswordInput } from '../Common/PasswordInput';
import {
  generateSecurePassword,
  getPasswordStrength,
  shareCredentialsViaWhatsApp,
  getSystemUrl
} from '../../utils/credentialsHelper';

interface StaffManagementProps {
  staffList: User[];
  onAddStaff: (newStaff: User) => void;
  onUpdateStaff: (updatedStaff: User) => void;
  currentUser: User;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staffList,
  onAddStaff,
  onUpdateStaff,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Metrólogo Técnico');
  const [specialty, setSpecialty] = useState('Humedad y Temperatura');
  const [cedula, setCedula] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Visibilidad de contraseñas por fila
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPhone('');
    setPosition('Metrólogo Técnico');
    setSpecialty('Humedad y Temperatura');
    setCedula('');
    setRole('admin');
    const autoUser = 'metrologo.' + Math.floor(100 + Math.random() * 900);
    setUsername(autoUser);
    setPassword(generateSecurePassword(12));
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (staff: User) => {
    setEditingStaff(staff);
    setName(staff.name);
    setEmail(staff.email);
    setPhone(staff.phone || '');
    setPosition(staff.position || 'Metrólogo');
    setSpecialty(staff.specialty || 'General');
    setCedula(staff.cedula || '');
    setRole(staff.role);
    setUsername(staff.username);
    setPassword(staff.password || '');
    setFormError(null);
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingStaff && !username) {
      // Auto-generar sugerencia de usuario
      const clean = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '.');
      if (clean) setUsername(clean);
    }
  };

  const handleSubmit = (e: React.FormEvent, andShareWhatsApp: boolean = false) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('El nombre completo es requerido.');
      return;
    }
    if (!username.trim()) {
      setFormError('El usuario de acceso es requerido.');
      return;
    }
    if (!password.trim()) {
      setFormError('La contraseña es requerida.');
      return;
    }

    // Verificar si el username ya existe en otro usuario
    const exists = staffList.some(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.id !== editingStaff?.id
    );
    if (exists) {
      setFormError(`El nombre de usuario "${username}" ya está registrado.`);
      return;
    }

    if (editingStaff) {
      const updated: User = {
        ...editingStaff,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: position.trim(),
        specialty: specialty.trim(),
        cedula: cedula.trim(),
        role,
        username: username.trim().toLowerCase(),
        password: password.trim(),
      };
      onUpdateStaff(updated);
      setSuccessToast(`Datos de ${updated.name} actualizados exitosamente.`);

      if (andShareWhatsApp) {
        shareCredentialsViaWhatsApp({
          recipientName: updated.name,
          username: updated.username,
          password: updated.password || '',
          phone: updated.phone,
          roleOrPosition: updated.position,
          companyName: 'SIEM Metrología (Personal Autorizado)',
          notes: 'Credenciales del sistema actualizadas.',
        });
      }
    } else {
      const newStaff: User = {
        id: 'staff-' + Date.now(),
        name: name.trim(),
        email: email.trim() || `${username.trim()}@siemmx.com`,
        phone: phone.trim(),
        position: position.trim(),
        specialty: specialty.trim(),
        cedula: cedula.trim(),
        role,
        username: username.trim().toLowerCase(),
        password: password.trim(),
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddStaff(newStaff);
      setSuccessToast(`Personal ${newStaff.name} registrado con éxito.`);

      if (andShareWhatsApp) {
        shareCredentialsViaWhatsApp({
          recipientName: newStaff.name,
          username: newStaff.username,
          password: newStaff.password || '',
          phone: newStaff.phone,
          roleOrPosition: newStaff.position,
          companyName: 'SIEM Metrología (Personal Autorizado)',
          notes: 'Bienvenido(a) al equipo técnico de SIEM.',
        });
      }
    }

    setShowModal(false);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCopyStaffCreds = (staff: User) => {
    const text = `CREDENCIALES PERSONAL SIEM\nNombre: ${staff.name}\nPuesto: ${staff.position || 'Técnico'}\nUsuario: ${staff.username}\nContraseña: ${staff.password || '••••••••'}\nSistema: ${getSystemUrl()}`;
    navigator.clipboard.writeText(text);
    setCopiedId(staff.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtro
  const filteredStaff = staffList.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.username.toLowerCase().includes(term) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.position && s.position.toLowerCase().includes(term)) ||
      (s.specialty && s.specialty.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#0A6EA2] text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Módulo de Control y Acreditación</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Registro de Personal y Metrólogos
          </h2>
          <p className="text-xs text-slate-500">
            Administración del equipo de laboratorio, asignación de credenciales seguras y envío directo por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#0A6EA2] hover:bg-[#085a85] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Registrar Personal</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Personal</span>
            <div className="p-2 rounded-lg bg-sky-50 text-[#0A6EA2]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{staffList.length}</p>
          <span className="text-[11px] text-slate-400">Integrantes activos en plataforma</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Metrólogos Técnicos</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {staffList.filter((s) => s.position?.toLowerCase().includes('metrólogo') || s.position?.toLowerCase().includes('técnico')).length || staffList.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Acreditados ISO/IEC 17025</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Administradores</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">
            {staffList.filter((s) => s.role === 'admin').length}
          </p>
          <span className="text-[11px] text-slate-400">Control total del laboratorio</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Seguridad de Acceso</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">100%</p>
          <span className="text-[11px] text-amber-700 font-medium">Contraseñas seguras y WhatsApp</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario, especialidad o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium shrink-0">
          Mostrando {filteredStaff.length} de {staffList.length} integrantes
        </span>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const isPassVisible = !!visiblePasswords[staff.id];
          const hasCopied = copiedId === staff.id;
          const strength = getPasswordStrength(staff.password || '');

          return (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#0A6EA2] to-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {staff.name
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {staff.name}
                      </h3>
                      <p className="text-xs text-[#0A6EA2] font-semibold mt-0.5">
                        {staff.position || 'Personal Técnico'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      staff.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {staff.role === 'admin' ? 'Admin' : 'Técnico'}
                  </span>
                </div>

                {/* Info List */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  {staff.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{staff.phone}</span>
                    </div>
                  )}
                  {staff.specialty && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-slate-700 font-medium">{staff.specialty}</span>
                    </div>
                  )}
                </div>

                {/* Credenciales Box with Eye Icon */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Usuario:</span>
                    <code className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {staff.username}
                    </code>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Contraseña:</span>
                    <div className="flex items-center space-x-1.5">
                      <code className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {isPassVisible ? staff.password || 'Sin clave' : '••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(staff.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                        title={isPassVisible ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {isPassVisible ? (
                          <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {staff.password && (
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Seguridad:</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${strength.colorClass}`}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    shareCredentialsViaWhatsApp({
                      recipientName: staff.name,
                      username: staff.username,
                      password: staff.password || '',
                      phone: staff.phone,
                      roleOrPosition: staff.position,
                      companyName: 'SIEM Metrología',
                      notes: 'Acceso autorizado al sistema técnico.',
                    })
                  }
                  className="px-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                  title="Compartir credenciales por WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyStaffCreds(staff)}
                  className="px-2 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                  title="Copiar credenciales al portapapeles"
                >
                  {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopied ? '¡Listo!' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(staff)}
                  className="px-2 py-2 rounded-lg bg-white hover:bg-slate-100 text-[#0A6EA2] border border-slate-200 text-xs font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                  title="Editar datos o cambiar clave"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 text-sm font-medium">
            No se encontró personal registrado con los criterios de búsqueda.
          </p>
        </div>
      )}

      {/* MODAL: Registrar / Editar Personal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0A6EA2] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">
                  {editingStaff ? 'Editar Personal y Credenciales' : 'Registrar Nuevo Integrante'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={(e) => handleSubmit(e, false)}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {formError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Ing. Carlos Daniel García"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="cgarcia@siemmx.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    placeholder="81-2345-6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Puesto / Cargo
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Metrólogo Dimensional"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Especialidad / Magnitud
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Presión y Temperatura"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cédula / Acreditación Técnica
                  </label>
                  <input
                    type="text"
                    placeholder="ej. CED-894125 / ISO-17025"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rol en Sistema
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'client')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
                  >
                    <option value="admin">Administrador / Personal Interno</option>
                    <option value="client">Técnico Operativo</option>
                  </select>
                </div>
              </div>

              {/* Credenciales y Generador Seguro */}
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-950 flex items-center space-x-1.5">
                    <Key className="w-4 h-4 text-[#0A6EA2]" />
                    <span>Credenciales de Acceso al Sistema</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const sec = generateSecurePassword(12);
                      setPassword(sec);
                    }}
                    className="text-[11px] text-[#0A6EA2] hover:text-[#085a85] font-bold flex items-center space-x-1 cursor-pointer bg-white px-2 py-1 rounded-md border border-sky-200 shadow-2xs"
                    title="Generar contraseña de alta seguridad con números, letras y símbolos"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Generar Contraseña Segura</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Usuario de Ingreso *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="usuario.acceso"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Contraseña (Ver con el ojito) *
                    </label>
                    <PasswordInput
                      required
                      placeholder="Contraseña segura"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] font-mono text-slate-800"
                    />
                  </div>
                </div>

                {password && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Nivel de Fortaleza:</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${getPasswordStrength(password).colorClass}`}>
                      {getPasswordStrength(password).label}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    title="Guardar y abrir WhatsApp con las credenciales"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Guardar y Enviar WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-[#0A6EA2] hover:bg-[#085a85] text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
                  >
                    Guardar Personal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
