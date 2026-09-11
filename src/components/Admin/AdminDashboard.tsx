import React from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  FileCheck,
  Building2,
  TrendingUp,
  PlusCircle,
  Upload,
  UserPlus,
  Users,
  ArrowRight,
  ShieldAlert,
  Activity,
  BookOpen
} from 'lucide-react';
import { ServiceOrder, Client, OrderDocument, AuditLog } from '../../types';

interface AdminDashboardProps {
  orders: ServiceOrder[];
  clients: Client[];
  documents: OrderDocument[];
  auditLogs: AuditLog[];
  onNavigate: (tab: string) => void;
  onOpenNewOrderModal: () => void;
  onOpenNewClientModal: () => void;
  onOpenUserManual?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  clients,
  documents,
  auditLogs,
  onNavigate,
  onOpenNewOrderModal,
  onOpenNewClientModal,
  onOpenUserManual,
}) => {
  // Compute metrics
  const activeOrdersCount = orders.filter((o) => o.status === 'En Proceso').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completada').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Entregada').length;
  const totalDocsCount = documents.length;
  const totalClientsCount = clients.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-1">
            <Activity className="w-3.5 h-3.5 text-slate-900" />
            <span>MÉTRICA / PANEL ADMINISTRATIVO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Servicios Integrales en Equipos de Medición
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de órdenes de servicio, calibraciones en proceso y repositorio de certificados oficiales ISO/IEC 17025.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenUserManual && (
            <button
              onClick={onOpenUserManual}
              className="px-3.5 py-2 border border-sky-300 bg-sky-50 hover:bg-sky-100 text-[#0A6EA2] text-xs font-bold uppercase tracking-wider rounded transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              title="Abrir Manual de Usuario para consultar o descargar en PDF"
            >
              <BookOpen className="w-4 h-4 text-[#0A6EA2]" />
              <span>Manual de Usuario (PDF)</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('staff')}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider rounded transition flex items-center space-x-1.5 cursor-pointer"
            title="Administración y registro de personal técnico"
          >
            <Users className="w-4 h-4 text-[#0A6EA2]" />
            <span>Personal Técnico</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider rounded transition flex items-center space-x-1.5 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-slate-700" />
            <span>Ver Órdenes</span>
          </button>
          <button
            onClick={onOpenNewOrderModal}
            className="px-4 py-2 bg-[#0A6EA2] hover:bg-[#085a85] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Nueva Orden SIEM</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Órdenes en Proceso
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{activeOrdersCount}</h3>
            <span className="text-amber-600 text-xs font-bold mb-1 uppercase">Activas</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Completadas / Listas
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{completedOrdersCount}</h3>
            <span className="text-emerald-600 text-xs font-bold mb-1 uppercase">Verificadas</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Certificados PDF
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{totalDocsCount}</h3>
            <span className="text-blue-600 text-xs font-bold mb-1 uppercase">Emitidos</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Empresas CRM
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{totalClientsCount}</h3>
            <span className="text-slate-500 text-xs font-bold mb-1 uppercase">Clientes</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Orders Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                Órdenes de Servicio Recientes
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('orders')}
                  className="text-xs font-bold text-slate-900 hover:underline uppercase tracking-wider flex items-center space-x-1"
                >
                  <span>Ver Todas ({orders.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex gap-1.5 ml-2">
                  <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Folio</th>
                    <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Servicio</th>
                    <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Estatus</th>
                    <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider text-right">PDFs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {orders.slice(0, 5).map((order) => {
                    const orderDocs = documents.filter((d) => d.orderId === order.id);
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">
                          {order.folio}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          {order.clientName}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate">
                          {order.equipmentNotes}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                              order.status === 'En Proceso'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                : order.status === 'Completada'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {orderDocs.length} PDF{orderDocs.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Distribution Progress */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Distribución de Estado de Calibración
            </h4>
            <div className="h-3 w-full bg-slate-100 rounded flex overflow-hidden">
              <div
                style={{ width: `${(activeOrdersCount / Math.max(orders.length, 1)) * 100}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`En Proceso: ${activeOrdersCount}`}
              />
              <div
                style={{ width: `${(completedOrdersCount / Math.max(orders.length, 1)) * 100}%` }}
                className="bg-indigo-600 transition-all duration-500"
                title={`Completadas: ${completedOrdersCount}`}
              />
              <div
                style={{ width: `${(deliveredOrdersCount / Math.max(orders.length, 1)) * 100}%` }}
                className="bg-emerald-600 transition-all duration-500"
                title={`Entregadas: ${deliveredOrdersCount}`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 inline-block rounded-xs" />
                <span className="font-medium text-slate-700">En Proceso ({activeOrdersCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 inline-block rounded-xs" />
                <span className="font-medium text-slate-700">Completadas ({completedOrdersCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 inline-block rounded-xs" />
                <span className="font-medium text-slate-700">Entregadas ({deliveredOrdersCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Activity Feed & Directory */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                Actividad Reciente
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Bitácora
              </span>
            </div>

            <div className="space-y-4">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-900 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">
                      {log.action} <span className="font-normal text-slate-500">by {log.user}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                      {log.details}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick User Manual Card */}
          {onOpenUserManual && (
            <div className="bg-gradient-to-br from-[#0A6EA2] to-[#085a85] text-white rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm tracking-wide">Manual de Operación Oficial</h3>
              </div>
              <p className="text-xs text-sky-100 leading-relaxed">
                Guía completa para registrar clientes, crear órdenes, actualizar estados y descargar certificados en PDF.
              </p>
              <button
                onClick={onOpenUserManual}
                className="w-full py-2 px-3 bg-white hover:bg-sky-50 text-[#0A6EA2] rounded-md font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Consultar y Descargar PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick CRM Directory */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                Directorio CRM
              </h2>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-slate-900 font-bold hover:underline uppercase tracking-wider"
              >
                Ver Órdenes
              </button>
            </div>

            <div className="space-y-2">
              {clients.slice(0, 3).map((client) => (
                <div
                  key={client.id}
                  className="p-3 bg-slate-50 rounded border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{client.razonSocial}</p>
                    <p className="text-slate-500 text-[11px]">RFC: {client.rfc}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase rounded shrink-0">
                    Activo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
