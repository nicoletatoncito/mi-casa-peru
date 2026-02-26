## Mi Casa Perú – Plantilla Next.js inmobiliaria

Mi Casa Perú es una plantilla inmobiliaria profesional construida con **Next.js (App Router)**, **Tailwind CSS** y **Supabase**. Incluye listado de propiedades con mapa, detalle con SEO dinámico, panel admin y captura de leads.

---

### Requisitos previos

- Node.js 18+ (recomendado 20+)
- npm o pnpm
- Cuenta de Supabase (proyecto creado)

---

### Instalación

1. Clonar el repositorio:

```bash
git clone <TU_REPO.git>
cd mi-casa-peru
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env.local` en la raíz del proyecto.

---

### Variables de entorno (.env.local)

Configura las siguientes variables, usando los valores de tu proyecto Supabase:

```bash
# URL pública de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxx.supabase.co"

# Anon key pública (desde Settings → API → Project API keys)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5..."

# Service role key (NO exponer en frontend ni en repos públicos)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5..."
```

> **Importante**: El archivo `.env.local` **no** debe commitearse. Mantén tu `SUPABASE_SERVICE_ROLE_KEY` fuera de repositorios públicos.

---

### Esquema mínimo en Supabase

#### Tabla `listings`

Columna | Tipo | Notas
------- | ---- | -----
`id` | `uuid` (PK, default `uuid_generate_v4()`) | Identificador del listing
`title` | `text` | Título de la propiedad
`description` | `text` | Descripción larga
`status` | `text` | `draft` \| `published` \| `archived`
`operation` | `text` | `venta` \| `alquiler`
`property_type` | `text` | Ej: "Departamento"
`district` | `text` | Opcional
`city` | `text` | Ej: "Lima"
`address` | `text` | Dirección
`price_pen` | `numeric` | Precio en soles
`beds` | `integer` | Dormitorios
`baths` | `integer` | Baños
`parking` | `integer` | Estacionamientos
`area_m2` | `numeric` | Área en m²
`lat` | `numeric` | Latitud
`lng` | `numeric` | Longitud
`image_url` | `text` | URL portada
`whatsapp_phone` | `text` | Teléfono WhatsApp (solo dígitos, con código de país)
`featured` | `boolean` | Destacado
`verified` | `boolean` | Verificado
`created_at` | `timestamp` (default `now()`) | Fecha de creación

#### Tabla `listing_images` (opcional, para galería)

Columna | Tipo | Notas
------- | ---- | -----
`id` | `uuid` (PK) |
`listing_id` | `uuid` (FK → `listings.id`) |
`path` | `text` | Ruta dentro del bucket `listing-images`
`is_cover` | `boolean` | Marca de portada
`sort_order` | `integer` | Orden
`created_at` | `timestamp` | Fecha de subida

#### Bucket de storage

- Crear bucket `listing-images` en Supabase Storage.

#### Tabla `leads`

Columna | Tipo | Notas
------- | ---- | -----
`id` | `uuid` (PK) |
`listing_id` | `uuid` | Referencia al listing
`name` | `text` | Nombre del lead
`phone` | `text` | Teléfono opcional
`message` | `text` | Mensaje opcional
`source` | `text` | Ej: `"web"`
`created_at` | `timestamp` (default `now()`) |

#### Tabla `profiles` (para rol admin)

Columna | Tipo | Notas
------- | ---- | -----
`user_id` | `uuid` (PK) | Id de usuario Supabase Auth
`role` | `text` | `"admin"` para acceso al panel

---

### Políticas RLS recomendadas (resumen)

- `listings`:
  - `SELECT`: permitir a `anon` solo filas con `status = 'published'`.
  - `INSERT/UPDATE/DELETE`: solo con `service_role` (desde backend).
- `leads`:
  - `INSERT`: permitir a `anon` (para guardar leads desde la web).
  - `SELECT/UPDATE/DELETE`: restringir a servicio / rol interno.
- `profiles`:
  - `SELECT`: restringir según tus necesidades internas.

Adapta las políticas a tu modelo de seguridad.

---

### Scripts de desarrollo y build

- Desarrollo:

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

- Build de producción:

```bash
npm run build
```

- Ejecutar en modo producción (después de `build`):

```bash
npm start
```

---

### Flujo de autenticación admin

1. Crea un usuario en Supabase Auth (email/contraseña).
2. En la tabla `profiles`, crea una fila con:
   - `user_id` = `id` del usuario de Supabase.
   - `role` = `"admin"`.
3. Carga el sitio en desarrollo o producción.
4. Accede a `/login`:
   - Inicia sesión con email/contraseña del usuario creado.
   - El sistema crea una cookie de sesión interna para admin.

A partir de ahí, tendrás acceso al panel admin.

---

### Crear propiedades desde el panel admin

1. Inicia sesión en `/login` con un usuario que tenga `role = 'admin'`.
2. Ir a `/admin` (redirige a `/admin/listings`).
3. Pulsar **“+ Nueva propiedad”**.
4. Completar el formulario:
   - Título, operación (`venta`/`alquiler`), tipo, ciudad, distrito, dirección.
   - Precio, dormitorios, baños, estacionamientos, área.
   - Lat/Lng (para el mapa).
   - URL de imagen principal (opcional).
   - WhatsApp del dueño (solo dígitos, incluyendo código de país; ej: `51939226632`).
   - Marcar `featured` / `verified` si aplica.
   - Estado:
     - `draft` → oculto en la web pública.
     - `published` → visible en `/propiedades` y `/propiedades/[id]`.
5. Guardar:
   - El panel usará las APIs `/api/admin/listings` y revalidará:
     - `/`
     - `/propiedades`
     - `/propiedades/[id]`

Para editar o eliminar una propiedad:

- Desde `/admin/listings`, usar los botones **Ver** / **Editar** sobre cada fila.

---

### Rutas principales de la app

- Público:
  - `/` – Landing principal.
  - `/propiedades` – Listado de propiedades + filtros + mapa.
  - `/propiedades/[id]` – Detalle de propiedad con:
    - Descripción, datos básicos.
    - Botón de WhatsApp por propiedad (uso de `whatsapp_phone` con fallback).
    - Formulario de leads (`/api/leads`).
  - `/publica-tu-propiedad` – Landing comercial para vender la solución.

- Autenticación:
  - `/login` – Login admin con Supabase.
  - `/logout` – Cierra sesión admin.

- Admin:
  - `/admin` → redirige a `/admin/listings`.
  - `/admin/listings` – Listado admin de propiedades.
  - `/admin/listings/new` – Crear propiedad.
  - `/admin/listings/[id]` – Editar / eliminar / cambiar estado.

---

### Endpoints API

- `POST /api/leads`
  - Crea un lead asociado a un `listing_id`.
  - Acepta `application/json` o `form-data`.

- `GET /api/admin/listings`
  - Lista propiedades para panel admin (requiere sesión admin).

- `POST /api/admin/listings`
  - Crea un listing (requiere sesión admin).

- `PATCH /api/admin/listings/[id]`
  - Actualiza un listing existente.

- `DELETE /api/admin/listings/[id]`
  - Elimina un listing.

- `POST /api/admin/listings/[id]/images`
  - Sube imágenes a Supabase Storage (`listing-images`) y actualiza `listing_images` y `image_url`.

- `DELETE /api/admin/listing-images/[imageId]`
  - Borra una imagen de storage y tabla `listing_images`.

- `POST /api/admin/listing-images/[imageId]/cover`
  - Marca una imagen como portada y sincroniza `listings.image_url`.

---

### Despliegue en Vercel

1. Subir el proyecto a GitHub/GitLab/Bitbucket.
2. En Vercel:
   - Crear un nuevo proyecto linkeando este repo.
   - En **Environment Variables**, agregar:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy.

Vercel detectará Next.js y usará los scripts:

- `next build`
- `next start`

> Puedes usar dominios personalizados y redirigir tu dominio final (ej. `micasa.tu-dominio.com`) a este proyecto.

---

### Notas de producción

- No hay `console.log` en el código de producción.
- No se usa `middleware.ts`; el proyecto es compatible con Next 16 (App Router).
- Imágenes optimizadas con `next/image` en:
  - Tarjetas de propiedades (`SafeImage`).
  - Portada del detalle de propiedad (`/propiedades/[id]`).
- SEO:
  - Metadata base en `src/app/layout.tsx` (título, Open Graph, Twitter).
  - Metadata dinámica por propiedad en `src/app/propiedades/[id]/page.tsx`.

---

### Desarrollo local rápido

1. Configurar `.env.local`.
2. Correr:

```bash
npm run dev
```

3. Abrir:
   - `http://localhost:3000` – landing.
   - `http://localhost:3000/propiedades` – listado.
   - `http://localhost:3000/login` – login admin.

Con eso el proyecto queda listo para usar como demo, plantilla SaaS o base para un producto inmobiliario en producción.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
