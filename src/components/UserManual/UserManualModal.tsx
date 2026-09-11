import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Printer,
  Download,
  Search,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Building2,
  FileCheck2,
  UploadCloud,
  HelpCircle,
  Copy,
  Check,
  X,
  Smartphone,
  Laptop,
  Lock,
  Share2,
  FileText,
  Shield,
  Layers,
  ArrowRight,
  Eye,
  Edit3,
  Trash2,
  FolderOpen,
  Users,
  Database,
  Sparkles,
  Key,
  ExternalLink,
  EyeOff
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
  userRole?: 'admin' | 'client';
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  initialSection = 'intro',
  userRole = 'admin'
}) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Escape key and print isolation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrintManual = () => {
    // Scroll to top for print
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
    window.print();
  };

  const handleCopyQuickGuide = () => {
    const text = `*GUÍA RÁPIDA DE USO - SISTEMA SIEM METROLOGÍA*
1. Acceso: Ingrese al enlace oficial con su usuario y contraseña.
2. Registro de Personal: En el módulo "Registro de Personal", agregue metrólogos técnicos, genere contraseñas seguras y compártalas por WhatsApp.
3. Registrar Cliente: Vaya a "Directorio de Clientes" > "+ Registrar Cliente" y guarde sus datos.
4. Crear Orden: Clic en "+ Nueva Orden SIEM", seleccione el cliente, llene los datos del instrumento (marca, modelo, serie) y guarde.
5. Cambiar Estatus: Actualice la orden de "En Proceso" a "Completada" o "Entregada" desde la tabla.
6. Documentos: Clic en "Documentos" en la orden para subir certificados o cotizaciones.
7. Extraer en PDF: Clic en el botón de impresora en la orden para abrir el formato oficial membretado y elija "Guardar como PDF".
8. Supabase Cloud: Acceda a https://supabase.com/dashboard con usuario ucontreras@siemmx.com para administrar la base de datos central.`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const sections = [
    { id: 'intro', title: '1. Introducción y Acceso al Sistema', icon: BookOpen },
    { id: 'staff', title: '2. Registro de Personal y Contraseñas', icon: Users },
    { id: 'clients', title: '3. Registro y Edición de Clientes', icon: Building2 },
    { id: 'orders', title: '4. Crear una Orden de Servicio', icon: ClipboardList },
    { id: 'status', title: '5. Editar y Cambiar Estados', icon: Edit3 },
    { id: 'documents', title: '6. Expediente Digital y Documentos', icon: FolderOpen },
    { id: 'pdf-export', title: '7. Cómo Extraer y Guardar en PDF', icon: Printer },
    { id: 'client-portal', title: '8. Guía para el Portal del Cliente', icon: FileCheck2 },
    { id: 'supabase', title: '9. Administración de Supabase Cloud', icon: Database },
    { id: 'faq', title: '10. Preguntas Frecuentes y Soporte', icon: HelpCircle }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 backdrop-blur-xs siem-modal-overlay-print overflow-y-auto">
      {/* Dynamic print stylesheet for Manual */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 15mm 15mm;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: system-ui, -apple-system, sans-serif !important;
          }
          .manual-screen-only {
            display: none !important;
          }
          .manual-print-view {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .manual-chapter-break {
            page-break-before: always !important;
            break-before: page !important;
          }
          .manual-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 siem-modal-content-print max-h-[92vh]">
        {/* Top Modal Toolbar (Hidden when printing) */}
        <div className="bg-[#0A6EA2] text-white px-5 py-3.5 flex items-center justify-between print:hidden shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-md">
              <img
                src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siem.png"
                alt="Logo SIEM"
                className="h-6 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
                <span>Manual de Usuario y Operación</span>
                <span className="bg-sky-700/80 text-[10px] px-2 py-0.5 rounded text-white font-medium">
                  Versión 2026.1 • ISO/IEC 17025
                </span>
              </h2>
              <p className="text-[11px] text-sky-100">
                Guía completa paso a paso: registros, guardado, edición y extracción en PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuickGuide}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-700/80 hover:bg-sky-600 text-white text-xs font-semibold transition cursor-pointer border border-sky-600/50"
              title="Copiar resumen para WhatsApp o correo"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? '¡Copiado!' : 'Copiar Resumen'}</span>
            </button>

            <button
              onClick={handlePrintManual}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#0A6EA2] text-xs font-bold transition shadow-sm cursor-pointer"
              title="Descargar o imprimir manual completo en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#0A6EA2]" />
              <span>Descargar en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-sky-800/80 hover:bg-sky-700 text-white/90 hover:text-white transition cursor-pointer ml-1"
              title="Cerrar Manual"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Interactive Browser & Screen View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden print:hidden">
          {/* Sidebar Menu inside modal */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-4 flex flex-col shrink-0 overflow-y-auto">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tema o función..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6EA2]"
              />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Capítulos del Manual
            </p>

            <nav className="space-y-1">
              {sections
                .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition cursor-pointer ${
                        isActive
                          ? 'bg-[#0A6EA2] text-white font-semibold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/70'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-2">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5 text-sky-800">
                <p className="font-semibold text-xs mb-0.5 flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-[#0A6EA2]" />
                  <span>Modo PDF Portátil</span>
                </p>
                <p className="text-[10px] text-sky-700 leading-relaxed">
                  Al pulsar el botón blanco <strong>"Descargar en PDF"</strong>, el navegador genera el folleto completo encuadernado para imprimir o compartir por WhatsApp.
                </p>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full py-1.5 px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-semibold text-center transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
              >
                <Share2 className="w-3 h-3" />
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace de la App'}</span>
              </button>
            </div>
          </div>

          {/* Section Reader Canvas */}
          <div
            ref={scrollContainerRef}
            className="flex-1 p-6 md:p-8 overflow-y-auto bg-white text-slate-800"
          >
            {/* Header Banner */}
            <div className="mb-6 pb-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#0A6EA2] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 uppercase tracking-wider">
                  Guía Oficial de Usuario SIEM
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                  {sections.find((s) => s.id === activeSection)?.title || 'Manual de Operación'}
                </h1>
              </div>

              <button
                onClick={handlePrintManual}
                className="hidden md:flex items-center gap-1.5 text-xs text-[#0A6EA2] hover:text-[#085a85] font-semibold border border-[#0A6EA2]/30 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir este tema o todo el manual</span>
              </button>
            </div>

            {/* Content Switcher */}
            {activeSection === 'intro' && <SectionIntro />}
            {activeSection === 'staff' && <SectionStaff />}
            {activeSection === 'clients' && <SectionClients />}
            {activeSection === 'orders' && <SectionOrders />}
            {activeSection === 'status' && <SectionStatus />}
            {activeSection === 'documents' && <SectionDocuments />}
            {activeSection === 'pdf-export' && <SectionPdfExport />}
            {activeSection === 'client-portal' && <SectionClientPortal />}
            {activeSection === 'supabase' && <SectionSupabase />}
            {activeSection === 'faq' && <SectionFaq />}

            {/* Bottom Nav between chapters */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500">
              <button
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection);
                  if (idx > 0) setActiveSection(sections[idx - 1].id);
                }}
                disabled={sections.findIndex((s) => s.id === activeSection) === 0}
                className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Capítulo Anterior
              </button>

              <button
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection);
                  if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                }}
                disabled={sections.findIndex((s) => s.id === activeSection) === sections.length - 1}
                className="px-3 py-1.5 rounded bg-[#0A6EA2] text-white hover:bg-[#085a85] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <span>Siguiente Capítulo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COMPLETE PRINTABLE BOOKLET VIEW (RENDERED WHEN PRINTING TO PDF)
            ========================================================================= */}
        <div className="hidden print:block p-8 bg-white text-slate-900 manual-print-view siem-printable-area">
          {/* Cover Page */}
          <div className="border-b-4 border-[#0A6EA2] pb-6 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="https://dkcapqljyznnimiczlpr.supabase.co/storage/v1/object/public/logo/siem.png"
                alt="Logo SIEM"
                className="h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#0A6EA2] uppercase">
              Manual de Usuario y Operación
            </h1>
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mt-1">
              Sistema Integral de Gestión Metrológica • ISO/IEC 17025
            </p>
            <div className="mt-4 inline-block bg-slate-100 px-4 py-1.5 rounded border border-slate-300 text-xs text-slate-600 font-medium">
              Emisión: Septiembre 2026 • Versión 2.5 Oficial • SIEM Laboratorio de Metrología
            </div>
          </div>

          {/* Quick Index */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8 manual-avoid-break">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Índice de Contenido
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <div>1. Introducción y Acceso al Sistema</div>
              <div>2. Registro de Personal y Contraseñas</div>
              <div>3. Registro y Edición de Clientes</div>
              <div>4. Crear una Orden de Servicio</div>
              <div>5. Editar y Cambiar Estados</div>
              <div>6. Expediente Digital y Documentos</div>
              <div>7. Cómo Extraer y Guardar en PDF</div>
              <div>8. Guía para el Portal del Cliente</div>
              <div>9. Administración de Supabase Cloud</div>
              <div>10. Preguntas Frecuentes y Soporte</div>
            </div>
          </div>

          {/* All Chapters sequentially rendered for clean multi-page print */}
          <div className="space-y-10">
            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                1. Introducción y Acceso al Sistema
              </h2>
              <SectionIntro />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                2. Registro de Personal y Contraseñas
              </h2>
              <SectionStaff />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                3. Registro y Edición de Clientes
              </h2>
              <SectionClients />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                4. Crear una Orden de Servicio
              </h2>
              <SectionOrders />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                5. Editar y Cambiar Estados
              </h2>
              <SectionStatus />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                6. Expediente Digital y Documentos
              </h2>
              <SectionDocuments />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                7. Cómo Extraer y Guardar en PDF
              </h2>
              <SectionPdfExport />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                8. Guía para el Portal del Cliente
              </h2>
              <SectionClientPortal />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                9. Administración de Supabase Cloud
              </h2>
              <SectionSupabase />
            </div>

            <div className="manual-chapter-break">
              <h2 className="text-xl font-black text-[#0A6EA2] border-b-2 border-slate-200 pb-2 mb-4">
                10. Preguntas Frecuentes y Soporte
              </h2>
              <SectionFaq />
            </div>
          </div>

          {/* Footer note in printed document */}
          <div className="mt-12 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-400">
            SIEM Servicios Integrales en Equipos de Medición • Documento Oficial Confidencial para Capacitación de Usuarios
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER SUB-COMPONENTS
   ========================================================================= */

function SectionIntro() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p className="text-sm font-medium text-slate-800">
        Bienvenido a la plataforma web de <strong>SIEM (Servicios Integrales en Equipos de Medición)</strong>. Este sistema administra el ciclo de vida completo de calibración metrológica: recepción de instrumentos, registro de clientes, emisión de certificados acreditados bajo norma <strong>ISO/IEC 17025</strong> y consulta digital para clientes externos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
        <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-lg">
          <div className="flex items-center space-x-2 text-[#0A6EA2] font-bold text-xs mb-1.5">
            <Shield className="w-4 h-4" />
            <span>Perfil Administrador / Técnico</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-2">
            Diseñado para el equipo metrólogo y administrativo. Permite alta de clientes, emisión de órdenes, subida de certificados, modificación técnica y control global.
          </p>
          <div className="bg-white p-2 rounded border border-sky-200 text-[11px] font-mono">
            <div className="text-slate-800"><strong>Usuario Ulises:</strong> ucontreras</div>
            <div className="text-slate-800"><strong>Contraseña:</strong> Cuch#960303</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs mb-1.5">
            <Building2 className="w-4 h-4 text-slate-700" />
            <span>Perfil Cliente Externo</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-2">
            Acceso seguro para las empresas que envían sus instrumentos a calibrar. Pueden consultar el estatus en vivo y descargar sus certificados en PDF las 24 horas del día.
          </p>
          <div className="bg-white p-2 rounded border border-slate-200 text-[11px] font-mono">
            <div className="text-slate-800"><strong>Ejemplo:</strong> metalmec / pass123</div>
            <div className="text-slate-600">Acceso exclusivo a sus propios folios</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
        <p className="font-semibold text-amber-900 text-xs mb-1">
          💡 Compatibilidad Total (Sin instalar nada)
        </p>
        <p className="text-[11px] text-amber-800">
          El sistema funciona desde cualquier navegador moderno (Google Chrome, Microsoft Edge, Safari o Firefox) en computadoras de escritorio, laptops, iPads, tablets y teléfonos celulares. Toda la información se sincroniza automáticamente con la nube de <strong>Supabase Cloud</strong>.
        </p>
      </div>
    </div>
  );
}

function SectionClients() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        Para emitir órdenes de servicio, primero debe existir el cliente registrado en el sistema. Los clientes quedan disponibles de inmediato tanto para el personal técnico como para que el cliente ingrese a su portal con su usuario y contraseña.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-5 h-5 bg-[#0A6EA2] text-white rounded-full flex items-center justify-center text-[10px]">1</span>
          <span>Paso a Paso: Dar de Alta un Nuevo Cliente</span>
        </h3>

        <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-700 pl-1">
          <li>
            <strong>Acceda al módulo:</strong> En el menú lateral izquierdo, seleccione <strong>"Órdenes y Calibración"</strong> y luego pulse la pestaña <strong>"Clientes y Empresas"</strong>.
          </li>
          <li>
            <strong>Abra el formulario:</strong> Haga clic en el botón azul superior <strong>"+ Registrar Nuevo Cliente"</strong>.
          </li>
          <li>
            <strong>Llene los datos empresariales:</strong>
            <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-600">
              <li><strong>Razón Social:</strong> Nombre legal de la empresa (Ej. <em>Metálicos y Maquinados S.A. de C.V.</em>).</li>
              <li><strong>RFC:</strong> Registro Federal de Contribuyentes (Ej. <em>MMA120415AB3</em>).</li>
              <li><strong>Nombre de Contacto:</strong> Persona responsable del área de calidad o compras.</li>
              <li><strong>Correo Electrónico:</strong> Email para envío de notificaciones y avisos.</li>
              <li><strong>Teléfono:</strong> Número con lada para atención directa.</li>
              <li><strong>Dirección:</strong> Domicilio de planta o fiscal.</li>
            </ul>
          </li>
          <li>
            <strong>Asigne Credenciales de Acceso para el Cliente:</strong>
            <p className="pl-4 text-slate-600 mt-1">
              Defina un <strong>Usuario</strong> (ej. <em>metalicos.nl</em>) y una <strong>Contraseña</strong> (mínimo 6 caracteres). Con estos datos, el cliente podrá consultar sus certificados por su cuenta.
            </p>
          </li>
          <li>
            <strong>Guardar:</strong> Haga clic en el botón <strong>"Guardar Cliente"</strong>. El sistema validará los campos y lo almacenará tanto localmente como en la base de datos de Supabase.
          </li>
        </ol>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-5 h-5 bg-slate-700 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
          <span>Cómo Editar o Actualizar un Cliente</span>
        </h3>
        <p className="text-[11px] text-slate-600">
          Si el cliente cambia de dirección, contacto o teléfono:
        </p>
        <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
          <li>Busque al cliente en la tabla por nombre o RFC.</li>
          <li>Haga clic en el botón con ícono de <strong>Lápiz (Editar)</strong> ubicado a la derecha de la fila.</li>
          <li>Modifique la información necesaria y haga clic en <strong>"Guardar Cambios"</strong>.</li>
          <li>Si el cliente olvidó su contraseña, puede reescribirla en este formulario y guardarla.</li>
        </ul>
      </div>
    </div>
  );
}

function SectionOrders() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        La <strong>Orden de Servicio</strong> es el documento central de SIEM. Registra la recepción física del instrumento, los requerimientos metrológicos, las observaciones de inspección inicial y los datos del equipo a calibrar.
      </p>

      <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-[#0A6EA2] text-xs uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-5 h-5 bg-[#0A6EA2] text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
          <span>Flujo para Generar una Nueva Orden</span>
        </h3>

        <div className="space-y-2 text-[11px]">
          <div className="bg-white p-3 rounded border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900">Paso 1: Abrir el Formulario</span>
            <p className="text-slate-600 mt-0.5">
              Desde el Dashboard principal o desde el módulo de Órdenes, pulse el botón <strong>"+ Nueva Orden SIEM"</strong>.
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900">Paso 2: Datos Generales de la Orden</span>
            <ul className="list-disc list-inside pl-2 text-slate-600 mt-1 space-y-0.5">
              <li><strong>Folio:</strong> Se genera automáticamente (ej. <em>OS-2026-004</em>), pero puede personalizarse.</li>
              <li><strong>Cliente:</strong> Seleccione el cliente de la lista desplegable. Si no existe, créelo primero.</li>
              <li><strong>Fechas:</strong> Seleccione la <em>Fecha de Recepción</em> y la <em>Fecha Estimada de Entrega</em>.</li>
              <li><strong>Metrólogo Asignado:</strong> Seleccione el técnico responsable de la medición.</li>
            </ul>
          </div>

          <div className="bg-white p-3 rounded border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900">Paso 3: Ficha Técnica del Instrumento</span>
            <p className="text-slate-600 mt-0.5">
              Llene minuciosamente los campos del equipo recibido:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-[10px] font-mono bg-slate-50 p-2 rounded border border-slate-200">
              <div><strong>Instrumento:</strong> Ej. Manómetro</div>
              <div><strong>Marca:</strong> Ej. Ashcroft</div>
              <div><strong>Modelo:</strong> Ej. 1009-D</div>
              <div><strong>No. Serie:</strong> Ej. ASH-99210</div>
              <div><strong>ID / TAG:</strong> Ej. SIEM-PRE-01</div>
              <div><strong>Magnitud:</strong> Presión</div>
              <div><strong>Rango:</strong> 0 a 100 psi</div>
              <div><strong>Resolución:</strong> 0.5 psi</div>
              <div><strong>Vigencia:</strong> 1 año</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900">Paso 4: Observaciones de Entrada y Accesorios</span>
            <p className="text-slate-600 mt-0.5">
              Indique si el equipo incluye caja protectora, baterías, cables, adaptadores y el estado visual (ej. <em>"Equipo en buen estado físico, carátula sin roturas, se entrega con estuche original"</em>).
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900">Paso 5: Guardar en el Sistema</span>
            <p className="text-slate-600 mt-0.5">
              Haga clic en <strong>"Crear Orden de Servicio"</strong>. La orden aparecerá inmediatamente en la tabla con estatus inicial <strong>"En Proceso"</strong> y sincronizada en la nube.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionStatus() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        El sistema cuenta con un flujo de estados claro que informa tanto al personal técnico como al cliente sobre el avance de sus instrumentos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>En Proceso</span>
          </div>
          <p className="text-[11px] text-amber-700">
            El instrumento ha sido recibido físicamente y se encuentra en etapa de aclimatación, medición o calibración en laboratorio.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Completada</span>
          </div>
          <p className="text-[11px] text-emerald-700">
            La calibración concluyó con éxito, los cálculos metrológicos están validados y el Certificado de Calibración está emitido.
          </p>
        </div>

        <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
          <div className="flex items-center space-x-1.5 text-sky-800 font-bold text-xs mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span>Entregada</span>
          </div>
          <p className="text-[11px] text-sky-700">
            El instrumento fue entregado físicamente al cliente junto con su etiqueta de calibración y certificado firmado.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
          Cómo Cambiar el Estatus en 1 Clic:
        </h4>
        <p className="text-[11px] text-slate-600">
          En la tabla de Órdenes de Servicio, la columna <strong>"Estatus"</strong> contiene un selector desplegable interactivo. Simplemente haga clic sobre el estatus actual de la fila y elija el nuevo estatus (por ejemplo, cambiar de <em>En Proceso</em> a <em>Completada</em>). El cambio se guarda al instante sin necesidad de recargar la página.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
          Cómo Editar la Información de una Orden:
        </h4>
        <p className="text-[11px] text-slate-600">
          Si necesita corregir el número de serie, agregar observaciones, cambiar la fecha de entrega o modificar cualquier dato del instrumento, haga clic en el botón azul de <strong>Lápiz (Editar)</strong> en la columna de Acciones. Realice las modificaciones y pulse <strong>"Guardar Cambios"</strong>.
        </p>
      </div>
    </div>
  );
}

function SectionDocuments() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        Cada Orden de Servicio cuenta con un <strong>Expediente Digital</strong> que almacena todos los archivos vinculados: certificados de calibración, cotizaciones autorizadas, facturas fiscales, hojas de servicio y remisiones de entrega.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
          <FolderOpen className="w-4 h-4 text-[#0A6EA2]" />
          <span>Gestión de Archivos en el Expediente</span>
        </h3>

        <div className="space-y-2 text-[11px]">
          <p>
            <strong>1. Abrir el Expediente:</strong> En la tabla de órdenes, ubique la fila correspondiente y haga clic en el botón con ícono de <strong>Carpeta ("Documentos")</strong>.
          </p>
          <p>
            <strong>2. Subir un nuevo archivo:</strong>
          </p>
          <ul className="list-disc list-inside pl-3 text-slate-600 space-y-1">
            <li>Escriba el nombre o título del documento (ej. <em>Certificado Oficial Balanza Ohaus</em>).</li>
            <li>Seleccione la categoría: <em>Certificado de Calibración, Hoja de Servicio, Cotización, Factura, Reporte de Entrega</em>.</li>
            <li>Haga clic en <strong>"Seleccionar Archivo"</strong> para subir un PDF o imagen desde su computadora, o ingrese un enlace directo en Supabase Storage.</li>
            <li>Haga clic en <strong>"Guardar y Vincular Documento"</strong>.</li>
          </ul>
          <p>
            <strong>3. Previsualizar y Descargar:</strong> Dentro del modal, puede hacer clic en cualquier documento para abrirlo en el visor de alta resolución o imprimirlo.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionPdfExport() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-lg">
        <h3 className="font-bold text-[#0A6EA2] text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
          <Printer className="w-4 h-4" />
          <span>Extracción Directa a PDF con Formato Membretado Oficial</span>
        </h3>
        <p className="text-[11px] text-sky-800">
          El sistema está optimizado para generar documentos vectoriales de calidad de imprenta directamente desde el navegador, eliminando barras, menús y elementos visuales de pantalla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Caso 1: Orden de Servicio */}
        <div className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2 shadow-2xs">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-[#0A6EA2]" />
            <span>A) Extraer Orden de Servicio en PDF</span>
          </h4>
          <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1 pl-1">
            <li>En la tabla de órdenes, pulse el botón <strong>"Imprimir / Ver Formato Oficial"</strong>.</li>
            <li>Se desplegará la <strong>Ficha Técnica Oficial SIEM</strong> con membrete, código QR, tabla de instrumentos y firmas.</li>
            <li>En la barra azul superior, pulse el botón <strong>"Imprimir / Guardar PDF"</strong>.</li>
            <li>En la ventana del navegador, en <strong>Destino</strong> seleccione: <strong>"Guardar como PDF"</strong>.</li>
            <li>En <em>Diseño</em> elija <strong>Horizontal (Landscape)</strong> para formato de hoja ancha.</li>
            <li>Pulse <strong>Guardar</strong> en su computadora.</li>
          </ol>
        </div>

        {/* Caso 2: Certificado de Calibración */}
        <div className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2 shadow-2xs">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>B) Extraer Certificado ISO/IEC 17025</span>
          </h4>
          <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1 pl-1">
            <li>En la orden con estatus completada, pulse <strong>"Ver Certificado Oficial"</strong>.</li>
            <li>Revise la trazabilidad metrológica (CENAM), lecturas e incertidumbre expandida ($U$).</li>
            <li>Haga clic en <strong>"Descargar / Imprimir en PDF"</strong>.</li>
            <li>En la ventana de impresión, configure tamaño <strong>Carta / A4</strong> y orientación <strong>Vertical</strong>.</li>
            <li>Marque la casilla <em>"Gráficos de fondo"</em> para conservar los logotipos y sellos.</li>
            <li>Pulse <strong>Guardar como PDF</strong>.</li>
          </ol>
        </div>
      </div>

      {/* Caso 3: Exportar a Excel */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-[11px]">
        <span className="font-bold text-slate-900">C) Exportar Tablas a Excel / CSV:</span>
        <p className="text-slate-600">
          Si requiere realizar un reporte gerencial o inventario en Microsoft Excel, haga clic en el botón <strong>"Exportar CSV"</strong> ubicado en la parte superior de la tabla de órdenes o clientes. Se descargará de forma inmediata.
        </p>
      </div>
    </div>
  );
}

function SectionClientPortal() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        El <strong>Portal del Cliente</strong> es una de las mayores ventajas del sistema SIEM. Permite a las empresas consultar el estado de sus calibraciones sin necesidad de llamar por teléfono o enviar correos.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
          Instrucciones para Compartir con sus Clientes:
        </h3>

        <div className="space-y-2.5 text-[11px] text-slate-700">
          <div className="bg-white p-3 rounded border border-slate-200">
            <span className="font-bold text-slate-900">1. ¿Cómo ingresa el cliente?</span>
            <p className="text-slate-600 mt-0.5">
              El cliente abre la misma dirección web de SIEM en su navegador, escribe su <strong>Usuario</strong> y <strong>Contraseña</strong> asignados y presiona <em>"Iniciar Sesión"</em>.
            </p>
          </div>

          <div className="bg-white p-3 rounded border border-slate-200">
            <span className="font-bold text-slate-900">2. ¿Qué puede ver el cliente?</span>
            <ul className="list-disc list-inside pl-2 text-slate-600 mt-1 space-y-0.5">
              <li>Únicamente los instrumentos y órdenes pertenecientes a su empresa.</li>
              <li>El estatus de avance (<em>En Proceso, Completada, Entregada</em>).</li>
              <li>Fecha de recepción y fecha estimada de entrega.</li>
              <li>Vigencia metrológica del certificado para auditorías de calidad (ISO 9001 / IATF 16949).</li>
            </ul>
          </div>

          <div className="bg-white p-3 rounded border border-slate-200">
            <span className="font-bold text-slate-900">3. ¿Cómo descarga sus certificados el cliente?</span>
            <p className="text-slate-600 mt-0.5">
              Al hacer clic en la orden completada, el cliente verá el botón <strong>"Descargar Certificado PDF"</strong>. Al presionarlo, el certificado oficial se descarga en su computadora o celular listo para presentarse en auditorías.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionFaq() {
  return (
    <div className="space-y-3 text-xs leading-relaxed text-slate-700">
      <div className="border border-slate-200 rounded-lg p-3 bg-white">
        <p className="font-bold text-slate-900 mb-1">
          ¿Qué debo hacer si un cliente o usuario olvida su contraseña?
        </p>
        <p className="text-[11px] text-slate-600">
          Como Administrador, vaya a <em>"Órdenes y Calibración" &gt; "Clientes"</em>, pulse el botón de editar (lápiz) sobre el cliente, ingrese la nueva contraseña en el campo correspondiente y presione <em>"Guardar Cambios"</em>. El cambio toma efecto de inmediato.
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg p-3 bg-white">
        <p className="font-bold text-slate-900 mb-1">
          ¿Cómo me aseguro de que el PDF se descargue con los colores y logos oficiales?
        </p>
        <p className="text-[11px] text-slate-600">
          En el cuadro de diálogo de impresión de Google Chrome o Edge, despliegue la sección de <em>"Más opciones de configuración"</em> y asegúrese de que la casilla <strong>"Gráficos en segundo plano" (Background graphics)</strong> esté activada.
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg p-3 bg-white">
        <p className="font-bold text-slate-900 mb-1">
          ¿Los datos se pierden si se apaga la computadora?
        </p>
        <p className="text-[11px] text-slate-600">
          No. El sistema utiliza almacenamiento dual: guarda instantáneamente en el almacenamiento del navegador y sincroniza de forma segura con la base de datos central en la nube de <strong>Supabase</strong>.
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg p-3 bg-white">
        <p className="font-bold text-slate-900 mb-1">
          ¿Puedo eliminar una orden si me equivoqué de folio?
        </p>
        <p className="text-[11px] text-slate-600">
          Sí. En la tabla de órdenes de servicio, en la columna de Acciones existe el botón de <strong>Bote de Basura (Eliminar)</strong>. El sistema le pedirá una confirmación de seguridad para evitar eliminaciones accidentales.
        </p>
      </div>
    </div>
  );
}

function SectionStaff() {
  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        El módulo <strong>Registro de Personal</strong> permite al Administrador gestionar a los metrólogos, técnicos y supervisores que operan en el laboratorio SIEM, facilitando la creación de accesos seguros y el envío directo de credenciales por WhatsApp.
      </p>

      {/* Paso a paso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-[#0A6EA2] text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Acceso al Módulo</span>
          </div>
          <p className="text-[11px] text-slate-600">
            En el menú lateral izquierdo o en la barra inferior móvil, seleccione <strong>"Registro de Personal"</strong>. Verá la plantilla de técnicos activos con su especialidad, cédula y credenciales.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-[#0A6EA2] text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Generar Contraseña Segura</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Al registrar o editar a un técnico, haga clic en el botón <strong>"Generar Segura"</strong> (icono de varita mágica). El sistema creará una clave robusta con mayúsculas, números y símbolos (ejemplo: <em>SiemMet#9824</em>).
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-[#0A6EA2] text-white flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Ver Contraseña (Icono Ojito)</span>
          </div>
          <p className="text-[11px] text-slate-600">
            En todos los campos de contraseña del sistema existe el icono del <strong>ojito</strong>. Al pulsarlo, podrá visualizar o verificar la contraseña capturada sin que aparezcan puntos ocultos.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              4
            </span>
            <span>Compartir por WhatsApp</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Haga clic en el botón <strong>"WhatsApp"</strong> (icono verde) en la tarjeta del técnico o en el formulario. Se abrirá WhatsApp con el mensaje listo que incluye el enlace del sistema, usuario, clave y recomendaciones de confidencialidad.
          </p>
        </div>
      </div>

      {/* Nota de Seguridad */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[11px] text-emerald-800 flex items-start space-x-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Ventaja de Compartir por WhatsApp:</span> Evita errores de captura tipográfica para los técnicos en campo o en planta, permitiéndoles ingresar de inmediato desde su celular con un solo toque.
        </div>
      </div>
    </div>
  );
}

function SectionSupabase() {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
      <p>
        El sistema SIEM está respaldado por <strong>Supabase Cloud</strong>, una base de datos PostgreSQL empresarial de alto rendimiento que garantiza la integridad, sincronización en tiempo real y respaldo inmutable de todos los certificados oficiales.
      </p>

      {/* Botón de Acceso Directo y Credenciales */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-3.5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-white">Consola de Supabase Cloud</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded font-mono font-bold">
            Conexión Activa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Enlace de Inicio:</span>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline font-mono inline-flex items-center space-x-1"
            >
              <span>https://supabase.com/dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Correo Administrador:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono font-semibold">ucontreras@siemmx.com</span>
              <button
                type="button"
                onClick={() => copyToClipboard('ucontreras@siemmx.com', 'email')}
                className="text-slate-400 hover:text-white transition p-0.5"
                title="Copiar correo"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Contraseña Maestra:</span>
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-mono font-bold tracking-wider">
                {showPassword ? 'Cuch#960303' : '••••••••••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard('Cuch#960303', 'pass')}
                className="text-slate-400 hover:text-white transition p-0.5"
                title="Copiar contraseña"
              >
                {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Proyecto / Instancia:</span>
            <span className="text-slate-300 font-mono">ucontreras@siemmx.com's Project (dkcapqljyznnimiczlpr)</span>
          </div>
        </div>

        {/* Botón destacado para abrir Supabase */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-slate-400">
            Haga clic en el botón verde para acceder directamente a la consola de su base de datos:
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Entrar a mi Cuenta de Supabase</span>
          </a>
        </div>
      </div>

      {/* Explicación de los botones en la interfaz */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-[11px] text-sky-900 space-y-1">
        <span className="font-bold flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-[#0A6EA2]" />
          <span>Acceso rápido permanente en la barra superior:</span>
        </span>
        <p className="text-slate-600">
          En todo momento, en la esquina superior derecha del sistema SIEM, encontrará el botón <strong>"Supabase Cloud"</strong> con el logo verde. Al hacer clic sobre él, podrá ver el estado de salud de la base de datos y presionar <em>"Abrir Consola de Supabase"</em>.
        </p>
      </div>

      {/* Instrucciones para el Administrador */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
          Cómo Administrar la Base de Datos en Supabase:
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
          <li>Presione el botón verde superior <strong>"Entrar a mi Cuenta de Supabase"</strong> o visite <strong>https://supabase.com/dashboard</strong>.</li>
          <li>Inicie sesión con el correo <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">ucontreras@siemmx.com</code> y contraseña <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">Cuch#960303</code>.</li>
          <li>Seleccione el proyecto <strong>"ucontreras@siemmx.com's Project"</strong>.</li>
          <li>En el menú lateral izquierdo, ingrese a <strong>Table Editor</strong> para ver y editar registros directos de las tablas:
            <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-500 font-mono text-[10px]">
              <li><strong>admin_users:</strong> Metrólogos, credenciales, especialidades y teléfonos.</li>
              <li><strong>clients:</strong> Directorio de empresas, contactos, RFCs y accesos.</li>
              <li><strong>service_orders:</strong> Órdenes de servicio y certificados F-7.2.</li>
              <li><strong>order_documents:</strong> Certificados, expedientes y cotizaciones en PDF.</li>
              <li><strong>audit_logs:</strong> Registro de auditoría y trazabilidad ISO/IEC 17025.</li>
            </ul>
          </li>
          <li>En el menú <strong>SQL Editor</strong> puede ejecutar el script SQL oficial actualizado para crear o modificar tablas con un solo clic.</li>
        </ol>
      </div>
    </div>
  );
}
