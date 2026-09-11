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
  } else {
    // Ensure Ulises and Harold are present and up to date in stored admin users
    try {
      const existing: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_USERS) || '[]');
      const updated = existing.map(u => {
        if (u.username === 'haroldo90' || u.email?.includes('haroldo90')) {
          return {
            ...u,
            email: 'haroldo90@hotmail.com',
            username: 'haroldo90',
            password: 'Chevropar#1970'
          };
        }
        if (u.username === 'ucontreras' || u.email === 'ucontreras@siemmx.com') {
          return {
            ...u,
            email: 'ucontreras@siemmx.com',
            username: 'ucontreras',
            password: 'Cuch#960303'
          };
        }
        return u;
      });

      const hasHarold = updated.some(u => u.username === 'haroldo90');
      const hasUlises = updated.some(u => u.username === 'ucontreras');

      if (!hasHarold || !hasUlises) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      } else {
        localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updated));
      }
    } catch {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
    }
  }
  // Note: Do not auto-login, show access form on Home by default
}

// Admin Users
export function getStoredAdminUsers(): User[] {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    if (!raw) return INITIAL_ADMIN_USERS;
    let list: User[] = JSON.parse(raw);
    
    // Ensure Ulises and Harold exist
    let modified = false;
    for (const baseUser of INITIAL_ADMIN_USERS) {
      const idx = list.findIndex(u => u.username === baseUser.username);
      if (idx === -1) {
        list.push(baseUser);
        modified = true;
      }
    }

    if (modified) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(list));
    }
    return list;
  } catch {
    return INITIAL_ADMIN_USERS;
  }
}

export function saveStoredAdminUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
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
    return null;
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
