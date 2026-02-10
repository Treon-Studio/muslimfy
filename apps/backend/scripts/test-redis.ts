import { config } from 'dotenv'
import path from 'path'
import Redis from 'ioredis'

// Load environment variables
config({ path: path.join(__dirname, '../.dev.vars') })

async function testRedis() {
  console.log('🔄 Testing Redis connection...\n')
  console.log('REDIS_URL:', process.env.REDIS_URL?.replace(/:[^:@]+@/, ':***@'))

  // Try different connection methods
  const configs = [
    {
      name: 'URL with default user (correct password)',
      url: 'redis://default:ZhVvsKEwVas7lIgCUeu2Uu84H3FCvqMvDHVdgsVFheZnkhRwtc1DJGolNUDrohkY@154.26.132.120:5435/0'
    }
  ]

  for (const cfg of configs) {
    console.log(`\n--- Testing: ${cfg.name} ---`)
    const redis = cfg.url ? new Redis(cfg.url) : new Redis(cfg.options!)

    redis.on('error', () => {}) // Suppress error events

    try {
      const pong = await Promise.race([
        redis.ping(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ])
      console.log('✅ SUCCESS! PING:', pong)

      // Test SET/GET
      await redis.set('test:muslimfy', 'working', 'EX', 60)
      const val = await redis.get('test:muslimfy')
      console.log('✅ SET/GET:', val)

      await redis.quit()
      console.log('\n✨ Redis connection successful with:', cfg.name)
      return
    } catch (error: any) {
      console.log('❌ Failed:', error.message)
      redis.disconnect()
    }
  }

  console.log('\n❌ All connection methods failed')
  process.exit(1)
}

testRedis()
