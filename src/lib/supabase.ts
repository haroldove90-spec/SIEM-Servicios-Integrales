import { createClient } from '@supabase/supabase-js';
import { Client, ServiceOrder, OrderDocument, AuditLog, User } from '../types';

// Extract and sanitize URL and Anon Key
const env = (import.meta as any).env || {};
const rawUrl = env.VITE_SUPABASE_URL || 'https://dkcapqljyznnimiczlpr.supabase.co';
// Clean any /rest/v1 or trailing slash
const sanitizedUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

const anonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrY2FwcWxqeXpubmltaWN6bHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNDQyMDAsImV4cCI6MjEwNDYyMDIwMH0.oqPo6aXL4IR8rtU7HyAxOTFB55mh9YD-_k9pJEMyunU';

export const SUPABASE_CONFIG = {
  url: sanitizedUrl,
  anonKey,
  projectId: 'dkcapqljyznnimiczlpr',
  projectName: "ucontreras@siemmx.com's Project"
};

export const supabase = createClient(sanitizedUrl, anonKey);

// Data Mappers: Frontend <-> Supabase DB

export const mapDbToClient = (row: any): Client => ({
  id: row.id,
  razonSocial: row.razon_social,
  rfc: row.rfc,
  contactName: row.contact_name,
  email: row.email,
  phone: row.phone,
  address: row.address || undefined,
  username: row.username,
  passwordHash: row.password_hash,
  active: row.active ?? true,
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  notes: row.notes || undefined,
});

export const mapClientToDb = (client: Client) => ({
  id: client.id,
  razon_social: client.razonSocial,
  rfc: client.rfc,
  contact_name: client.contactName,
  email: client.email,
  phone: client.phone,
  address: client.address || null,
  username: client.username,
  password_hash: client.passwordHash,
  active: client.active,
  notes: client.notes || null,
});

export const mapDbToOrder = (row: any): ServiceOrder => ({
  id: row.id,
  folio: row.folio,
  elaboro: row.elaboro || undefined,
  fechaRecepcion: row.fecha_recepcion || undefined,
  fechaEntrega: row.fecha_entrega || undefined,
  clientId: row.client_id || '',
  clientName: row.client_name,
  clientRfc: row.client_rfc,
  clientPhone: row.client_phone || undefined,
  clientContact: row.client_contact || undefined,
  clientEmail: row.client_email || undefined,
  clientAddress: row.client_address || undefined,
  certRazonSocial: row.cert_razon_social || undefined,
  certDireccion: row.cert_direccion || undefined,
  equipments: Array.isArray(row.equipments) ? row.equipments : [],
  observacionesGenerales: row.observaciones_generales || undefined,
  recibidoPor: row.recibido_por || undefined,
  fechaFirmaRecibido: row.fecha_firma_recibido || undefined,
  calibrationDate: row.calibration_date || row.fecha_recepcion || '',
  status: row.status || 'En Proceso',
  equipmentNotes: row.equipment_notes || '',
  technicianName: row.technician_name || '',
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
});

export const mapOrderToDb = (order: ServiceOrder) => ({
  id: order.id,
  folio: order.folio,
  elaboro: order.elaboro || null,
  fecha_recepcion: order.fechaRecepcion || null,
  fecha_entrega: order.fechaEntrega || null,
  client_id: order.clientId || null,
  client_name: order.clientName,
  client_rfc: order.clientRfc,
  client_phone: order.clientPhone || null,
  client_contact: order.clientContact || null,
  client_email: order.clientEmail || null,
  client_address: order.clientAddress || null,
  cert_razon_social: order.certRazonSocial || null,
  cert_direccion: order.certDireccion || null,
  equipments: order.equipments || [],
  observaciones_generales: order.observacionesGenerales || null,
  recibido_por: order.recibidoPor || null,
  fecha_firma_recibido: order.fechaFirmaRecibido || null,
  calibration_date: order.calibrationDate,
  status: order.status,
  equipment_notes: order.equipmentNotes,
  technician_name: order.technicianName,
  updated_at: new Date().toISOString(),
});

export const mapDbToDocument = (row: any): OrderDocument => ({
  id: row.id,
  orderId: row.order_id,
  name: row.name,
  type: row.type,
  size: Number(row.size || 0),
  uploadDate: row.upload_date,
  fileUrl: row.file_url,
  isSample: row.is_sample ?? false,
  description: row.description || undefined,
});

export const mapDocumentToDb = (doc: OrderDocument) => ({
  id: doc.id,
  order_id: doc.orderId,
  name: doc.name,
  type: doc.type,
  size: doc.size,
  upload_date: doc.uploadDate,
  file_url: doc.fileUrl,
  is_sample: doc.isSample ?? false,
  description: doc.description || null,
});

export const mapDbToAuditLog = (row: any): AuditLog => ({
  id: row.id,
  timestamp: row.timestamp,
  user: row.user_name,
  action: row.action,
  details: row.details,
});

export const mapAuditLogToDb = (log: AuditLog) => ({
  id: log.id,
  timestamp: log.timestamp,
  user_name: log.user,
  action: log.action,
  details: log.details,
});

// Database Operations with Graceful Fallback

export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string; tablesExist: boolean }> {
  try {
    const { error } = await supabase.from('service_orders').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          connected: true,
          tablesExist: false,
          message: 'Conexión exitosa a Supabase, pero las tablas aún no han sido creadas. Ejecuta el script SQL en el Editor SQL de Supabase.'
        };
      }
      return {
        connected: false,
        tablesExist: false,
        message: `Error al conectar con Supabase: ${error.message}`
      };
    }
    return {
      connected: true,
      tablesExist: true,
      message: 'Conexión a Supabase activa y tablas verificadas con éxito.'
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesExist: false,
      message: err?.message || 'No fue posible contactar el servidor de Supabase.'
    };
  }
}

// Clients Operations
export async function fetchClientsSupabase(): Promise<Client[] | null> {
  try {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapDbToClient);
  } catch {
    return null;
  }
}

export async function upsertClientSupabase(client: Client): Promise<boolean> {
  try {
    const dbPayload = mapClientToDb(client);
    const { error } = await supabase.from('clients').upsert(dbPayload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteClientSupabase(clientId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    return !error;
  } catch {
    return false;
  }
}

// Orders Operations
export async function fetchOrdersSupabase(): Promise<ServiceOrder[] | null> {
  try {
    const { data, error } = await supabase.from('service_orders').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapDbToOrder);
  } catch {
    return null;
  }
}

export async function upsertOrderSupabase(order: ServiceOrder): Promise<boolean> {
  try {
    const dbPayload = mapOrderToDb(order);
    const { error } = await supabase.from('service_orders').upsert(dbPayload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteOrderSupabase(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('service_orders').delete().eq('id', orderId);
    return !error;
  } catch {
    return false;
  }
}

// Documents Operations
export async function fetchDocumentsSupabase(): Promise<OrderDocument[] | null> {
  try {
    const { data, error } = await supabase.from('order_documents').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapDbToDocument);
  } catch {
    return null;
  }
}

export async function upsertDocumentSupabase(doc: OrderDocument): Promise<boolean> {
  try {
    const dbPayload = mapDocumentToDb(doc);
    const { error } = await supabase.from('order_documents').upsert(dbPayload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteDocumentSupabase(docId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('order_documents').delete().eq('id', docId);
    return !error;
  } catch {
    return false;
  }
}

// Audit Logs Operations
export async function fetchAuditLogsSupabase(): Promise<AuditLog[] | null> {
  try {
    const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (error || !data) return null;
    return data.map(mapDbToAuditLog);
  } catch {
    return null;
  }
}

export async function insertAuditLogSupabase(log: AuditLog): Promise<boolean> {
  try {
    const dbPayload = mapAuditLogToDb(log);
    const { error } = await supabase.from('audit_logs').insert(dbPayload);
    return !error;
  } catch {
    return false;
  }
}

// Admin Users Operations
export const mapDbToUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  username: row.username,
  password: row.password_hash || row.password || (row.username === 'ucontreras' ? 'Cuch#960303' : 'Chevropar#1970'),
  role: (row.role as any) || 'admin',
  position: row.position || undefined,
  phone: row.phone || undefined,
  avatar: row.avatar || undefined,
  specialty: row.specialty || undefined,
  cedula: row.cedula || undefined,
  active: row.active ?? true,
});

export const mapUserToDb = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  password_hash: user.password,
  role: user.role,
  position: user.position || null,
  phone: user.phone || null,
  avatar: user.avatar || null,
  specialty: user.specialty || null,
  cedula: user.cedula || null,
  active: user.active ?? true,
});

export async function fetchAdminUsersSupabase(): Promise<User[] | null> {
  try {
    const { data, error } = await supabase.from('admin_users').select('*');
    if (error || !data || data.length === 0) return null;
    return data.map(mapDbToUser);
  } catch {
    return null;
  }
}

export async function upsertAdminUserSupabase(user: User): Promise<boolean> {
  try {
    const payload = mapUserToDb(user);
    let { error } = await supabase.from('admin_users').upsert(payload, { onConflict: 'id' });
    if (error) {
      // Fallback if some new columns are not yet applied in remote schema
      const basicPayload: any = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        password_hash: user.password,
        role: user.role,
        position: user.position || null,
        phone: user.phone || null,
      };
      const res = await supabase.from('admin_users').upsert(basicPayload, { onConflict: 'id' });
      error = res.error;
    }
    return !error;
  } catch {
    return false;
  }
}

