# MANUAL DE USUARIO Y GUÍA DE OPERACIÓN OFICIAL
## SISTEMA DE METROLOGÍA SIEM (Servicios Integrales en Equipos de Medición)
**Acreditación ISO/IEC 17025 • Versión 2026.2**

---

### ÍNDICE DE CONTENIDO
1. [Introducción y Acceso al Sistema](#1-introducción-y-acceso-al-sistema)
2. [Registro de Personal Técnico y Generador de Contraseñas](#2-registro-de-personal-técnico-y-generador-de-contraseñas)
3. [Gestión de Clientes y Empresas (Directorio CRM)](#3-gestión-de-clientes-y-empresas)
4. [Creación de una Nueva Orden de Servicio y Ficha F-7.2](#4-creación-de-una-nueva-orden-de-servicio)
5. [Edición de Órdenes y Flujo de Estados Metrológicos](#5-edición-de-órdenes-y-flujo-de-estados)
6. [Gestión del Expediente Digital y Documentos](#6-gestión-del-expediente-digital-y-documentos)
7. [Cómo Extraer y Guardar Documentos en PDF Oficial](#7-cómo-extraer-y-guardar-documentos-en-pdf)
8. [Guía para el Portal del Cliente Externo](#8-guía-para-el-portal-del-cliente-externo)
9. [Acceso y Administración de Supabase Cloud (Botón Directo y Base de Datos)](#9-acceso-y-administración-de-supabase-cloud)
10. [Preguntas Frecuentes y Soporte](#10-preguntas-frecuentes-y-soporte)

---

## 1. INTRODUCCIÓN Y ACCESO AL SISTEMA

El sistema **SIEM** es una plataforma integral desarrollada para gestionar con rigor técnico todos los procesos del laboratorio de calibración metrológica bajo los lineamientos de la norma **ISO/IEC 17025:2017**:
- Recepción, custodia y entrega de instrumentos de medición.
- Emisión de Hojas de Servicio y Fichas Técnicas Oficiales con código QR.
- Expedición de Certificados de Calibración con cálculo de incertidumbres expandidas ($k=2$).
- Módulo de administración de personal técnico con generador de claves y WhatsApp.
- Portal de autoconsulta 24/7 para clientes corporativos.
- Base de datos relacional en la nube respaldada por **Supabase Cloud**.

### 1.1 ¿Cómo ingresar?
1. Abra el enlace oficial del sistema en su navegador web preferido (Google Chrome, Microsoft Edge, Safari o Firefox).
2. Funciona de manera responsiva en computadoras de escritorio, portátiles, tabletas y teléfonos móviles sin necesidad de instalar aplicaciones adicionales.
3. En la pantalla de bienvenida, capture su **Usuario** y **Contraseña**:
   - **Administrador General (Ulises Contreras):**
     - Usuario: `ucontreras`
     - Contraseña: `Cuch#960303`
   - **Administrador de Laboratorio (Harold Anguiano):**
     - Usuario: `haroldo90`
     - Contraseña: `Chevropar#1970`
   - **Técnicos Metrólogos:** Credenciales generadas por el Administrador en el módulo de personal.
   - **Clientes externos:** Usuario y contraseña asignados a su empresa (ej. `autonorte` / `auto2026pass`).

---

## 2. REGISTRO DE PERSONAL TÉCNICO Y GENERADOR DE CONTRASEÑAS

El módulo **Registro de Personal** permite al Administrador gestionar a los técnicos, metrólogos y supervisores que intervienen en las calibraciones y emiten firmas en los certificados oficiales.

### 2.1 Acceso al Módulo
- **En computadora (Escritorio):** En el menú lateral izquierdo (Sidebar), haga clic en la opción **"Registro de Personal"** (icono de credencial/usuario con palomita).
- **En teléfono móvil:** En la barra inferior de navegación, toque el icono **"Personal"**.
- **Desde el Panel de Control:** En la pantalla de bienvenida o Dashboard, presione el botón de acceso rápido **"Registro de Personal"**.

### 2.2 Cómo dar de alta a un nuevo técnico
1. En el encabezado del módulo, presione el botón azul **"+ Registrar Técnico"**.
2. Complete la ficha técnica del colaborador:
   - **Nombre Completo:** Nombre y apellidos con grado profesional (Ej. *Ing. Carlos Méndez Treviño*).
   - **Cédula Profesional:** Registro de cédula ante la SEP/Dirección General de Profesiones (Ej. *CED-182399*).
   - **Rol y Puesto:** Metrólogo, Técnico de Calibración, Supervisor de Calidad o Director.
   - **Especialidad Metrológica:** Magnitud principal de competencia (Humedad, Temperatura, Presión, Masa, Dimensional, Par Torsional, etc.).
   - **Correo Electrónico:** Correo institucional o personal.
   - **Teléfono / WhatsApp:** Número móvil a 10 dígitos (indispensable para el envío automático de credenciales).

### 2.3 Generador de Contraseñas Seguras (Icono de Varita Mágica)
Para proteger la integridad de los certificados y evitar accesos no autorizados:
1. En el campo de contraseña, presione el botón **"Generar Segura"** con icono de varita mágica ✨.
2. El sistema creará al instante una contraseña de alta entropía que combina mayúsculas, minúsculas, números y caracteres especiales (por ejemplo: `SiemMet#8391` o `Calib#9284`).

### 2.4 Visualización de Contraseña (Icono del Ojito)
- Todos los campos de contraseña en el sistema cuentan con el icono interactivo del **ojito** 👁️.
- Al hacer clic sobre el ojito, el texto se hace visible para validar visualmente la clave antes de guardarla o compartirla.
- Al volver a hacer clic, se oculta inmediatamente con puntos de seguridad.

### 2.5 Envío Directo de Credenciales por WhatsApp
Para evitar errores de captura o demoras en la comunicación con el personal de campo o planta:
1. Al guardar el registro o en la tarjeta de cualquier técnico, presione el botón verde **"WhatsApp"**.
2. El sistema abrirá automáticamente WhatsApp (Web o App en celular) con un mensaje redactado profesionalmente:
   - Saludo cordial con el nombre del metrólogo.
   - Enlace oficial del sistema SIEM.
   - Usuario de acceso asignado.
   - Contraseña generada.
   - Recomendaciones de confidencialidad y buenas prácticas de laboratorio.
3. Solo debe pulsar **Enviar** y el técnico podrá ingresar con un solo toque desde su teléfono móvil.

---

## 3. GESTIÓN DE CLIENTES Y EMPRESAS

Antes de recibir equipos o generar una orden, la empresa cliente debe estar registrada en el directorio oficial.

### 3.1 Cómo dar de alta un nuevo cliente
1. En el menú lateral, seleccione **"Clientes y Empresas"** o ingrese a la pestaña *Clientes* dentro de Órdenes.
2. Haga clic en **"+ Registrar Nuevo Cliente"**.
3. Capture los datos fiscales y operativos:
   - **Razón Social:** Nombre fiscal registrado ante el SAT (Ej. *Industrias Automotrices del Norte S.A. de C.V.*).
   - **RFC:** Clave de Registro Federal de Contribuyentes (Ej. *IAN880315KH4*).
   - **Contacto Técnico:** Nombre del encargado de calidad o metrología en la planta.
   - **Correo y Teléfono:** Medios de notificación para envío de certificados listos.
   - **Dirección de Planta / Fiscal:** Domicilio donde opera el cliente.
4. **Asignación de Acceso al Portal:**
   - Asigne un **Usuario** exclusivo (ej. `autonorte`).
   - Defina una **Contraseña** o use el generador de claves seguras.
5. Presione **"Guardar Cliente"**. El cliente queda sincronizado de inmediato en Supabase Cloud.

### 3.2 Edición y Consulta
- En la tabla de clientes puede buscar por Razón Social, RFC o contacto.
- El botón de **Lápiz (Editar)** permite actualizar domicilios, teléfonos o restablecer contraseñas en caso de extravío.

---

## 4. CREACIÓN DE UNA NUEVA ORDEN DE SERVICIO

La Orden de Servicio ampara la recepción formal de los instrumentos en el laboratorio conforme al procedimiento P-7.2.

### 4.1 Paso a paso para generar la orden
1. Presione el botón **"+ Nueva Orden SIEM"** en el panel principal o en la barra de órdenes.
2. Seleccione el **Cliente** de la lista desplegable; el sistema autocompletará su RFC, teléfono y dirección.
3. Establezca las fechas de recepción y la fecha acordada para entrega.
4. Asigne al **Metrólogo Responsable**.
5. **Captura del Instrumento:**
   - **Instrumento:** Termohigrómetro, Manómetro, Calibrador Pie de Rey, Micrómetro, Balanza Analítica, etc.
   - **Marca, Modelo y Número de Serie:** Datos de placa del equipo.
   - **ID Interno (TAG):** Clave interna asignada por la planta cliente (ej. `SIEM-AH-004`).
   - **Magnitud Metrológica:** Humedad, Presión, Temperatura, Masa, Dimensional, etc.
   - **Vigencia Sugerida:** 6 meses, 1 año o 2 años.
6. **Observaciones de Entrada:** Registre si el equipo incluye estuches, sondas, cables de alimentación o si tiene desgaste estético.
7. Presione **"Crear Orden de Servicio"**. Se generará el folio oficial con estatus **"En Proceso"**.

---

## 5. EDICIÓN DE ÓRDENES Y FLUJO DE ESTADOS

### 5.1 Estatus Metrológicos Oficiales
- 🟡 **En Proceso:** El instrumento se encuentra en aclimatación o en calibración en banco.
- 🟢 **Completada:** Calibración terminada satisfactoriamente y Certificado Oficial emitido.
- 🔵 **Entregada:** El equipo y su certificado original fueron entregados físicamente al cliente.
- 🔴 **Cancelada:** Servicio no procedente por daño irrecuperable en el sensor o petición del cliente.

### 5.2 Cambio de Estado Rápido
En la tabla de órdenes, haga clic directo sobre la pastilla de estado para seleccionar la nueva etapa; los cambios se guardan de forma instantánea.

---

## 6. GESTIÓN DEL EXPEDIENTE DIGITAL Y DOCUMENTOS

Cada orden cuenta con su propio expediente electrónico para archivar documentación complementaria:
1. En la fila de la orden, presione el botón de **Carpeta ("Documentos")**.
2. Para anexar un archivo:
   - Indique el **Nombre del Documento** (ej. *Certificado Oficial de Humedad F-7.2*).
   - Elija el **Tipo**: Certificado de Calibración, Hoja de Servicio, Cotización, Factura o Remisión.
   - Suba el archivo (PDF, PNG, JPG) o vincule la URL.
   - Haga clic en **"Guardar y Vincular Documento"**.
3. Cuenta con visor de alta definición integrado para inspeccionar cualquier archivo sin salir de la plataforma.

---

## 7. CÓMO EXTRAER Y GUARDAR DOCUMENTOS EN PDF OFICIAL

El sistema incluye plantillas membretadas en alta resolución listas para imprimir o enviar digitalmente.

### 7.1 Ficha Oficial de Recepción de Orden de Servicio
1. En la orden correspondiente, haga clic en el botón con icono de **Impresora**.
2. Aparecerá en pantalla la hoja membretada con logotipo de SIEM, código QR de validación, tabla de equipos y espacios de firma.
3. Presione el botón azul **"Imprimir / Guardar PDF"**.
4. En el diálogo del navegador:
   - **Destino:** Guardar como PDF.
   - **Diseño:** Horizontal (Landscape).
   - **Opciones avanzadas:** Activar la casilla *"Gráficos en segundo plano"*.
5. Presione **Guardar**.

### 7.2 Certificado de Calibración ISO/IEC 17025 (Formato F-7.2)
1. En órdenes completadas, haga clic en **"Ver Certificado Oficial"**.
2. Se desplegará el certificado oficial con:
   - Trazabilidad a patrones nacionales del CENAM.
   - Condiciones ambientales registradas durante la prueba.
   - Tabla de puntos de calibración, errores e incertidumbres expandidas ($U$).
   - Firmas autorizadas del metrólogo y signatario.
3. Presione **"Descargar / Imprimir en PDF"** con orientación **Vertical (Portrait)**.

---

## 8. GUÍA PARA EL PORTAL DEL CLIENTE EXTERNO

Instrucciones para orientar a sus clientes:
1. El cliente ingresa con su usuario y clave empresarial.
2. Tendrá acceso exclusivo a los equipos de su empresa.
3. Podrá consultar en tiempo real si el equipo está en calibración o ya listo para entrega.
4. Cuenta con descarga directa en 1 clic de sus Certificados de Calibración vigentes para sus auditorías de calidad (ISO 9001, IATF 16949, COFEPRIS).

---

## 9. ACCESO Y ADMINISTRACIÓN DE SUPABASE CLOUD

El sistema SIEM está respaldado por **Supabase Cloud**, una base de datos PostgreSQL de alta disponibilidad que garantiza que sus datos nunca se pierdan.

### 9.1 Botón de Acceso Directo a Supabase en la Barra Superior
- En la esquina superior derecha del sistema, localice el botón **"Supabase Cloud"** (con el logotipo de Supabase en color verde).
- Al hacer clic, se abre el panel de control de la nube donde podrá revisar la conectividad y hacer clic directo en **"Abrir Consola de Supabase"**.
- También dentro de este mismo Manual de Usuario (Capítulo 9) encontrará el botón verde **"Entrar a mi Cuenta de Supabase"**.

### 9.2 Credenciales Oficiales de la Cuenta
- **Portal de Acceso:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Correo de Administrador:** `ucontreras@siemmx.com`
- **Contraseña Maestra:** `Cuch#960303` *(puede pulsar el icono del ojito para visualizarla)*
- **Proyecto:** `ucontreras@siemmx.com's Project (dkcapqljyznnimiczlpr)`

### 9.3 Cómo usar la Consola de Supabase
1. Entre a [https://supabase.com/dashboard](https://supabase.com/dashboard) e inicie sesión con las credenciales indicadas.
2. Seleccione su proyecto SIEM.
3. **Table Editor (Editor de Tablas):**
   - Ingrese en el menú izquierdo a **Table Editor** para consultar, filtrar, editar o exportar registros de:
     - `admin_users`: Metrólogos registrados, especialidades, cédulas y contraseñas.
     - `clients`: Directorio de empresas clientes, teléfonos y credenciales del portal.
     - `service_orders`: Todas las órdenes de calibración y sus datos técnicos.
     - `order_documents`: Expediente digital y certificados adjuntos.
     - `audit_logs`: Registro histórico de auditoría ISO 17025.
4. **SQL Editor (Editor SQL):**
   - En la sección **SQL Editor**, cree una nueva consulta (*New Query*) y pegue el **Script SQL Actualizado** que se incluye a continuación para regenerar o migrar la base de datos con un solo clic.

---

## 10. PREGUNTAS FRECUENTES Y SOPORTE

- **¿Dónde puedo consultar el script SQL para Supabase?**
  El script completo se encuentra en los archivos `/supabase/schema.sql` y `/public/supabase/schema.sql` del sistema, listo para ejecutarse en el SQL Editor de Supabase.
- **¿Qué hago si un técnico olvida su contraseña?**
  El Administrador entra a *Registro de Personal*, localiza al técnico, presiona *Editar*, genera una nueva clave con la varita mágica y se la envía por WhatsApp con el botón verde.
- **¿Cómo imprimo este Manual de Usuario completo en PDF?**
  Abra el botón **"Manual de Usuario (PDF)"** en la barra superior o en el menú lateral y haga clic en **"Descargar en PDF"**. Se descargará un documento formal con portada membretada, índice y formato listo para auditorías.

---
*SIEM Servicios Integrales en Equipos de Medición • Laboratorio de Calibración Acreditado ISO/IEC 17025:2017*
