import React from 'react';
import { Printer, Download, X, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { ServiceOrder } from '../../types';

interface SiemServiceOrderModalProps {
  order: ServiceOrder;
  onClose: () => void;
}

export const SiemServiceOrderModal: React.FC<SiemServiceOrderModalProps> = ({ order, onClose }) => {
  const equipments = order.equipments && order.equipments.length > 0 ? order.equipments : [
    {
      id: 'eq-default',
      no: 1,
      instrumento: 'Termohigrómetro Digital',
      marca: 'Vaisala',
      modelo: 'HMP76 / MI70',
      serie: 'P2720442',
      idInterno: 'SIEM-AH-004',
      vigencia: '1 año',
      servicio: 'Calibración',
      magnitud: 'Humedad',
      observaciones: order.equipmentNotes || 'Condiciones de entrega óptimas.'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      'Orden de Servicio',
      'Elaboro',
      'Fecha Recepcion',
      'Fecha Entrega',
      'Razon Social',
      'Telefono',
      'Atencion',
      'Correo',
      'Direccion',
      'Certificado Razon Social',
      'Certificado Direccion',
      'No',
      'Instrumento',
      'Marca',
      'Modelo',
      'Serie',
      'ID Interno',
      'Vigencia',
      'Servicio',
      'Magnitud',
      'Observaciones Equipo',
      'Observaciones Generales'
    ];

    const rows = equipments.map(eq => [
      `"${order.folio}"`,
      `"${order.elaboro || order.technicianName}"`,
      `"${order.fechaRecepcion || order.calibrationDate}"`,
      `"${order.fechaEntrega || ''}"`,
      `"${order.clientName}"`,
      `"${order.clientPhone || ''}"`,
      `"${order.clientContact || ''}"`,
      `"${order.clientEmail || ''}"`,
      `"${order.clientAddress || ''}"`,
      `"${order.certRazonSocial || order.clientName}"`,
      `"${order.certDireccion || order.clientAddress || ''}"`,
      eq.no,
      `"${eq.instrumento}"`,
      `"${eq.marca}"`,
      `"${eq.modelo}"`,
      `"${eq.serie}"`,
      `"${eq.idInterno}"`,
      `"${eq.vigencia}"`,
      `"${eq.servicio}"`,
      `"${eq.magnitud}"`,
      `"${eq.observaciones || ''}"`,
      `"${order.observacionesGenerales || order.equipmentNotes || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Orden_Servicio_${order.folio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs">
      {/* Container */}
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 print:border-none print:shadow-none print:m-0 print:p-0">
        
        {/* Top toolbar (hidden in print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide uppercase text-blue-400">
              Documento Oficial
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-sm font-semibold">Orden de Servicio #{order.folio}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
              title="Exportar datos a CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel/CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded shadow-xs transition"
              title="Imprimir o Guardar en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (exact layout from user's PDF) */}
        <div className="p-6 sm:p-10 bg-white overflow-x-auto text-slate-900 font-sans print:p-0">
          
          <div className="min-w-[780px] max-w-[950px] mx-auto border-2 border-[#1a4a75] text-[11px] leading-tight">
            
            {/* Header Title */}
            <div className="bg-[#b9d3ee] border-b-2 border-[#1a4a75] py-2 text-center">
              <h1 className="text-base font-black tracking-wider text-[#103050] uppercase font-sans">
                ORDEN DE SERVICIO
              </h1>
            </div>

            {/* Row 1: ELABORO, F. RECEPCIÓN, F. ENTREGA, ORDEN DE SERVICIO */}
            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
              <div className="col-span-3 p-1.5 bg-[#dbe8f5] font-bold text-center uppercase flex items-center justify-center">
                ELABORÓ:
              </div>
              <div className="col-span-2 p-1.5 font-medium flex items-center justify-center text-center">
                {order.elaboro || order.technicianName || 'Ing. Ulises Contreras'}
              </div>

              <div className="col-span-2 p-1.5 bg-[#dbe8f5] font-bold text-center uppercase flex items-center justify-center text-[10px]">
                F. RECEPCIÓN:
              </div>
              <div className="col-span-1 p-1.5 text-center font-medium flex items-center justify-center">
                {order.fechaRecepcion || order.calibrationDate}
              </div>

              <div className="col-span-2 p-1.5 bg-[#dbe8f5] font-bold text-center uppercase flex items-center justify-center text-[10px]">
                F. ENTREGA:
              </div>
              <div className="col-span-1 p-1.5 text-center font-medium flex items-center justify-center">
                {order.fechaEntrega || 'Pendiente'}
              </div>

              <div className="col-span-1 p-1.5 bg-[#103050] text-white font-bold text-center uppercase flex items-center justify-center text-[10px]">
                {order.folio}
              </div>
            </div>

            {/* Row 2: DATOS DEL CLIENTE */}
            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                RAZÓN SOCIAL:
              </div>
              <div className="col-span-5 p-1.5 font-medium">
                {order.clientName}
              </div>
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                TELÉFONO:
              </div>
              <div className="col-span-3 p-1.5 font-medium">
                {order.clientPhone || '81-8123-4567'}
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                DIRECCIÓN:
              </div>
              <div className="col-span-5 p-1.5 font-medium">
                {order.clientAddress || 'Av. de las Industrias #1200, Apodaca, N.L.'}
              </div>
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                ATENCIÓN:
              </div>
              <div className="col-span-3 p-1.5 font-medium">
                {order.clientContact || 'Ing. Roberto Garza'}
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                CORREO:
              </div>
              <div className="col-span-10 p-1.5 font-medium">
                {order.clientEmail || 'contacto@cliente.com'}
              </div>
            </div>

            {/* Row 3: DATOS DEL CERTIFICADO */}
            <div className="bg-[#b9d3ee] border-b border-[#1a4a75] py-1 text-center font-bold text-[#103050] uppercase text-[10px] tracking-wider">
              DATOS DEL CERTIFICADO
            </div>

            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                RAZÓN SOCIAL:
              </div>
              <div className="col-span-10 p-1.5 font-medium">
                {order.certRazonSocial || order.clientName}
              </div>
            </div>

            <div className="grid grid-cols-12 border-b-2 border-[#1a4a75] divide-x divide-[#1a4a75]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px]">
                DIRECCIÓN:
              </div>
              <div className="col-span-10 p-1.5 font-medium">
                {order.certDireccion || order.clientAddress || 'Misma dirección fiscal'}
              </div>
            </div>

            {/* TABLA DE INSTRUMENTOS (exact columns from PDF) */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#dbe8f5] text-[#103050] font-bold text-[9.5px] uppercase border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
                    <th className="p-1 w-8">No</th>
                    <th className="p-1">INSTRUMENTO</th>
                    <th className="p-1">MARCA</th>
                    <th className="p-1">MODELO</th>
                    <th className="p-1">SERIE</th>
                    <th className="p-1">ID</th>
                    <th className="p-1">VIGENCIA</th>
                    <th className="p-1">SERVICIO</th>
                    <th className="p-1">MAGNITUD</th>
                    <th className="p-1">OBSERVACIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a4a75]">
                  {equipments.map((eq, idx) => (
                    <tr key={eq.id || idx} className="divide-x divide-[#1a4a75] text-[10px] hover:bg-blue-50/40">
                      <td className="p-1.5 font-bold">{eq.no || idx + 1}</td>
                      <td className="p-1.5 font-semibold text-left">{eq.instrumento}</td>
                      <td className="p-1.5">{eq.marca}</td>
                      <td className="p-1.5">{eq.modelo}</td>
                      <td className="p-1.5 font-mono text-[9px]">{eq.serie}</td>
                      <td className="p-1.5 font-mono text-[9px] font-semibold">{eq.idInterno}</td>
                      <td className="p-1.5">{eq.vigencia}</td>
                      <td className="p-1.5">{eq.servicio}</td>
                      <td className="p-1.5 font-medium text-blue-900">{eq.magnitud}</td>
                      <td className="p-1.5 text-left text-[9px] text-slate-700">{eq.observaciones || '—'}</td>
                    </tr>
                  ))}
                  {/* Padding empty row if less than 3 */}
                  {equipments.length === 1 && (
                    <tr className="divide-x divide-[#1a4a75] text-[10px] text-slate-300">
                      <td className="p-1.5 font-bold">2</td>
                      <td className="p-1.5 text-left">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                      <td className="p-1.5">—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Observaciones generales */}
            <div className="border-t-2 border-[#1a4a75] p-2 min-h-[70px] bg-white">
              <span className="font-bold uppercase text-[10px] block text-slate-800">
                Observaciones:
              </span>
              <p className="mt-1 text-[10.5px] text-slate-700 whitespace-pre-wrap">
                {order.observacionesGenerales || order.equipmentNotes || 'El equipo se recibe para calibración en condiciones operativas estándar con accesorios completos.'}
              </p>
            </div>

            {/* Footer / Firmas */}
            <div className="border-t border-[#1a4a75] pt-12 pb-4 px-8 bg-white grid grid-cols-12 gap-8 text-center text-[10.5px]">
              <div className="col-span-7 flex flex-col items-center">
                <div className="w-full border-t border-slate-900 pt-1">
                  <span className="font-semibold text-slate-900 block">
                    {order.recibidoPor || 'Ing. Cristian Ulises Contreras H.'}
                  </span>
                  <span className="text-[9.5px] uppercase font-bold text-slate-600">
                    Nombre y Firma de quien recibe
                  </span>
                </div>
              </div>

              <div className="col-span-5 flex flex-col items-center">
                <div className="w-full border-t border-slate-900 pt-1">
                  <span className="font-semibold text-slate-900 block">
                    {order.fechaFirmaRecibido || order.fechaRecepcion || order.calibrationDate}
                  </span>
                  <span className="text-[9.5px] uppercase font-bold text-slate-600">
                    Fecha
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
