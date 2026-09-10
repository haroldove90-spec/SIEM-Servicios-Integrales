import { User, Client, ServiceOrder, OrderDocument, AuditLog } from '../types';
import { generateSamplePdfDataUrl } from '../utils/pdfGenerator';

export const INITIAL_ADMIN_USERS: User[] = [
  {
    id: 'user-admin-ulises',
    name: 'Ulises Contreras',
    email: 'ucontreras@siemmx.com',
    username: 'ucontreras',
    password: 'Cuch#960303',
    role: 'admin',
    position: 'Líder de Metrología / Admin SIEM',
    phone: '81-1982-3344'
  },
  {
    id: 'user-admin-harold',
    name: 'Harold Anguiano Morales',
    email: 'haroldo90@hotmail.com',
    username: 'haroldo90',
    password: 'Chevropar#1970',
    role: 'admin',
    position: 'Administrador Metrología SIEM',
    phone: '81-1823-9901'
  },
  {
    id: 'user-admin-1',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@metrologia.com.mx',
    username: 'carlos.m',
    password: 'siem2026password',
    role: 'admin',
    position: 'Técnico de Masa y Presión',
    phone: '81-1823-9901'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-001',
    razonSocial: 'Industrias Automotrices del Norte S.A. de C.V.',
    rfc: 'IAN880315KH4',
    contactName: 'Ing. Roberto Garza',
    email: 'rgarza@autonorte.com.mx',
    phone: '81-8123-4567',
    address: 'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.',
    username: 'autonorte',
    passwordHash: 'auto2026pass',
    active: true,
    createdAt: '2025-11-10',
    notes: 'Cliente prioritario de calibración dimensional y torque.'
  },
  {
    id: 'client-002',
    razonSocial: 'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
    rfc: 'LFB9506209A3',
    contactName: 'Dra. Patricia Solís',
    email: 'psolis@biomedlabs.com.mx',
    phone: '55-5678-1234',
    address: 'Calzada de los Leones #450, Col. Las Águilas, CDMX',
    username: 'biomed',
    passwordHash: 'biomed2026pass',
    active: true,
    createdAt: '2026-01-15',
    notes: 'Requiere certificados con trazabilidad ISO/IEC 17025 para COFEPRIS.'
  },
  {
    id: 'client-003',
    razonSocial: 'Metalúrgica Mexicana de Calidad S.A.',
    rfc: 'MMC021110TX8',
    contactName: 'Ing. Héctor Ramírez',
    email: 'hramirez@metalurgica.com',
    phone: '444-820-9900',
    address: 'Zona Industrial Lote 14, San Luis Potosí, S.L.P.',
    username: 'metalurgica',
    passwordHash: 'metal2026pass',
    active: true,
    createdAt: '2026-03-02',
    notes: 'Calibración semestral de manómetros de alta presión y celdas de carga.'
  }
];

export const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'order-siem-001',
    folio: 'SIEM-OS-2026-001',
    elaboro: 'Ing. Cristian Ulises Contreras H.',
    fechaRecepcion: '2026-09-07',
    fechaEntrega: '2026-09-12',
    clientId: 'client-002',
    clientName: 'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
    clientRfc: 'LFB9506209A3',
    clientPhone: '55-5678-1234',
    clientContact: 'Dra. Patricia Solís',
    clientEmail: 'psolis@biomedlabs.com.mx',
    clientAddress: 'Calzada de los Leones #450, Col. Las Águilas, CDMX',
    certRazonSocial: 'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
    certDireccion: 'Planta Industrial Norte, Eje Central #102, CDMX',
    observacionesGenerales: 'Equipo entregado con estuche original rígido y sonda de medición. Calibración directa de alta precisión.',
    recibidoPor: 'Ing. Cristian Ulises Contreras H.',
    fechaFirmaRecibido: '2026-09-07',
    calibrationDate: '2026-09-07',
    status: 'Completada',
    equipmentNotes: 'Termohigrómetro Digital Vaisala HMP76 / MI70 para cuartos limpios.',
    technicianName: 'Ing. Cristian Ulises Contreras H.',
    createdAt: '2026-09-07',
    updatedAt: '2026-09-08',
    equipments: [
      {
        id: 'eq-siem-01',
        no: 1,
        instrumento: 'Termohigrómetro Digital',
        marca: 'Vaisala',
        modelo: 'HMP76 / MI70',
        serie: 'P2720442 / P2510005',
        idInterno: 'SIEM-AH-004',
        vigencia: '2027-07',
        servicio: 'Calibración',
        magnitud: 'Humedad',
        resolucion: '0.01 %HR',
        observaciones: 'Condiciones óptimas sin daño físico en sensor.',
        certificate: {
          id: 'cert-siem-01',
          folioCertificado: 'SIEM/1H/26',
          magnitud: 'Humedad',
          codigoFormato: 'F-7.2',
          noRevision: '1',
          lugarCalibracion: 'Calibración Realizada en las instalaciones de SIEM',
          fechaRecepcion: '2026-09-07',
          fechaCalibracion: '2026-09-07',
          fechaEmision: '2026-09-08',
          ordenTrabajo: 'SIEM-OS-2026-001',
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
        }
      }
    ]
  },
  {
    id: 'order-001',
    folio: 'ORD-2026-001',
    elaboro: 'Ulises Martínez',
    fechaRecepcion: '2026-07-12',
    fechaEntrega: '2026-07-16',
    clientId: 'client-001',
    clientName: 'Industrias Automotrices del Norte S.A. de C.V.',
    clientRfc: 'IAN880315KH4',
    clientPhone: '81-8123-4567',
    clientContact: 'Ing. Roberto Garza',
    clientEmail: 'rgarza@autonorte.com.mx',
    clientAddress: 'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.',
    calibrationDate: '2026-07-15',
    status: 'Entregada',
    equipmentNotes: 'Calibración de 4 Calibradores Pie de Rey Mitutoyo 0-150mm y 2 Micrómetros de Exteriores.',
    technicianName: 'Ulises Martínez',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-16',
    equipments: [
      {
        id: 'eq-001',
        no: 1,
        instrumento: 'Calibrador Pie de Rey Digital',
        marca: 'Mitutoyo',
        modelo: '500-196-30',
        serie: '21045991',
        idInterno: 'CAL-MIT-01',
        vigencia: '1 año',
        servicio: 'Calibración',
        magnitud: 'Dimensional',
        resolucion: '0.01 mm',
        observaciones: 'Desplazamiento suave, baterías nuevas.',
      },
      {
        id: 'eq-002',
        no: 2,
        instrumento: 'Micrómetro de Exteriores',
        marca: 'Mitutoyo',
        modelo: '293-240-30',
        serie: '18392011',
        idInterno: 'MIC-EXT-02',
        vigencia: '1 año',
        servicio: 'Calibración',
        magnitud: 'Dimensional',
        resolucion: '0.001 mm',
        observaciones: 'Con barra de ajuste y llave de trinquete.',
      }
    ]
  },
  {
    id: 'order-002',
    folio: 'ORD-2026-002',
    elaboro: 'Ana Laura Torres',
    fechaRecepcion: '2026-07-18',
    fechaEntrega: '2026-07-21',
    clientId: 'client-002',
    clientName: 'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
    clientRfc: 'LFB9506209A3',
    clientPhone: '55-5678-1234',
    clientContact: 'Dra. Patricia Solís',
    clientEmail: 'psolis@biomedlabs.com.mx',
    clientAddress: 'Calzada de los Leones #450, Col. Las Águilas, CDMX',
    calibrationDate: '2026-07-20',
    status: 'Completada',
    equipmentNotes: 'Calibración de Balanza Analítica Mettler Toledo MS204TS y Termo-higrómetro Vaisala HMT330.',
    technicianName: 'Ana Laura Torres',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-21',
    equipments: [
      {
        id: 'eq-003',
        no: 1,
        instrumento: 'Balanza Analítica',
        marca: 'Mettler Toledo',
        modelo: 'MS204TS',
        serie: 'B91823901',
        idInterno: 'BAL-MET-01',
        vigencia: '6 meses',
        servicio: 'Calibración',
        magnitud: 'Masa',
        resolucion: '0.1 mg',
        observaciones: 'Nivel óptimo, platillo en buenas condiciones.',
      }
    ]
  },
  {
    id: 'order-003',
    folio: 'ORD-2026-003',
    elaboro: 'Carlos Méndez',
    fechaRecepcion: '2026-07-25',
    fechaEntrega: '2026-07-29',
    clientId: 'client-001',
    clientName: 'Industrias Automotrices del Norte S.A. de C.V.',
    clientRfc: 'IAN880315KH4',
    clientPhone: '81-8123-4567',
    clientContact: 'Ing. Roberto Garza',
    clientEmail: 'rgarza@autonorte.com.mx',
    clientAddress: 'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.',
    calibrationDate: '2026-07-26',
    status: 'En Proceso',
    equipmentNotes: 'Calibración de Torquímetros Digitales Snap-On 10-100 Nm (Línea de Ensamble 3).',
    technicianName: 'Carlos Méndez',
    createdAt: '2026-07-25',
    updatedAt: '2026-07-26',
    equipments: [
      {
        id: 'eq-004',
        no: 1,
        instrumento: 'Torquímetro Digital',
        marca: 'Snap-On',
        modelo: 'ATECH2CS100',
        serie: 'SN-90123',
        idInterno: 'TORQ-SNAP-01',
        vigencia: '1 año',
        servicio: 'Calibración',
        magnitud: 'Torque',
        resolucion: '0.1 Nm',
        observaciones: 'En proceso de toma de puntos.',
      }
    ]
  },
  {
    id: 'order-004',
    folio: 'ORD-2026-004',
    elaboro: 'Ulises Martínez',
    fechaRecepcion: '2026-07-08',
    fechaEntrega: '2026-07-11',
    clientId: 'client-003',
    clientName: 'Metalúrgica Mexicana de Calidad S.A.',
    clientRfc: 'MMC021110TX8',
    clientPhone: '444-820-9900',
    clientContact: 'Ing. Héctor Ramírez',
    clientEmail: 'hramirez@metalurgica.com',
    clientAddress: 'Zona Industrial Lote 14, San Luis Potosí, S.L.P.',
    calibrationDate: '2026-07-10',
    status: 'Entregada',
    equipmentNotes: 'Inspección y Calibración de Manómetros de Alta Presión WIKA (0-700 bar).',
    technicianName: 'Ulises Martínez',
    createdAt: '2026-07-08',
    updatedAt: '2026-07-11',
    equipments: [
      {
        id: 'eq-005',
        no: 1,
        instrumento: 'Manómetro de Alta Presión',
        marca: 'WIKA',
        modelo: '232.50',
        serie: 'WIK-771234',
        idInterno: 'MAN-WIK-01',
        vigencia: '1 año',
        servicio: 'Calibración',
        magnitud: 'Presión',
        resolucion: '5 bar',
        observaciones: 'Glicerina limpia, conexión 1/2 NPT.',
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: OrderDocument[] = [
  {
    id: 'doc-001',
    orderId: 'order-001',
    name: 'Certificado_Calibracion_PieDeRey_Mitutoyo.pdf',
    type: 'Certificado de Calibración',
    size: 425100, // ~415 KB
    uploadDate: '2026-07-15 14:30',
    fileUrl: generateSamplePdfDataUrl('Certificado Pie de Rey Mitutoyo', 'ORD-2026-001', 'Industrias Automotrices del Norte', '2026-07-15', 'Certificado de Calibración'),
    isSample: true,
    description: 'Certificado con patrón acreditado CENAM para instrumentos dimensionales.'
  },
  {
    id: 'doc-002',
    orderId: 'order-001',
    name: 'Informe_Tecnico_Inspeccion_001.pdf',
    type: 'Informe Técnico',
    size: 280400,
    uploadDate: '2026-07-15 15:00',
    fileUrl: generateSamplePdfDataUrl('Informe Técnico de Tolerancias', 'ORD-2026-001', 'Industrias Automotrices del Norte', '2026-07-15', 'Informe Técnico'),
    isSample: true,
    description: 'Reporte de errores máximos permisibles y repetibilidad.'
  },
  {
    id: 'doc-003',
    orderId: 'order-001',
    name: 'Factura_Remision_F-8821.pdf',
    type: 'Factura/Remisión',
    size: 195000,
    uploadDate: '2026-07-16 09:15',
    fileUrl: generateSamplePdfDataUrl('Remisión de Servicio F-8821', 'ORD-2026-001', 'Industrias Automotrices del Norte', '2026-07-16', 'Factura/Remisión'),
    isSample: true
  },
  {
    id: 'doc-004',
    orderId: 'order-002',
    name: 'Certificado_Balanza_Analitica_MS204TS.pdf',
    type: 'Certificado de Calibración',
    size: 512000,
    uploadDate: '2026-07-20 16:45',
    fileUrl: generateSamplePdfDataUrl('Certificado Balanza Analítica', 'ORD-2026-002', 'Laboratorios Farmacéuticos BioMed', '2026-07-20', 'Certificado de Calibración'),
    isSample: true,
    description: 'Calibración con pesas patrón E2 con trazabilidad internacional.'
  },
  {
    id: 'doc-005',
    orderId: 'order-002',
    name: 'Hoja_Datos_Incertidumbre.pdf',
    type: 'Hoja de Datos',
    size: 310000,
    uploadDate: '2026-07-20 17:00',
    fileUrl: generateSamplePdfDataUrl('Hoja de Cálculo de Incertidumbre', 'ORD-2026-002', 'Laboratorios Farmacéuticos BioMed', '2026-07-20', 'Hoja de Datos'),
    isSample: true
  },
  {
    id: 'doc-006',
    orderId: 'order-003',
    name: 'Informe_Preliminar_Torquimetros.pdf',
    type: 'Informe Técnico',
    size: 240000,
    uploadDate: '2026-07-26 11:20',
    fileUrl: generateSamplePdfDataUrl('Informe Preliminar de Ajuste', 'ORD-2026-003', 'Industrias Automotrices del Norte', '2026-07-26', 'Informe Técnico'),
    isSample: true
  },
  {
    id: 'doc-007',
    orderId: 'order-004',
    name: 'Certificado_Manometros_WIKA_700bar.pdf',
    type: 'Certificado de Calibración',
    size: 480000,
    uploadDate: '2026-07-10 13:10',
    fileUrl: generateSamplePdfDataUrl('Certificado Manómetros WIKA 700bar', 'ORD-2026-004', 'Metalúrgica Mexicana de Calidad', '2026-07-10', 'Certificado de Calibración'),
    isSample: true
  },
  {
    id: 'doc-008',
    orderId: 'order-004',
    name: 'Factura_Servicio_F-8790.pdf',
    type: 'Factura/Remisión',
    size: 180000,
    uploadDate: '2026-07-11 10:00',
    fileUrl: generateSamplePdfDataUrl('Factura F-8790', 'ORD-2026-004', 'Metalúrgica Mexicana de Calidad', '2026-07-11', 'Factura/Remisión'),
    isSample: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-07-26 11:20',
    user: 'Carlos Méndez',
    action: 'Carga de Archivo',
    details: 'Se subió "Informe_Preliminar_Torquimetros.pdf" a la orden ORD-2026-003'
  },
  {
    id: 'log-2',
    timestamp: '2026-07-25 09:30',
    user: 'Ulises Martínez',
    action: 'Creación de Orden',
    details: 'Se generó la orden de servicio ORD-2026-003 para Industrias Automotrices del Norte'
  },
  {
    id: 'log-3',
    timestamp: '2026-07-20 16:45',
    user: 'Ana Laura Torres',
    action: 'Carga de Archivo',
    details: 'Se subió "Certificado_Balanza_Analitica_MS204TS.pdf" a la orden ORD-2026-002'
  },
  {
    id: 'log-4',
    timestamp: '2026-07-18 10:00',
    user: 'Ulises Martínez',
    action: 'Registro de Cliente',
    details: 'Se registraron credenciales de acceso para Laboratorios Farmacéuticos BioMed'
  }
];
