/**
 * Utilidades para generación de contraseñas seguras y compartición por WhatsApp
 * Laboratorio de Metrología SIEM - ISO/IEC 17025
 */

export interface WhatsAppCredentialParams {
  systemUrl?: string;
  recipientName: string;
  username: string;
  password: string;
  roleOrPosition?: string;
  companyName?: string;
  phone?: string;
  notes?: string;
}

/**
 * Genera una contraseña segura con mayúsculas, minúsculas, números y caracteres especiales.
 * Ejemplos: Siem#8291!Kx, Calib#2026*Mtr, Siem$7392!Za
 */
export function generateSecurePassword(length: number = 12): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '#$!%*@';

  // Garantizar al menos uno de cada tipo
  let pass = '';
  pass += upper.charAt(Math.floor(Math.random() * upper.length));
  pass += lower.charAt(Math.floor(Math.random() * lower.length));
  pass += digits.charAt(Math.floor(Math.random() * digits.length));
  pass += symbols.charAt(Math.floor(Math.random() * symbols.length));

  const allChars = upper + lower + digits + symbols;
  for (let i = pass.length; i < length; i++) {
    pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Barajar caracteres
  return pass
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

/**
 * Calcula el nivel de seguridad de una contraseña
 */
export function getPasswordStrength(password: string): {
  score: number; // 0 a 4
  label: string;
  colorClass: string;
} {
  if (!password) {
    return { score: 0, label: 'Vacía', colorClass: 'text-slate-400 bg-slate-100' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 1:
      return { score: 1, label: 'Débil', colorClass: 'text-red-700 bg-red-100' };
    case 2:
      return { score: 2, label: 'Media', colorClass: 'text-amber-700 bg-amber-100' };
    case 3:
      return { score: 3, label: 'Segura', colorClass: 'text-sky-700 bg-sky-100' };
    case 4:
    default:
      return { score: 4, label: 'Muy Segura', colorClass: 'text-emerald-700 bg-emerald-100' };
  }
}

/**
 * Retorna la URL del sistema actual para compartir
 */
export function getSystemUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return 'https://ais-pre-g3sdoa2pdzfbjmtyihlr2r-22265430521.us-west2.run.app';
}

/**
 * Construye el mensaje oficial preformateado para WhatsApp
 */
export function buildWhatsAppCredentialMessage({
  systemUrl,
  recipientName,
  username,
  password,
  roleOrPosition,
  companyName,
  notes,
}: WhatsAppCredentialParams): string {
  const url = systemUrl || getSystemUrl();
  const dateStr = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let msg = `🔬 *SIEM METROLOGÍA - Credenciales Oficiales de Acceso* 🔬\n`;
  msg += `_Laboratorio de Calibración Acreditado ISO/IEC 17025_\n\n`;
  msg += `Estimado(a) *${recipientName}*,\n`;
  msg += `Le compartimos sus datos oficiales para ingresar a la plataforma digital de calibración:\n\n`;

  msg += `🌐 *Enlace del Sistema:* ${url}\n`;
  if (companyName) {
    msg += `🏢 *Empresa:* ${companyName}\n`;
  }
  if (roleOrPosition) {
    msg += `💼 *Puesto / Rol:* ${roleOrPosition}\n`;
  }
  msg += `👤 *Usuario de Acceso:* ${username}\n`;
  msg += `🔑 *Contraseña:* ${password}\n\n`;

  msg += `📋 *Instrucciones de Ingreso:*\n`;
  msg += `1. Abra el enlace en cualquier navegador (Chrome, Edge o Safari).\n`;
  msg += `2. Ingrese su usuario y contraseña asignados.\n`;
  msg += `3. Podrá consultar órdenes de servicio, estatus en tiempo real y descargar Certificados de Calibración oficiales en PDF.\n`;

  if (notes) {
    msg += `\n📌 *Nota adicional:* ${notes}\n`;
  }

  msg += `\n🔒 *Seguridad:* Fecha de emisión: ${dateStr}. No comparta sus credenciales con terceros.\n`;
  msg += `_SIEM - Servicios Integrales en Equipos de Medición_`;

  return msg;
}

/**
 * Abre WhatsApp con el mensaje pre-cargado
 */
export function shareCredentialsViaWhatsApp(params: WhatsAppCredentialParams): void {
  const message = buildWhatsAppCredentialMessage(params);
  let cleanPhone = (params.phone || '').replace(/[^\d]/g, '');

  // Si tiene 10 dígitos (México), anteponer 52
  if (cleanPhone.length === 10) {
    cleanPhone = '52' + cleanPhone;
  }

  const encodedMsg = encodeURIComponent(message);
  let waUrl = '';

  if (cleanPhone && cleanPhone.length >= 10) {
    waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
  } else {
    waUrl = `https://api.whatsapp.com/send?text=${encodedMsg}`;
  }

  // Copiar también al portapapeles por comodidad
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  window.open(waUrl, '_blank', 'noopener,noreferrer');
}
