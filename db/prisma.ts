import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Enable WebSocket connections for Neon
neonConfig.webSocketConstructor = ws;

// Use PrismaClient directly with the database URL
export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});
