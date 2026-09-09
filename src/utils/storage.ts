import { Client, ServiceOrder, OrderDocument, AuditLog, User } from '../types';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_CLIENTS,
  INITIAL_ORDERS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

const STORAGE_KEYS = {
  CLIENTS: 'metrologia_clients_v1',
  ORDERS: 'metrologia_orders_v1',
  DOCUMENTS: 'metrologia_documents_v1',
  AUDIT_LOGS: 'metrologia_audit_v1',
  CURRENT_USER: 'metrologia_current_user_v1',
  ADMIN_USERS: 'metrologia_admin_users_v1'
};

// Initialize default data if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_ADMIN_USERS[0]));
  }
}

// Clients
export function getStoredClients(): Client[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]');
  } catch {
    return INITIAL_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

// Service Orders
export function getStoredOrders(): ServiceOrder[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: ServiceOrder[]): void {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// Documents
export function getStoredDocuments(): OrderDocument[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]');
  } catch {
    return INITIAL_DOCUMENTS;
  }
}

export function saveStoredDocuments(documents: OrderDocument[]): void {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
}

// Audit Logs
export function getStoredAuditLogs(): AuditLog[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(user: string, action: string, details: string): void {
  const logs = getStoredAuditLogs();
  const newLog: AuditLog = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
    user,
    action,
    details
  };
  const updated = [newLog, ...logs];
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated.slice(0, 50)));
}

// Current User Session
export function getCurrentUser(): User | null {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return INITIAL_ADMIN_USERS[0];
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Reset Storage to Fresh Demo State
export function resetDemoStorage(): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_ADMIN_USERS[0]));
}
