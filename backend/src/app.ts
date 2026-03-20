// Main Express app configuration

import express, { Express } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSocketHandlers } from './utils/socketEvents';

export function createApp(): { app: Express; io: Server } {
  const app = express();
  const httpServer = createServer(app);
  
  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }),
  );
  
  // Socket.io setup
  setupSocketHandlers(io);
  
  // Health check
  app.get('/health', (req: any, res: any) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/reviews', reviewRoutes);
  
  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  return { app, io };
}

export { setupSocketHandlers };
