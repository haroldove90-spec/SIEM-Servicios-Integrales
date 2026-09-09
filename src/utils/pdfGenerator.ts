/**
 * Utility to generate valid PDF Data URLs for Calibration Certificates and Technical Reports
 */

export function generateSamplePdfDataUrl(
  documentTitle: string,
  folio: string,
  clientName: string,
  date: string,
  docType: string
): string {
  // Generate a valid minimal PDF base64 standard string with custom content
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F2 18 Tf
50 720 Td
(SISTEMA DE METROLOGIA Y CALIBRACION) Tj
0 -24 Td
/F1 12 Tf
(${docType.toUpperCase()}) Tj
0 -30 Td
(FOLIO DE ORDEN: ${folio}) Tj
0 -18 Td
(CLIENTE: ${clientName}) Tj
0 -18 Td
(FECHA DE EMISION: ${date}) Tj
0 -18 Td
(DOCUMENTO: ${documentTitle}) Tj
0 -30 Td
(--------------------------------------------------------------------------------) Tj
0 -20 Td
(DETALLES DEL SERVICIO DE METROLOGIA:) Tj
0 -18 Td
(1. Equipo Evaluado: Calibracion e Inspeccion de Exactitud) Tj
0 -18 Td
(2. Patron de Referencia: MET-PAT-004 Traceable ISO/IEC 17025) Tj
0 -18 Td
(3. Temperatura Ambiental: 20.2 C | Humedad Relativa: 48%) Tj
0 -18 Td
(4. Resultado: CONFORME / DENTRO DE TOLERANCIA) Tj
0 -40 Td
(--------------------------------------------------------------------------------) Tj
0 -20 Td
(TECNICO RESPONSABLE: Ulises Martinez - Lider de Metrologia) Tj
0 -18 Td
(ESTADO: CERTIFICADO VALIDO Y FIRMADO DIGITALMENTE) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000256 00000 n 
0000000806 00000 n 
0000000873 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
945
%%EOF`;

  // Encode to Base64
  try {
    const base64 = btoa(unescape(encodeURIComponent(pdfContent)));
    return `data:application/pdf;base64,${base64}`;
  } catch (e) {
    return 'data:application/pdf;base64,';
  }
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
