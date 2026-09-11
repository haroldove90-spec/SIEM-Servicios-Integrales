-- ==============================================================================
-- SISTEMA METROLOGÍA SIEM - SCRIPT SQL COMPLETO PARA SUPABASE
-- Proyecto: ucontreras@siemmx.com's Project (dkcapqljyznnimiczlpr)
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE USUARIOS INTERNOS / ADMINISTRADORES Y PERSONAL TÉCNICO
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

-- 3. TABLA DE CLIENTES (PORTAL CLIENTE SIEM)
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

-- 4. TABLA DE ÓRDENES DE SERVICIO Y CERTIFICADOS (FORMATO OFICIAL F-7.2)
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

-- 5. TABLA DE EXPEDIENTE DIGITAL Y DOCUMENTOS PDF
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

-- 6. TABLA DE AUDITORÍA Y TRAZABILIDAD ISO/IEC 17025
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. ÍNDICES DE RENDIMIENTO Y BÚSQUEDA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_orders_folio ON public.service_orders(folio);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.service_orders(status);
CREATE INDEX IF NOT EXISTS idx_documents_order_id ON public.order_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_clients_username ON public.clients(username);
CREATE INDEX IF NOT EXISTS idx_clients_rfc ON public.clients(rfc);

-- 8. POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- Permite lectura y escritura sincronizada desde la API pública y el portal
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo en admin_users" ON public.admin_users;
CREATE POLICY "Permitir todo en admin_users" ON public.admin_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en clients" ON public.clients;
CREATE POLICY "Permitir todo en clients" ON public.clients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en service_orders" ON public.service_orders;
CREATE POLICY "Permitir todo en service_orders" ON public.service_orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en order_documents" ON public.order_documents;
CREATE POLICY "Permitir todo en order_documents" ON public.order_documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en audit_logs" ON public.audit_logs;
CREATE POLICY "Permitir todo en audit_logs" ON public.audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 9. INSERCIÓN DE USUARIOS ADMINISTRADORES Y PERSONAL TÉCNICO OFICIAL
-- Limpiar registros existentes con estos correos o usernames para prevenir colisiones de clave única
DELETE FROM public.admin_users 
WHERE email IN (
  'carlos.mendez@metrologia.com.mx',
  'ucontreras@siemmx.com',
  'haroldo90@hotmail.com',
  'ulises.martinez@metrologia.com.mx',
  'ana.torres@metrologia.com.mx',
  'jorge.ramos@metrologia.com.mx',
  'maria.delgado@metrologia.com.mx'
) OR username IN (
  'carlos.m',
  'ucontreras',
  'haroldo90',
  'ulises.admin',
  'ana.torres',
  'jorge.r',
  'maria.delgado'
) OR id IN ('user-admin-ulises', 'user-admin-harold', 'user-admin-1', 'user-admin-2', 'user-admin-3', 'user-admin-4', 'user-admin-5');

INSERT INTO public.admin_users (id, name, email, username, password_hash, role, position, phone, specialty, cedula, active)
VALUES 
  ('user-admin-ulises', 'Ulises Contreras', 'ucontreras@siemmx.com', 'ucontreras', 'Cuch#960303', 'admin', 'Líder de Metrología / Admin SIEM', '81-1982-3344', 'Humedad y Temperatura', 'CED-960303', true),
  ('user-admin-harold', 'Harold Anguiano Morales', 'haroldo90@hotmail.com', 'haroldo90', 'Chevropar#1970', 'admin', 'Administrador Metrología SIEM', '81-1823-9901', 'Dimensional y Calidad', 'CED-197001', true),
  ('user-admin-1', 'Carlos Méndez', 'carlos.mendez@metrologia.com.mx', 'carlos.m', 'siem2026password', 'admin', 'Técnico de Masa y Presión', '81-1823-9901', 'Masa y Presión', 'CED-182399', true);

-- 10. INSERCIÓN DE CLIENTES DE PRUEBA
INSERT INTO public.clients (id, razon_social, rfc, contact_name, email, phone, address, username, password_hash, active, notes)
VALUES
  ('client-001', 'Industrias Automotrices del Norte S.A. de C.V.', 'IAN880315KH4', 'Ing. Roberto Garza', 'rgarza@autonorte.com.mx', '81-8123-4567', 'Av. Las Industrias #1200, Parque Industrial Apodaca, N.L.', 'autonorte', 'auto2026pass', true, 'Cliente prioritario de calibración dimensional y torque.'),
  ('client-002', 'Laboratorios Farmacéuticos BioMed S.A. de C.V.', 'LFB9506209A3', 'Dra. Patricia Solís', 'psolis@biomedlabs.com.mx', '55-5678-1234', 'Calzada de los Leones #450, Col. Las Águilas, CDMX', 'biomed', 'biomed2026pass', true, 'Cliente de magnitudes térmicas y masa (balanzas).')
ON CONFLICT (id) DO NOTHING;
