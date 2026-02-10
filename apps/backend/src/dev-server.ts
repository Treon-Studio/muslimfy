import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import path from 'path'
import { app } from './index'

// Load environment variables
config({ path: path.join(__dirname, '../.dev.vars') })

const port = 3000

console.log(`🚀 Starting Muslimfy Backend...`)
console.log(`📦 Environment: development`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`\n✅ Server running at http://localhost:${info.port}`)
  console.log(`\nAvailable endpoints:`)
  console.log(`  - GET  /health`)
  console.log(`  - ALL  /trpc/*  (tRPC router)`)
  console.log(`\ntRPC procedures:`)
  console.log(`  - auth.register, auth.login, auth.refresh, auth.logout`)
  console.log(`  - user.me, user.update, user.getGamification`)
  console.log(`  - mission.list, mission.create, mission.complete`)
  console.log(`  - stats.daily, stats.weekly, stats.streaks, stats.activityGrid`)
  console.log(`  - prayer.getTimes, prayer.completePrayer`)
  console.log(`  - quran.getSurahs, quran.getSurah, quran.search`)
  console.log(`  - dailyVerse.getToday, dailyVerse.getFavorites`)
  console.log(`  - donation.getCharities, donation.create`)
})
