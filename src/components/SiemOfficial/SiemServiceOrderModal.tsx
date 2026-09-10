import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, FileSpreadsheet } from 'lucide-react';
import { ServiceOrder } from '../../types';
import { SiemLogo } from './SiemLogo';

interface SiemServiceOrderModalProps {
  order: ServiceOrder;
  onClose: () => void;
}

export const SiemServiceOrderModal: React.FC<SiemServiceOrderModalProps> = ({ order, onClose }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Manage body print isolation class and escape key listener
  useEffect(() => {
    document.body.classList.add('siem-printing-document');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('siem-printing-document');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs siem-modal-overlay-print">
      {/* Dynamic landscape print configuration */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 6mm 8mm;
            }
            .siem-order-sheet {
              width: 100% !important;
              max-width: 100% !important;
              min-width: 0 !important;
              box-shadow: none !important;
              border: 1.5px solid #1a4a75 !important;
              margin: 0 !important;
              padding: 0 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}
      </style>

      {/* Container */}
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 siem-modal-content-print print:border-none print:shadow-none print:m-0 print:p-0">
        
        {/* Top toolbar (hidden in print) */}
        <div className="bg-[#0A6EA2] text-white px-5 py-3 flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs tracking-wider uppercase px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
              Orden Oficial
            </span>
            <span className="text-white/60 text-xs">•</span>
            <span className="text-sm font-semibold">Folio: {order.folio}</span>
            <span className="text-xs text-white/80 hidden sm:inline">
              (Formato Horizontal Optimizado para Impresión)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition cursor-pointer"
              title="Exportar datos a CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span className="hidden md:inline">Exportar Excel/CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-white text-[#0A6EA2] hover:bg-white/90 rounded shadow-xs transition cursor-pointer"
              title="Imprimir o Guardar en PDF (Horizontal)"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF (Horizontal)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div
          ref={scrollContainerRef}
          className="p-4 sm:p-8 bg-slate-100 overflow-x-auto text-slate-900 font-sans print:bg-white print:p-0 siem-printable-area"
        >
          <div className="w-full max-w-[1020px] mx-auto bg-white border-2 border-[#1a4a75] text-[11px] leading-tight shadow-md siem-order-sheet">
            
            {/* Header: Official Logo + Title + Folio */}
            <div className="p-3 border-b-2 border-[#1a4a75] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="shrink-0">
                <SiemLogo className="h-14" />
              </div>

              <div className="text-center flex-1">
                <div className="inline-block bg-[#b9d3ee] border border-[#1a4a75] px-6 py-1.5 rounded-xs shadow-2xs">
                  <h1 className="text-base sm:text-lg font-black tracking-widest text-[#0a2744] uppercase font-sans">
                    ORDEN DE SERVICIO
                  </h1>
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-1">
                  Servicios Integrales en Equipos de Medición
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="bg-[#103050] text-white px-3 py-1 text-xs font-black tracking-wider uppercase rounded-xs">
                  FOLIO: {order.folio}
                </div>
                <div className="text-[10px] font-bold text-slate-700 mt-1">
                  Recepción: <span className="font-mono">{order.fechaRecepcion || order.calibrationDate}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-700">
                  Entrega Est.: <span className="font-mono">{order.fechaEntrega || 'Por programar'}</span>
                </div>
              </div>
            </div>

            {/* Row 1: ELABORÓ, F. RECEPCIÓN, F. ENTREGA, ORDEN */}
            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75] bg-white text-[10.5px]">
              <div className="col-span-2 p-1.5 bg-[#dbe8f5] font-bold text-center uppercase flex items-center justify-center">
                ELABORÓ:
              </div>
              <div className="col-span-4 p-1.5 font-medium flex items-center px-2">
                {order.elaboro || order.technicianName || 'Ing. Cristian Ulises Contreras'}
              </div>

              <div className="col-span-2 p-1.5 bg-[#dbe8f5] font-bold text-center uppercase flex items-center justify-center text-[10px]">
                F. RECEPCIÓN:
              </div>
              <div className="col-span-1 p-1.5 text-center font-medium flex items-center justify-center font-mono">
                {order.fechaRecepcion || order.calibrationDate}
              </div>

              <div className="col-span-2 p-1.5 bg-[#dbe8f5] font-bold text-center uppercase flex items-center justify-center text-[10px]">
                F. ENTREGA:
              </div>
              <div className="col-span-1 p-1.5 text-center font-medium flex items-center justify-center font-mono">
                {order.fechaEntrega || 'Pendiente'}
              </div>
            </div>

            {/* Row 2: DATOS DEL CLIENTE */}
            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75] bg-white text-[10.5px]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                RAZÓN SOCIAL:
              </div>
              <div className="col-span-5 p-1.5 font-semibold text-slate-900 flex items-center">
                {order.clientName}
              </div>
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                TELÉFONO:
              </div>
              <div className="col-span-3 p-1.5 font-medium flex items-center">
                {order.clientPhone || '55-5678-1234'}
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75] bg-white text-[10.5px]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                DIRECCIÓN:
              </div>
              <div className="col-span-5 p-1.5 font-medium flex items-center">
                {order.clientAddress || 'Calzada de los Leones #450, Col. Las Águilas, CDMX'}
              </div>
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                ATENCIÓN:
              </div>
              <div className="col-span-3 p-1.5 font-medium flex items-center">
                {order.clientContact || 'Dra. Patricia Solís'}
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75] bg-white text-[10.5px]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                CORREO:
              </div>
              <div className="col-span-10 p-1.5 font-medium flex items-center">
                {order.clientEmail || 'contacto@cliente.com'}
              </div>
            </div>

            {/* Row 3: DATOS DEL CERTIFICADO */}
            <div className="bg-[#b9d3ee] border-b border-[#1a4a75] py-1 text-center font-bold text-[#103050] uppercase text-[10px] tracking-wider">
              DATOS DEL CERTIFICADO
            </div>

            <div className="grid grid-cols-12 border-b border-[#1a4a75] divide-x divide-[#1a4a75] bg-white text-[10.5px]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                RAZÓN SOCIAL:
              </div>
              <div className="col-span-10 p-1.5 font-medium flex items-center">
                {order.certRazonSocial || order.clientName}
              </div>
            </div>

            <div className="grid grid-cols-12 border-b-2 border-[#1a4a75] divide-x divide-[#1a4a75] bg-white text-[10.5px]">
              <div className="col-span-2 p-1.5 bg-[#eef4fa] font-bold uppercase text-[10px] flex items-center">
                DIRECCIÓN:
              </div>
              <div className="col-span-10 p-1.5 font-medium flex items-center">
                {order.certDireccion || order.clientAddress || 'Planta Industrial Norte, CDMX'}
              </div>
            </div>

            {/* TABLA DE INSTRUMENTOS (table-fixed 100% width, no horizontal scrolling) */}
            <div className="w-full overflow-visible">
              <table className="w-full table-fixed text-center border-collapse border-b border-[#1a4a75]">
                <thead>
                  <tr className="bg-[#dbe8f5] text-[#103050] font-bold text-[9px] uppercase border-b border-[#1a4a75] divide-x divide-[#1a4a75]">
                    <th className="p-1 w-[4%]">No</th>
                    <th className="p-1 w-[18%]">INSTRUMENTO</th>
                    <th className="p-1 w-[10%]">MARCA</th>
                    <th className="p-1 w-[10%]">MODELO</th>
                    <th className="p-1 w-[12%]">SERIE</th>
                    <th className="p-1 w-[8%]">ID</th>
                    <th className="p-1 w-[8%]">VIGENCIA</th>
                    <th className="p-1 w-[8%]">SERVICIO</th>
                    <th className="p-1 w-[8%]">MAGNITUD</th>
                    <th className="p-1 w-[14%]">OBSERVACIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a4a75] bg-white">
                  {equipments.map((eq, idx) => (
                    <tr key={eq.id || idx} className="divide-x divide-[#1a4a75] text-[9.5px]">
                      <td className="p-1 font-bold">{eq.no || idx + 1}</td>
                      <td className="p-1 font-semibold text-left break-words">{eq.instrumento}</td>
                      <td className="p-1 break-words">{eq.marca}</td>
                      <td className="p-1 break-words">{eq.modelo}</td>
                      <td className="p-1 font-mono text-[9px] break-words">{eq.serie}</td>
                      <td className="p-1 font-mono text-[9px] font-semibold break-words">{eq.idInterno}</td>
                      <td className="p-1 break-words">{eq.vigencia}</td>
                      <td className="p-1 break-words">{eq.servicio}</td>
                      <td className="p-1 font-bold text-blue-900 break-words">{eq.magnitud}</td>
                      <td className="p-1 text-left text-[8.5px] text-slate-700 break-words">{eq.observaciones || 'Condiciones óptimas sin daño físico.'}</td>
                    </tr>
                  ))}
                  {equipments.length === 1 && (
                    <tr className="divide-x divide-[#1a4a75] text-[9.5px] text-slate-300">
                      <td className="p-1 font-bold">2</td>
                      <td className="p-1 text-left">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                      <td className="p-1">—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Observaciones generales */}
            <div className="p-2 min-h-[55px] bg-white border-b border-[#1a4a75]">
              <span className="font-bold uppercase text-[9.5px] block text-slate-900">
                Observaciones Generales:
              </span>
              <p className="mt-0.5 text-[10px] text-slate-700 leading-normal">
                {order.observacionesGenerales || order.equipmentNotes || 'Equipo entregado con estuche original rígido y sonda de medición. Calibración directa de alta precisión.'}
              </p>
            </div>

            {/* Footer / Firmas */}
            <div className="py-5 px-10 bg-white grid grid-cols-12 gap-8 text-center text-[10px]">
              <div className="col-span-7 flex flex-col items-center">
                <div className="w-full border-t border-slate-900 pt-1">
                  <span className="font-semibold text-slate-900 block">
                    {order.recibidoPor || 'Ing. Cristian Ulises Contreras H.'}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-600">
                    Nombre y Firma de quien recibe
                  </span>
                </div>
              </div>

              <div className="col-span-5 flex flex-col items-center">
                <div className="w-full border-t border-slate-900 pt-1">
                  <span className="font-semibold text-slate-900 block">
                    {order.fechaFirmaRecibido || order.fechaRecepcion || order.calibrationDate}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-600">
                    Fecha de Recepción
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

