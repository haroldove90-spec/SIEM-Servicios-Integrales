import React, { useState } from 'react';
import { Printer, Download, X, FileSpreadsheet, Edit3, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs">
      {/* Modal Shell */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 print:border-none print:shadow-none print:m-0 print:p-0">
        
        {/* Top toolbar (hidden in print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between print:hidden sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
              F-7.2 Rev. 1
            </span>
            <span className="text-sm font-semibold">
              Certificado Oficial: {cert.folioCertificado}
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              ({equipment.instrumento} - {equipment.serie})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEditor && (
              <button
                onClick={onOpenEditor}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Editar Datos</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
              title="Exportar puntos a CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded shadow-xs transition"
              title="Imprimir las 2 páginas o guardar en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-page printable canvas */}
        <div className="p-4 sm:p-8 bg-slate-100 print:bg-white overflow-x-auto space-y-8 print:space-y-0 print:p-0">
          
          {/* ======================================================== */}
          {/* PÁGINA 1: IDENTIFICACIÓN, CONDICIONES, PATRONES Y FIRMAS */}
          {/* ======================================================== */}
          <div className="w-[794px] min-h-[1123px] mx-auto bg-white p-8 sm:p-12 shadow-lg border border-slate-200 flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:min-h-screen print:page-break-after-always">
            
            <div>
              {/* Header: Logo and Titles */}
              <div className="flex items-start justify-between border-b pb-4">
                <SiemLogo className="h-16" />
                
                <div className="text-right">
                  <h1 className="text-xl font-bold italic tracking-wide text-slate-900 uppercase font-serif">
                    CERTIFICADO DE CALIBRACIÓN
                  </h1>
                  <h2 className="text-base font-bold italic text-slate-800 mt-1">
                    Magnitud {cert.magnitud}
                  </h2>
                  <div className="text-base font-black text-slate-900 tracking-wider mt-1">
                    {cert.folioCertificado}
                  </div>
                </div>
              </div>

              {/* Client info */}
              <div className="mt-5 space-y-1 text-xs">
                <div className="flex">
                  <span className="w-24 font-bold text-slate-900">Nombre :</span>
                  <span className="font-semibold text-slate-800">{order.certRazonSocial || order.clientName}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-bold text-slate-900">Dirección:</span>
                  <span className="text-slate-700">{order.certDireccion || order.clientAddress || 'Dirección de la empresa registrada en orden'}</span>
                </div>
              </div>

              {/* Section 1: Instrument Description */}
              <div className="mt-6">
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-xs italic tracking-wider uppercase">
                  DESCRIPCIÓN DEL INSTRUMENTO BAJO CALIBRACIÓN
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-xs">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-900">Instrumento:</span>
                    <span className="text-slate-800">{equipment.instrumento}</span>
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
              <div className="mt-6">
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-xs italic tracking-wider">
                  {cert.lugarCalibracion}
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-xs">
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
              <div className="mt-6">
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-xs italic tracking-wider uppercase">
                  CONDICIONES AMBIENTALES DE MEDICIÓN:
                </div>

                <div className="grid grid-cols-2 gap-8 mt-3 text-xs text-center">
                  <div className="border-b border-slate-300 pb-1">
                    <span className="font-bold block text-slate-900">Temperatura</span>
                    <span className="text-slate-700 font-medium">{cert.temperaturaAmbiente}</span>
                  </div>
                  <div className="border-b border-slate-300 pb-1">
                    <span className="font-bold block text-slate-900">Humedad</span>
                    <span className="text-slate-700 font-medium">{cert.humedadAmbiente}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Patrones Utilizados */}
              <div className="mt-6">
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-xs italic tracking-wider uppercase">
                  PATRONES UTILIZADOS DURANTE LA CALIBRACIÓN
                </div>

                <div className="mt-4 text-center text-xs italic text-slate-800 leading-relaxed px-4">
                  {cert.patronDescripcion}, Marca: {cert.patronMarca}, Modelo: {cert.patronModelo}, Serie: {cert.patronSerie}, ID: {cert.patronId}, Certificado: {cert.patronCertificado}, Vigencia: {cert.patronVigencia}, Trazabilidad: {cert.patronTrazabilidad}
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-14 grid grid-cols-2 gap-16 text-center text-xs">
                <div>
                  <div className="h-10"></div>
                  <div className="border-t border-slate-900 pt-1">
                    <span className="font-bold block text-slate-900 text-xs">
                      {cert.calibroNombre}
                    </span>
                    <span className="text-[11px] italic text-slate-600 block">
                      {cert.calibroPuesto}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mt-1 block">
                      Calibró
                    </span>
                  </div>
                </div>

                <div>
                  <div className="h-10"></div>
                  <div className="border-t border-slate-900 pt-1">
                    <span className="font-bold block text-slate-900 text-xs">
                      {cert.autorizoNombre}
                    </span>
                    <span className="text-[11px] italic text-slate-600 block">
                      {cert.autorizoPuesto}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mt-1 block">
                      Autorizó
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Footer */}
            <div className="mt-8 border-t border-slate-200 pt-3 text-[10px] text-slate-600 text-center space-y-0.5">
              <div className="flex justify-between items-center text-[10px]">
                <span>Codigo: {cert.codigoFormato}</span>
                <span className="italic">ucontreras@siemmx.com</span>
                <span className="font-semibold">Página: 1 de 2</span>
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-500">
                <span>No de Revisión: {cert.noRevision}</span>
                <span>Av. Circunvalación Oriente Mz. 31 Lt. 10, Rio de Luz, CP. 55100, Ecatepec de Morelos, Edo. de México. Tel. (55) 34-86-59-79</span>
                <span></span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* PÁGINA 2: RESULTADOS DE LA CALIBRACIÓN, GRÁFICA Y NORMAS */}
          {/* ======================================================== */}
          <div className="w-[794px] min-h-[1123px] mx-auto bg-white p-8 sm:p-12 shadow-lg border border-slate-200 flex flex-col justify-between print:shadow-none print:border-none print:p-8 print:min-h-screen">
            
            <div>
              {/* Header Bar */}
              <div className="bg-[#386b99] text-white py-1.5 px-4 text-center font-bold text-sm italic tracking-wider uppercase">
                RESULTADOS DE LA CALIBRACIÓN
              </div>

              <div className="text-center font-bold text-sm text-slate-900 mt-2">
                {cert.folioCertificado}
              </div>

              {/* Calibration Points Table (Exact reproduction of PDF format) */}
              <div className="mt-4 flex justify-center">
                <table className="w-[520px] text-center border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-[#eef4fa] font-bold text-slate-900 divide-x divide-slate-900 border-b border-slate-900">
                      <th className="p-1.5 w-1/4">Valor de Referencia</th>
                      <th className="p-1.5 w-1/4">Indicación Promedio<br/>del IBC</th>
                      <th className="p-1.5 w-1/4">Error de medida</th>
                      <th className="p-1.5 w-1/4">± U</th>
                    </tr>
                    <tr className="bg-[#eef4fa] font-bold text-slate-700 divide-x divide-slate-900 border-b border-slate-900 text-[10px]">
                      <th className="p-0.5">%HR</th>
                      <th className="p-0.5">%HR</th>
                      <th className="p-0.5">%HR</th>
                      <th className="p-0.5">%HR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {cert.puntos.map((p, idx) => (
                      <tr key={p.id || idx} className="divide-x divide-slate-900 font-mono text-[11px]">
                        <td className="p-1">{p.referencia.toFixed(2)}</td>
                        <td className="p-1">{p.indicacionIbc.toFixed(2)}</td>
                        <td className="p-1 font-semibold">{p.error >= 0 ? `+${p.error.toFixed(2)}` : p.error.toFixed(2)}</td>
                        <td className="p-1">{p.incertidumbreU.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calibration Curve Graph (Exact reproduction of PDF box) */}
              <div className="mt-6 flex flex-col items-center">
                <div className="w-[520px] border border-slate-300 rounded p-3 bg-white shadow-xs">
                  <div className="text-center text-xs font-semibold text-slate-800 mb-2">
                    Resultados de calibración del IBC
                  </div>

                  {/* SVG Chart */}
                  <svg viewBox="0 0 480 180" className="w-full h-auto">
                    {/* Gridlines horizontal */}
                    <line x1="45" y1="20" x2="460" y2="20" stroke="#e2e8f0" strokeDasharray="2" />
                    <line x1="45" y1="50" x2="460" y2="50" stroke="#e2e8f0" strokeDasharray="2" />
                    <line x1="45" y1="80" x2="460" y2="80" stroke="#e2e8f0" strokeDasharray="2" />
                    <line x1="45" y1="110" x2="460" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="45" y1="140" x2="460" y2="140" stroke="#e2e8f0" strokeDasharray="2" />

                    {/* Y-axis labels (Error) */}
                    <text x="40" y="24" fontSize="9" textAnchor="end" fill="#64748b">1.00</text>
                    <text x="40" y="54" fontSize="9" textAnchor="end" fill="#64748b">0.70</text>
                    <text x="40" y="84" fontSize="9" textAnchor="end" fill="#64748b">0.40</text>
                    <text x="40" y="114" fontSize="9" textAnchor="end" fill="#64748b" fontWeight="bold">0.00</text>
                    <text x="40" y="144" fontSize="9" textAnchor="end" fill="#64748b">-0.50</text>

                    {/* Y-axis title rotated */}
                    <text
                      x="-85"
                      y="14"
                      transform="rotate(-90)"
                      fontSize="9"
                      textAnchor="middle"
                      fill="#475569"
                      fontWeight="bold"
                    >
                      error
                    </text>

                    {/* X-axis ticks (Valor de Referencia 0 to 100) */}
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val, idx) => {
                      const xPos = 60 + idx * 38;
                      return (
                        <g key={val}>
                          <line x1={xPos} y1="110" x2={xPos} y2="114" stroke="#475569" />
                          <text x={xPos} y="126" fontSize="8.5" textAnchor="middle" fill="#64748b">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis title */}
                    <text x="250" y="146" fontSize="9" textAnchor="middle" fill="#475569" fontWeight="bold">
                      Valor de Referencia
                    </text>

                    {/* Data Line & Plot Points */}
                    {/* Error = -0.01 at 20, 40, 60, 80, 95 */}
                    <path
                      d="M 136 111 L 212 111 L 288 111 L 364 111 L 421 111"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    {[
                      { x: 136, y: 111 },
                      { x: 212, y: 111 },
                      { x: 288, y: 111 },
                      { x: 364, y: 111 },
                      { x: 421, y: 111 },
                    ].map((pt, i) => (
                      <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Declaraciones Generales (exact words from user's PDF) */}
              <div className="mt-5">
                <div className="bg-[#386b99] text-white py-1 px-4 text-center font-bold text-xs italic tracking-wider uppercase">
                  DECLARACIONES GENERALES DEL CERTIFICADO DE CALIBRACIÓN
                </div>

                <div className="mt-3 text-[9.5px] leading-snug text-slate-700 space-y-1.5 px-2">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      Esta calibración fue realizada empleando un método de comparación directa y siguiendo las indicaciones del procedimiento <span className="font-semibold text-slate-900">{cert.procedimientoCalibracion}</span>.
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      <span className="font-semibold text-slate-900">Próxima calibración:</span> Es responsabilidad del cliente calibrar el instrumento en periodos adecuados de tiempo. La Vigencia mostrada fue solicitada por el cliente.
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      La incertidumbre expandida de la medición se obtiene mediante un factor de cobertura cercano <span className="font-semibold text-slate-900">k= {cert.factorCoberturaK}</span> que asegura un nivel de confianza igual <span className="font-semibold text-slate-900">{cert.nivelConfianza}</span> y fue estimada de acuerdo a la norma NMX-CH-140-IMNC 2002 "Guía para la expresión de incertidumbre en las mediciones".
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      El presente certificado de calibración ampara única y exclusivamente las mediciones realizadas al momento y bajo las condiciones ambientales mencionadas, este certificado perderá validez y respaldo por SIEM, si presenta alteraciones, enmendaduras o tachaduras en los resultados emitidos.
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      Los resultados de este certificado de calibración son válidos únicamente para el instrumento indicado y bajo condiciones de referencia declaradas. Este certificado es única y exclusivamente válido en su estado original y completo; contando con las firmas de los responsables.
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      <span className="font-semibold text-slate-900">Trazabilidad:</span> Los patrones utilizados por SIEM cuentan con trazabilidad a los patrones primarios del CENAM a través de laboratorios secundarios acreditados por la entidad mexicana de acreditación. Las unidades de medición están acordes al Sistema General de Unidades de Medida (SGUM); Sistema Internacional (SI).
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <p>
                      <span className="font-semibold text-slate-900">Referencias técnicas:</span> NOM-008-SE-2021 - Sistema General de Unidades de Medida, NMX-CH-140-IMNC 2002 - Guía para la Expresión de la incertidumbre de las Mediciones, Guía Técnica de Trazabilidad Metrológica e Incertidumbre de Medida en la Calibración de Higrómetros de Humedad Relativa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 2 Footer with Fin de Documento */}
            <div className="mt-6 border-t border-slate-200 pt-3 text-[10px] text-slate-600 space-y-1">
              <div className="flex justify-between items-center font-bold text-[10px] text-slate-800">
                <span>Fin de Documento</span>
                <span>Página: 2 de 2</span>
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-500">
                <span>Codigo: {cert.codigoFormato}</span>
                <span className="italic">ucontreras@siemmx.com • Tel. (55) 34-86-59-79</span>
                <span>No de Revisión: {cert.noRevision}</span>
              </div>
              <p className="text-[8.5px] text-center text-slate-400">
                Av. Circunvalación Oriente Mz. 31 Lt. 10, Rio de Luz, CP. 55100, Ecatepec de Morelos, Estado de México.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
