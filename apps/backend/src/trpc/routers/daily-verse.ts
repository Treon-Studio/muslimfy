import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { formatDate, getStartOfDay } from '../../utils/date'

export const dailyVerseRouter = router({
  getToday: publicProcedure
    .query(async ({ ctx }) => {
      const today = getStartOfDay()
      const cacheKey = `daily-verse:${formatDate(today)}`

      const cached = await ctx.redis.get(cacheKey)
      let verse

      if (cached) {
        verse = JSON.parse(cached)
      } else {
        verse = await ctx.db.dailyVerse.findUnique({
          where: { displayDate: today },
          include: {
            ayah: {
              include: {
                surah: true,
                translations: {
                  where: { language: 'id' },
                  take: 1,
                },
              },
            },
          },
        })

        if (verse) {
          await ctx.redis.set(cacheKey, JSON.stringify(verse), 'EX', 86400)
        }
      }

      if (!verse) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Daily verse not found' })
      }

      let isFavorited = false
      if (ctx.userId) {
        const favorite = await ctx.db.dailyVerseFavorite.findUnique({
          where: {
            userId_dailyVerseId: {
              userId: ctx.userId,
              dailyVerseId: verse.id,
            },
          },
        })
        isFavorited = !!favorite
      }

      return { ...verse, isFavorited }
    }),

  getHistory: publicProcedure
    .input(z.object({
      limit: z.number().default(30),
      offset: z.number().default(0),
      theme: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const verses = await ctx.db.dailyVerse.findMany({
        where: {
          displayDate: { lte: new Date() },
          ...(input?.theme && { theme: input.theme as any }),
        },
        orderBy: { displayDate: 'desc' },
        take: input?.limit ?? 30,
        skip: input?.offset ?? 0,
        include: {
          ayah: {
            include: {
              surah: true,
              translations: {
                where: { language: 'id' },
                take: 1,
              },
            },
          },
        },
      })

      return verses
    }),

  getByDate: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date + 'T00:00:00.000Z')

      const verse = await ctx.db.dailyVerse.findUnique({
        where: { displayDate: date },
        include: {
          ayah: {
            include: {
              surah: true,
              translations: {
                where: { language: 'id' },
                take: 1,
              },
            },
          },
        },
      })

      if (!verse) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Verse not found for this date' })
      }

      return verse
    }),

  share: publicProcedure
    .input(z.object({ verseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.dailyVerse.update({
        where: { id: input.verseId },
        data: { shareCount: { increment: 1 } },
      })

      return { shared: true }
    }),

  getFavorites: protectedProcedure
    .query(async ({ ctx }) => {
      const favorites = await ctx.db.dailyVerseFavorite.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          dailyVerse: {
            include: {
              ayah: {
                include: {
                  surah: true,
                  translations: {
                    where: { language: 'id' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      })

      return favorites
    }),

  addFavorite: protectedProcedure
    .input(z.object({ verseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const favorite = await ctx.db.dailyVerseFavorite.create({
        data: {
          userId: ctx.userId,
          dailyVerseId: input.verseId,
        },
      })

      await ctx.db.dailyVerse.update({
        where: { id: input.verseId },
        data: { favoriteCount: { increment: 1 } },
      })

      return favorite
    }),

  removeFavorite: protectedProcedure
    .input(z.object({ verseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db.dailyVerseFavorite.deleteMany({
        where: {
          userId: ctx.userId,
          dailyVerseId: input.verseId,
        },
      })

      if (deleted.count > 0) {
        await ctx.db.dailyVerse.update({
          where: { id: input.verseId },
          data: { favoriteCount: { decrement: 1 } },
        })
      }

      return { deleted: deleted.count > 0 }
    }),
})
