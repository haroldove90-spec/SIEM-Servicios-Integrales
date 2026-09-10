import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Filter,
  Calendar,
  UserCheck,
  Edit,
  Trash2,
  FileText,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronRight,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { ServiceOrder, Client, OrderDocument, OrderStatus, EquipmentItem, CalibrationCertificateData } from '../../types';
import { SiemServiceOrderModal } from '../SiemOfficial/SiemServiceOrderModal';
import { SiemCertificateModal } from '../SiemOfficial/SiemCertificateModal';
import { CalibrationEditorModal } from '../SiemOfficial/CalibrationEditorModal';

interface OrderManagementProps {
  orders: ServiceOrder[];
  clients: Client[];
  documents: OrderDocument[];
  onCreateOrder: (newOrder: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateOrder: (updatedOrder: ServiceOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenDocumentManager: (orderId: string) => void;
  isCreateModalOpenInitially?: boolean;
  onCloseCreateModal?: () => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  clients,
  documents,
  onCreateOrder,
  onUpdateOrder,
  onDeleteOrder,
  onOpenDocumentManager,
  isCreateModalOpenInitially = false,
  onCloseCreateModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(isCreateModalOpenInitially);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Official SIEM Modals
  const [viewingSiemOrder, setViewingSiemOrder] = useState<ServiceOrder | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<{
    order: ServiceOrder;
    equipment: EquipmentItem;
  } | null>(null);
  const [editingCalibration, setEditingCalibration] = useState<{
    order: ServiceOrder;
    equipment: EquipmentItem;
  } | null>(null);

  // Expanded row state for equipment inspection
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Sync initial prop open
  React.useEffect(() => {
    if (isCreateModalOpenInitially) {
      setShowCreateModal(true);
    }
  }, [isCreateModalOpenInitially]);

  // Form state
  const [formClientId, setFormClientId] = useState('');
  const [formFolio, setFormFolio] = useState('');
  const [formElaboro, setFormElaboro] = useState('Ing. Cristian Ulises Contreras H.');
  const [formFechaRecepcion, setFormFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
  const [formFechaEntrega, setFormFechaEntrega] = useState('');
  const [formStatus, setFormStatus] = useState<OrderStatus>('En Proceso');
  const [formEquipmentNotes, setFormEquipmentNotes] = useState('');
  const [formTechnicianName, setFormTechnicianName] = useState('Ing. Cristian Ulises Contreras H.');
  const [formCertRazonSocial, setFormCertRazonSocial] = useState('');
  const [formCertDireccion, setFormCertDireccion] = useState('');

  // Equipment list in form
  const [formEquipments, setFormEquipments] = useState<EquipmentItem[]>([
    {
      id: 'eq-1',
      no: 1,
      instrumento: 'Termohigrómetro Digital',
      marca: 'Vaisala',
      modelo: 'HMP76 / MI70',
      serie: 'P2720442',
      idInterno: 'SIEM-AH-004',
      vigencia: '2027-07',
      servicio: 'Calibración',
      magnitud: 'Humedad',
      resolucion: '0.01 %HR',
      observaciones: 'Condición física óptima.'
    }
  ]);

  const handleOpenCreateModal = () => {
    const nextNum = orders.length + 1;
    const padNum = nextNum < 10 ? `00${nextNum}` : nextNum < 100 ? `0${nextNum}` : `${nextNum}`;
    const autoFolio = `SIEM-OS-2026-${padNum}`;

    setFormFolio(autoFolio);
    const defaultClient = clients[0];
    setFormClientId(defaultClient?.id || '');
    setFormCertRazonSocial(defaultClient?.razonSocial || '');
    setFormCertDireccion(defaultClient?.address || '');
    setFormElaboro('Ing. Cristian Ulises Contreras H.');
    setFormFechaRecepcion(new Date().toISOString().split('T')[0]);
    setFormFechaEntrega('');
    setFormStatus('En Proceso');
    setFormEquipmentNotes('');
    setFormTechnicianName('Ing. Cristian Ulises Contreras H.');
    setFormEquipments([
      {
        id: 'eq-' + Date.now(),
        no: 1,
        instrumento: 'Termohigrómetro Digital',
        marca: 'Vaisala',
        modelo: 'HMP76 / MI70',
        serie: 'P2720442',
        idInterno: 'SIEM-AH-004',
        vigencia: '2027-07',
        servicio: 'Calibración',
        magnitud: 'Humedad',
        resolucion: '0.01 %HR',
        observaciones: 'Condición física óptima.'
      }
    ]);
    setShowCreateModal(true);
  };

  const handleAddEquipmentRow = () => {
    const nextNo = formEquipments.length + 1;
    const newEq: EquipmentItem = {
      id: 'eq-' + Date.now() + '-' + nextNo,
      no: nextNo,
      instrumento: 'Manómetro de Presión',
      marca: 'WIKA',
      modelo: '232.50',
      serie: 'SN-' + Math.floor(100000 + Math.random() * 900000),
      idInterno: 'IBC-' + nextNo,
      vigencia: '1 año',
      servicio: 'Calibración',
      magnitud: 'Presión',
      resolucion: '0.1 bar',
      observaciones: 'Sin daños visibles.'
    };
    setFormEquipments([...formEquipments, newEq]);
  };

  const handleRemoveEquipmentRow = (index: number) => {
    if (formEquipments.length <= 1) return;
    const updated = formEquipments.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      no: idx + 1
    }));
    setFormEquipments(updated);
  };

  const handleEquipmentChange = (index: number, field: keyof EquipmentItem, value: any) => {
    const updated = [...formEquipments];
    updated[index] = { ...updated[index], [field]: value };
    setFormEquipments(updated);
  };

  const handleStartEdit = (order: ServiceOrder) => {
    setEditingOrder(order);
    setFormFolio(order.folio);
    setFormClientId(order.clientId);
    setFormElaboro(order.elaboro || order.technicianName || 'Ing. Cristian Ulises Contreras H.');
    setFormFechaRecepcion(order.fechaRecepcion || order.calibrationDate);
    setFormFechaEntrega(order.fechaEntrega || '');
    setFormCertRazonSocial(order.certRazonSocial || order.clientName);
    setFormCertDireccion(order.certDireccion || order.clientAddress || '');
    setFormStatus(order.status);
    setFormEquipmentNotes(order.observacionesGenerales || order.equipmentNotes);
    setFormTechnicianName(order.technicianName);
    setFormEquipments(order.equipments && order.equipments.length > 0 ? order.equipments : [
      {
        id: 'eq-default',
        no: 1,
        instrumento: 'Instrumento Principal',
        marca: 'Generica',
        modelo: 'Mod-1',
        serie: 'SN-001',
        idInterno: 'ID-01',
        vigencia: '1 año',
        servicio: 'Calibración',
        magnitud: 'General',
        observaciones: order.equipmentNotes
      }
    ]);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const clientMatch = clients.find((c) => c.id === formClientId);
    if (!clientMatch) {
      alert('Por favor seleccione un cliente válido.');
      return;
    }

    if (!formFolio.trim()) {
      alert('Por favor ingrese el folio de la orden.');
      return;
    }

    if (editingOrder) {
      const updated: ServiceOrder = {
        ...editingOrder,
        folio: formFolio.trim().toUpperCase(),
        clientId: clientMatch.id,
        clientName: clientMatch.razonSocial,
        clientRfc: clientMatch.rfc,
        clientPhone: clientMatch.phone,
        clientContact: clientMatch.contactName,
        clientEmail: clientMatch.email,
        clientAddress: clientMatch.address,
        elaboro: formElaboro,
        fechaRecepcion: formFechaRecepcion,
        fechaEntrega: formFechaEntrega,
        certRazonSocial: formCertRazonSocial || clientMatch.razonSocial,
        certDireccion: formCertDireccion || clientMatch.address,
        calibrationDate: formFechaRecepcion,
        status: formStatus,
        equipmentNotes: formEquipmentNotes,
        observacionesGenerales: formEquipmentNotes,
        technicianName: formTechnicianName,
        equipments: formEquipments,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateOrder(updated);
      setEditingOrder(null);
    } else {
      onCreateOrder({
        folio: formFolio.trim().toUpperCase(),
        clientId: clientMatch.id,
        clientName: clientMatch.razonSocial,
        clientRfc: clientMatch.rfc,
        clientPhone: clientMatch.phone,
        clientContact: clientMatch.contactName,
        clientEmail: clientMatch.email,
        clientAddress: clientMatch.address,
        elaboro: formElaboro,
        fechaRecepcion: formFechaRecepcion,
        fechaEntrega: formFechaEntrega,
        certRazonSocial: formCertRazonSocial || clientMatch.razonSocial,
        certDireccion: formCertDireccion || clientMatch.address,
        calibrationDate: formFechaRecepcion,
        status: formStatus,
        equipmentNotes: formEquipmentNotes,
        observacionesGenerales: formEquipmentNotes,
        technicianName: formTechnicianName,
        equipments: formEquipments,
      });
      setShowCreateModal(false);
      if (onCloseCreateModal) onCloseCreateModal();
    }
  };

  const handleSaveCalibrationCertificate = (
    orderToUpdate: ServiceOrder,
    updatedEquipment: EquipmentItem,
    certData: CalibrationCertificateData
  ) => {
    const existingEquipments = orderToUpdate.equipments || [];
    const newEquipments = existingEquipments.map((eq) =>
      eq.id === updatedEquipment.id ? { ...updatedEquipment, certificate: certData } : eq
    );

    const updatedOrder: ServiceOrder = {
      ...orderToUpdate,
      equipments: newEquipments,
      status: 'Completada',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onUpdateOrder(updatedOrder);

    // If currently viewing certificate, update viewing state too
    if (viewingCertificate && viewingCertificate.order.id === orderToUpdate.id) {
      setViewingCertificate({
        order: updatedOrder,
        equipment: { ...updatedEquipment, certificate: certData }
      });
    }
  };

  // Export all orders to CSV
  const handleExportAllOrdersCsv = () => {
    const headers = [
      'Folio',
      'Cliente',
      'RFC',
      'Telefono',
      'Correo',
      'F. Recepcion',
      'F. Entrega',
      'Estatus',
      'Tecnico',
      'Total Equipos',
      'Equipos (Resumen)'
    ];

    const rows = filteredOrders.map((o) => {
      const eqSummary = (o.equipments || []).map(eq => `${eq.instrumento} (${eq.marca} Serie:${eq.serie})`).join('; ');
      return [
        `"${o.folio}"`,
        `"${o.clientName}"`,
        `"${o.clientRfc}"`,
        `"${o.clientPhone || ''}"`,
        `"${o.clientEmail || ''}"`,
        `"${o.fechaRecepcion || o.calibrationDate}"`,
        `"${o.fechaEntrega || ''}"`,
        `"${o.status}"`,
        `"${o.technicianName}"`,
        (o.equipments || []).length,
        `"${eqSummary}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reporte_Ordenes_SIEM_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.equipmentNotes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.equipments || []).some(
        (eq) =>
          eq.instrumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.idInterno.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
    const matchesClient = clientFilter === 'all' ? true : o.clientId === clientFilter;

    let matchesDate = true;
    if (dateFrom && (o.fechaRecepcion || o.calibrationDate) < dateFrom) matchesDate = false;
    if (dateTo && (o.fechaRecepcion || o.calibrationDate) > dateTo) matchesDate = false;

    return matchesSearch && matchesStatus && matchesClient && matchesDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <ClipboardList className="w-4 h-4" />
            <span>Metrología & Laboratorio SIEM</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Órdenes de Servicio y Certificados de Calibración
          </h2>
          <p className="text-xs text-slate-500">
            Captura de equipos, cálculo automático de error metrológico y emisión en PDF oficial F-7.2.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllOrdersCsv}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center space-x-1.5 shrink-0"
            title="Exportar base de órdenes a CSV/Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#0A6EA2] hover:bg-[#085a85] text-white font-semibold text-xs shadow-md shadow-blue-100 transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden SIEM</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por folio, cliente, instrumento o serie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] font-medium text-slate-700"
            >
              <option value="all">Todos los Estatus</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
              <option value="Entregada">Entregada</option>
            </select>
          </div>

          {/* Client Filter */}
          <div className="md:col-span-4">
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2] font-medium text-slate-700"
            >
              <option value="all">Todos los Clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.razonSocial}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#0A6EA2] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Folio Orden</th>
                <th className="px-4 py-3">Cliente / Razón Social</th>
                <th className="px-4 py-3">Recepción</th>
                <th className="px-4 py-3">Estatus</th>
                <th className="px-4 py-3">Equipos / Instrumentos</th>
                <th className="px-4 py-3 text-center">Documentos Oficiales</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map((order) => {
                const equipments = order.equipments || [];
                const isExpanded = expandedOrderId === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title={isExpanded ? 'Ocultar equipos' : 'Ver equipos'}
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                          <span>{order.folio}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="font-bold text-slate-900 truncate" title={order.clientName}>
                          {order.clientName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">RFC: {order.clientRfc}</p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 font-mono text-[11px]">
                        {order.fechaRecepcion || order.calibrationDate}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            order.status === 'En Proceso'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : order.status === 'Completada'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {order.status === 'En Proceso' && <Clock className="w-3 h-3 text-amber-600" />}
                          {order.status === 'Completada' && <CheckCircle className="w-3 h-3 text-blue-600" />}
                          {order.status === 'Entregada' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                          <span>{order.status}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition"
                        >
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>{equipments.length} {equipments.length === 1 ? 'Instrumento' : 'Instrumentos'}</span>
                        </button>
                      </td>

                      {/* Botones de Documentos Oficiales SIEM */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. Orden de Servicio Oficial PDF */}
                          <button
                            onClick={() => setViewingSiemOrder(order)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 text-[11px] flex items-center gap-1 transition"
                            title="Ver e Imprimir Orden de Servicio en PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Orden PDF</span>
                          </button>

                          {/* 2. Certificado F-7.2 si tiene al menos 1 equipo */}
                          {equipments.length > 0 && (
                            <button
                              onClick={() =>
                                setViewingCertificate({
                                  order,
                                  equipment: equipments[0]
                                })
                              }
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-[11px] flex items-center gap-1 transition"
                              title="Ver Certificado de Calibración F-7.2 (2 Páginas con Gráfica)"
                            >
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Certificado F-7.2</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onOpenDocumentManager(order.id)}
                            title="Archivos adjuntos adicionales"
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartEdit(order)}
                            title="Editar Orden y Equipos"
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingOrderId(order.id)}
                            title="Eliminar Orden"
                            className="p-1.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-row: Equipment Details when expanded */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-y border-slate-200">
                        <td colSpan={7} className="p-4 pl-12">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-blue-600" />
                                Equipos Bajo Calibración ({equipments.length})
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Haz clic en "Capturar / Editar Calibración" para registrar puntos y generar el certificado oficial F-7.2.
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {equipments.map((eq, idx) => (
                                <div
                                  key={eq.id || idx}
                                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 text-xs"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <span className="font-bold text-slate-900 block text-xs">
                                        #{eq.no || idx + 1}. {eq.instrumento}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        {eq.marca} • {eq.modelo}
                                      </span>
                                    </div>
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                                      {eq.magnitud}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 border-t pt-2">
                                    <div>
                                      <span className="font-bold text-slate-700">Serie: </span>
                                      <span className="font-mono">{eq.serie}</span>
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-700">ID: </span>
                                      <span className="font-mono">{eq.idInterno}</span>
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-700">Resolución: </span>
                                      <span>{eq.resolucion || '0.01'}</span>
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-700">Vigencia: </span>
                                      <span>{eq.vigencia}</span>
                                    </div>
                                  </div>

                                  {/* Actions for this equipment */}
                                  <div className="flex items-center justify-between pt-2 border-t gap-2">
                                    <button
                                      onClick={() => setEditingCalibration({ order, equipment: eq })}
                                      className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold transition text-center"
                                    >
                                      {eq.certificate ? 'Editar Calibración' : 'Capturar Calibración'}
                                    </button>

                                    <button
                                      onClick={() => setViewingCertificate({ order, equipment: eq })}
                                      className="py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition flex items-center gap-1 shrink-0"
                                      title="Ver Certificado F-7.2"
                                    >
                                      <Printer className="w-3 h-3" />
                                      <span>F-7.2</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No se encontraron órdenes de servicio con los criterios seleccionados.
          </div>
        )}
      </div>

      {/* Modal: Creación / Edición Completa de Orden con Equipos */}
      {(showCreateModal || editingOrder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
            
            <div className="px-6 py-4 bg-[#0A6EA2] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">
                  {editingOrder ? 'Editar Orden de Servicio SIEM' : 'Nueva Orden de Servicio SIEM'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingOrder(null);
                  if (onCloseCreateModal) onCloseCreateModal();
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Bloque 1: Datos de la Orden y Fechas */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-900">
                  1. Encabezado de la Orden
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Folio Orden *</label>
                    <input
                      type="text"
                      required
                      value={formFolio}
                      onChange={(e) => setFormFolio(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Elaboró *</label>
                    <input
                      type="text"
                      required
                      value={formElaboro}
                      onChange={(e) => setFormElaboro(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Estatus *</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold"
                    >
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completada">Completada</option>
                      <option value="Entregada">Entregada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">F. Recepción *</label>
                    <input
                      type="date"
                      required
                      value={formFechaRecepcion}
                      onChange={(e) => setFormFechaRecepcion(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">F. Estimada de Entrega</label>
                    <input
                      type="date"
                      value={formFechaEntrega}
                      onChange={(e) => setFormFechaEntrega(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 2: Datos del Cliente y Datos del Certificado */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-900">
                  2. Cliente y Datos del Certificado
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cliente Receptor *</label>
                    <select
                      required
                      value={formClientId}
                      onChange={(e) => {
                        const cid = e.target.value;
                        setFormClientId(cid);
                        const found = clients.find(c => c.id === cid);
                        if (found) {
                          setFormCertRazonSocial(found.razonSocial);
                          setFormCertDireccion(found.address || '');
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.razonSocial} ({c.rfc})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Certificado: Razón Social</label>
                    <input
                      type="text"
                      value={formCertRazonSocial}
                      onChange={(e) => setFormCertRazonSocial(e.target.value)}
                      placeholder="Nombre exacto para el certificado"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Certificado: Dirección de Emisión</label>
                  <input
                    type="text"
                    value={formCertDireccion}
                    onChange={(e) => setFormCertDireccion(e.target.value)}
                    placeholder="Dirección que se imprimirá en el certificado"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
                  />
                </div>
              </div>

              {/* Bloque 3: Tabla Dinámica de Instrumentos */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-900">
                    3. Instrumentos Bajo Calibración ({formEquipments.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddEquipmentRow}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Instrumento</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formEquipments.map((eq, idx) => (
                    <div
                      key={eq.id || idx}
                      className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2 relative"
                    >
                      <div className="flex items-center justify-between pb-1 border-b">
                        <span className="font-bold text-xs text-blue-900">
                          Instrumento #{idx + 1}
                        </span>
                        {formEquipments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEquipmentRow(idx)}
                            className="text-slate-400 hover:text-red-600 transition"
                            title="Eliminar instrumento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-600 block">Instrumento</label>
                          <input
                            type="text"
                            required
                            value={eq.instrumento}
                            onChange={(e) => handleEquipmentChange(idx, 'instrumento', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="ej. Termohigrómetro Digital"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">Marca</label>
                          <input
                            type="text"
                            value={eq.marca}
                            onChange={(e) => handleEquipmentChange(idx, 'marca', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="Vaisala"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">Modelo</label>
                          <input
                            type="text"
                            value={eq.modelo}
                            onChange={(e) => handleEquipmentChange(idx, 'modelo', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="HMP76 / MI70"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">No. Serie</label>
                          <input
                            type="text"
                            required
                            value={eq.serie}
                            onChange={(e) => handleEquipmentChange(idx, 'serie', e.target.value)}
                            className="w-full px-2 py-1 border rounded font-mono text-xs"
                            placeholder="P2720442"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">ID Interno</label>
                          <input
                            type="text"
                            value={eq.idInterno}
                            onChange={(e) => handleEquipmentChange(idx, 'idInterno', e.target.value)}
                            className="w-full px-2 py-1 border rounded font-mono text-xs"
                            placeholder="SIEM-AH-004"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">Magnitud</label>
                          <input
                            type="text"
                            required
                            value={eq.magnitud}
                            onChange={(e) => handleEquipmentChange(idx, 'magnitud', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="Humedad"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">Vigencia Solicitada</label>
                          <input
                            type="text"
                            value={eq.vigencia}
                            onChange={(e) => handleEquipmentChange(idx, 'vigencia', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="2027-07 o 1 año"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones generales */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Observaciones Generales de la Orden:
                </label>
                <textarea
                  rows={2}
                  value={formEquipmentNotes}
                  onChange={(e) => setFormEquipmentNotes(e.target.value)}
                  placeholder="Condiciones de entrega, estado físico de los sensores, estuche, etc."
                  className="w-full px-3 py-2 border rounded text-xs bg-slate-50"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingOrder(null);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                >
                  {editingOrder ? 'Guardar Cambios' : 'Registrar Orden SIEM'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Ver e Imprimir ORDEN DE SERVICIO Oficial */}
      {viewingSiemOrder && (
        <SiemServiceOrderModal
          order={viewingSiemOrder}
          onClose={() => setViewingSiemOrder(null)}
        />
      )}

      {/* Modal: Ver e Imprimir CERTIFICADO DE CALIBRACIÓN F-7.2 Oficial */}
      {viewingCertificate && (
        <SiemCertificateModal
          order={viewingCertificate.order}
          equipment={viewingCertificate.equipment}
          onClose={() => setViewingCertificate(null)}
          onOpenEditor={() => {
            const current = viewingCertificate;
            setViewingCertificate(null);
            setEditingCalibration(current);
          }}
        />
      )}

      {/* Modal: Capturar / Editar Calibración Metrológica */}
      {editingCalibration && (
        <CalibrationEditorModal
          order={editingCalibration.order}
          equipment={editingCalibration.equipment}
          onSaveCertificate={(updatedEq, certData) =>
            handleSaveCalibrationCertificate(editingCalibration.order, updatedEq, certData)
          }
          onClose={() => setEditingCalibration(null)}
        />
      )}

      {/* Modal: Confirm Delete */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">¿Eliminar Orden de Servicio?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Esta acción eliminará la orden y sus instrumentos asociados.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteOrder(deletingOrderId);
                  setDeletingOrderId(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
