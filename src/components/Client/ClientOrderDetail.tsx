import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  X,
  Archive,
  CheckCircle,
  Calendar,
  UserCheck,
  Building2,
  ShieldCheck,
  FileCheck2,
  Loader2,
  Printer,
  Award,
  Layers
} from 'lucide-react';
import JSZip from 'jszip';
import { ServiceOrder, OrderDocument, Client, EquipmentItem } from '../../types';
import { formatBytes } from '../../utils/pdfGenerator';
import { SiemServiceOrderModal } from '../SiemOfficial/SiemServiceOrderModal';
import { SiemCertificateModal } from '../SiemOfficial/SiemCertificateModal';

interface ClientOrderDetailProps {
  order: ServiceOrder | null;
  client: Client;
  documents: OrderDocument[];
  onClose: () => void;
  onViewPdf: (doc: OrderDocument) => void;
}

export const ClientOrderDetail: React.FC<ClientOrderDetailProps> = ({
  order,
  client,
  documents,
  onClose,
  onViewPdf,
}) => {
  if (!order) return null;

  const orderDocs = documents.filter((d) => d.orderId === order.id);
  const [isZipping, setIsZipping] = useState(false);

  // Official SIEM modals for client
  const [showSiemOrderModal, setShowSiemOrderModal] = useState(false);
  const [viewingCertificateEquipment, setViewingCertificateEquipment] = useState<EquipmentItem | null>(null);

  const handleDownloadSingle = (doc: OrderDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mass ZIP download of all attached PDFs in this order
  const handleDownloadZipMassive = async () => {
    if (orderDocs.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder(`Metrologia_${order.folio}`);

      for (const doc of orderDocs) {
        // Extract base64 data from data URL or fetch blob
        let base64Data = '';
        if (doc.fileUrl.startsWith('data:application/pdf;base64,')) {
          base64Data = doc.fileUrl.replace('data:application/pdf;base64,', '');
        } else {
          // Fetch blob and convert to base64
          const response = await fetch(doc.fileUrl);
          const blob = await response.blob();
          const buffer = await blob.arrayBuffer();
          folder?.file(doc.name, buffer);
          continue;
        }

        folder?.file(doc.name, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `Metrologia_Paquete_Certificados_${order.folio}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error('Error generating zip:', err);
      alert('Ocurrió un inconveniente al empaquetar el ZIP. Intentando descarga individual.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A6EA2] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg border border-white/20 text-white">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Detalle de Orden de Servicio
                </h3>
                <span className="font-mono bg-white/20 text-white text-xs px-2 py-0.5 rounded font-bold border border-white/30">
                  {order.folio}
                </span>
              </div>
              <p className="text-xs text-white/80">
                Empresa: <span className="font-semibold text-white">{client.razonSocial}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Order Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Estatus del Servicio
              </p>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                  order.status === 'En Proceso'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Fecha de Realización
              </p>
              <p className="font-bold text-slate-800 text-sm mt-1">{order.calibrationDate}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Técnico Responsable
              </p>
              <p className="font-bold text-slate-800 text-sm mt-1">{order.technicianName}</p>
            </div>

            <div className="sm:col-span-3 border-t border-slate-200/80 pt-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Equipos y Descripción del Servicio
              </p>
              <p className="text-slate-800 font-medium text-xs mt-0.5">{order.equipmentNotes}</p>
            </div>
          </div>

          {/* SIEM Official Metrology Documents & Certificates */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Documentación Oficial SIEM (ISO/IEC 17025)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Consulte la Orden de Recepción y los Certificados Oficiales con cálculo de incertidumbre y gráficos.
                </p>
              </div>

              <button
                onClick={() => setShowSiemOrderModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Ver Orden de Servicio Oficial</span>
              </button>
            </div>

            {/* List of Equipments with Certificates */}
            {order.equipments && order.equipments.length > 0 ? (
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Instrumentos Registrados ({order.equipments.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {order.equipments.map((eq, idx) => (
                    <div
                      key={eq.id || idx}
                      className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {eq.instrumento}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Serie: {eq.serie} • {eq.marca}
                        </p>
                      </div>

                      <button
                        onClick={() => setViewingCertificateEquipment(eq)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded transition flex items-center gap-1 shrink-0"
                        title="Ver Certificado F-7.2"
                      >
                        <Award className="w-3 h-3" />
                        <span>F-7.2 PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                Instrumentos registrados en proceso de recepción física.
              </p>
            )}
          </div>

          {/* Mass ZIP Download Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <h4 className="font-bold text-sm flex items-center space-x-2">
                <Archive className="w-4 h-4 text-emerald-400" />
                <span>Paquete de Certificados PDF (.ZIP)</span>
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Descargue todos los certificados e informes adjuntos a esta orden en un solo archivo comprimido.
              </p>
            </div>

            <button
              onClick={handleDownloadZipMassive}
              disabled={isZipping || orderDocs.length === 0}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-lg shadow transition flex items-center space-x-1.5 shrink-0"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Paquete ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Documentos Adjuntos ({orderDocs.length})
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {orderDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 truncate" title={doc.name}>
                          {doc.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Tamaño: {formatBytes(doc.size)} • Emisión: {doc.uploadDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onViewPdf(doc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ver en Pantalla</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSingle(doc)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow transition flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
                    </button>
                  </div>
                </div>
              ))}

              {orderDocs.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No hay certificados disponibles aún para esta orden de servicio.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Documentos Acreditados ISO/IEC 17025</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>

      {/* SIEM Official Modals */}
      {showSiemOrderModal && (
        <SiemServiceOrderModal
          order={order}
          onClose={() => setShowSiemOrderModal(false)}
        />
      )}

      {viewingCertificateEquipment && (
        <SiemCertificateModal
          order={order}
          equipment={viewingCertificateEquipment}
          onClose={() => setViewingCertificateEquipment(null)}
        />
      )}
    </div>
  );
};
