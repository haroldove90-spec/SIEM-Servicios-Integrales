-- ==============================================================================
-- SISTEMA METROLOGÍA SIEM - SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- Project: ucontreras@siemmx.com's Project
-- Project ID: dkcapqljyznnimiczlpr
-- Execute this script in Supabase SQL Editor (https://supabase.com/dashboard/project/dkcapqljyznnimiczlpr/sql)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES DEFINITION

-- 2.1 CLIENTS (Catálogo de Clientes / Directorio Empresarial)
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    razon_social TEXT NOT NULL,
    rfc TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes TEXT
);

-- 2.2 SERVICE ORDERS (Órdenes de Servicio e Instrumentos Calibrados)
CREATE TABLE IF NOT EXISTS public.service_orders (
    id TEXT PRIMARY KEY,
    folio TEXT NOT NULL UNIQUE,
    elaboro TEXT,
    fecha_recepcion TEXT,
    fecha_entrega TEXT,
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_rfc TEXT NOT NULL,
    client_phone TEXT,
    client_contact TEXT,
    client_email TEXT,
    client_address TEXT,
    cert_razon_social TEXT,
    cert_direccion TEXT,
    equipments JSONB NOT NULL DEFAULT '[]'::jsonb,
    observaciones_generales TEXT,
    recibido_por TEXT,
    fecha_firma_recibido TEXT,
    calibration_date TEXT,
    status TEXT NOT NULL DEFAULT 'En Proceso',
    equipment_notes TEXT,
    technician_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 ORDER DOCUMENTS (Expediente Digital, Certificados PDF F-7.2, Informes Técnicos)
CREATE TABLE IF NOT EXISTS public.order_documents (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.service_orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size BIGINT NOT NULL DEFAULT 0,
    upload_date TEXT NOT NULL,
    file_url TEXT NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 AUDIT LOGS (Trazabilidad y Registro de Actividad ISO 17025)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 ADMIN USERS (Personal de Laboratorio / Metrólogos)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    position TEXT,
    phone TEXT,
    avatar TEXT,
    specialty TEXT,
    cedula TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía previamente
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS cedula TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_folio ON public.service_orders(folio);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.service_orders(status);
CREATE INDEX IF NOT EXISTS idx_docs_order_id ON public.order_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_clients_rfc ON public.clients(rfc);
CREATE INDEX IF NOT EXISTS idx_clients_username ON public.clients(username);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create Permissive Policies for Web App Client (Anon / Authenticated access)
DROP POLICY IF EXISTS "Permitir todo a anon y auth en clients" ON public.clients;
CREATE POLICY "Permitir todo a anon y auth en clients"
    ON public.clients FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a anon y auth en service_orders" ON public.service_orders;
CREATE POLICY "Permitir todo a anon y auth en service_orders"
    ON public.service_orders FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a anon y auth en order_documents" ON public.order_documents;
CREATE POLICY "Permitir todo a anon y auth en order_documents"
    ON public.order_documents FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a anon y auth en audit_logs" ON public.audit_logs;
CREATE POLICY "Permitir todo a anon y auth en audit_logs"
    ON public.audit_logs FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a anon y auth en admin_users" ON public.admin_users;
CREATE POLICY "Permitir todo a anon y auth en admin_users"
    ON public.admin_users FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 5. ENABLE REALTIME SUBSCRIPTIONS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'service_orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_orders;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'clients'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_documents'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_documents;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- 6. SEED INITIAL DATA (Datos iniciales SIEM ISO/IEC 17025)

-- 6.1 Admin Users y Personal Técnico
INSERT INTO public.admin_users (id, name, email, username, password_hash, role, position, phone, specialty, cedula, active)
VALUES
    ('user-admin-ulises', 'Ulises Contreras', 'ucontreras@siemmx.com', 'ucontreras', 'Cuch#960303', 'admin', 'Líder de Metrología / Admin SIEM', '81-1982-3344', 'Humedad y Temperatura', 'CED-960303', true),
    ('user-admin-harold', 'Harold Anguiano Morales', 'haroldo90@hotmail.com', 'haroldo90', 'Chevropar#1970', 'admin', 'Administrador Metrología SIEM', '81-1823-9901', 'Dimensional y Calidad', 'CED-197001', true),
    ('user-admin-1', 'Carlos Méndez', 'carlos.mendez@metrologia.com.mx', 'carlos.m', 'siem2026password', 'admin', 'Técnico de Masa y Presión', '81-1823-9901', 'Masa y Presión', 'CED-182399', true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    position = EXCLUDED.position,
    phone = EXCLUDED.phone,
    specialty = EXCLUDED.specialty,
    cedula = EXCLUDED.cedula,
    active = EXCLUDED.active;

-- 6.2 Clients
INSERT INTO public.clients (id, razon_social, rfc, contact_name, email, phone, address, username, password_hash, active, created_at, notes)
VALUES
    ('client-001', 'Industrias Automotrices del Norte S.A. de C.V.', 'IAN880315KH4', 'Ing. Roberto Garza', 'rgarza@autonorte.com.mx', '81-8123-4567', 'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.', 'autonorte', 'auto2026pass', true, '2025-11-10T00:00:00Z', 'Cliente prioritario de calibración dimensional y torque.'),
    ('client-002', 'Laboratorios Farmacéuticos BioMed S.A. de C.V.', 'LFB9506209A3', 'Dra. Patricia Solís', 'psolis@biomedlabs.com.mx', '55-5678-1234', 'Calzada de los Leones #450, Col. Las Águilas, CDMX', 'biomed', 'biomed2026pass', true, '2026-01-15T00:00:00Z', 'Requiere certificados con trazabilidad ISO/IEC 17025 para COFEPRIS.'),
    ('client-003', 'Metalúrgica Mexicana de Calidad S.A.', 'MMC021110TX8', 'Ing. Héctor Ramírez', 'hramirez@metalurgica.com', '444-820-9900', 'Zona Industrial Lote 14, San Luis Potosí, S.L.P.', 'metalurgica', 'metal2026pass', true, '2026-03-02T00:00:00Z', 'Calibración semestral de manómetros de alta presión y celdas de carga.')
ON CONFLICT (id) DO UPDATE SET 
    razon_social = EXCLUDED.razon_social,
    rfc = EXCLUDED.rfc,
    contact_name = EXCLUDED.contact_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;

-- 6.3 Service Orders (Including SIEM-OS-2026-001 Official F-7.2 Certificate)
INSERT INTO public.service_orders (
    id, folio, elaboro, fecha_recepcion, fecha_entrega, client_id, client_name, client_rfc,
    client_phone, client_contact, client_email, client_address, cert_razon_social, cert_direccion,
    equipments, observaciones_generales, recibido_por, fecha_firma_recibido, calibration_date,
    status, equipment_notes, technician_name, created_at, updated_at
)
VALUES
    (
        'order-siem-001',
        'SIEM-OS-2026-001',
        'Ing. Cristian Ulises Contreras H.',
        '2026-09-07',
        '2026-09-12',
        'client-002',
        'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
        'LFB9506209A3',
        '55-5678-1234',
        'Dra. Patricia Solís',
        'psolis@biomedlabs.com.mx',
        'Calzada de los Leones #450, Col. Las Águilas, CDMX',
        'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
        'Planta Industrial Norte, Eje Central #102, CDMX',
        '[
            {
                "id": "eq-siem-01",
                "no": 1,
                "instrumento": "Termohigrómetro Digital",
                "marca": "Vaisala",
                "modelo": "HMP76 / MI70",
                "serie": "P2720442 / P2510005",
                "idInterno": "SIEM-AH-004",
                "vigencia": "2027-07",
                "servicio": "Calibración",
                "magnitud": "Humedad",
                "resolucion": "0.01 %HR",
                "observaciones": "Condiciones óptimas sin daño físico en sensor.",
                "certificate": {
                    "id": "cert-siem-01",
                    "folioCertificado": "SIEM/1H/26",
                    "magnitud": "Humedad",
                    "codigoFormato": "F-7.2",
                    "noRevision": "1",
                    "lugarCalibracion": "Calibración Realizada en las instalaciones de SIEM",
                    "fechaRecepcion": "2026-09-07",
                    "fechaCalibracion": "2026-09-07",
                    "fechaEmision": "2026-09-08",
                    "ordenTrabajo": "SIEM-OS-2026-001",
                    "temperaturaAmbiente": "21.4 °C ± 0.5 °C",
                    "humedadAmbiente": "48.2 %HR ± 2.0 %HR",
                    "patronDescripcion": "Termohigrómetro Digital",
                    "patronMarca": "Vaisala",
                    "patronModelo": "HMP76 / MI70",
                    "patronSerie": "P2720442 / P2510005",
                    "patronId": "SIEM-AH-004",
                    "patronCertificado": "CAH-1245-26",
                    "patronVigencia": "2027-07",
                    "patronTrazabilidad": "H34",
                    "puntos": [
                        { "id": "p1", "referencia": 20.00, "indicacionIbc": 19.99, "error": -0.01, "incertidumbreU": 0.70, "unidad": "%HR" },
                        { "id": "p2", "referencia": 40.00, "indicacionIbc": 39.99, "error": -0.01, "incertidumbreU": 0.70, "unidad": "%HR" },
                        { "id": "p3", "referencia": 60.00, "indicacionIbc": 59.99, "error": -0.01, "incertidumbreU": 0.70, "unidad": "%HR" },
                        { "id": "p4", "referencia": 80.00, "indicacionIbc": 79.99, "error": -0.01, "incertidumbreU": 0.70, "unidad": "%HR" },
                        { "id": "p5", "referencia": 95.00, "indicacionIbc": 94.99, "error": -0.01, "incertidumbreU": 0.70, "unidad": "%HR" }
                    ],
                    "calibroNombre": "Ing. Cristian Ulises Contreras H.",
                    "calibroPuesto": "Metrólogo",
                    "autorizoNombre": "Ing. Raul Hernandez Vicente",
                    "autorizoPuesto": "Metrólogo",
                    "procedimientoCalibracion": "Procedimiento de Calibración para Humedad P-7.2.2",
                    "factorCoberturaK": 2,
                    "nivelConfianza": "95.45%",
                    "normaReferencia": "NOM-008-SE-2021, NMX-CH-140-IMNC 2002"
                }
            }
        ]'::jsonb,
        'Equipo entregado con estuche original rígido y sonda de medición. Calibración directa de alta precisión.',
        'Ing. Cristian Ulises Contreras H.',
        '2026-09-07',
        '2026-09-07',
        'Completada',
        'Termohigrómetro Digital Vaisala HMP76 / MI70 para cuartos limpios.',
        'Ing. Cristian Ulises Contreras H.',
        '2026-09-07T00:00:00Z',
        '2026-09-08T00:00:00Z'
    ),
    (
        'order-001',
        'ORD-2026-001',
        'Ulises Martínez',
        '2026-07-12',
        '2026-07-16',
        'client-001',
        'Industrias Automotrices del Norte S.A. de C.V.',
        'IAN880315KH4',
        '81-8123-4567',
        'Ing. Roberto Garza',
        'rgarza@autonorte.com.mx',
        'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.',
        NULL,
        NULL,
        '[
            {
                "id": "eq-001",
                "no": 1,
                "instrumento": "Calibrador Pie de Rey Digital",
                "marca": "Mitutoyo",
                "modelo": "500-196-30",
                "serie": "21045991",
                "idInterno": "CAL-MIT-01",
                "vigencia": "1 año",
                "servicio": "Calibración",
                "magnitud": "Dimensional",
                "resolucion": "0.01 mm",
                "observaciones": "Desplazamiento suave, baterías nuevas."
            },
            {
                "id": "eq-002",
                "no": 2,
                "instrumento": "Micrómetro de Exteriores",
                "marca": "Mitutoyo",
                "modelo": "293-240-30",
                "serie": "18392011",
                "idInterno": "MIC-EXT-02",
                "vigencia": "1 año",
                "servicio": "Calibración",
                "magnitud": "Dimensional",
                "resolucion": "0.001 mm",
                "observaciones": "Con barra de ajuste y llave de trinquete."
            }
        ]'::jsonb,
        'Entregado en laboratorio central.',
        'Ulises Martínez',
        '2026-07-12',
        '2026-07-15',
        'Entregada',
        'Calibración de 4 Calibradores Pie de Rey Mitutoyo 0-150mm y 2 Micrómetros de Exteriores.',
        'Ulises Martínez',
        '2026-07-12T00:00:00Z',
        '2026-07-16T00:00:00Z'
    ),
    (
        'order-002',
        'ORD-2026-002',
        'Ana Laura Torres',
        '2026-07-18',
        '2026-07-21',
        'client-002',
        'Laboratorios Farmacéuticos BioMed S.A. de C.V.',
        'LFB9506209A3',
        '55-5678-1234',
        'Dra. Patricia Solís',
        'psolis@biomedlabs.com.mx',
        'Calzada de los Leones #450, Col. Las Águilas, CDMX',
        NULL,
        NULL,
        '[
            {
                "id": "eq-003",
                "no": 1,
                "instrumento": "Balanza Analítica",
                "marca": "Mettler Toledo",
                "modelo": "MS204TS",
                "serie": "B82910394",
                "idInterno": "BAL-BIO-04",
                "vigencia": "1 año",
                "servicio": "Calibración",
                "magnitud": "Masa",
                "resolucion": "0.0001 g",
                "observaciones": "Nivelada y calibrada en mesa antivibratoria."
            }
        ]'::jsonb,
        'Equipo en buen estado de conservación.',
        'Ana Laura Torres',
        '2026-07-18',
        '2026-07-20',
        'Completada',
        'Calibración de Balanza Analítica Mettler Toledo MS204TS y Termo-higrómetro Vaisala HMT330.',
        'Ana Laura Torres',
        '2026-07-18T00:00:00Z',
        '2026-07-21T00:00:00Z'
    ),
    (
        'order-003',
        'ORD-2026-003',
        'Carlos Méndez',
        '2026-07-25',
        '2026-07-29',
        'client-001',
        'Industrias Automotrices del Norte S.A. de C.V.',
        'IAN880315KH4',
        '81-8123-4567',
        'Ing. Roberto Garza',
        'rgarza@autonorte.com.mx',
        'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.',
        NULL,
        NULL,
        '[
            {
                "id": "eq-004",
                "no": 1,
                "instrumento": "Torquímetro Digital",
                "marca": "Sturtevant Richmont",
                "modelo": "1250-Exacta",
                "serie": "SR-992144",
                "idInterno": "TOR-IND-01",
                "vigencia": "6 meses",
                "servicio": "Calibración",
                "magnitud": "Par Torsional",
                "resolucion": "0.1 Nm",
                "observaciones": "Inspección de mecanismo de disparo conforme."
            }
        ]'::jsonb,
        'Equipo recibido en maletín protector.',
        'Carlos Méndez',
        '2026-07-25',
        '2026-07-28',
        'En Proceso',
        'Calibración de 3 Torquímetros tipo I y tipo II (10 a 200 Nm).',
        'Carlos Méndez',
        '2026-07-25T00:00:00Z',
        '2026-07-25T00:00:00Z'
    ),
    (
        'order-004',
        'ORD-2026-004',
        'Carlos Méndez',
        '2026-07-08',
        '2026-07-11',
        'client-003',
        'Metalúrgica Mexicana de Calidad S.A.',
        'MMC021110TX8',
        '444-820-9900',
        'Ing. Héctor Ramírez',
        'hramirez@metalurgica.com',
        'Zona Industrial Lote 14, San Luis Potosí, S.L.P.',
        NULL,
        NULL,
        '[
            {
                "id": "eq-005",
                "no": 1,
                "instrumento": "Manómetro Digital Patrón",
                "marca": "Ashcroft",
                "modelo": "DG25",
                "serie": "ASH-881290",
                "idInterno": "MAN-MET-08",
                "vigencia": "1 año",
                "servicio": "Calibración",
                "magnitud": "Presión",
                "resolucion": "0.01 bar",
                "observaciones": "Rango 0 - 250 bar verificado."
            }
        ]'::jsonb,
        'Sin fugas aparentes en rosca NPT.',
        'Carlos Méndez',
        '2026-07-08',
        '2026-07-10',
        'Entregada',
        'Calibración de 5 Manómetros hidráulicos tipo Bourdon escala 0-400 bar.',
        'Carlos Méndez',
        '2026-07-08T00:00:00Z',
        '2026-07-11T00:00:00Z'
    )
ON CONFLICT (id) DO UPDATE SET 
    folio = EXCLUDED.folio,
    client_name = EXCLUDED.client_name,
    status = EXCLUDED.status,
    equipments = EXCLUDED.equipments,
    updated_at = now();

-- 6.4 Initial Audit Logs
INSERT INTO public.audit_logs (id, timestamp, user_name, action, details)
VALUES
    ('log-01', '07/09/2026, 09:30', 'Ing. Cristian Ulises Contreras H.', 'Emisión de Certificado', 'Se generó y validó el certificado oficial SIEM/1H/26 (F-7.2) de Humedad para Vaisala HMP76 / MI70'),
    ('log-02', '07/09/2026, 08:15', 'Ing. Cristian Ulises Contreras H.', 'Recepción de Equipo', 'Se registró la Orden de Servicio SIEM-OS-2026-001 para Laboratorios Farmacéuticos BioMed S.A. de C.V.'),
    ('log-03', '21/07/2026, 14:10', 'Ana Laura Torres', 'Completó Orden', 'Se completó la calibración y emisión de informe para la orden ORD-2026-002'),
    ('log-04', '16/07/2026, 11:30', 'Ulises Martínez', 'Entrega de Orden', 'Orden ORD-2026-001 marcada como Entregada físicamente al cliente con expediente completo')
ON CONFLICT (id) DO NOTHING;
