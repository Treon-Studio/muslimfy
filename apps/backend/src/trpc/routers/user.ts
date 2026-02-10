import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'

function getRank(level: number): string {
  if (level >= 50) return 'Ulama'
  if (level >= 40) return 'Hafidz'
  if (level >= 30) return 'Muttaqin'
  if (level >= 20) return 'Muhsin'
  if (level >= 15) return 'Mujahid'
  if (level >= 10) return 'Mujtahid'
  if (level >= 5) return 'Pelajar'
  return 'Pemula'
}

export const userRouter = router({
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
        include: {
          settings: true,
          gamification: true,
          preferences: {
            include: {
              preferredQari: true,
              preferredTranslation: true,
              preferredTafsir: true,
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const { passwordHash: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }),

  update: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.userId },
        data: {
          name: input.name,
          avatarUrl: input.avatarUrl,
        },
        include: {
          settings: true,
          gamification: true,
          preferences: true,
        },
      })

      const { passwordHash: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }),

  delete: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.user.delete({ where: { id: ctx.userId } })
      await ctx.redis.del(`user:${ctx.userId}`)
      return { deleted: true }
    }),

  getSettings: protectedProcedure
    .query(async ({ ctx }) => {
      const settings = await ctx.db.userSettings.findUnique({
        where: { userId: ctx.userId },
      })

      if (!settings) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Settings not found' })
      }

      return settings
    }),

  updateSettings: protectedProcedure
    .input(z.record(z.unknown()))
    .mutation(async ({ ctx, input }) => {
      const settings = await ctx.db.userSettings.update({
        where: { userId: ctx.userId },
        data: input,
      })
      return settings
    }),

  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const preferences = await ctx.db.userPreferences.findUnique({
        where: { userId: ctx.userId },
        include: {
          preferredQari: true,
          preferredTranslation: true,
          preferredTafsir: true,
        },
      })

      if (!preferences) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Preferences not found' })
      }

      return preferences
    }),

  updatePreferences: protectedProcedure
    .input(z.object({
      preferredQariId: z.string().optional(),
      preferredTranslationId: z.string().optional(),
      preferredTafsirId: z.string().optional(),
      audioQuality: z.string().optional(),
      autoPlayAudio: z.boolean().optional(),
      preferredMadhab: z.string().optional(),
      asrCalculation: z.string().optional(),
      arabicFontFamily: z.string().optional(),
      mushafStyle: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const preferences = await ctx.db.userPreferences.update({
        where: { userId: ctx.userId },
        data: input,
        include: {
          preferredQari: true,
          preferredTranslation: true,
          preferredTafsir: true,
        },
      })
      return preferences
    }),

  followQari: protectedProcedure
    .input(z.object({ qariId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const preferences = await ctx.db.userPreferences.findUnique({
        where: { userId: ctx.userId },
      })

      if (!preferences) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Preferences not found' })
      }

      const followedQaris = preferences.followedQaris.includes(input.qariId)
        ? preferences.followedQaris
        : [...preferences.followedQaris, input.qariId]

      const updated = await ctx.db.userPreferences.update({
        where: { userId: ctx.userId },
        data: { followedQaris },
      })

      return updated
    }),

  unfollowQari: protectedProcedure
    .input(z.object({ qariId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const preferences = await ctx.db.userPreferences.findUnique({
        where: { userId: ctx.userId },
      })

      if (!preferences) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Preferences not found' })
      }

      const followedQaris = preferences.followedQaris.filter((id) => id !== input.qariId)

      const updated = await ctx.db.userPreferences.update({
        where: { userId: ctx.userId },
        data: { followedQaris },
      })

      return updated
    }),

  getGamification: protectedProcedure
    .query(async ({ ctx }) => {
      const gamification = await ctx.db.userGamification.findUnique({
        where: { userId: ctx.userId },
      })

      if (!gamification) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Gamification data not found' })
      }

      return gamification
    }),

  addPoints: protectedProcedure
    .input(z.object({
      points: z.number().positive('Points must be a positive number'),
      source: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const gamification = await ctx.db.userGamification.findUnique({
        where: { userId: ctx.userId },
      })

      if (!gamification) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Gamification data not found' })
      }

      let newXp = gamification.currentXp + input.points
      let newLevel = gamification.level
      let xpToNextLevel = gamification.xpToNextLevel

      while (newXp >= xpToNextLevel) {
        newXp -= xpToNextLevel
        newLevel++
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5)
      }

      const rank = getRank(newLevel)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const lastActive = gamification.lastActiveDate
        ? new Date(gamification.lastActiveDate)
        : null
      lastActive?.setHours(0, 0, 0, 0)

      let currentStreak = gamification.currentStreak
      if (!lastActive || lastActive.getTime() < today.getTime() - 86400000) {
        currentStreak = 1
      } else if (lastActive.getTime() < today.getTime()) {
        currentStreak++
      }

      const longestStreak = Math.max(gamification.longestStreak, currentStreak)

      const sourceUpdates: Record<string, object> = {
        prayer: { totalPrayersCompleted: { increment: 1 } },
        quran: { totalAyahsRead: { increment: 1 } },
        mission: { totalMissionsCompleted: { increment: 1 } },
        donation: { totalDonationsCount: { increment: 1 } },
      }

      const updated = await ctx.db.userGamification.update({
        where: { userId: ctx.userId },
        data: {
          totalPoints: { increment: input.points },
          currentXp: newXp,
          level: newLevel,
          xpToNextLevel,
          rank,
          currentStreak,
          longestStreak,
          lastActiveDate: today,
          ...sourceUpdates[input.source],
        },
      })

      return {
        ...updated,
        pointsAdded: input.points,
        leveledUp: newLevel > gamification.level,
      }
    }),

  getAchievements: protectedProcedure
    .query(async ({ ctx }) => {
      const achievements = await ctx.db.userAchievement.findMany({
        where: { userId: ctx.userId },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      })
      return achievements
    }),

  getLeaderboard: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
      type: z.enum(['points', 'streak', 'level']).default('points'),
    }))
    .query(async ({ ctx, input }) => {
      const orderBy =
        input.type === 'streak'
          ? { currentStreak: 'desc' as const }
          : input.type === 'level'
            ? { level: 'desc' as const }
            : { totalPoints: 'desc' as const }

      const leaderboard = await ctx.db.userGamification.findMany({
        take: input.limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      })

      return leaderboard
    }),

  getQaris: publicProcedure
    .query(async ({ ctx }) => {
      const qaris = await ctx.db.qari.findMany({
        orderBy: [{ isPopular: 'desc' }, { name: 'asc' }],
      })
      return qaris
    }),

  getTranslationSources: publicProcedure
    .input(z.object({ lang: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const language = input?.lang
      const sources = await ctx.db.translationSource.findMany({
        where: language ? { language } : undefined,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      })
      return sources
    }),

  getTafsirSources: publicProcedure
    .input(z.object({ lang: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const language = input?.lang
      const sources = await ctx.db.tafsirSource.findMany({
        where: language ? { language } : undefined,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      })
      return sources
    }),
})
