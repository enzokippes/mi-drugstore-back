# Plan TIF - Barba Negra Drugstore (Full-Stack)

## Resumen
Plan completo para llevar el proyecto a nivel 10, cubriendo los 3 plus individuales y todos los entregables.

---

## FASE 1: Backend - Plus Integrante A (Zod + Seguridad Avanzada)

### 1.1 Instalar Zod (HECHO - ya se instalo)
- `npm install zod` - Completado
- `npm uninstall express-validator` - Completado

### 1.2 Middleware validateZod
**Archivo:** `src/middlewares/validate.ts`
```typescript
import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateZod = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
```

### 1.3 Schemas Zod

**`src/validations/auth.validation.ts` (NUEVO)**
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50).trim(),
  email: z.string().email('Email invalido').max(100).trim().toLowerCase(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100)
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayuscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un numero'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalido').trim().toLowerCase(),
  password: z.string().min(1, 'La contraseña es requerida'),
});
```

**`src/validations/product.validation.ts` (REESCRIBIR)**
```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100).trim(),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().min(0).optional().default(0),
  unlimitedStock: z.coerce.boolean().optional().default(false),
  categoryId: z.string().min(1, 'La categoria es requerida'),
  isCombo: z.coerce.boolean().optional().default(false),
});
```

**`src/validations/category.validation.ts` (REESCRIBIR)**
```typescript
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50).trim(),
});
```

**`src/validations/order.validation.ts` (REESCRIBIR)**
```typescript
import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'productId es requerido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  total: z.number().positive('El total debe ser mayor a 0'),
  items: z.array(orderItemSchema).min(1, 'El pedido debe tener al menos un item'),
  deliveryType: z.enum(['PICKUP', 'DELIVERY']),
  address: z.string().min(5).optional(),
  phone: z.string().min(1).optional(),
  notes: z.string().max(500).optional(),
  deliveryTime: z.string().optional(),
}).refine(
  (data) => data.deliveryType !== 'DELIVERY' || (!!data.address && !!data.phone && !!data.deliveryTime),
  { message: 'Direccion, telefono y horario son requeridos para delivery' }
);

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED']),
});
```

**`src/validations/promotion.validation.ts` (REESCRIBIR)**
```typescript
import { z } from 'zod';

export const promotionSchema = z.object({
  title: z.string().min(1, 'El titulo es requerido').max(100).trim(),
  description: z.string().min(1, 'La descripcion es requerida').max(500).trim(),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.coerce.number().positive().optional(),
});
```

**`src/validations/settings.validation.ts` (NUEVO)**
```typescript
import { z } from 'zod';

export const settingSchema = z.object({
  key: z.string().min(1, 'La clave es requerida').max(50).trim(),
  value: z.string().max(500),
});
```

### 1.4 Actualizar rutas para usar validateZod

**`src/routes/auth.routes.ts`** - Agregar:
```typescript
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { validateZod } from '../middlewares/validate';

router.post('/register', validateZod(registerSchema), register);
router.post('/login', validateZod(loginSchema), login);
```

**`src/routes/product.routes.ts`** - Cambiar:
```typescript
import { productSchema } from '../validations/product.validation';
import { validateZod } from '../middlewares/validate';

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), validateZod(productSchema), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), validateZod(productSchema), updateProduct);
```

**`src/routes/category.routes.ts`** - Cambiar:
```typescript
import { categorySchema } from '../validations/category.validation';
import { validateZod } from '../middlewares/validate';

router.post('/', authMiddleware, adminMiddleware, validateZod(categorySchema), categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, validateZod(categorySchema), categoryController.updateCategory);
```

**`src/routes/order.routes.ts`** - Cambiar:
```typescript
import { createOrderSchema, updateOrderStatusSchema } from '../validations/order.validation';
import { validateZod } from '../middlewares/validate';

router.post('/', authMiddleware, validateZod(createOrderSchema), orderController.createOrder);
```

**`src/routes/promotion.routes.ts`** - Cambiar:
```typescript
import { promotionSchema } from '../validations/promotion.validation';
import { validateZod } from '../middlewares/validate';

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), validateZod(promotionSchema), createPromotion);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), validateZod(promotionSchema), updatePromotion);
```

**`src/routes/settings.routes.ts`** - Agregar:
```typescript
import { settingSchema } from '../validations/settings.validation';
import { validateZod } from '../middlewares/validate';

router.put('/', authMiddleware, adminMiddleware, validateZod(settingSchema), updateSetting);
```

### 1.5 Modelo Order con status
**`prisma/schema.prisma`** - Agregar al modelo Order:
```prisma
model Order {
  // ... campos existentes ...
  status        String      @default("PENDING")
  paymentStatus String      @default("PENDING")
  paymentId     String?
}
```

### 1.6 Endpoints admin de ordenes
**Agregar a `src/services/order.service.ts`:**
```typescript
export const getAllOrdersService = async () => {
  return await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
  return await prisma.order.update({ where: { id: orderId }, data: { status } });
};
```

**Agregar a `src/controllers/order.controller.ts`:**
```typescript
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrdersService();
    sendSuccess(res, orders);
  } catch (error: unknown) {
    sendError(res, 'Error fetching orders', 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatusService(id, status);
    sendSuccess(res, order, 'Order status updated');
  } catch (error: unknown) {
    sendError(res, 'Error updating order status', 400);
  }
};
```

**Agregar a `src/routes/order.routes.ts`:**
```typescript
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, validateZod(updateOrderStatusSchema), orderController.updateOrderStatus);
```

### 1.7 Descuento de stock al crear orden
**Modificar `src/services/order.service.ts`** en `createOrderService`:
```typescript
// Despues de crear la orden, descontar stock
for (const item of data.items) {
  if (!item.productId.startsWith('promo-')) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }
}
```

### 1.8 Handler 404
**Agregar a `src/server.ts` antes del error handler:**
```typescript
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});
```

---

## FASE 2: Backend - Plus Integrante B (APIs Externas)

### 2.1 Instalar dependencias
```bash
npm install resend mercadopago
```

### 2.2 Servicio de email
**`src/services/email.service.ts` (NUEVO)**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmation = async (to: string, orderData: any) => {
  try {
    await resend.emails.send({
      from: 'Barba Negra <onboarding@resend.dev>',
      to,
      subject: `Pedido #${orderData.id.slice(0, 8)} confirmado`,
      html: `<h1>Tu pedido fue recibido</h1>...`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
```

### 2.3 Integrar email en order service
Llamar `sendOrderConfirmation` despues de crear la orden.

### 2.4 Servicio MercadoPago
**`src/services/payment.service.ts` (NUEVO)**
```typescript
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export const createPaymentPreference = async (items: any[], orderId: string) => {
  const preference = new Preference(client);
  const result = await preference.create({
    body: {
      items: items.map(item => ({
        title: item.productName || 'Producto',
        quantity: item.quantity,
        unit_price: item.price,
      })),
      external_reference: orderId,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success`,
        failure: `${process.env.FRONTEND_URL}/payment/failure`,
      },
    },
  });
  return result;
};
```

### 2.5 Endpoints de pago
**`src/controllers/payment.controller.ts` (NUEVO)**
**`src/routes/payment.routes.ts` (NUEVO)**

Endpoints:
- `POST /api/payments/create-preference` - Crea preferencia de pago
- `POST /api/payments/webhook` - Recibe notificaciones de MP

### 2.6 Actualizar schema
Agregar a Order: `paymentStatus String @default("PENDING")` y `paymentId String?`

---

## FASE 3: Frontend - Plus Integrante C (UX/UI + Accesibilidad)

### 3.1 Tipos compartidos
**`src/types/index.ts` (NUEVO)** - Definir Product, Category, Order, Promotion, CartItem, User, etc.

### 3.2 Refactorizar componentes
Reemplazar interfaces inline por imports de `src/types`.

### 3.3 Accesibilidad
- `index.html`: `lang="es"`
- `Toast.tsx`: `aria-live="polite"` en contenedor
- Skip-nav link en Layout
- `prefers-reduced-motion` en CSS
- `aria-expanded` en toggles

### 3.4 Skeletons
**`src/components/store/ProductSkeleton.tsx` (NUEVO)** - Skeleton cards para loading state

### 3.5 CartContext
**`src/context/CartContext.tsx` (NUEVO)** - Mover logica de useCartPersistence a un Context

### 3.6 Fix err:any
Cambiar `catch (err: any)` a `catch (err: unknown)` con type narrowing

### 3.7 Eliminar dead code
Borrar: `FloatingCart.tsx`, `DeliveryToggle.tsx`, `DeliveryForm.tsx`

---

## FASE 4: Frontend - Integracion MP + Admin Orders

### 4.1 Checkout con MercadoPago
Boton en CheckoutSheet que llama a `/api/payments/create-preference` y redirige a MP

### 4.2 Paginas de pago
- `src/pages/PaymentSuccess.tsx` (NUEVO)
- `src/pages/PaymentFailure.tsx` (NUEVO)

### 4.3 MyOrders con estado
Mostrar badges de estado (Pendiente, Confirmado, Entregado, Cancelado) y estado de pago

### 4.4 Panel admin de ordenes
**`src/pages/OrderManagement.tsx` (NUEVO)** - Lista de todas las ordenes con filtros y acciones

---

## FASE 5: Documentacion y Deploy

### 5.1 README profesional del frontend
Descripcion, tech stack, setup, env vars, scripts, arquitectura, screenshots

### 5.2 Actualizar README del backend
Agregar Promotions, Settings, Payments, Zod, roles

### 5.3 DER
Diagrama entidad-relacion en markdown

### 5.4 Deploy config
- Backend: Render (ya esta preparado con Turso)
- Frontend: Vercel (agregar `vercel.json` si es necesario)
- Actualizar `.env.example` con nuevas variables (RESEND_API_KEY, MP_ACCESS_TOKEN, FRONTEND_URL)

---

## Variables de entorno nuevas necesarias

### Backend (.env)
```
RESEND_API_KEY=re_xxxxx
MP_ACCESS_TOKEN=APP_USR-xxxxx
FRONTEND_URL=https://mi-drugstore-front.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://mi-drugstore-back.onrender.com
VITE_MP_PUBLIC_KEY=APP_USR-xxxxx
```
