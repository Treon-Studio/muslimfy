import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import {
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  formatDate,
} from '../../utils/date'

export const statsRouter = router({
  daily: protectedProcedure
    .input(z.object({ date: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const date = input?.date ? new Date(input.date) : new Date()
      const startOfDay = getStartOfDay(date)
      const cacheKey = `stats:daily:${ctx.userId}:${formatDate(date)}`

      const cached = await ctx.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const missions = await ctx.db.mission.findMany({
        where: { userId: ctx.userId, isActive: true },
      })

      const completions = await ctx.db.missionCompletion.findMany({
        where: {
          userId: ctx.userId,
          completionDate: startOfDay,
        },
      })

      const completedIds = new Set(completions.map((c) => c.missionId))
      const totalMissions = missions.length
      const completedMissions = completions.length
      const completionPercentage = totalMissions > 0
        ? Math.round((completedMissions / totalMissions) * 100)
        : 0

      const prayerCompletions = await ctx.db.prayerCompletion.findMany({
        where: {
          userId: ctx.userId,
          prayerDate: startOfDay,
        },
      })

      const result = {
        date: formatDate(date),
        totalMissions,
        completedMissions,
        completionPercentage,
        prayersCompleted: prayerCompletions.length,
        missions: missions.map((m) => ({
          ...m,
          completed: completedIds.has(m.id),
        })),
      }

      await ctx.redis.set(cacheKey, JSON.stringify(result), 'EX', 300)

      return result
    }),

  weekly: protectedProcedure
    .query(async ({ ctx }) => {
      const today = new Date()
      const startOfWeek = getStartOfWeek(today)

      const missions = await ctx.db.mission.findMany({
        where: { userId: ctx.userId, isActive: true },
      })

      const completions = await ctx.db.missionCompletion.findMany({
        where: {
          userId: ctx.userId,
          completionDate: { gte: startOfWeek },
        },
      })

      const dailyStats: Record<string, number> = {}
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek)
        d.setDate(d.getDate() + i)
        dailyStats[formatDate(d)] = 0
      }

      completions.forEach((c) => {
        const key = formatDate(c.completionDate)
        if (dailyStats[key] !== undefined) {
          dailyStats[key]++
        }
      })

      const totalMissions = missions.length
      const weeklyAverage = totalMissions > 0
        ? Math.round(
            (Object.values(dailyStats).reduce((a, b) => a + b, 0) / 7 / totalMissions) * 100
          )
        : 0

      return {
        startDate: formatDate(startOfWeek),
        totalMissions,
        dailyStats,
        weeklyAverage,
        totalCompletions: completions.length,
      }
    }),

  monthly: protectedProcedure
    .input(z.object({ month: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()

      if (input?.month) {
        const [y, m] = input.month.split('-').map(Number)
        year = y
        month = m - 1
      }

      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0)

      const completions = await ctx.db.missionCompletion.findMany({
        where: {
          userId: ctx.userId,
          completionDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      })

      const dailyStats: Record<string, number> = {}
      completions.forEach((c) => {
        const key = formatDate(c.completionDate)
        dailyStats[key] = (dailyStats[key] || 0) + 1
      })

      return {
        year,
        month: month + 1,
        dailyStats,
        totalCompletions: completions.length,
        daysWithActivity: Object.keys(dailyStats).length,
      }
    }),

  streaks: protectedProcedure
    .query(async ({ ctx }) => {
      const missions = await ctx.db.mission.findMany({
        where: { userId: ctx.userId, isActive: true },
      })

      if (missions.length === 0) {
        return { currentStreak: 0, bestStreak: 0, todayComplete: false }
      }

      const completions = await ctx.db.missionCompletion.findMany({
        where: { userId: ctx.userId },
        orderBy: { completionDate: 'desc' },
      })

      let currentStreak = 0
      let bestStreak = 0
      const today = getStartOfDay()

      const dateSet = new Set(
        completions.map((c) => formatDate(c.completionDate))
      )

      const todayCompletions = completions.filter(
        (c) => formatDate(c.completionDate) === formatDate(today)
      ).length
      const todayComplete = todayCompletions >= Math.ceil(missions.length * 0.5)

      let checkDate = todayComplete ? today : new Date(today.getTime() - 86400000)

      while (dateSet.has(formatDate(checkDate))) {
        currentStreak++
        checkDate = new Date(checkDate.getTime() - 86400000)
      }

      bestStreak = Math.max(currentStreak, bestStreak)

      return {
        currentStreak,
        bestStreak,
        todayComplete,
      }
    }),

  activityGrid: protectedProcedure
    .input(z.object({ weeks: z.number().default(12) }).optional())
    .query(async ({ ctx, input }) => {
      const weeks = input?.weeks ?? 12

      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(startDate.getDate() - weeks * 7)

      const missions = await ctx.db.mission.findMany({
        where: { userId: ctx.userId, isActive: true },
      })

      const completions = await ctx.db.missionCompletion.findMany({
        where: {
          userId: ctx.userId,
          completionDate: { gte: startDate },
        },
      })

      const completionsByDate: Record<string, number> = {}
      completions.forEach((c) => {
        const key = formatDate(c.completionDate)
        completionsByDate[key] = (completionsByDate[key] || 0) + 1
      })

      const grid: Array<{
        date: string
        count: number
        level: number
      }> = []

      const totalMissions = missions.length || 1

      for (let i = 0; i <= weeks * 7; i++) {
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const dateStr = formatDate(d)
        const count = completionsByDate[dateStr] || 0
        const percentage = (count / totalMissions) * 100

        let level = 0
        if (percentage > 0 && percentage <= 25) level = 1
        else if (percentage > 25 && percentage <= 50) level = 2
        else if (percentage > 50 && percentage <= 75) level = 3
        else if (percentage > 75) level = 4

        grid.push({ date: dateStr, count, level })
      }

      return { grid, totalMissions }
    }),
})
