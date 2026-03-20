// Entry point for the application

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createApp } from './app';

const prisma = new PrismaClient();

async function main() {
  const { app, io } = createApp();
  const PORT = process.env.PORT || 3001;
  
  // Create HTTP server
  const server = app.listen(PORT, () => {
    console.log(`🚗 Carpool API Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket server listening for real-time updates`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n📛 Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
    });
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch(async (err) => {
  console.error('💥 Fatal error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
