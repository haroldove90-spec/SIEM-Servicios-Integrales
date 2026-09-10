import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Calculator, Check, AlertCircle } from 'lucide-react';
import { EquipmentItem, ServiceOrder, CalibrationCertificateData, CalibrationPoint } from '../../types';

interface CalibrationEditorModalProps {
  order: ServiceOrder;
  equipment: EquipmentItem;
  onSaveCertificate: (updatedEquipment: EquipmentItem, certData: CalibrationCertificateData) => void;
  onClose: () => void;
}

export const CalibrationEditorModal: React.FC<CalibrationEditorModalProps> = ({
  order,
  equipment,
  onSaveCertificate,
  onClose,
}) => {
  const initialCert: CalibrationCertificateData = equipment.certificate || {
    id: 'cert-' + equipment.id + '-' + Date.now(),
    folioCertificado: `SIEM/1H/${new Date().getFullYear().toString().slice(-2)}`,
    magnitud: equipment.magnitud || 'Humedad',
    codigoFormato: 'F-7.2',
    noRevision: '1',
    lugarCalibracion: 'Calibración Realizada en las instalaciones de SIEM',
    fechaRecepcion: order.fechaRecepcion || order.calibrationDate || new Date().toISOString().split('T')[0],
    fechaCalibracion: order.calibrationDate || new Date().toISOString().split('T')[0],
    fechaEmision: new Date().toISOString().split('T')[0],
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
      { id: '1', referencia: 20.00, indicacionIbc: 19.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: '2', referencia: 40.00, indicacionIbc: 39.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: '3', referencia: 60.00, indicacionIbc: 59.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: '4', referencia: 80.00, indicacionIbc: 79.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
      { id: '5', referencia: 95.00, indicacionIbc: 94.99, error: -0.01, incertidumbreU: 0.70, unidad: '%HR' },
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

  const [formData, setFormData] = useState<CalibrationCertificateData>(initialCert);
  const [puntos, setPuntos] = useState<CalibrationPoint[]>(initialCert.puntos);
  const [resolution, setResolution] = useState<string>(equipment.resolucion || '0.01 %HR');

  const handlePointChange = (index: number, field: keyof CalibrationPoint, value: any) => {
    const updated = [...puntos];
    const current = { ...updated[index], [field]: value };

    // Auto-calculate error: indicacionIbc - referencia
    if (field === 'referencia' || field === 'indicacionIbc') {
      const ref = field === 'referencia' ? parseFloat(value) || 0 : current.referencia;
      const ibc = field === 'indicacionIbc' ? parseFloat(value) || 0 : current.indicacionIbc;
      current.error = parseFloat((ibc - ref).toFixed(3));
    }

    updated[index] = current;
    setPuntos(updated);
  };

  const handleAddPoint = () => {
    const lastPoint = puntos[puntos.length - 1];
    const newRef = lastPoint ? lastPoint.referencia + 10 : 10;
    const newPoint: CalibrationPoint = {
      id: Date.now().toString(),
      referencia: newRef,
      indicacionIbc: newRef,
      error: 0.00,
      incertidumbreU: lastPoint ? lastPoint.incertidumbreU : 0.70,
      unidad: lastPoint?.unidad || '%HR',
    };
    setPuntos([...puntos, newPoint]);
  };

  const handleRemovePoint = (index: number) => {
    if (puntos.length <= 1) return;
    setPuntos(puntos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCertData: CalibrationCertificateData = {
      ...formData,
      puntos,
    };
    const updatedEquipment: EquipmentItem = {
      ...equipment,
      resolucion: resolution,
      certificate: finalCertData,
    };
    onSaveCertificate(updatedEquipment, finalCertData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-5 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0A6EA2] text-white px-6 py-4 flex items-center justify-between border-b border-[#085a85]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
                Formato F-7.2
              </span>
              <h2 className="text-base font-bold">
                Captura de Certificado de Calibración
              </h2>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Equipo: <span className="text-white font-semibold">{equipment.instrumento}</span> ({equipment.marca} {equipment.modelo}, Serie: {equipment.serie})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh] space-y-6 text-xs text-slate-700">
          
          {/* Section 1: Identificación y Folio */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Identificación y Folio Oficial
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Folio Certificado</label>
                <input
                  type="text"
                  value={formData.folioCertificado}
                  onChange={(e) => setFormData({ ...formData, folioCertificado: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded font-mono font-bold text-slate-900 bg-white"
                  placeholder="ej. SIEM/1H/26"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Magnitud</label>
                <input
                  type="text"
                  value={formData.magnitud}
                  onChange={(e) => setFormData({ ...formData, magnitud: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded font-medium text-slate-900 bg-white"
                  placeholder="Humedad, Temperatura, etc."
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Resolución del IBC</label>
                <input
                  type="text"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded font-medium text-slate-900 bg-white"
                  placeholder="ej. 0.01 %HR"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">F. Recepción</label>
                <input
                  type="date"
                  value={formData.fechaRecepcion}
                  onChange={(e) => setFormData({ ...formData, fechaRecepcion: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">F. Calibración</label>
                <input
                  type="date"
                  value={formData.fechaCalibracion}
                  onChange={(e) => setFormData({ ...formData, fechaCalibracion: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">F. Emisión</label>
                <input
                  type="date"
                  value={formData.fechaEmision}
                  onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Orden de Trabajo</label>
                <input
                  type="text"
                  value={formData.ordenTrabajo}
                  onChange={(e) => setFormData({ ...formData, ordenTrabajo: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Condiciones Ambientales y Patrón Utilizado */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Condiciones Ambientales y Patrón de Referencia
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Temperatura Ambiental</label>
                <input
                  type="text"
                  value={formData.temperaturaAmbiente}
                  onChange={(e) => setFormData({ ...formData, temperaturaAmbiente: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                  placeholder="ej. 21.4 °C ± 0.5 °C"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Humedad Ambiental</label>
                <input
                  type="text"
                  value={formData.humedadAmbiente}
                  onChange={(e) => setFormData({ ...formData, humedadAmbiente: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                  placeholder="ej. 48.2 %HR ± 2.0 %HR"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label className="font-semibold block text-slate-700 mb-1">Patrón de Referencia</label>
                <input
                  type="text"
                  value={formData.patronDescripcion}
                  onChange={(e) => setFormData({ ...formData, patronDescripcion: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white font-medium"
                  placeholder="ej. Termohigrómetro Digital"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">ID Interno Patrón</label>
                <input
                  type="text"
                  value={formData.patronId}
                  onChange={(e) => setFormData({ ...formData, patronId: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white font-mono"
                  placeholder="ej. SIEM-AH-004"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Marca Patrón</label>
                <input
                  type="text"
                  value={formData.patronMarca}
                  onChange={(e) => setFormData({ ...formData, patronMarca: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Modelo Patrón</label>
                <input
                  type="text"
                  value={formData.patronModelo}
                  onChange={(e) => setFormData({ ...formData, patronModelo: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 mb-1">No. Certificado Patrón</label>
                <input
                  type="text"
                  value={formData.patronCertificado}
                  onChange={(e) => setFormData({ ...formData, patronCertificado: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white font-mono"
                  placeholder="ej. CAH-1245-26"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Trazabilidad CENAM/EMA</label>
                <input
                  type="text"
                  value={formData.patronTrazabilidad}
                  onChange={(e) => setFormData({ ...formData, patronTrazabilidad: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white font-mono"
                  placeholder="ej. H34"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Puntos de Calibración con Cálculo Automático de Error */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  Puntos de Medición (Cálculo Automático de Error)
                </h3>
                <p className="text-[11px] text-slate-500">
                  El <span className="font-semibold text-slate-800">Error de medida</span> se calcula automáticamente al instante: <em>Error = Indicación IBC - Valor de Referencia</em>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPoint}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Punto</span>
              </button>
            </div>

            <div className="overflow-x-auto border rounded bg-white">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b divide-x">
                    <th className="p-2 w-10">#</th>
                    <th className="p-2">Valor Referencia</th>
                    <th className="p-2">Indicación Promedio IBC</th>
                    <th className="p-2 bg-blue-50 text-blue-900">Error de Medida</th>
                    <th className="p-2">± U (Incertidumbre)</th>
                    <th className="p-2 w-12">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {puntos.map((pt, idx) => (
                    <tr key={pt.id || idx} className="divide-x hover:bg-slate-50/70">
                      <td className="p-2 font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          step="0.01"
                          value={pt.referencia}
                          onChange={(e) => handlePointChange(idx, 'referencia', e.target.value)}
                          className="w-24 text-center px-2 py-1 border rounded font-mono font-medium"
                          required
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          step="0.01"
                          value={pt.indicacionIbc}
                          onChange={(e) => handlePointChange(idx, 'indicacionIbc', e.target.value)}
                          className="w-24 text-center px-2 py-1 border rounded font-mono font-medium"
                          required
                        />
                      </td>
                      <td className="p-1.5 bg-blue-50/50 font-mono font-bold text-blue-900">
                        {pt.error >= 0 ? `+${pt.error.toFixed(2)}` : pt.error.toFixed(2)}
                      </td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          step="0.01"
                          value={pt.incertidumbreU}
                          onChange={(e) => handlePointChange(idx, 'incertidumbreU', parseFloat(e.target.value) || 0)}
                          className="w-24 text-center px-2 py-1 border rounded font-mono"
                          required
                        />
                      </td>
                      <td className="p-1.5">
                        <button
                          type="button"
                          onClick={() => handleRemovePoint(idx)}
                          disabled={puntos.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 transition"
                          title="Eliminar punto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Firmas y Personal Técnico */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Metrólogos Responsables (Firmas del Certificado)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 border p-3 rounded bg-white">
                <span className="font-bold text-slate-900 block text-xs uppercase text-blue-900">
                  Calibró
                </span>
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.calibroNombre}
                    onChange={(e) => setFormData({ ...formData, calibroNombre: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Puesto</label>
                  <input
                    type="text"
                    value={formData.calibroPuesto}
                    onChange={(e) => setFormData({ ...formData, calibroPuesto: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 border p-3 rounded bg-white">
                <span className="font-bold text-slate-900 block text-xs uppercase text-blue-900">
                  Autorizó
                </span>
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.autorizoNombre}
                    onChange={(e) => setFormData({ ...formData, autorizoNombre: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Puesto</label>
                  <input
                    type="text"
                    value={formData.autorizoPuesto}
                    onChange={(e) => setFormData({ ...formData, autorizoPuesto: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Certificado F-7.2</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
