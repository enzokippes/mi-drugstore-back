# 💊 Mi Drugstore — Backend API

REST API para una farmacia online. Construida con **Express 5**, **TypeScript**, **Prisma ORM** y autenticación **JWT**.

## 🛠️ Stack

| Tecnología | Uso |
|------------|-----|
| Node.js + TypeScript | Runtime y tipado estático |
| Express 5 | Framework HTTP |
| Prisma ORM | Acceso a base de datos |
| SQLite (libsql) | Base de datos local / [Turso](https://turso.tech) en producción |
| bcryptjs | Hash de contraseñas |
| JSON Web Tokens | Autenticación stateless |
| ts-node-dev | Hot reload en desarrollo |

## 📁 Estructura del proyecto

```
src/
├── config/
│   └── db.ts              # Cliente de Prisma
├── controllers/
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   ├── order.controller.ts
│   └── product.controller.ts
├── middlewares/
│   └── authMiddleware.ts  # Verificación JWT
├── routes/
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   ├── order.routes.ts
│   └── product.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── category.service.ts
│   ├── order.service.ts
│   └── product.service.ts
├── types/
│   └── index.d.ts
└── server.ts
prisma/
├── schema.prisma
└── seed.ts
```

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_clave_secreta_aqui"
PORT=3000
```

> Para producción con **Turso**, reemplazar `DATABASE_URL` por la URL del proyecto y agregar `TURSO_AUTH_TOKEN`.

## 🚀 Instalación y uso

```bash
# 1. Instalar dependencias (genera el cliente de Prisma automáticamente)
npm install

# 2. Aplicar el schema a la base de datos
npx prisma db push

# 3. (Opcional) Cargar datos de prueba
npx prisma db seed

# 4. Iniciar en modo desarrollo
npm run dev
```

El servidor levanta en `http://localhost:3000`.

## 📋 Endpoints

### Auth — `/api/auth`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | ❌ |
| POST | `/login` | Iniciar sesión, retorna JWT | ❌ |

### Productos — `/api/products`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Listar todos los productos | ❌ |
| GET | `/:id` | Obtener un producto | ❌ |
| POST | `/` | Crear producto | ✅ |
| PUT | `/:id` | Actualizar producto | ✅ |
| DELETE | `/:id` | Eliminar producto | ✅ |

### Categorías — `/api/categories`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Listar categorías | ❌ |
| POST | `/` | Crear categoría | ✅ |
| PUT | `/:id` | Actualizar categoría | ✅ |
| DELETE | `/:id` | Eliminar categoría | ✅ |

### Órdenes — `/api/orders`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/` | Crear una orden | ✅ |
| GET | `/my-orders` | Ver mis órdenes | ✅ |

### Health Check

```
GET /health → { "status": "OK" }
```

## 🔐 Autenticación

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registro.

## 🗃️ Modelos de datos

```prisma
User       → id, name, email, password
Product    → id, name, price, stock, categoryId
Category   → id, name
Order      → id, total, createdAt, userId
OrderItem  → id, quantity, price, orderId, productId
```

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Compilar TypeScript a JS |
| `npm start` | Producción (build + prisma db push) |

## 🔗 Frontend

Este backend está diseñado para trabajar con [mi-drugstore-front](https://github.com/enzokippes/mi-drugstore-front).
