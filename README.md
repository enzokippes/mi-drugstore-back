# Barba Negra Drugstore — Backend API

A REST API for an online pharmacy/drugstore featuring JWT authentication, role-based access control, Zod validation, MercadoPago payment integration, Resend email services, Cloudinary image hosting, and a loyalty points system.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime and static typing |
| Express 5 | HTTP framework |
| Prisma ORM 7 | Database access |
| PostgreSQL | Production database |
| `@prisma/adapter-pg` + `pg` | PostgreSQL connection adapter |
| Zod | Input validation |
| bcryptjs | Password hashing |
| JWT | Stateless authentication |
| Resend | Transactional emails |
| MercadoPago SDK | Payment gateway |
| Cloudinary | Image hosting and management |
| Helmet + Rate Limit | HTTP security |
| Swagger | API documentation |

## Project Structure

```
src/
├── config/
│   └── db.ts                  # Prisma client with @prisma/adapter-pg
├── controllers/
│   ├── address.controller.ts   # User address management
│   ├── adminDashboard.controller.ts # Admin dashboard stats
│   ├── auth.controller.ts      # Login, register, password reset
│   ├── category.controller.ts   # Category CRUD
│   ├── deliveryZone.controller.ts # Delivery zones CRUD
│   ├── loyalty.controller.ts    # Points and rewards
│   ├── order.controller.ts      # Order management
│   ├── payment.controller.ts    # MercadoPago preferences + webhook
│   ├── product.controller.ts     # Product CRUD
│   ├── promotion.controller.ts   # Promotion CRUD
│   └── settings.controller.ts    # Global configuration
├── middleware/
│   ├── adminMiddleware.ts     # ADMIN role guard
│   ├── authMiddleware.ts       # JWT verification
│   ├── validate.ts             # Zod validation middleware
│   └── upload.ts               # Multer configuration (legacy - use Cloudinary)
├── routes/
│   ├── address.routes.ts       # /api/addresses
│   ├── admin.routes.ts         # Admin dashboard stats
│   ├── auth.routes.ts           # /api/auth
│   ├── category.routes.ts       # /api/categories
│   ├── delivery-zone.routes.ts   # /api/delivery-zones
│   ├── loyalty.routes.ts        # /api/loyalty
│   ├── order.routes.ts          # /api/orders
│   ├── payment.routes.ts        # /api/payments
│   ├── popular.routes.ts        # /api/products/popular
│   ├── product.routes.ts        # /api/products
│   ├── promotion.routes.ts      # /api/promotions
│   └── settings.routes.ts       # /api/settings
├── services/
│   ├── address.service.ts      # Address management logic
│   ├── auth.service.ts          # Authentication logic
│   ├── category.service.ts       # Category logic
│   ├── cloudinary.service.ts     # Cloudinary upload/delete
│   ├── deliveryZone.service.ts   # Delivery zones logic
│   ├── email.service.ts          # Resend email templates
│   ├── loyalty.service.ts        # Points and rewards logic
│   ├── order.service.ts          # Order logic + stock management
│   ├── payment.service.ts        # MercadoPago integration
│   ├── product.service.ts        # Product logic
│   ├── promotion.service.ts      # Promotion logic
│   └── settings.service.ts       # Settings logic
├── types/
│   └── index.d.ts               # Express types + AuthPayload
├── utils/
│   └── response.ts              # sendSuccess/sendError helpers
├── validations/
│   ├── address.validation.ts   # Address Zod schemas
│   ├── auth.validation.ts       # Auth Zod schemas
│   ├── category.validation.ts    # Category Zod schemas
│   ├── deliveryZone.validation.ts # Delivery zone Zod schemas
│   ├── loyalty.validation.ts     # Points Zod schemas
│   ├── order.validation.ts        # Order Zod schemas
│   ├── product.validation.ts      # Product Zod schemas
│   ├── promotion.validation.ts    # Promotion Zod schemas
│   └── settings.validation.ts     # Settings Zod schemas
├── server.ts                    # Application entry point
prisma/
├── schema.prisma                # Database schema
├── seed.ts                      # Idempotent seed data
└── migrations/                   # Database migrations
    └── 20260604200000_init/
        └── migration.sql         # Initial migration (PostgreSQL)
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Database (Production - PostgreSQL on Render)
# For local development, use your local PostgreSQL URL
DATABASE_URL="postgresql://user:password@localhost:5432/barbanegra"

# Authentication
JWT_SECRET="your_long_random_secret_here"
PORT=3000

# Frontend URL (for password reset links and CORS)
FRONTEND_URL="http://localhost:5173"

# Email (Resend) - https://resend.com/api-keys
RESEND_API_KEY="re_xxxxx"
ADMIN_EMAIL="admin@example.com"

# Cloudinary - https://cloudinary.com/console
# Format: cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"

# MercadoPago - https://www.mercadopago.com.ar/developers/panel/credentials
MP_ACCESS_TOKEN="APP_USR-xxxxx"
```

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Apply migrations to database
npx prisma migrate deploy

# 4. (Optional) Seed database with sample data
npx prisma db seed

# 5. Start development server
npm run dev
```

The server runs at `http://localhost:3000`.
Swagger docs at `http://localhost:3000/api-docs`.

## Deployment (Render)

### Build Command
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run build
```

### Environment Variables on Render
Set these in your Render dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL internal database URL from Render |
| `JWT_SECRET` | A long random string |
| `PORT` | 3000 |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://barbanegra.onrender.com`) |
| `RESEND_API_KEY` | Your Resend API key |
| `ADMIN_EMAIL` | Your admin email |
| `CLOUDINARY_URL` | Your Cloudinary URL |
| `MP_ACCESS_TOKEN` | Your MercadoPago access token |

### Database Setup
1. Create a PostgreSQL database on Render (Free tier)
2. Copy the Internal Database URL
3. Set as `DATABASE_URL` environment variable
4. Deploy - migrations run automatically

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/register` | Register new user | No | - |
| POST | `/login` | Login | No | - |
| POST | `/forgot-password` | Request password reset email | No | - |
| POST | `/reset-password` | Reset password with token | No | - |

### Products — `/api/products`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | List all products | No | - |
| GET | `/popular` | List popular products | No | - |
| GET | `/:id` | Get product details | No | - |
| POST | `/` | Create product | Yes | ADMIN |
| PUT | `/:id` | Update product | Yes | ADMIN |
| DELETE | `/:id` | Delete product | Yes | ADMIN |

### Categories — `/api/categories`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | List categories | No | - |
| GET | `/:id` | Get category with products | No | - |
| POST | `/` | Create category | Yes | ADMIN |
| PUT | `/:id` | Update category | Yes | ADMIN |
| DELETE | `/:id` | Delete category | Yes | ADMIN |

### Orders — `/api/orders`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/` | Create order | Yes | USER+ |
| GET | `/my-orders` | User's order history | Yes | USER+ |
| GET | `/` | List all orders | Yes | ADMIN |
| PUT | `/:id/status` | Update order status | Yes | ADMIN |
| PUT | `/:id/payment-status` | Update payment status | Yes | ADMIN |

### Promotions — `/api/promotions`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/active` | Active promotions | No | - |
| GET | `/` | List all promotions | No | - |
| GET | `/:id` | Get promotion | No | - |
| POST | `/` | Create promotion | Yes | ADMIN |
| PUT | `/:id` | Update promotion | Yes | ADMIN |
| DELETE | `/:id` | Delete promotion | Yes | ADMIN |

### Payments — `/api/payments`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/create-preference` | Create MercadoPago preference | Yes | USER+ |
| POST | `/webhook` | MercadoPago webhook handler | No | - |

### Settings — `/api/settings`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get all settings | Yes | ADMIN |
| PUT | `/` | Update settings | Yes | ADMIN |

### Delivery Zones — `/api/delivery-zones`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | List delivery zones | No | - |
| GET | `/:id` | Get delivery zone | No | - |
| POST | `/` | Create delivery zone | Yes | ADMIN |
| PUT | `/:id` | Update delivery zone | Yes | ADMIN |
| DELETE | `/:id` | Delete delivery zone | Yes | ADMIN |

### Loyalty/Points — `/api/loyalty`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/rewards` | List active rewards | No | - |
| GET | `/my-points` | Get user's points balance | Yes | USER+ |
| GET | `/history` | Get user's points history | Yes | USER+ |
| POST | `/redeem` | Redeem points for reward | Yes | USER+ |
| POST | `/award` | Award points to user | Yes | ADMIN |
| GET | `/admin/rewards` | List all rewards | Yes | ADMIN |
| POST | `/admin/rewards` | Create reward | Yes | ADMIN |
| PUT | `/admin/rewards/:id` | Update reward | Yes | ADMIN |
| DELETE | `/admin/rewards/:id` | Delete reward | Yes | ADMIN |

### Addresses — `/api/addresses`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get user's addresses | Yes | USER+ |
| POST | `/` | Create address | Yes | USER+ |
| PUT | `/:id` | Update address | Yes | USER+ |
| DELETE | `/:id` | Delete address | Yes | USER+ |

### Admin Stats — `/api/admin/stats`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get dashboard statistics | Yes | ADMIN |

### Health Check

```
GET /health → { "name": "Barba Negra Drugstore API", "status": "OK", "uptime": "..." }
```

## Authentication

Protected routes require the header:

```
Authorization: Bearer <token>
```

Tokens are obtained on login or registration and expire after 24 hours.

### Password Reset Flow
1. User submits email to `/api/auth/forgot-password`
2. Backend sends reset email (if Resend is configured with verified domain)
3. User clicks link with token: `/reset-password?token=<token>`
4. User submits new password to `/api/auth/reset-password`

## Roles and Permissions

| Role | Permissions |
|------|-------------|
| USER | Create orders, view own orders, manage own addresses, earn/redeem points, pay |
| ADMIN | All USER permissions + manage products, categories, promotions, delivery zones, rewards, settings, view all orders, update order statuses |

## Data Models

```
User
  ├── id (UUID)
  ├── email (unique)
  ├── password (hashed)
  ├── name
  ├── phone
  ├── role (USER | ADMIN)
  ├── resetToken
  ├── resetTokenExpiry
  ├── createdAt

Product
  ├── id (UUID)
  ├── name (unique)
  ├── description
  ├── price
  ├── stock
  ├── unlimitedStock
  ├── image (Cloudinary URL)
  ├── isCombo
  ├── isFeatured
  ├── categoryId → Category
  └── createdAt

Category
  ├── id (UUID)
  ├── name (unique)
  ├── parentId → Category (self-reference)
  └── createdAt

Order
  ├── id (UUID)
  ├── total
  ├── deliveryType (PICKUP | DELIVERY)
  ├── deliveryCost
  ├── address
  ├── phone
  ├── notes
  ├── deliveryTime
  ├── status (PENDING | CONFIRMED | IN_TRANSIT | DELIVERED | CANCELLED)
  ├── paymentStatus (PENDING | PAID | FAILED | REFUNDED)
  ├── paymentId
  ├── userId → User
  ├── deliveryZoneId → DeliveryZone (nullable)
  ├── createdAt
  └── items → OrderItem[]

OrderItem
  ├── id (UUID)
  ├── quantity
  ├── price
  ├── productName
  ├── orderId → Order
  ├── productId → Product (nullable)
  └── createdAt

Promotion
  ├── id (UUID)
  ├── title
  ├── description
  ├── image (Cloudinary URL)
  ├── price
  ├── originalPrice
  ├── active
  ├── startDate
  ├── endDate
  └── createdAt

DeliveryZone
  ├── id (UUID)
  ├── name (unique)
  ├── basePrice
  ├── surcharge
  ├── maxDistanceKm
  ├── active
  └── createdAt

Address
  ├── id (UUID)
  ├── userId → User
  ├── label
  ├── street
  ├── number
  ├── notes
  ├── zoneId → DeliveryZone (nullable)
  ├── isDefault
  └── createdAt

LoyaltyPoint
  ├── id (UUID)
  ├── userId → User
  ├── points (positive = earned, negative = redeemed)
  ├── reason (PURCHASE | REDEMPTION | BONUS)
  ├── orderId → Order (nullable)
  └── createdAt

PointReward
  ├── id (UUID)
  ├── name (unique)
  ├── description
  ├── pointsCost
  ├── productId → Product (nullable)
  ├── image (Cloudinary URL)
  ├── active
  └── createdAt

Setting
  ├── key (primary key)
  └── value
```

## Points System

### Earning Points
Points are automatically awarded when an order status changes to `CONFIRMED`.
- Default rate: 1 point per 100 pesos spent
- Configurable via `Setting` with key `pointsPerPeso`

### Redeeming Points
1. User views available rewards at `GET /api/loyalty/rewards`
2. User checks their balance at `GET /api/loyalty/my-points`
3. User redeems at `POST /api/loyalty/redeem` with `rewardId`
4. Points are deducted atomically within a transaction
5. If reward has an associated product, stock is decremented
6. An order is created for the redemption

### Race Condition Protection
Redemptions use `prisma.$transaction()` to ensure atomicity:
- PostgreSQL serializes concurrent transactions
- Balance check and deduction happen in a single transaction
- If any step fails, entire operation rolls back

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Production (build + start) |
| `npm run seed` | Seed database with sample data |

## Frontend

This API is designed to work with [mi-drugstore-front](https://github.com/enzokippes/mi-drugstore-front).

## License

MIT