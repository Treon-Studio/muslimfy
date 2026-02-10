import { Redis as UpstashRedis } from '@upstash/redis'
import IORedis from 'ioredis'

// Detect runtime environment
const isCloudflareWorkers = typeof globalThis.caches !== 'undefined' &&
  typeof (globalThis as any).WebSocketPair !== 'undefined'

// Unified Redis interface
export interface RedisClient {
  get(key: string): Promise<string | null>
  set(key: string, value: string, mode?: string, duration?: number): Promise<any>
  del(key: string): Promise<number>
  ping(): Promise<string>
}

// Parse Redis URL for Upstash
function parseRedisUrl(url: string) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '6379'),
    password: parsed.password,
    username: parsed.username,
  }
}

// Create Redis client based on environment
export function createRedisClient(redisUrl: string): RedisClient {
  if (isCloudflareWorkers) {
    // Cloudflare Workers: use Upstash HTTP Redis
    // Note: For Upstash, you need UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
    // If using standard Redis URL, we'll create a wrapper
    const { host, port, password } = parseRedisUrl(redisUrl)

    // For non-Upstash Redis in Workers, we need to use Upstash's REST API format
    // This assumes you're using Upstash. For other Redis providers in Workers,
    // you may need a different solution (like Cloudflare Workers KV)
    const upstash = new UpstashRedis({
      url: `https://${host}`,
      token: password || '',
    })

    return {
      async get(key: string) {
        return upstash.get<string>(key)
      },
      async set(key: string, value: string, mode?: string, duration?: number) {
        if (mode === 'EX' && duration) {
          return upstash.set(key, value, { ex: duration })
        }
        return upstash.set(key, value)
      },
      async del(key: string) {
        return upstash.del(key)
      },
      async ping() {
        await upstash.ping()
        return 'PONG'
      },
    }
  } else {
    // Node.js: use ioredis
    const client = new IORedis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    })

    return {
      async get(key: string) {
        return client.get(key)
      },
      async set(key: string, value: string, mode?: string, duration?: number) {
        if (mode === 'EX' && duration) {
          return client.set(key, value, 'EX', duration)
        }
        return client.set(key, value)
      },
      async del(key: string) {
        return client.del(key)
      },
      async ping() {
        return client.ping()
      },
    }
  }
}

export { RedisClient as RedisClientType }
