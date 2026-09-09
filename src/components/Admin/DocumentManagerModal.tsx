import React, { useState } from 'react';
import {
  FileText,
  Upload,
  X,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  FilePlus,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { ServiceOrder, OrderDocument, DocumentType } from '../../types';
import { formatBytes, generateSamplePdfDataUrl } from '../../utils/pdfGenerator';

interface DocumentManagerModalProps {
  order: ServiceOrder | null;
  documents: OrderDocument[];
  onClose: () => void;
  onAddDocument: (doc: Omit<OrderDocument, 'id' | 'uploadDate'>) => void;
  onDeleteDocument: (docId: string) => void;
  onReplaceDocument: (docId: string, newFileUrl: string, newSize: number, newName: string) => void;
  onViewPdf: (doc: OrderDocument) => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'Certificado de Calibración',
  'Informe Técnico',
  'Factura/Remisión',
  'Hoja de Datos',
  'Otro',
];

export const DocumentManagerModal: React.FC<DocumentManagerModalProps> = ({
  order,
  documents,
  onClose,
  onAddDocument,
  onDeleteDocument,
  onReplaceDocument,
  onViewPdf,
}) => {
  if (!order) return null;

  const orderDocs = documents.filter((d) => d.orderId === order.id);

  // Form State
  const [selectedTag, setSelectedTag] = useState<DocumentType>('Certificado de Calibración');
  const [customDocName, setCustomDocName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File Upload Handler (reads real local PDF file to DataURL)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    Array.from(files).forEach((file) => {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setUploadError('Únicamente se permiten archivos en formato PDF.');
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        onAddDocument({
          orderId: order.id,
          name: file.name,
          type: selectedTag,
          size: file.size,
          fileUrl,
          description: customDesc || `Documento ${selectedTag} cargado en sistema`,
          isSample: false,
        });
        setIsUploading(false);
        setCustomDocName('');
        setCustomDesc('');
      };
      reader.onerror = () => {
        setUploadError('Error al leer el archivo PDF.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate Sample Demo Certificate
  const handleGenerateSampleCert = () => {
    const docName = customDocName.trim()
      ? customDocName.endsWith('.pdf') ? customDocName : `${customDocName}.pdf`
      : `Certificado_${order.folio}_${Date.now().toString().slice(-4)}.pdf`;

    const sampleUrl = generateSamplePdfDataUrl(
      docName,
      order.folio,
      order.clientName,
      order.calibrationDate,
      selectedTag
    );

    onAddDocument({
      orderId: order.id,
      name: docName,
      type: selectedTag,
      size: Math.floor(250000 + Math.random() * 300000),
      fileUrl: sampleUrl,
      description: customDesc || `Certificado digital generado para ${order.clientName}`,
      isSample: true,
    });

    setCustomDocName('');
    setCustomDesc('');
  };

  // Replace Document
  const handleReplaceFile = (docId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onReplaceDocument(docId, event.target?.result as string, file.size, file.name);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/30 rounded-lg border border-indigo-500/30 text-indigo-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Gestor Documental de la Orden
                </h3>
                <span className="font-mono bg-indigo-500/30 text-indigo-200 text-xs px-2 py-0.5 rounded font-bold border border-indigo-400/30">
                  {order.folio}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cliente: <span className="font-semibold text-white">{order.clientName}</span> • Estatus: {order.status}
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
          {/* Section 1: Upload / Add PDF Form */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Cargar o Adjuntar Nuevo Certificado PDF</span>
              </h4>
              <span className="text-[11px] text-slate-500">Formatos permitidos: .PDF</span>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Classification Tag Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Etiqueta / Tipo de PDF *</span>
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional custom doc name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Personalizado (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Certificado_Calibracion_2026.pdf"
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Optional description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas / Incertidumbre
                </label>
                <input
                  type="text"
                  placeholder="ej. Trazabilidad CENAM / ISO 17025"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Drag & Drop Box or Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Upload real local file */}
              <label className="cursor-pointer border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 p-4 rounded-xl text-center transition flex flex-col items-center justify-center space-y-1.5 group">
                <Upload className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-indigo-900">
                  {isUploading ? 'Procesando PDF...' : 'Subir Archivo PDF Local'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Arrastre o seleccione su archivo PDF aquí
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  disabled={isUploading}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>

              {/* Generate Sample PDF for quick demo testing */}
              <button
                type="button"
                onClick={handleGenerateSampleCert}
                className="border-2 border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/50 p-4 rounded-xl text-center transition flex flex-col items-center justify-center space-y-1.5 group"
              >
                <FilePlus className="w-6 h-6 text-teal-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">
                  Generar Certificado Digital Demo
                </span>
                <span className="text-[10px] text-slate-500">
                  Crea un PDF válido formateado al instante
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: Uploaded Documents Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">
                Documentos Adjuntos en la Orden ({orderDocs.length})
              </h4>
              <span className="text-xs text-slate-500">
                Los clientes pueden previsualizar y descargar estos archivos en su portal.
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-sm">
              {orderDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100 shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-bold text-slate-900 truncate" title={doc.name}>
                          {doc.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Tamaño: {formatBytes(doc.size)} • Subido: {doc.uploadDate}
                      </p>
                      {doc.description && (
                        <p className="text-slate-600 text-[11px] italic">
                          "{doc.description}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onViewPdf(doc)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center space-x-1"
                      title="Visualizador Integrado"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ver PDF</span>
                    </button>

                    <button
                      onClick={() => handleReplaceFile(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-500 hover:text-amber-700 transition"
                      title="Reemplazar archivo PDF"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {orderDocs.length === 0 && (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold">
                    No hay documentos adjuntos en esta orden de servicio.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Utilice el formulario superior para subir o generar un certificado PDF.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Almacenamiento Seguro Acreditado para Auditoría de Metrología</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition"
          >
            Cerrar Gestor
          </button>
        </div>
      </div>
    </div>
  );
};
