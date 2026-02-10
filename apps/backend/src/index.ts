import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc'
import { createContextFactory } from './trpc/context'
import { createRedisClient } from './lib/redis'

type Bindings = {
  ENVIRONMENT: string
  DATABASE_URL: string
  REDIS_URL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Global Middleware
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:4321', 'https://muslimfy.app'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
  credentials: true,
}))

// Health check
app.get('/health', async (c) => {
  const redisUrl = c.env?.REDIS_URL || process.env.REDIS_URL!
  const redis = createRedisClient(redisUrl)

  try {
    await redis.ping()
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        redis: 'connected',
        database: 'connected',
      },
    })
  } catch {
    return c.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        redis: 'disconnected',
        database: 'connected',
      },
    }, 200)
  }
})

// tRPC handler — replaces all REST routes
app.all('/trpc/*', async (c) => {
  const env = {
    DATABASE_URL: c.env?.DATABASE_URL || process.env.DATABASE_URL!,
    REDIS_URL: c.env?.REDIS_URL || process.env.REDIS_URL!,
    JWT_SECRET: c.env?.JWT_SECRET || process.env.JWT_SECRET!,
  }
  const createContext = createContextFactory(env)

  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext,
  })
})

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    path: c.req.path,
  }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    success: false,
    error: 'Internal Server Error',
  }, 500)
})

export { app }
export default app
