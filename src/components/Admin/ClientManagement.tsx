import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Key,
  Eye,
  Edit2,
  Check,
  Copy,
  Mail,
  Phone,
  FileText,
  UserCheck,
  X,
  Lock,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Client, ServiceOrder, OrderDocument } from '../../types';

interface ClientManagementProps {
  clients: Client[];
  orders: ServiceOrder[];
  documents: OrderDocument[];
  onAddClient: (newClient: Omit<Client, 'id' | 'createdAt'>) => void;
  onUpdateClient: (updatedClient: Client) => void;
  onOpenOrderDocsModal: (orderId: string) => void;
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({
  clients,
  orders,
  documents,
  onAddClient,
  onUpdateClient,
  onOpenOrderDocsModal,
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(isAddModalOpenInitially);
  const [selectedClientForCredentials, setSelectedClientForCredentials] = useState<Client | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form state for New Client
  const [formData, setFormData] = useState({
    razonSocial: '',
    rfc: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    passwordHash: '',
    notes: '',
  });

  // Credential Generator state
  const [genUsername, setGenUsername] = useState('');
  const [genPassword, setGenPassword] = useState('');

  // Sync initial open modal if passed from props
  React.useEffect(() => {
    if (isAddModalOpenInitially) {
      setShowAddModal(true);
    }
  }, [isAddModalOpenInitially]);

  const handleOpenAddModal = () => {
    setFormData({
      razonSocial: '',
      rfc: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      username: '',
      passwordHash: '',
      notes: '',
    });
    setShowAddModal(true);
  };

  const handleSaveNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.razonSocial || !formData.rfc || !formData.email) {
      alert('Por favor complete la Razón Social, RFC y Correo del contacto.');
      return;
    }

    // Auto generate username/password if empty
    const autoUser = formData.username.trim()
      ? formData.username.trim().toLowerCase()
      : formData.razonSocial.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const autoPass = formData.passwordHash.trim()
      ? formData.passwordHash.trim()
      : 'metrologia' + Math.floor(1000 + Math.random() * 9000);

    onAddClient({
      razonSocial: formData.razonSocial,
      rfc: formData.rfc.toUpperCase(),
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      username: autoUser,
      passwordHash: autoPass,
      active: true,
      notes: formData.notes,
    });

    setShowAddModal(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Open credential manager for a client
  const handleOpenCredentials = (client: Client) => {
    setSelectedClientForCredentials(client);
    setGenUsername(client.username);
    setGenPassword(client.passwordHash);
  };

  const handleSaveCredentials = () => {
    if (!selectedClientForCredentials) return;
    const updated = {
      ...selectedClientForCredentials,
      username: genUsername.trim().toLowerCase(),
      passwordHash: genPassword.trim(),
    };
    onUpdateClient(updated);
    setSelectedClientForCredentials(null);
  };

  const handleCopyCredentials = () => {
    if (!selectedClientForCredentials) return;
    const text = `PORTAL DE CLIENTE - SISTEMA METROLOGÍA\nEmpresa: ${selectedClientForCredentials.razonSocial}\nUsuario de Acceso: ${genUsername}\nContraseña: ${genPassword}\nAcceso: Portal Web Metrología`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? c.active
        : !c.active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Gestión CRM de Clientes</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Directorio de Empresas
          </h2>
          <p className="text-xs text-slate-500">
            Registro de empresas, asignación de credenciales para portal web e historial de órdenes.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#0A6EA2] hover:bg-[#085a85] text-white font-semibold text-xs shadow-md shadow-blue-100 transition flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Alta de Nuevo Cliente</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por Razón Social, RFC, Contacto o Correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] text-slate-700 font-medium"
          >
            <option value="all">Todos los Estatus</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Client List Grid/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientOrders = orders.filter((o) => o.clientId === client.id);
          return (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      RFC: {client.rfc}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1" title={client.razonSocial}>
                      {client.razonSocial}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                      client.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {client.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">
                      {client.contactName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </div>

              {/* Card Credentials & Stats Summary */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    Usuario Portal:{' '}
                    <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800 font-bold">
                      {client.username}
                    </code>
                  </span>
                </div>
                <div className="text-slate-500 font-medium">
                  {clientOrders.length} Órden{clientOrders.length !== 1 ? 'es' : ''}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-white grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedClientDetail(client)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ficha Cliente</span>
                </button>

                <button
                  onClick={() => handleOpenCredentials(client)}
                  className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition flex items-center justify-center space-x-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Credenciales</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 text-sm font-medium">
            No se encontraron clientes que coincidan con la búsqueda.
          </p>
        </div>
      )}

      {/* Modal 1: Alta de Cliente */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="px-6 py-4 bg-[#0A6EA2] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">Alta de Nuevo Cliente CRM</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClient} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Razón Social de la Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Industrial de Calibraciones S.A. de C.V."
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    RFC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. ICA880315KH4"
                    value={formData.rfc}
                    onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Ing. Fernando López"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="ej. 81-8123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dirección Física
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, Número, Colonia, Ciudad, Estado"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Optional Credential presets */}
              <div className="border-t border-slate-200 pt-3 bg-indigo-50/50 p-3 rounded-xl border space-y-2">
                <span className="text-xs font-bold text-indigo-900 block flex items-center space-x-1">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Credenciales para Portal de Cliente (Opcional)</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Si los deja en blanco, se generarán automáticamente.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Usuario acceso"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Contraseña"
                    value={formData.passwordHash}
                    onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Generador / Administrador de Credenciales */}
      {selectedClientForCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-[#0A6EA2] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">Generador de Credenciales</h3>
              </div>
              <button
                onClick={() => setSelectedClientForCredentials(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">{selectedClientForCredentials.razonSocial}</p>
                <p className="text-slate-500">RFC: {selectedClientForCredentials.rfc}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Usuario de Acceso
                  </label>
                  <input
                    type="text"
                    value={genUsername}
                    onChange={(e) => setGenUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contraseña de Acceso
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={genPassword}
                      onChange={(e) => setGenPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setGenPassword('pass' + Math.floor(100000 + Math.random() * 900000))}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                    >
                      Regenerar
                    </button>
                  </div>
                </div>
              </div>

              {copiedNotification && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Credenciales copiadas al portapapeles!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Info</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClientForCredentials(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCredentials}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Ficha del Cliente (Histórico de Órdenes) */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-[#0A6EA2] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">Ficha Detallada del Cliente</h3>
              </div>
              <button
                onClick={() => setSelectedClientDetail(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Header Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Razón Social
                  </p>
                  <p className="font-bold text-slate-900 text-sm">{selectedClientDetail.razonSocial}</p>
                  <p className="text-slate-600 font-mono mt-0.5">RFC: {selectedClientDetail.rfc}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Contacto Principal
                  </p>
                  <p className="font-bold text-slate-800">{selectedClientDetail.contactName}</p>
                  <p className="text-slate-600">{selectedClientDetail.email} • {selectedClientDetail.phone}</p>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800 flex items-center justify-between">
                  <span>Historial de Órdenes de Servicio Asignadas</span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">
                    {orders.filter((o) => o.clientId === selectedClientDetail.id).length} Órdenes
                  </span>
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {orders
                    .filter((o) => o.clientId === selectedClientDetail.id)
                    .map((order) => {
                      const orderDocs = documents.filter((d) => d.orderId === order.id);
                      return (
                        <div
                          key={order.id}
                          className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                                {order.folio}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                                  order.status === 'En Proceso'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-slate-700 font-medium">{order.equipmentNotes}</p>
                            <p className="text-slate-500 text-[11px]">
                              Fecha de Calibración: {order.calibrationDate} • Técnico: {order.technicianName}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => {
                                setSelectedClientDetail(null);
                                onOpenOrderDocsModal(order.id);
                              }}
                              className="px-3 py-1.5 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition flex items-center space-x-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Documentos ({orderDocs.length})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {orders.filter((o) => o.clientId === selectedClientDetail.id).length === 0 && (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      Este cliente aún no tiene órdenes de servicio registradas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
