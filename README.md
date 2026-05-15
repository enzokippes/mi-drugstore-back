# 💊 Mi Drugstore — Backend API

REST API for an online pharmacy. Built with **Express 5**, **TypeScript**, **Prisma ORM**, and **JWT** authentication.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime and static typing |
| Express 5 | HTTP framework |
| Prisma ORM | Database access layer |
| SQLite (libsql) | Local database / [Turso](https://turso.tech) in production |
| bcryptjs | Password hashing |
| JSON Web Tokens | Stateless authentication |
| ts-node-dev | Hot reload for development |

## 📁 Project Structure

```
src/
├── config/
│   └── db.ts              # Prisma client instance
├── controllers/
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   ├── order.controller.ts
│   └── product.controller.ts
├── middlewares/
│   └── authMiddleware.ts  # JWT verification
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

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key_here"
PORT=3000
```

> For **Turso** in production, replace `DATABASE_URL` with your Turso database URL and add `TURSO_AUTH_TOKEN`.

## 🚀 Getting Started

```bash
# 1. Install dependencies (auto-generates Prisma client)
npm install

# 2. Push the schema to the database
npx prisma db push

# 3. (Optional) Seed the database with sample data
npx prisma db seed

# 4. Start in development mode
npm run dev
```

The server runs at `http://localhost:3000`.

## 📋 API Endpoints

### Auth — `/api/auth`

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Log in and receive a JWT | ❌ |

### Products — `/api/products`

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/` | List all products | ❌ |
| GET | `/:id` | Get a single product | ❌ |
| POST | `/` | Create a product | ✅ |
| PUT | `/:id` | Update a product | ✅ |
| DELETE | `/:id` | Delete a product | ✅ |

### Categories — `/api/categories`

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/` | List all categories | ❌ |
| POST | `/` | Create a category | ✅ |
| PUT | `/:id` | Update a category | ✅ |
| DELETE | `/:id` | Delete a category | ✅ |

### Orders — `/api/orders`

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/` | Place a new order | ✅ |
| GET | `/my-orders` | Get current user's orders | ✅ |

### Health Check

```
GET /health → { "status": "OK" }
```

## 🔐 Authentication

Protected routes require the following header:

```
Authorization: Bearer <token>
```

The token is returned on login or registration.

## 🗃️ Data Models

```prisma
User       → id, name, email, password
Product    → id, name, price, stock, categoryId
Category   → id, name
Order      → id, total, createdAt, userId
OrderItem  → id, quantity, price, orderId, productId
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript to JS |
| `npm start` | Production (build + prisma db push) |

## 🔗 Frontend

This API is designed to work with [mi-drugstore-front](https://github.com/enzokippes/mi-drugstore-front).
