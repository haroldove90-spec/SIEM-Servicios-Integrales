export type UserRole = 'admin' | 'client';

export type OrderStatus = 'En Proceso' | 'Completada' | 'Entregada';

export type DocumentType = 
  | 'Certificado de Calibración'
  | 'Informe Técnico'
  | 'Factura/Remisión'
  | 'Hoja de Datos'
  | 'Orden de Servicio'
  | 'Otro';

export interface CalibrationPoint {
  id: string;
  referencia: number;     // Valor de Referencia (ej. %HR, °C, etc.)
  indicacionIbc: number;  // Indicación Promedio del IBC
  error: number;          // Error de medida = indicacionIbc - referencia
  incertidumbreU: number; // ± U (ej. 0.70)
  unidad?: string;        // %HR, °C, bar, etc.
}

export interface CalibrationCertificateData {
  id: string;
  folioCertificado: string; // ej. SIEM/1H/26
  magnitud: string;         // ej. Humedad, Temperatura, Presión
  codigoFormato: string;    // F-7.2
  noRevision: string;       // 1
  lugarCalibracion: string; // ej. "Calibración Realizada en las instalaciones de SIEM"
  fechaRecepcion: string;
  fechaCalibracion: string;
  fechaEmision: string;
  ordenTrabajo: string;
  temperaturaAmbiente: string; // ej. "21.4 °C ± 0.5 °C"
  humedadAmbiente: string;     // ej. "48.2 %HR ± 2.0 %HR"
  // Patrón de referencia utilizado
  patronDescripcion: string;  // ej. "Termohigrómetro Digital"
  patronMarca: string;        // ej. "Vaisala"
  patronModelo: string;       // ej. "HMP76 / MI70"
  patronSerie: string;        // ej. "P2720442 / P2510005"
  patronId: string;           // ej. "SIEM-AH-004"
  patronCertificado: string;  // ej. "CAH-1245-26"
  patronVigencia: string;     // ej. "2027-07"
  patronTrazabilidad: string; // ej. "H34"
  // Puntos de medición
  puntos: CalibrationPoint[];
  // Personal técnico
  calibroNombre: string;      // ej. "Ing. Cristian Ulises Contreras H."
  calibroPuesto: string;      // ej. "Metrólogo"
  autorizoNombre: string;     // ej. "Ing. Raul Hernandez Vicente"
  autorizoPuesto: string;     // ej. "Metrólogo"
  procedimientoCalibracion: string; // ej. "Procedimiento de Calibración para Humedad P-7.2.2"
  factorCoberturaK: number;   // 2
  nivelConfianza: string;     // "95.45%"
  normaReferencia: string;    // ej. "NOM-008-SE-2021, NMX-CH-140-IMNC 2002"
}

export interface EquipmentItem {
  id: string;
  no: number;
  instrumento: string; // ej. "Termohigrómetro Digital"
  marca: string;       // ej. "Vaisala"
  modelo: string;      // ej. "HMP76 / MI70"
  serie: string;       // ej. "P2720442"
  idInterno: string;   // ej. "IBC-004" o "SIEM-AH-004"
  vigencia: string;    // ej. "1 año" o "2027-07"
  servicio: string;    // ej. "Calibración"
  magnitud: string;    // ej. "Humedad", "Temperatura", "Presión"
  resolucion?: string; // ej. "0.01 %HR"
  observaciones?: string;
  certificate?: CalibrationCertificateData;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  clientId?: string; // Set if user is a client
  position?: string;
  phone?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  razonSocial: string;
  rfc: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  username: string;
  passwordHash: string; // Stored password in plain/masked for demo display
  active: boolean;
  createdAt: string;
  notes?: string;
}

export interface OrderDocument {
  id: string;
  orderId: string;
  name: string;
  type: DocumentType;
  size: number; // in bytes
  uploadDate: string;
  fileUrl: string; // Data URL or Blob URL or sample Data URL
  isSample?: boolean;
  description?: string;
}

export interface ServiceOrder {
  id: string;
  folio: string; // e.g. ORD-2026-001 o SIEM-OS-001
  elaboro?: string; // e.g. "Ing. Cristian Ulises Contreras"
  fechaRecepcion?: string;
  fechaEntrega?: string;
  clientId: string;
  clientName: string;
  clientRfc: string;
  clientPhone?: string;
  clientContact?: string;
  clientEmail?: string;
  clientAddress?: string;
  // Datos específicos del certificado si difieren
  certRazonSocial?: string;
  certDireccion?: string;
  // Instrumentos
  equipments?: EquipmentItem[];
  observacionesGenerales?: string;
  recibidoPor?: string;
  fechaFirmaRecibido?: string;
  // Propiedades anteriores
  calibrationDate: string;
  status: OrderStatus;
  equipmentNotes: string;
  technicianName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface DashboardMetrics {
  totalOrdersThisMonth: number;
  activeOrders: number;
  completedOrders: number;
  deliveredOrders: number;
  totalDocuments: number;
  totalClients: number;
  totalEquipmentsCalibrated?: number;
}

