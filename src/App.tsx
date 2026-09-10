import React, { useState, useEffect } from 'react';
import { User, Client, ServiceOrder, OrderDocument, AuditLog } from './types';
import {
  initStorage,
  getStoredClients,
  saveStoredClients,
  getStoredOrders,
  saveStoredOrders,
  getStoredDocuments,
  saveStoredDocuments,
  getStoredAuditLogs,
  addAuditLog,
  getCurrentUser,
  setCurrentUser,
  resetDemoStorage
} from './utils/storage';

import { HomeRoleSelector } from './components/HomeRoleSelector';
import { Sidebar } from './components/Sidebar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { PdfViewerModal } from './components/PdfViewerModal';

// Admin Components
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { OrderManagement } from './components/Admin/OrderManagement';
import { DocumentManagerModal } from './components/Admin/DocumentManagerModal';
import { AdminProfile } from './components/Admin/AdminProfile';

// Client Components
import { ClientDashboard } from './components/Client/ClientDashboard';
import { ClientOrderDetail } from './components/Client/ClientOrderDetail';
import { ClientProfile } from './components/Client/ClientProfile';

import { LogOut, Shield, Building2, Database } from 'lucide-react';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import {
  fetchClientsSupabase,
  upsertClientSupabase,
  fetchOrdersSupabase,
  upsertOrderSupabase,
  deleteOrderSupabase,
  fetchDocumentsSupabase,
  upsertDocumentSupabase,
  deleteDocumentSupabase,
  fetchAuditLogsSupabase,
  insertAuditLogSupabase,
  supabase
} from './lib/supabase';

const ADMIN_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Ulises Martínez',
    email: 'ulises.martinez@metrologia.com.mx',
    username: 'ulises.admin',
    role: 'admin',
    position: 'Líder de Metrología / Admin'
  },
  {
    id: 'user-admin-2',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@metrologia.com.mx',
    username: 'carlos.m',
    role: 'admin',
    position: 'Técnico de Masa y Presión'
  }
];

export default function App() {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [documents, setDocuments] = useState<OrderDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals & Active View Selection
  const [viewingPdfDoc, setViewingPdfDoc] = useState<OrderDocument | null>(null);
  const [managingDocsOrderId, setManagingDocsOrderId] = useState<string | null>(null);
  const [viewingClientOrder, setViewingClientOrder] = useState<ServiceOrder | null>(null);

  // Quick action modal triggers
  const [openNewClientModalTrigger, setOpenNewClientModalTrigger] = useState(false);
  const [openNewOrderModalTrigger, setOpenNewOrderModalTrigger] = useState(false);

  // Supabase Cloud State
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(false);

  // Initialize storage & load state on mount (Hybrid Cloud + Local)
  useEffect(() => {
    initStorage();
    const storedUser = getCurrentUser();
    const storedClients = getStoredClients();
    const storedOrders = getStoredOrders();
    const storedDocs = getStoredDocuments();
    const storedLogs = getStoredAuditLogs();

    setUser(storedUser);
    setClients(storedClients);
    setOrders(storedOrders);
    setDocuments(storedDocs);
    setAuditLogs(storedLogs);

    if (storedUser) {
      setActiveTab(storedUser.role === 'admin' ? 'dashboard' : 'my-orders');
    }

    // Cloud Synchronization from Supabase
    const syncFromCloud = async () => {
      try {
        const [cloudOrders, cloudClients, cloudDocs, cloudLogs] = await Promise.all([
          fetchOrdersSupabase(),
          fetchClientsSupabase(),
          fetchDocumentsSupabase(),
          fetchAuditLogsSupabase()
        ]);

        if (cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
          saveStoredOrders(cloudOrders);
          setIsSupabaseOnline(true);
        }
        if (cloudClients && cloudClients.length > 0) {
          setClients(cloudClients);
          saveStoredClients(cloudClients);
          setIsSupabaseOnline(true);
        }
        if (cloudDocs && cloudDocs.length > 0) {
          setDocuments(cloudDocs);
          saveStoredDocuments(cloudDocs);
        }
        if (cloudLogs && cloudLogs.length > 0) {
          setAuditLogs(cloudLogs);
        }
      } catch (err) {
        console.warn('Supabase offline or tables pending:', err);
      }
    };

    syncFromCloud();

    // Realtime subscription to live updates
    const channel = supabase
      .channel('siem-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders' }, () => {
        fetchOrdersSupabase().then((latest) => {
          if (latest) {
            setOrders(latest);
            saveStoredOrders(latest);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sync helpers to storage
  const syncClients = (newClients: Client[]) => {
    setClients(newClients);
    saveStoredClients(newClients);
  };

  const syncOrders = (newOrders: ServiceOrder[]) => {
    setOrders(newOrders);
    saveStoredOrders(newOrders);
  };

  const syncDocuments = (newDocs: OrderDocument[]) => {
    setDocuments(newDocs);
    saveStoredDocuments(newDocs);
  };

  const syncUser = (newUser: User | null) => {
    setUser(newUser);
    setCurrentUser(newUser);
    if (newUser) {
      setActiveTab(newUser.role === 'admin' ? 'dashboard' : 'my-orders');
    }
  };

  // Handlers: Authentication
  const handleLoginSuccess = (loggedInUser: User) => {
    syncUser(loggedInUser);
    addAuditLog(loggedInUser.name, 'Inicio de Sesión', `Acceso al sistema como ${loggedInUser.role === 'admin' ? 'Administrador' : 'Cliente'}`);
    setAuditLogs(getStoredAuditLogs());
  };

  const handleLogout = () => {
    if (user) {
      addAuditLog(user.name, 'Cierre de Sesión', 'Salida del sistema');
    }
    syncUser(null);
  };

  // Switch role for quick testing
  const handleSwitchRole = (targetRole: 'admin' | 'client', targetClientId?: string) => {
    if (targetRole === 'admin') {
      const adminUser = ADMIN_USERS[0];
      syncUser(adminUser);
    } else if (targetClientId) {
      const clientMatch = clients.find((c) => c.id === targetClientId) || clients[0];
      if (clientMatch) {
        const clientUser: User = {
          id: 'user-client-' + clientMatch.id,
          name: clientMatch.contactName,
          email: clientMatch.email,
          username: clientMatch.username,
          role: 'client',
          clientId: clientMatch.id,
          position: 'Contacto Principal'
        };
        syncUser(clientUser);
      }
    }
  };

  // Reset demo state
  const handleResetDemoData = () => {
    resetDemoStorage();
    const storedClients = getStoredClients();
    const storedOrders = getStoredOrders();
    const storedDocs = getStoredDocuments();
    const storedLogs = getStoredAuditLogs();
    const storedUser = getCurrentUser();

    setClients(storedClients);
    setOrders(storedOrders);
    setDocuments(storedDocs);
    setAuditLogs(storedLogs);
    syncUser(storedUser);
    alert('Datos demo restablecidos al estado inicial.');
  };

  // CRM: Add Client
  const handleAddClient = (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...newClientData,
      id: 'client-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newClient, ...clients];
    syncClients(updated);
    upsertClientSupabase(newClient);

    addAuditLog(user?.name || 'Admin', 'Alta de Cliente', `Cliente "${newClient.razonSocial}" registrado con RFC ${newClient.rfc}`);
    setAuditLogs(getStoredAuditLogs());
  };

  // CRM: Update Client
  const handleUpdateClient = (updatedClient: Client) => {
    const updated = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
    syncClients(updated);
    upsertClientSupabase(updatedClient);

    addAuditLog(user?.name || 'Admin', 'Actualización de Cliente', `Se actualizaron credenciales/datos para "${updatedClient.razonSocial}"`);
    setAuditLogs(getStoredAuditLogs());
  };

  // Service Order: Create
  const handleCreateOrder = (newOrderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: ServiceOrder = {
      ...newOrderData,
      id: 'order-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newOrder, ...orders];
    syncOrders(updated);
    upsertOrderSupabase(newOrder);

    addAuditLog(user?.name || 'Admin', 'Creación de Orden', `Se generó la orden de servicio ${newOrder.folio} para ${newOrder.clientName}`);
    setAuditLogs(getStoredAuditLogs());
  };

  // Service Order: Update
  const handleUpdateOrder = (updatedOrder: ServiceOrder) => {
    const updated = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    syncOrders(updated);
    upsertOrderSupabase(updatedOrder);

    addAuditLog(user?.name || 'Admin', 'Modificación de Orden', `Se actualizó la orden ${updatedOrder.folio} a estatus "${updatedOrder.status}"`);
    setAuditLogs(getStoredAuditLogs());
  };

  // Service Order: Delete
  const handleDeleteOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    const updatedOrders = orders.filter((o) => o.id !== orderId);
    const updatedDocs = documents.filter((d) => d.orderId !== orderId);

    syncOrders(updatedOrders);
    syncDocuments(updatedDocs);
    deleteOrderSupabase(orderId);

    if (target) {
      addAuditLog(user?.name || 'Admin', 'Eliminación de Orden', `Se eliminó la orden de servicio ${target.folio}`);
      setAuditLogs(getStoredAuditLogs());
    }
  };

  // Documents: Add Document
  const handleAddDocument = (docData: Omit<OrderDocument, 'id' | 'uploadDate'>) => {
    const newDoc: OrderDocument = {
      ...docData,
      id: 'doc-' + Date.now() + Math.random().toString(36).substring(2, 5),
      uploadDate: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
    };
    const updated = [newDoc, ...documents];
    syncDocuments(updated);
    upsertDocumentSupabase(newDoc);

    const targetOrder = orders.find((o) => o.id === docData.orderId);
    addAuditLog(user?.name || 'Admin', 'Carga de PDF', `Se adjuntó "${newDoc.name}" (${newDoc.type}) a la orden ${targetOrder?.folio || docData.orderId}`);
    setAuditLogs(getStoredAuditLogs());
  };

  // Documents: Delete Document
  const handleDeleteDocument = (docId: string) => {
    const targetDoc = documents.find((d) => d.id === docId);
    const updated = documents.filter((d) => d.id !== docId);
    syncDocuments(updated);
    deleteDocumentSupabase(docId);

    if (targetDoc) {
      addAuditLog(user?.name || 'Admin', 'Eliminación de PDF', `Se eliminó el archivo "${targetDoc.name}"`);
      setAuditLogs(getStoredAuditLogs());
    }
  };

  // Documents: Replace Document
  const handleReplaceDocument = (docId: string, newFileUrl: string, newSize: number, newName: string) => {
    let replacedDoc: OrderDocument | null = null;
    const updated = documents.map((doc) => {
      if (doc.id === docId) {
        replacedDoc = {
          ...doc,
          name: newName,
          fileUrl: newFileUrl,
          size: newSize,
          uploadDate: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
        };
        return replacedDoc;
      }
      return doc;
    });
    syncDocuments(updated);
    if (replacedDoc) {
      upsertDocumentSupabase(replacedDoc);
    }

    addAuditLog(user?.name || 'Admin', 'Reemplazo de PDF', `Se reemplazó el archivo del documento ID ${docId} por "${newName}"`);
    setAuditLogs(getStoredAuditLogs());
  };

  // Update Client Password (from Client Profile)
  const handleUpdateClientPassword = (clientId: string, newPass: string) => {
    let targetClient: Client | null = null;
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        targetClient = { ...c, passwordHash: newPass };
        return targetClient;
      }
      return c;
    });
    syncClients(updated);
    if (targetClient) {
      upsertClientSupabase(targetClient);
    }

    addAuditLog(user?.name || 'Cliente', 'Cambio de Contraseña', `El cliente actualizó su clave de acceso al portal`);
    setAuditLogs(getStoredAuditLogs());
  };

  // Active Order for document management modal
  const selectedOrderForDocs = orders.find((o) => o.id === managingDocsOrderId) || null;

  // Active Client object if user is client
  const activeClient = user?.clientId
    ? clients.find((c) => c.id === user.clientId) || clients[0]
    : clients[0];

  // -------------------------------------------------------------
  // RENDER CONDITION 1: Home Screen / Role Selector when Logged Out
  // (NO Header, NO Footer as explicitly requested!)
  // -------------------------------------------------------------
  if (!user) {
    return (
      <HomeRoleSelector
        onLoginSuccess={handleLoginSuccess}
        clients={clients}
        adminUsers={ADMIN_USERS}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER CONDITION 2: Application Dashboard when Logged In
  // (With Sidebar + Mobile Bottom Navigation)
  // -------------------------------------------------------------
  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-row">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentUser={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        clientsList={clients}
        onSwitchRole={handleSwitchRole}
        onResetDemo={handleResetDemoData}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="md:hidden w-7 h-7 bg-slate-900 flex items-center justify-center rounded-sm shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                  Sistema Metrología
                </span>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                    isAdmin ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Cliente'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ISO/IEC 17025 • {user.name || user.username}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Configuración de Supabase Cloud y SQL"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Supabase</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseOnline ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-400'
                }`}
              />
            </button>

            {/* Quick Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 text-xs font-bold uppercase tracking-wider transition"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          {isAdmin ? (
            /* Admin / Technical Internal Views */
            <>
              {activeTab === 'dashboard' && (
                <AdminDashboard
                  orders={orders}
                  clients={clients}
                  documents={documents}
                  auditLogs={auditLogs}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenNewOrderModal={() => {
                    setActiveTab('orders');
                    setOpenNewOrderModalTrigger(true);
                  }}
                  onOpenNewClientModal={() => {
                    setActiveTab('orders');
                    setOpenNewOrderModalTrigger(true);
                  }}
                />
              )}

              {activeTab === 'orders' && (
                <OrderManagement
                  orders={orders}
                  clients={clients}
                  documents={documents}
                  onCreateOrder={handleCreateOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onDeleteOrder={handleDeleteOrder}
                  onOpenDocumentManager={(orderId) => setManagingDocsOrderId(orderId)}
                  isCreateModalOpenInitially={openNewOrderModalTrigger}
                  onCloseCreateModal={() => setOpenNewOrderModalTrigger(false)}
                />
              )}

              {activeTab === 'profile' && (
                <AdminProfile
                  currentUser={user}
                  onUpdateProfile={(updatedUser) => {
                    syncUser(updatedUser);
                    addAuditLog(updatedUser.name, 'Actualización de Perfil', 'Datos de contacto técnico modificados');
                    setAuditLogs(getStoredAuditLogs());
                  }}
                />
              )}
            </>
          ) : (
            /* Client Portal Views */
            <>
              {activeTab === 'my-orders' && (
                <ClientDashboard
                  currentClient={activeClient}
                  orders={orders}
                  documents={documents}
                  onOpenOrderDetail={(order) => setViewingClientOrder(order)}
                  onViewPdf={(doc) => setViewingPdfDoc(doc)}
                />
              )}

              {activeTab === 'my-profile' && (
                <ClientProfile
                  client={activeClient}
                  onUpdateClientPassword={handleUpdateClientPassword}
                />
              )}
            </>
          )}
        </main>

        {/* Workspace Footer when logged in */}
        <footer className="border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400 bg-white">
          <p>© 2026 Sistema Metrología • Laboratorio de Calibración Acreditado ISO/IEC 17025</p>
        </footer>
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <MobileBottomBar
        currentUser={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Global Shared Modals */}
      {/* 1. PDF Viewer Modal */}
      {viewingPdfDoc && (
        <PdfViewerModal
          document={viewingPdfDoc}
          folio={orders.find((o) => o.id === viewingPdfDoc.orderId)?.folio}
          clientName={orders.find((o) => o.id === viewingPdfDoc.orderId)?.clientName}
          onClose={() => setViewingPdfDoc(null)}
        />
      )}

      {/* 2. Admin Document Manager Modal */}
      {selectedOrderForDocs && (
        <DocumentManagerModal
          order={selectedOrderForDocs}
          documents={documents}
          onClose={() => setManagingDocsOrderId(null)}
          onAddDocument={handleAddDocument}
          onDeleteDocument={handleDeleteDocument}
          onReplaceDocument={handleReplaceDocument}
          onViewPdf={(doc) => setViewingPdfDoc(doc)}
        />
      )}

      {/* 3. Client Order Detail Modal */}
      {viewingClientOrder && (
        <ClientOrderDetail
          order={viewingClientOrder}
          client={activeClient}
          documents={documents}
          onClose={() => setViewingClientOrder(null)}
          onViewPdf={(doc) => setViewingPdfDoc(doc)}
        />
      )}

      {/* 4. Supabase Status & SQL Modal */}
      <SupabaseStatusModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </div>
  );
}
