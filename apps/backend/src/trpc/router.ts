import { router } from './trpc'
import { authRouter } from './routers/auth'
import { userRouter } from './routers/user'
import { missionRouter } from './routers/mission'
import { statsRouter } from './routers/stats'
import { prayerRouter } from './routers/prayer'
import { quranRouter } from './routers/quran'
import { dailyVerseRouter } from './routers/daily-verse'
import { donationRouter } from './routers/donation'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  mission: missionRouter,
  stats: statsRouter,
  prayer: prayerRouter,
  quran: quranRouter,
  dailyVerse: dailyVerseRouter,
  donation: donationRouter,
})

export type AppRouter = typeof appRouter
