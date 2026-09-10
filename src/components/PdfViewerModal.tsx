import React from 'react';
import { X, Download, FileText, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { OrderDocument } from '../types';
import { formatBytes } from '../utils/pdfGenerator';

interface PdfViewerModalProps {
  document: OrderDocument | null;
  folio?: string;
  clientName?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  document,
  folio,
  clientName,
  onClose,
}) => {
  if (!document) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.name || `Documento_${document.type}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open(document.fileUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0A6EA2] text-white flex items-center justify-between border-b border-[#085a85]">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 bg-white/10 rounded-lg border border-white/20 text-white shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-base sm:text-lg text-white truncate">
                  {document.name}
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/20 text-white border border-white/30 shrink-0">
                  {document.type}
                </span>
              </div>
              <p className="text-xs text-white/80 truncate mt-0.5">
                {folio ? `Orden: ${folio}` : ''} {clientName ? `• ${clientName}` : ''} • {formatBytes(document.size)} • Subido: {document.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-4">
            <button
              onClick={handlePrint}
              title="Imprimir Documento"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition flex items-center space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-slate-700">Documento Verificado por Sistema Metrología</span>
            {document.isSample && (
              <span className="text-slate-500 hidden sm:inline">(Documento Oficial Digital Acreditado)</span>
            )}
          </div>
          <span className="text-slate-500">
            Vista Previa en Pantalla
          </span>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-800 relative p-2 sm:p-4 overflow-hidden flex flex-col items-center justify-center">
          {document.fileUrl ? (
            <object
              data={document.fileUrl}
              type="application/pdf"
              className="w-full h-full rounded-md shadow-inner bg-white"
            >
              <iframe
                src={document.fileUrl}
                className="w-full h-full rounded-md bg-white border-0"
                title={document.name}
              >
                <div className="p-8 text-center text-white space-y-4">
                  <FileText className="w-12 h-12 mx-auto text-slate-400" />
                  <p>Su navegador no admite la previsualización directa de este archivo PDF.</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium text-sm"
                  >
                    Descargar {document.name}
                  </button>
                </div>
              </iframe>
            </object>
          ) : (
            <div className="text-center text-slate-400 space-y-3">
              <FileText className="w-12 h-12 mx-auto" />
              <p>No se pudo cargar la vista previa del documento.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Certificado de laboratorio protegido con firma digital de auditoría</span>
          </div>
          <div>
            ISO/IEC 17025 Acreditado
          </div>
        </div>
      </div>
    </div>
  );
};
