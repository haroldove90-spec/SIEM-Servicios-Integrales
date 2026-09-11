import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Eye,
  Download,
  Filter,
  ShieldCheck,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { Client, ServiceOrder, OrderDocument } from '../../types';

interface ClientDashboardProps {
  currentClient: Client;
  orders: ServiceOrder[];
  documents: OrderDocument[];
  onOpenOrderDetail: (order: ServiceOrder) => void;
  onViewPdf: (doc: OrderDocument) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentClient,
  orders,
  documents,
  onOpenOrderDetail,
  onViewPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'En Proceso' | 'Completada' | 'Entregada'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Filter ONLY orders for this client!
  const clientOrders = orders.filter((o) => o.clientId === currentClient.id);
  const clientOrderIds = new Set(clientOrders.map((o) => o.id));
  const clientDocs = documents.filter((d) => clientOrderIds.has(d.orderId));

  // Filtered orders
  const filteredOrders = clientOrders.filter((order) => {
    const matchesSearch =
      order.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipmentNotes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.calibrationDate.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;

    // Filter by document type if tag selected
    let matchesTag = true;
    if (selectedTag !== 'all') {
      const orderDocTypes = documents
        .filter((d) => d.orderId === order.id)
        .map((d) => d.type);
      matchesTag = orderDocTypes.includes(selectedTag as any);
    }

    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-1">
            <Building2 className="w-3.5 h-3.5 text-slate-900" />
            <span>PORTAL CORPORATIVO DE CLIENTE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentClient.razonSocial}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            RFC: <span className="font-mono font-bold text-slate-800">{currentClient.rfc}</span> • Contacto: {currentClient.contactName} ({currentClient.email})
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-md text-right shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Estatus Acreditación
          </p>
          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ISO/IEC 17025 Vigente</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Total de Órdenes
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{clientOrders.length}</h3>
            <span className="text-slate-500 text-xs font-bold mb-1 uppercase">Servicios</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Órdenes Activas
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">
              {clientOrders.filter((o) => o.status === 'En Proceso').length}
            </h3>
            <span className="text-amber-600 text-xs font-bold mb-1 uppercase">En Proceso</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Certificados Disponibles
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{clientDocs.length}</h3>
            <span className="text-emerald-600 text-xs font-bold mb-1 uppercase">Verificados</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por número de orden (001), equipo o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700 font-bold uppercase tracking-wider"
            >
              <option value="all">TODOS LOS ESTADOS</option>
              <option value="En Proceso">EN PROCESO</option>
              <option value="Completada">COMPLETADA</option>
              <option value="Entregada">ENTREGADA</option>
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700 font-bold uppercase tracking-wider"
            >
              <option value="all">TODOS LOS DOCUMENTOS</option>
              <option value="Certificado de Calibración">CERTIFICADO DE CALIBRACIÓN</option>
              <option value="Informe Técnico">INFORME TÉCNICO</option>
              <option value="Factura/Remisión">FACTURA/REMISIÓN</option>
              <option value="Hoja de Datos">HOJA DE DATOS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Listado de Órdenes de Servicio ({filteredOrders.length})
          </h3>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-300"></div>
            <div className="h-2 w-2 rounded-full bg-slate-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const orderDocs = documents.filter((d) => d.orderId === order.id);
            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {order.folio}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider border ${
                        order.status === 'En Proceso'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : order.status === 'Completada'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {order.equipmentNotes}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.calibrationDate}</span>
                    </span>
                    <span>Técnico: {order.technicianName}</span>
                  </div>
                </div>

                {/* Attached PDFs Quick Links */}
                <div className="bg-slate-50 rounded p-3 border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Certificados PDF ({orderDocs.length})
                  </p>

                  {orderDocs.length > 0 ? (
                    <div className="space-y-1.5">
                      {orderDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200"
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            <FileText className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate" title={doc.name}>
                              {doc.name}
                            </span>
                          </div>
                          <button
                            onClick={() => onViewPdf(doc)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-wider transition shrink-0"
                          >
                            Ver PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      En proceso de calibración y digitalización documental.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onOpenOrderDetail(order)}
                  className="w-full py-2.5 rounded bg-[#237781] hover:bg-[#1b5e66] text-white font-bold text-xs uppercase tracking-wider shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Ver Detalle y Descargas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200 text-slate-500 text-xs">
            No se encontraron órdenes de servicio que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};
