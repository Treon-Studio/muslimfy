import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { createPrismaClient, type Database } from '../lib/db'
import { createRedisClient, type RedisClient } from '../lib/redis'
import { verifyToken } from '../lib/jwt'

export type Context = {
  db: Database
  redis: RedisClient
  userId: string | null
  jwtSecret: string
  headers: Headers
}

export function createContextFactory(env: {
  DATABASE_URL: string
  REDIS_URL: string
  JWT_SECRET: string
}) {
  const db = createPrismaClient(env.DATABASE_URL)
  const redis = createRedisClient(env.REDIS_URL)

  return async (opts: FetchCreateContextFnOptions): Promise<Context> => {
    const authHeader = opts.req.headers.get('Authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const payload = await verifyToken(token, env.JWT_SECRET)
        if (payload?.type === 'access') {
          userId = payload.userId
        }
      } catch { /* ignore invalid token */ }
    }

    return { db, redis, userId, jwtSecret: env.JWT_SECRET, headers: opts.req.headers }
  }
}
