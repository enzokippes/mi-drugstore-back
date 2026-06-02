import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import settingsRoutes from './routes/settings.routes';
import promotionRoutes from './routes/promotion.routes';
import deliveryZoneRoutes from './routes/delivery-zone.routes';
import loyaltyRoutes from './routes/loyalty.routes';
import popularRoutes from './routes/popular.routes';
import addressRoutes from './routes/address.routes';
import statsRoutes from './routes/stats.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files for uploads (legacy - new uploads go to Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos, espera unos minutos.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use('/api/auth', authLimiter);
app.use(apiLimiter);

// Swagger setup
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Barba Negra Drugstore API',
      version: '1.0.0',
      description: 'API REST para Barba Negra Drugstore',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/products', popularRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/admin/stats', statsRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  res.status(200).json({
    name: 'Barba Negra Drugstore API',
    version: '1.0.0',
    status: 'OK',
    uptime: `${hours}h ${minutes}m ${seconds}s`,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  🏴‍☠️ Barba Negra Drugstore API');
  console.log(`  ✅ Running on http://localhost:${PORT}`);
  console.log(`  📚 Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log('');
});

export default app;
