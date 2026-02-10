import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { getStartOfDay, formatDate, parseDate } from '../../utils/date'

export const prayerRouter = router({
  getTimes: publicProcedure
    .input(z.object({
      lat: z.number().default(-6.2088),
      lon: z.number().default(106.8456),
      date: z.string().optional(),
      method: z.string().default('KEMENAG'),
    }).optional())
    .query(async ({ ctx, input }) => {
      const lat = input?.lat ?? -6.2088
      const lon = input?.lon ?? 106.8456
      const method = input?.method ?? 'KEMENAG'
      const date = input?.date ? parseDate(input.date) : getStartOfDay()
      const cacheKey = `prayer:${formatDate(date)}:${lat.toFixed(2)}:${lon.toFixed(2)}:${method}`

      const cached = await ctx.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      let prayerTime = await ctx.db.prayerTime.findFirst({
        where: {
          date,
          latitude: { gte: lat - 0.1, lte: lat + 0.1 },
          longitude: { gte: lon - 0.1, lte: lon + 0.1 },
          calculationMethod: method as any,
        },
      })

      if (!prayerTime) {
        prayerTime = await ctx.db.prayerTime.create({
          data: {
            date,
            latitude: lat,
            longitude: lon,
            timezone: 'Asia/Jakarta',
            calculationMethod: method as any,
            fajr: '04:30',
            sunrise: '05:45',
            dhuhr: '11:55',
            asr: '15:15',
            maghrib: '17:55',
            isha: '19:10',
            imsak: '04:20',
            midnight: '23:55',
          },
        })
      }

      await ctx.redis.set(cacheKey, JSON.stringify(prayerTime), 'EX', 86400)

      return prayerTime
    }),

  getMonthly: publicProcedure
    .input(z.object({
      lat: z.number().default(-6.2088),
      lon: z.number().default(106.8456),
      month: z.string().optional(),
      method: z.string().default('KEMENAG'),
    }).optional())
    .query(async ({ input }) => {
      const today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()

      if (input?.month) {
        const [y, m] = input.month.split('-').map(Number)
        year = y
        month = m - 1
      }

      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const times: Array<{
        date: string
        fajr: string
        sunrise: string
        dhuhr: string
        asr: string
        maghrib: string
        isha: string
      }> = []

      for (let day = 1; day <= daysInMonth; day++) {
        times.push({
          date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          fajr: '04:30',
          sunrise: '05:45',
          dhuhr: '11:55',
          asr: '15:15',
          maghrib: '17:55',
          isha: '19:10',
        })
      }

      return { year, month: month + 1, times }
    }),

  getQibla: publicProcedure
    .input(z.object({
      lat: z.number().default(-6.2088),
      lon: z.number().default(106.8456),
    }).optional())
    .query(async ({ input }) => {
      const lat = input?.lat ?? -6.2088
      const lon = input?.lon ?? 106.8456

      const kaabaLat = 21.4225
      const kaabaLon = 39.8262

      const latRad = (lat * Math.PI) / 180
      const lonRad = (lon * Math.PI) / 180
      const kaabaLatRad = (kaabaLat * Math.PI) / 180
      const kaabaLonRad = (kaabaLon * Math.PI) / 180

      const y = Math.sin(kaabaLonRad - lonRad)
      const x =
        Math.cos(latRad) * Math.tan(kaabaLatRad) -
        Math.sin(latRad) * Math.cos(kaabaLonRad - lonRad)

      let qibla = (Math.atan2(y, x) * 180) / Math.PI
      if (qibla < 0) qibla += 360

      const R = 6371
      const dLat = kaabaLatRad - latRad
      const dLon = kaabaLonRad - lonRad
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latRad) * Math.cos(kaabaLatRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      return {
        direction: Math.round(qibla * 100) / 100,
        distance: Math.round(distance),
        unit: 'km',
      }
    }),

  completePrayer: protectedProcedure
    .input(z.object({
      name: z.string(),
      date: z.string().optional(),
      onTime: z.boolean().default(true),
      isJamaah: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const prayerName = input.name.toUpperCase()

      const validPrayers = ['FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA', 'TAHAJUD', 'DHUHA']
      if (!validPrayers.includes(prayerName)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid prayer name' })
      }

      const prayerDate = input.date ? parseDate(input.date) : getStartOfDay()

      const completion = await ctx.db.prayerCompletion.upsert({
        where: {
          userId_prayerName_prayerDate: {
            userId: ctx.userId,
            prayerName: prayerName as any,
            prayerDate,
          },
        },
        create: {
          userId: ctx.userId,
          prayerName: prayerName as any,
          prayerDate,
          onTime: input.onTime,
          isJamaah: input.isJamaah,
        },
        update: {
          completedAt: new Date(),
          onTime: input.onTime,
          isJamaah: input.isJamaah,
        },
      })

      return completion
    }),

  uncompletePrayer: protectedProcedure
    .input(z.object({
      name: z.string(),
      date: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const prayerName = input.name.toUpperCase()
      const prayerDate = input.date ? parseDate(input.date) : getStartOfDay()

      const deleted = await ctx.db.prayerCompletion.deleteMany({
        where: {
          userId: ctx.userId,
          prayerName: prayerName as any,
          prayerDate,
        },
      })

      if (deleted.count === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Completion not found' })
      }

      return { deleted: true }
    }),

  getHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30) }).optional())
    .query(async ({ ctx, input }) => {
      const days = input?.days ?? 30

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const completions = await ctx.db.prayerCompletion.findMany({
        where: {
          userId: ctx.userId,
          prayerDate: { gte: startDate },
        },
        orderBy: { prayerDate: 'desc' },
      })

      return completions
    }),
})
