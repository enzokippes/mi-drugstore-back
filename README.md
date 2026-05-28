# Barba Negra Drugstore — Backend API

REST API para una farmacia/drugstore online con autenticacion JWT, roles, validacion Zod, integracion con MercadoPago y envio de emails con Resend.

## Tech Stack

| Tecnologia | Proposito |
|------------|-----------|
| Node.js + TypeScript 6 | Runtime y tipado estatico |
| Express 5 | Framework HTTP |
| Prisma ORM 7 | Acceso a base de datos |
| SQLite / Turso (libsql) | Base de datos local y produccion |
| Zod | Validacion de inputs |
| bcryptjs | Hashing de contraseñas |
| JWT | Autenticacion stateless |
| Resend | Envio de emails transaccionales |
| MercadoPago SDK | Pasarela de pagos |
| Multer | Upload de imagenes |
| Helmet + Rate Limit | Seguridad HTTP |
| Swagger | Documentacion automatica de API |

## Estructura del Proyecto

```
src/
├── config/
│   └── db.ts                  # Cliente Prisma
├── controllers/
│   ├── auth.controller.ts     # Login y registro
│   ├── category.controller.ts # CRUD categorias
│   ├── order.controller.ts    # CRUD ordenes + admin
│   ├── payment.controller.ts  # MercadoPago preferencias + webhook
│   ├── product.controller.ts  # CRUD productos
│   ├── promotion.controller.ts# CRUD promociones
│   └── settings.controller.ts # Configuracion global
├── middlewares/
│   ├── authMiddleware.ts      # Verificacion JWT
│   ├── adminMiddleware.ts     # Guard de rol ADMIN
│   ├── upload.ts              # Configuracion Multer
│   └── validate.ts            # Middleware de validacion Zod
├── routes/
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   ├── order.routes.ts
│   ├── payment.routes.ts
│   ├── product.routes.ts
│   ├── promotion.routes.ts
│   └── settings.routes.ts
├── services/
│   ├── auth.service.ts        # Logica de autenticacion
│   ├── category.service.ts
│   ├── email.service.ts       # Envio de emails con Resend
│   ├── order.service.ts       # Logica de ordenes + descuento stock
│   ├── payment.service.ts     # Integracion MercadoPago
│   ├── product.service.ts
│   ├── promotion.service.ts
│   └── settings.service.ts
├── types/
│   └── index.d.ts             # Tipos Express + AuthPayload
├── utils/
│   └── response.ts            # Helpers sendSuccess/sendError
├── validations/
│   ├── auth.validation.ts     # Schemas Zod para auth
│   ├── category.validation.ts
│   ├── order.validation.ts
│   ├── product.validation.ts
│   ├── promotion.validation.ts
│   └── settings.validation.ts
└── server.ts                  # Entry point
prisma/
├── schema.prisma              # Schema de base de datos
└── seed.ts                    # Datos de ejemplo
```

## Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Autenticacion
JWT_SECRET="tu_clave_secreta_larga_y_aleatoria"

# Servidor
PORT=3000
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

# Email (Resend) - https://resend.com/api-keys
RESEND_API_KEY="re_xxxxx"
ADMIN_EMAIL="admin@tudominio.com"

# MercadoPago - https://www.mercadopago.com.ar/developers/panel/credentials
MP_ACCESS_TOKEN="APP_USR-xxxxx"
```

Para produccion con **Turso**, reemplazar `DATABASE_URL` con la URL de Turso y agregar `TURSO_AUTH_TOKEN`.

## Instalacion

```bash
# 1. Instalar dependencias (genera el cliente Prisma automaticamente)
npm install

# 2. Sincronizar schema con la base de datos
npx prisma db push

# 3. (Opcional) Cargar datos de ejemplo
npm run seed

# 4. Iniciar en modo desarrollo
npm run dev
```

El servidor corre en `http://localhost:3000`.
Documentacion Swagger en `http://localhost:3000/api-docs`.

## Endpoints de la API

### Auth — `/api/auth`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| POST | `/register` | Registrar usuario | No | - |
| POST | `/login` | Iniciar sesion | No | - |

### Productos — `/api/products`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| GET | `/` | Listar productos | No | - |
| GET | `/:id` | Obtener producto | No | - |
| POST | `/` | Crear producto | Si | ADMIN |
| PUT | `/:id` | Actualizar producto | Si | ADMIN |
| DELETE | `/:id` | Eliminar producto | Si | ADMIN |

### Categorias — `/api/categories`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| GET | `/` | Listar categorias | No | - |
| GET | `/:id` | Obtener categoria | No | - |
| POST | `/` | Crear categoria | Si | ADMIN |
| PUT | `/:id` | Actualizar categoria | Si | ADMIN |
| DELETE | `/:id` | Eliminar categoria | Si | ADMIN |

### Ordenes — `/api/orders`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| POST | `/` | Crear pedido | Si | USER+ |
| GET | `/my-orders` | Mis pedidos | Si | USER+ |
| GET | `/` | Todas las ordenes | Si | ADMIN |
| PUT | `/:id/status` | Cambiar estado | Si | ADMIN |

### Promociones — `/api/promotions`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| GET | `/active` | Promos activas | No | - |
| GET | `/` | Todas las promos | No | - |
| GET | `/:id` | Obtener promo | No | - |
| POST | `/` | Crear promo | Si | ADMIN |
| PUT | `/:id` | Actualizar promo | Si | ADMIN |
| DELETE | `/:id` | Eliminar promo | Si | ADMIN |

### Pagos — `/api/payments`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| POST | `/create-preference` | Crear preferencia MP | Si | USER+ |
| POST | `/webhook` | Webhook de MercadoPago | No | - |

### Configuracion — `/api/settings`

| Metodo | Ruta | Descripcion | Auth | Rol |
|--------|------|-------------|------|-----|
| GET | `/` | Obtener settings | Si | ADMIN |
| PUT | `/` | Actualizar setting | Si | ADMIN |

### Health Check

```
GET /health → { "status": "OK", "uptime": "..." }
```

## Autenticacion

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene al iniciar sesion o registrarse. Tiene una duracion de 24 horas.

## Roles y Permisos

| Rol | Permisos |
|-----|----------|
| USER | Crear ordenes, ver sus ordenes, pagar |
| ADMIN | Todo lo de USER + gestionar productos, categorias, promos, settings y ver todas las ordenes |

## Modelos de Datos

```
User        → id, name, email, password, role
Product     → id, name, price, stock, unlimitedStock, image, isCombo, categoryId
Category    → id, name
Order       → id, total, deliveryType, address, phone, notes, deliveryTime, status, paymentStatus, paymentId, userId
OrderItem   → id, quantity, price, productName, orderId, productId
Promotion   → id, title, description, image, price, originalPrice, active, startDate, endDate
Setting     → key, value
```

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Compilar TypeScript |
| `npm start` | Produccion (build + prisma db push) |
| `npm run seed` | Cargar datos de ejemplo |

## Frontend

Esta API esta diseñada para funcionar con [mi-drugstore-front](https://github.com/enzokippes/mi-drugstore-front).
