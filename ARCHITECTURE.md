# Arquitectura Técnica: Cancionero Litúrgico Digital

Este documento describe la arquitectura técnica propuesta para la aplicación web "Cancionero Litúrgico", diseñada para ser una plataforma escalable, segura y de alto rendimiento.

## 1. Arquitectura General del Sistema

La arquitectura se basa en un enfoque JAMstack moderno, desacoplando el frontend, el backend y los servicios de terceros para maximizar la flexibilidad, escalabilidad y seguridad.

-   **Frontend:** **Next.js (App Router)** desplegado en **Vercel**. Se elige Next.js por su capacidad de renderizado híbrido (SSR y SSG), optimización de imágenes, excelente rendimiento y SEO. Vercel ofrece una integración perfecta, despliegues continuos (CI/CD) automáticos desde Git y una red de distribución de contenido (CDN) global.

-   **Backend:** **API Routes de Next.js** (Serverless Functions) alojadas en **Vercel**. Las funciones de backend se colocan junto al frontend, lo que simplifica el desarrollo. Al ser serverless, escalan automáticamente según la demanda y tienen un costo eficiente (pago por uso).

-   **Autenticación:** **Firebase Authentication**. Un servicio gestionado que provee una solución robusta y segura para el registro y login de usuarios, soportando múltiples proveedores (Google, correo/contraseña) con un SDK fácil de integrar y una generosa capa gratuita.

-   **Almacenamiento de Documentos:** **AWS S3**. Es el estándar de la industria para el almacenamiento de objetos. Ofrece durabilidad, bajo costo, alta disponibilidad y la capacidad de servir archivos de gran tamaño de manera eficiente.

-   **Búsqueda Avanzada:** **Servicio de Indexación Externo (ej. Algolia o AWS OpenSearch)**. Para permitir la búsqueda de texto completo dentro de los PDFs de manera eficiente, es necesario un servicio especializado. Un proceso de backend extraerá el texto de los PDFs y lo indexará en este servicio, permitiendo búsquedas casi instantáneas.

-   **Pasarela de Pagos:** **Stripe**. Ofrece una API robusta y amigable para desarrolladores, alta seguridad (PCI-DSS Nivel 1) y una excelente experiencia de usuario para gestionar suscripciones y pagos únicos a través de Stripe Checkout.

-   **Hosting:** **Vercel**. Es la plataforma ideal para Next.js, proveyendo un entorno optimizado, CI/CD, CDN global y escalado automático sin configuración manual.

## 2. Diagrama Lógico de Componentes

```mermaid
graph TD
    subgraph "Usuario"
        A[Navegador Web / Móvil]
    end

    subgraph "Plataforma Vercel"
        B(Next.js Frontend - App Router)
        C(Next.js Backend - API Routes)
    end

    subgraph "Servicios Externos"
        D[Firebase Authentication]
        E[AWS S3 Bucket]
        F[Stripe]
        G[Motor de Búsqueda <br> (Algolia / OpenSearch)]
    end
    
    subgraph "Proceso de Indexación (AWS)"
        H[S3 Event: Upload PDF]
        I[AWS Lambda Function]
        J[PDF Text Extraction]
    end

    A -- HTTP Request --> B
    B -- API Call --> C
    C -- Autenticación --> D
    C -- Genera Pre-signed URL --> E
    B -- Carga PDF con Pre-signed URL --> E
    C -- Petición de Pago --> F
    A -- Redirección a Checkout --> F
    F -- Webhook de Pago --> C
    C -- Búsqueda de Texto --> G
    
    H -- Triggers --> I
    I -- Procesa --> J
    J -- Envía datos --> G
```

## 3. Flujo de Usuario

1.  **Login / Registro:**
    1.  El usuario hace clic en "Login".
    2.  El frontend de Next.js muestra los proveedores (Google, Email).
    3.  El SDK de cliente de Firebase gestiona el flujo de autenticación.
    4.  Tras el éxito, Firebase devuelve un `JWT` (JSON Web Token).
    5.  El cliente almacena el token y lo envía en las cabeceras de las peticiones a las API Routes protegidas.

2.  **Visualización de PDF:**
    1.  El usuario navega a una página de un canto.
    2.  El frontend solicita al backend (API Route) el acceso al PDF del canto.
    3.  El backend verifica la sesión del usuario (si es requerido).
    4.  El backend utiliza el SDK de AWS para generar una **URL pre-firmada (pre-signed URL)** para el objeto PDF en S3, con un tiempo de expiración corto (ej. 5 minutos).
    5.  El backend devuelve esta URL al frontend.
    6.  El frontend utiliza una librería como **PDF.js** para renderizar el PDF directamente desde la URL pre-firmada, sin exponer las credenciales del bucket.

3.  **Búsqueda de Contenido:**
    1.  El usuario escribe un término en la barra de búsqueda.
    2.  El frontend llama a la API Route `/api/search`.
    3.  La API Route reenvía la consulta al **Servicio de Búsqueda** (Algolia/OpenSearch).
    4.  El servicio de búsqueda devuelve una lista de IDs de cantos que coinciden con el término.
    5.  El frontend muestra los resultados como enlaces a las páginas de los cantos correspondientes.

4.  **Apoyo al Proyecto (Suscripción):**
    1.  El usuario hace clic en "Apoya este proyecto".
    2.  El frontend llama a la API Route `/api/payments/create-checkout-session`.
    3.  El backend se comunica con Stripe para crear una sesión de Checkout para el producto de suscripción definido.
    4.  Stripe devuelve una URL de sesión.
    5.  El backend envía esta URL al frontend, que redirige al usuario a la página de pago segura de Stripe.
    6.  Una vez completado el pago, Stripe envía un **webhook** al endpoint `/api/webhooks/stripe` en nuestro backend para registrar el estado de la suscripción del usuario.

## 4. Estrategia de Integración con AWS S3

El acceso a los PDFs se gestionará de forma segura y eficiente mediante **URLs pre-firmadas**.

-   **Seguridad:** Las credenciales del bucket S3 (`AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`) se almacenan de forma segura como variables de entorno en Vercel, y nunca se exponen al cliente.
-   **Permisos:** Se creará un rol de IAM (Identity and Access Management) en AWS con permisos de solo lectura (`GetObject`) sobre el bucket, que será utilizado por la función serverless que genera las URLs.
-   **Eficiencia:** Los archivos se sirven directamente desde S3 al cliente, liberando al backend de la carga de transferir los datos del archivo.

**Variables de entorno requeridas en Vercel:**
-   `AWS_S3_BUCKET_NAME`
-   `AWS_REGION`
-   `AWS_ACCESS_KEY_ID`
-   `AWS_SECRET_ACCESS_KEY`

## 5. Estrategia de Búsqueda dentro de PDFs

La búsqueda de texto completo es una funcionalidad compleja que requiere un proceso de indexación asíncrono.

1.  **Activador (Trigger):** Se configura un evento de notificación en el bucket S3 (`s3:ObjectCreated:*`).
2.  **Procesamiento:** Cada vez que se sube o modifica un PDF, el evento activa una **función AWS Lambda**.
3.  **Extracción de Texto:** La función Lambda descarga temporalmente el PDF, utiliza una librería como `pdf-parse` (en Node.js) para extraer todo el contenido de texto.
4.  **Indexación:** La función envía el texto extraído, junto con metadatos como el título del canto y la ruta del S3, al servicio de búsqueda (Algolia, AWS OpenSearch). Este servicio optimiza y almacena los datos para consultas ultrarrápidas.

Este enfoque asegura que la función de búsqueda de la aplicación principal sea extremadamente rápida y no dependa del procesamiento de PDFs en tiempo real.

## 6. Diseño de Seguridad Básica

-   **Variables de Entorno:** Todas las claves secretas (Firebase, AWS, Stripe) se gestionarán como variables de entorno en Vercel, nunca hardcodeadas.
-   **Protección de APIs:** Las API Routes críticas se protegerán verificando el JWT de Firebase enviado en la cabecera `Authorization`.
-   **Seguridad de Webhooks:** El endpoint que recibe webhooks de Stripe debe verificar la firma de la solicitud para asegurar que proviene de Stripe.
-   **Acceso a Recursos:** El principio de moindre privilège (mínimo privilegio) se aplica a los roles de IAM en AWS.
-   **CORS:** Se configurarán políticas de Cross-Origin Resource Sharing en Vercel si fuera necesario.

## 7. Roadmap Evolutivo del Proyecto

-   **Fase 1 (MVP - Producto Mínimo Viable):**
    -   Autenticación de usuarios (Google/Email).
    -   Visor de PDFs cargados desde S3.
    -   Búsqueda básica por nombre de archivo/metadatos.
    -   Estructura básica de la UI/UX.

-   **Fase 2 (Funcionalidades Clave):**
    -   Integración completa con Stripe para suscripciones.
    -   Implementación del sistema de búsqueda de texto completo (Lambda + Servicio de Búsqueda).
    -   Paginación y filtros en los resultados de búsqueda.

-   **Fase 3 (Mejora de Experiencia de Usuario):**
    -   Funcionalidad de "Favoritos" y "Listas de Cantos".
    -   Mejoras en la interfaz del visor de PDF (zoom, modo pantalla completa).
    -   Optimización avanzada para móviles.

-   **Fase 4 (Capacidades Avanzadas):**
    -   **Modo Offline:** Convertir la aplicación en una Progressive Web App (PWA) para acceso sin conexión a cantos favoritos.
    -   **Roles de Usuario:** Roles de administrador o colaborador para gestionar contenido.
    -   **Analítica:** Integración de herramientas de analítica para entender el uso de la aplicación.

## 8. Recomendaciones de Buenas Prácticas DevOps

-   **Infraestructura como Código (IaC):** Utilizar **AWS CDK** o **Terraform** para definir y versionar la infraestructura de AWS (el bucket S3, la función Lambda, los roles IAM y el trigger de eventos). Esto permite recrear el entorno de forma predecible y automática.
-   **CI/CD:** Aprovechar al máximo la integración de Vercel con GitHub/GitLab. Cada `push` a la rama `main` despliega a producción, y los `push` a otras ramas o Pull Requests generan despliegues de previsualización aislados.
-   **Monitorización y Alertas:** Utilizar **Vercel Analytics** para el frontend y **Amazon CloudWatch** para monitorizar la salud y los logs de la función Lambda de indexación. Configurar alertas para fallos en la indexación.
-   **Gestión de Entornos:** Mantener entornos separados para desarrollo, staging (previsualización) y producción. Vercel facilita esto mediante sus despliegues de previsualización. Cada entorno tendrá su propio set de variables de entorno y, potencialmente, se conectará a diferentes servicios (ej. Stripe en modo test, base de datos de prueba).
