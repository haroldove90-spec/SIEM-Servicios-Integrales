import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Code2, 
  Sparkles,
  Server
} from 'lucide-react';
import { checkSupabaseConnection, SUPABASE_CONFIG } from '../lib/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{ connected: boolean; tablesExist: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql'>('status');
  const [sqlContent, setSqlContent] = useState<string>('');

  const sqlUrl = 'https://supabase.com/dashboard/project/' + SUPABASE_CONFIG.projectId + '/sql/new';

  const runCheck = async () => {
    setChecking(true);
    const result = await checkSupabaseConnection();
    setStatus(result);
    setChecking(false);
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
      // Fetch or set the schema SQL
      fetch('/supabase/schema.sql')
        .then((res) => (res.ok ? res.text() : ''))
        .then((text) => {
          if (text) setSqlContent(text);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleCopySql = () => {
    const textToCopy = sqlContent || DEFAULT_SQL_FALLBACK;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Configuración de Supabase Cloud</h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  Conectado
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Proyecto: <span className="text-slate-300 font-medium">{SUPABASE_CONFIG.projectName}</span> ({SUPABASE_CONFIG.projectId})
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4" />
            Estado de Conexión
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-4 w-4" />
            Script SQL (Tablas & Seed)
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'status' ? (
            <div className="space-y-5">
              {/* Credentials Card */}
              <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Credenciales del Proyecto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Project ID:</span>
                    <span className="font-mono text-emerald-300 font-semibold">{SUPABASE_CONFIG.projectId}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">URL Base:</span>
                    <span className="font-mono text-slate-200 truncate block">{SUPABASE_CONFIG.url}</span>
                  </div>
                  <div className="sm:col-span-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">API Key (Anon / Public JWT):</span>
                    <span className="font-mono text-slate-300 text-[11px] truncate block">
                      {SUPABASE_CONFIG.anonKey.substring(0, 32)}...{SUPABASE_CONFIG.anonKey.slice(-16)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Diagnostic Card */}
              <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {checking ? (
                      <RefreshCw className="h-5 w-5 animate-spin text-cyan-400 mt-0.5 shrink-0" />
                    ) : status?.tablesExist ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {checking
                          ? 'Comprobando estado de Supabase...'
                          : status?.tablesExist
                          ? 'Base de Datos Lista y Sincronizada'
                          : 'Conectado — Tablas pendientes de creación'}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {checking
                          ? 'Verificando tablas service_orders, clients, order_documents...'
                          : status?.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={runCheck}
                    disabled={checking}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
                    Verificar
                  </button>
                </div>

                {!status?.tablesExist && !checking && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 bg-amber-500/5 -mx-4 -mb-4 p-4 rounded-b-xl border-amber-500/20">
                    <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Pasos rápidos para activar tu base de datos:
                    </h5>
                    <ol className="mt-2 space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                      <li>
                        Abre el{' '}
                        <a
                          href={sqlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 font-semibold underline hover:text-cyan-300 inline-flex items-center gap-1"
                        >
                          Editor SQL de Supabase <ExternalLink className="h-3 w-3" />
                        </a>.
                      </li>
                      <li>
                        Ve a la pestaña <strong>"Script SQL"</strong> arriba y haz clic en <strong>"Copiar SQL"</strong>.
                      </li>
                      <li>Pega el código en el editor de Supabase y presiona el botón <strong>"Run"</strong> (Ejecutar).</li>
                      <li>Vuelve aquí y haz clic en <strong>"Verificar"</strong>. ¡Tus certificados y órdenes se sincronizarán en la nube al instante!</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Sync Behavior Info */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Arquitectura Híbrida Inteligente:</strong> El sistema cuenta con persistencia bidireccional. Si Supabase está disponible, almacena órdenes, clientes y certificados F-7.2 en la nube PostgreSQL. En caso de fallas de red momentáneas, conserva los datos en almacenamiento local seguro para que el laboratorio nunca se detenga.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Script SQL Completo (PostgreSQL Supabase)</h4>
                  <p className="text-xs text-slate-400">
                    Crea las tablas <code className="text-emerald-300">clients</code>, <code className="text-emerald-300">service_orders</code>, <code className="text-emerald-300">order_documents</code>, <code className="text-emerald-300">audit_logs</code> y precarga los datos oficiales de SIEM.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={sqlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir Editor Supabase
                  </a>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? '¡Copiado!' : 'Copiar SQL'}
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[50vh] leading-relaxed">
                <pre>{sqlContent || DEFAULT_SQL_FALLBACK}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">
            SIEM Laboratorio de Metrología • ISO/IEC 17025
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

const DEFAULT_SQL_FALLBACK = `-- SISTEMA METROLOGÍA SIEM - SUPABASE DATABASE SCHEMA
-- Proyecto: ucontreras@siemmx.com's Project (dkcapqljyznnimiczlpr)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA DE USUARIOS ADMINISTRADORES
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    position TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía previamente
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- 2. TABLA DE CLIENTES
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

-- 3. TABLA DE ÓRDENES DE SERVICIO Y CERTIFICADOS F-7.2
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

-- 4. TABLA DE DOCUMENTOS Y EXPEDIENTES
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

-- 5. TABLA DE AUDITORÍA Y TRAZABILIDAD
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POLÍTICAS RLS PERMISIVAS
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

-- INSERTAR USUARIOS ADMINISTRADORES OFICIALES
INSERT INTO public.admin_users (id, name, email, username, password_hash, role, position, phone)
VALUES 
  ('user-admin-ulises', 'Ulises Contreras', 'ucontreras@siemmx.com', 'ucontreras', 'Cuch#960303', 'admin', 'Líder de Metrología / Admin SIEM', '81-1982-3344'),
  ('user-admin-harold', 'Harold Anguiano Morales', 'haroldo90@hotmail.com', 'haroldo90', 'Chevropar#1970', 'admin', 'Administrador Metrología SIEM', '81-1823-9901')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash;
`;
