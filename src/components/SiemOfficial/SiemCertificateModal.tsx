import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, FileSpreadsheet, Edit3 } from 'lucide-react';
import { ServiceOrder, EquipmentItem, CalibrationCertificateData } from '../../types';
import { SiemLogo } from './SiemLogo';

interface SiemCertificateModalProps {
  order: ServiceOrder;
  equipment: EquipmentItem;
  onClose: () => void;
  onOpenEditor?: () => void;
}

export const SiemCertificateModal: React.FC<SiemCertificateModalProps> = ({
  order,
  equipment,
  onClose,
  onOpenEditor,
}) => {
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

  // Use existing certificate or default values inspired by the user's PDF
  const cert: CalibrationCertificateData = equipment.certificate || {
    id: 'cert-' + equipment.id,
    folioCertificado: `SIEM/1H/26`,
    magnitud: equipment.magnitud || 'Humedad',
    codigoFormato: 'F-7.2',
    noRevision: '1',
    lugarCalibracion: 'Calibración Realizada en las instalaciones de SIEM',
    fechaRecepcion: order.fechaRecepcion || order.calibrationDate || '2026-09-07',
    fechaCalibracion: order.calibrationDate || '2026-09-07',
    fechaEmision: '2026-09-08',
    ordenTrabajo: order.folio,
    temperaturaAmbiente: '21.4 °C ± 0.5 °C',
    humedadAmbiente: '48.2 %HR ± 2.0 %HR',
    patronDescripcion: 'Termohigrómetro Digital',
    patronMarca: 'Vaisala',
    patronModelo: 'HMP76 / MI70',
    patronSerie: 'P2720442 / P2510005',
    patronId: 'SIEM-AH-004',
    patronCertificado: 'CAH-1245-26',
    patronVigencia: '2027-07',
    patronTrazabilidad: 'H34',
    puntos: [
      { id: 'p1', referencia: 20.00, indicacionIbc: 19.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: 'p2', referencia: 40.00, indicacionIbc: 39.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: 'p3', referencia: 60.00, indicacionIbc: 59.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: 'p4', referencia: 80.00, indicacionIbc: 79.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: 'p5', referencia: 95.00, indicacionIbc: 94.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
    ],
    calibroNombre: 'Ing. Cristian Ulises Contreras H.',
    calibroPuesto: 'Metrólogo',
    autorizoNombre: 'Ing. Raul Hernandez Vicente',
    autorizoPuesto: 'Metrólogo',
    procedimientoCalibracion: 'Procedimiento de Calibración para Humedad P-7.2.2',
    factorCoberturaK: 2,
    nivelConfianza: '95.45%',
    normaReferencia: 'NOM-008-SE-2021, NMX-CH-140-IMNC 2002',
  };

  const handlePrint = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      'Folio Certificado',
      'Instrumento',
      'Marca',
      'Modelo',
      'Serie',
      'ID IBC',
      'Magnitud',
      'Punto',
      'Valor de Referencia',
      'Indicacion Promedio IBC',
      'Error de Medida',
      'Incertidumbre (±U)',
      'Unidad'
    ];

    const rows = cert.puntos.map((p, idx) => [
      `"${cert.folioCertificado}"`,
      `"${equipment.instrumento}"`,
      `"${equipment.marca}"`,
      `"${equipment.modelo}"`,
      `"${equipment.serie}"`,
      `"${equipment.idInterno}"`,
      `"${cert.magnitud}"`,
      idx + 1,
      p.referencia,
      p.indicacionIbc,
      p.error,
      p.incertidumbreU,
      `"${p.unidad || '%HR'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Certificado_${cert.folioCertificado.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs siem-modal-overlay-print">
      {/* Strict 2-Page Portrait Print Styling */}
      <style>
        {`
          @media print {
            @page {
              size: portrait;
              margin: 7mm 9mm;
            }
            .siem-cert-page {
              width: 100% !important;
              max-width: 100% !important;
              min-width: 0 !important;
              height: 260mm !important;
              max-height: 260mm !important;
              box-sizing: border-box !important;
              margin: 0 0 0 0 !important;
              padding: 4mm 2mm !important;
              box-shadow: none !important;
              border: none !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              overflow: hidden !important;
            }
            .siem-cert-page:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }
          }
        `}
      </style>

      {/* Modal Shell */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 siem-modal-content-print print:border-none print:shadow-none print:m-0 print:p-0">
        
        {/* Top toolbar (hidden in print) */}
        <div className="bg-[#0A6EA2] text-white px-5 py-3 flex items-center justify-between print:hidden sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
              F-7.2 Rev. 1
            </span>
            <span className="text-sm font-semibold">
              Certificado Oficial: {cert.folioCertificado}
            </span>
            <span className="text-white/80 text-xs hidden sm:inline">
              ({equipment.instrumento} - {equipment.serie})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEditor && (
              <button
                onClick={onOpenEditor}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Editar Datos</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition cursor-pointer"
              title="Exportar puntos a CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-white text-[#0A6EA2] hover:bg-white/90 rounded shadow-xs transition cursor-pointer"
              title="Imprimir las 2 páginas o guardar en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF (2 Págs)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-page printable canvas */}
        <div
          ref={scrollContainerRef}
          className="p-4 sm:p-8 bg-slate-100 print:bg-white overflow-x-auto space-y-8 print:space-y-0 print:p-0 siem-printable-area"
        >
          
          {/* ======================================================== */}
          {/* PÁGINA 1: IDENTIFICACIÓN, CONDICIONES, PATRONES Y FIRMAS */}
          {/* ======================================================== */}
          <div className="w-full max-w-[794px] min-h-[960px] mx-auto bg-white p-6 sm:p-10 shadow-lg border border-slate-200 flex flex-col justify-between siem-cert-page">
            
            <div className="space-y-4">
              {/* Header: Logo and Titles */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="shrink-0">
                  <SiemLogo className="h-16" />
                </div>
                
                <div className="text-right">
                  <h1 className="text-lg sm:text-xl font-bold italic tracking-wide text-slate-900 uppercase font-serif">
                    CERTIFICADO DE CALIBRACIÓN
                  </h1>
                  <h2 className="text-sm font-bold italic text-slate-800 mt-0.5">
                    Magnitud {cert.magnitud}
                  </h2>
                  <div className="text-base font-black text-blue-950 tracking-wider mt-0.5">
                    {cert.folioCertificado}
                  </div>
                </div>
              </div>

              {/* Client info */}
              <div className="space-y-1 text-[11px]">
                <div className="flex">
                  <span className="w-24 font-bold text-slate-900">Nombre :</span>
                  <span className="font-semibold text-slate-800">{order.certRazonSocial || order.clientName}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-bold text-slate-900">Dirección:</span>
                  <span className="text-slate-700">{order.certDireccion || order.clientAddress || 'Calzada de los Leones #450, Col. Las Águilas, CDMX'}</span>
                </div>
              </div>

              {/* Section 1: Instrument Description */}
              <div>
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-[11px] italic tracking-wider uppercase">
                  DESCRIPCIÓN DEL INSTRUMENTO BAJO CALIBRACIÓN
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mt-2.5 text-[11px]">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">Instrumento:</span>
                    <span className="text-slate-800 font-medium">{equipment.instrumento}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">Modelo:</span>
                    <span className="text-slate-800">{equipment.modelo}</span>
                  </div>

                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">Marca:</span>
                    <span className="text-slate-800">{equipment.marca}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">Identificación:</span>
                    <span className="text-slate-800 font-semibold">{equipment.idInterno}</span>
                  </div>

                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">No. De Serie:</span>
                    <span className="text-slate-800 font-mono">{equipment.serie}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">Resolución:</span>
                    <span className="text-slate-800">{equipment.resolucion || '0.01 %HR'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Calibración Realizada en las instalaciones de SIEM */}
              <div>
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-[11px] italic tracking-wider">
                  {cert.lugarCalibracion}
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mt-2.5 text-[11px]">
                  <div className="flex items-center">
                    <span className="w-36 font-bold text-slate-900">Fecha de Recepción :</span>
                    <span className="font-mono">{cert.fechaRecepcion}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-36 font-bold text-slate-900">Orden de Trabajo :</span>
                    <span className="font-semibold">{cert.ordenTrabajo}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-36 font-bold text-slate-900">Fecha de Calibración :</span>
                    <span className="font-mono">{cert.fechaCalibracion}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-36 font-bold text-slate-900">Fecha de Emisión :</span>
                    <span className="font-mono">{cert.fechaEmision}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Condiciones Ambientales */}
              <div>
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-[11px] italic tracking-wider uppercase">
                  CONDICIONES AMBIENTALES DE MEDICIÓN:
                </div>

                <div className="grid grid-cols-2 gap-8 mt-2.5 text-[11px] text-center">
                  <div className="border-b border-slate-300 pb-1">
                    <span className="font-bold block text-slate-900">Temperatura</span>
                    <span className="text-slate-800 font-medium font-mono">{cert.temperaturaAmbiente}</span>
                  </div>
                  <div className="border-b border-slate-300 pb-1">
                    <span className="font-bold block text-slate-900">Humedad</span>
                    <span className="text-slate-800 font-medium font-mono">{cert.humedadAmbiente}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Patrones Utilizados */}
              <div>
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-[11px] italic tracking-wider uppercase">
                  PATRONES UTILIZADOS DURANTE LA CALIBRACIÓN
                </div>

                <div className="mt-2 text-center text-[10.5px] italic text-slate-800 leading-normal px-2">
                  {cert.patronDescripcion}, Marca: {cert.patronMarca}, Modelo: {cert.patronModelo}, Serie: {cert.patronSerie}, ID: {cert.patronId}, Certificado: {cert.patronCertificado}, Vigencia: {cert.patronVigencia}, Trazabilidad: {cert.patronTrazabilidad}
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-16 text-center text-xs">
                <div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-900 pt-1">
                    <span className="font-bold block text-slate-900 text-xs">
                      {cert.calibroNombre}
                    </span>
                    <span className="text-[10px] italic text-slate-600 block">
                      {cert.calibroPuesto}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mt-0.5 block">
                      Calibró
                    </span>
                  </div>
                </div>

                <div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-900 pt-1">
                    <span className="font-bold block text-slate-900 text-xs">
                      {cert.autorizoNombre}
                    </span>
                    <span className="text-[10px] italic text-slate-600 block">
                      {cert.autorizoPuesto}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mt-0.5 block">
                      Autorizó
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Footer */}
            <div className="mt-6 border-t border-slate-300 pt-2 text-[10px] text-slate-600 text-center space-y-0.5">
              <div className="flex justify-between items-center text-[10px]">
                <span>Codigo: {cert.codigoFormato}</span>
                <span className="italic font-medium">ucontreras@siemmx.com</span>
                <span className="font-bold text-slate-900">Página: 1 de 2</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px] text-slate-500">
                <span>No de Revisión: {cert.noRevision}</span>
                <span>Av. Circunvalación Oriente Mz. 31 Lt. 10, Rio de Luz, CP. 55100, Ecatepec de Morelos, Edo. de México. Tel. (55) 34-86-59-79</span>
                <span></span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* PÁGINA 2: RESULTADOS DE LA CALIBRACIÓN, GRÁFICA Y NORMAS */}
          {/* ======================================================== */}
          <div className="w-full max-w-[794px] min-h-[960px] mx-auto bg-white p-6 sm:p-10 shadow-lg border border-slate-200 flex flex-col justify-between siem-cert-page">
            
            <div className="space-y-3">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b pb-2">
                <SiemLogo className="h-10" showText={false} />
                <div className="text-center flex-1">
                  <div className="bg-[#386b99] text-white py-1 px-4 inline-block font-bold text-xs italic tracking-wider uppercase">
                    RESULTADOS DE LA CALIBRACIÓN
                  </div>
                </div>
                <div className="text-right font-black text-xs text-slate-900">
                  {cert.folioCertificado}
                </div>
              </div>

              {/* Calibration Points Table */}
              <div className="flex justify-center">
                <table className="w-[500px] text-center border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-[#eef4fa] font-bold text-slate-900 divide-x divide-slate-900 border-b border-slate-900">
                      <th className="p-1 w-1/4">Valor de Referencia</th>
                      <th className="p-1 w-1/4">Indicación Promedio<br/>del IBC</th>
                      <th className="p-1 w-1/4">Error de medida</th>
                      <th className="p-1 w-1/4">± U</th>
                    </tr>
                    <tr className="bg-[#eef4fa] font-bold text-slate-700 divide-x divide-slate-900 border-b border-slate-900 text-[10px]">
                      <th className="p-0.5">%HR</th>
                      <th className="p-0.5">%HR</th>
                      <th className="p-0.5">%HR</th>
                      <th className="p-0.5">%HR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 bg-white">
                    {cert.puntos.map((p, idx) => (
                      <tr key={p.id || idx} className="divide-x divide-slate-900 font-mono text-[10.5px]">
                        <td className="p-1">{p.referencia.toFixed(2)}</td>
                        <td className="p-1">{p.indicacionIbc.toFixed(2)}</td>
                        <td className="p-1 font-semibold">{p.error >= 0 ? `+${p.error.toFixed(2)}` : p.error.toFixed(2)}</td>
                        <td className="p-1">{p.incertidumbreU.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calibration Curve Graph */}
              <div className="flex flex-col items-center">
                <div className="w-[500px] border border-slate-300 rounded p-2.5 bg-white">
                  <div className="text-center text-[11px] font-bold text-slate-800 mb-1">
                    Resultados de calibración del IBC
                  </div>

                  {/* SVG Chart */}
                  <svg viewBox="0 0 480 150" className="w-full h-auto">
                    {/* Gridlines horizontal */}
                    <line x1="45" y1="15" x2="460" y2="15" stroke="#e2e8f0" strokeDasharray="2" />
                    <line x1="45" y1="40" x2="460" y2="40" stroke="#e2e8f0" strokeDasharray="2" />
                    <line x1="45" y1="65" x2="460" y2="65" stroke="#e2e8f0" strokeDasharray="2" />
                    <line x1="45" y1="90" x2="460" y2="90" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="45" y1="115" x2="460" y2="115" stroke="#e2e8f0" strokeDasharray="2" />

                    {/* Y-axis labels (Error) */}
                    <text x="40" y="18" fontSize="8.5" textAnchor="end" fill="#64748b">1.00</text>
                    <text x="40" y="43" fontSize="8.5" textAnchor="end" fill="#64748b">0.70</text>
                    <text x="40" y="68" fontSize="8.5" textAnchor="end" fill="#64748b">0.40</text>
                    <text x="40" y="93" fontSize="8.5" textAnchor="end" fill="#0f172a" fontWeight="bold">0.00</text>
                    <text x="40" y="118" fontSize="8.5" textAnchor="end" fill="#64748b">-0.50</text>

                    {/* Y-axis title */}
                    <text
                      x="-65"
                      y="14"
                      transform="rotate(-90)"
                      fontSize="8.5"
                      textAnchor="middle"
                      fill="#334155"
                      fontWeight="bold"
                    >
                      error
                    </text>

                    {/* X-axis ticks (Valor de Referencia 0 to 100) */}
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val, idx) => {
                      const xPos = 55 + idx * 40;
                      return (
                        <g key={val}>
                          <line x1={xPos} y1="90" x2={xPos} y2="94" stroke="#475569" />
                          <text x={xPos} y="104" fontSize="8" textAnchor="middle" fill="#64748b">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis title */}
                    <text x="255" y="122" fontSize="8.5" textAnchor="middle" fill="#334155" fontWeight="bold">
                      Valor de Referencia
                    </text>

                    {/* Data Line & Plot Points */}
                    <path
                      d="M 135 91 L 215 91 L 295 91 L 375 91 L 435 91"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    {[
                      { x: 135, y: 91 },
                      { x: 215, y: 91 },
                      { x: 295, y: 91 },
                      { x: 375, y: 91 },
                      { x: 435, y: 91 },
                    ].map((pt, i) => (
                      <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Declaraciones Generales */}
              <div>
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-[10.5px] italic tracking-wider uppercase">
                  DECLARACIONES GENERALES DEL CERTIFICADO DE CALIBRACIÓN
                </div>

                <div className="mt-2 text-[9px] leading-tight text-slate-700 space-y-1 px-1">
                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      Esta calibración fue realizada empleando un método de comparación directa y siguiendo las indicaciones del procedimiento <span className="font-semibold text-slate-900">{cert.procedimientoCalibracion}</span>.
                    </p>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      <span className="font-semibold text-slate-900">Próxima calibración:</span> Es responsabilidad del cliente calibrar el instrumento en periodos adecuados de tiempo. La Vigencia mostrada fue solicitada por el cliente.
                    </p>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      La incertidumbre expandida de la medición se obtiene mediante un factor de cobertura cercano <span className="font-semibold text-slate-900">k= {cert.factorCoberturaK}</span> que asegura un nivel de confianza igual <span className="font-semibold text-slate-900">{cert.nivelConfianza}</span> y fue estimada de acuerdo a la norma NMX-CH-140-IMNC 2002 "Guía para la expresión de incertidumbre en las mediciones".
                    </p>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      El presente certificado de calibración ampara única y exclusivamente las mediciones realizadas al momento y bajo las condiciones ambientales mencionadas, este certificado perderá validez y respaldo por SIEM, si presenta alteraciones, enmendaduras o tachaduras en los resultados emitidos.
                    </p>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      Los resultados de este certificado de calibración son válidos únicamente para el instrumento indicado y bajo condiciones de referencia declaradas. Este certificado es única y exclusivamente válido en su estado original y completo; contando con las firmas de los responsables.
                    </p>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      <span className="font-semibold text-slate-900">Trazabilidad:</span> Los patrones utilizados por SIEM cuentan con trazabilidad a los patrones primarios del CENAM a través de laboratorios secundarios acreditados por la entidad mexicana de acreditación. Las unidades de medición están acordes al Sistema General de Unidades de Medida (SGUM); Sistema Internacional (SI).
                    </p>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-900">•</span>
                    <p>
                      <span className="font-semibold text-slate-900">Referencias técnicas:</span> NOM-008-SE-2021 - Sistema General de Unidades de Medida, NMX-CH-140-IMNC 2002 - Guía para la Expresión de la incertidumbre de las Mediciones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 2 Footer with Fin de Documento */}
            <div className="mt-4 border-t border-slate-300 pt-2 text-[9.5px] text-slate-600 space-y-0.5">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span className="uppercase tracking-wider">Fin de Documento</span>
                <span>Página: 2 de 2</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px] text-slate-500">
                <span>Codigo: {cert.codigoFormato}</span>
                <span className="italic font-medium">ucontreras@siemmx.com • Tel. (55) 34-86-59-79</span>
                <span>No de Revisión: {cert.noRevision}</span>
              </div>
              <p className="text-[8px] text-center text-slate-400">
                Av. Circunvalación Oriente Mz. 31 Lt. 10, Rio de Luz, CP. 55100, Ecatepec de Morelos, Estado de México.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};

