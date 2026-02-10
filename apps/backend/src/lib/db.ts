import { PrismaClient } from '.prisma/client'

// For Cloudflare Workers - use Neon serverless
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

// For Node.js - use pg
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Detect runtime environment
const isCloudflareWorkers = typeof globalThis.caches !== 'undefined' &&
  typeof (globalThis as any).WebSocketPair !== 'undefined'

// Create Prisma client based on environment
export function createPrismaClient(databaseUrl: string) {
  if (isCloudflareWorkers) {
    // Cloudflare Workers: use Neon HTTP adapter
    const sql = neon(databaseUrl)
    const adapter = new PrismaNeon(sql)
    return new PrismaClient({ adapter })
  } else {
    // Node.js: use pg adapter with connection pool
    const pool = new Pool({ connectionString: databaseUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }
}

export type Database = ReturnType<typeof createPrismaClient>
