import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'

export const quranRouter = router({
  getSurahs: publicProcedure
    .query(async ({ ctx }) => {
      const cacheKey = 'quran:surahs'

      const cached = await ctx.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const surahs = await ctx.db.surah.findMany({
        orderBy: { number: 'asc' },
      })

      await ctx.redis.set(cacheKey, JSON.stringify(surahs), 'EX', 86400)

      return surahs
    }),

  getSurah: publicProcedure
    .input(z.object({
      number: z.number().min(1).max(114),
      lang: z.string().default('id'),
    }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `quran:surah:${input.number}:${input.lang}`

      const cached = await ctx.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const surah = await ctx.db.surah.findUnique({
        where: { number: input.number },
        include: {
          ayahs: {
            orderBy: { ayahNumber: 'asc' },
            include: {
              translations: {
                where: { language: input.lang },
              },
            },
          },
        },
      })

      if (!surah) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Surah not found' })
      }

      await ctx.redis.set(cacheKey, JSON.stringify(surah), 'EX', 86400)

      return surah
    }),

  getAyah: publicProcedure
    .input(z.object({
      surahNumber: z.number(),
      ayahNumber: z.number(),
      lang: z.string().default('id'),
    }))
    .query(async ({ ctx, input }) => {
      const ayah = await ctx.db.ayah.findUnique({
        where: {
          surahNumber_ayahNumber: {
            surahNumber: input.surahNumber,
            ayahNumber: input.ayahNumber,
          },
        },
        include: {
          surah: true,
          translations: {
            where: { language: input.lang },
          },
        },
      })

      if (!ayah) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Ayah not found' })
      }

      return ayah
    }),

  getJuz: publicProcedure
    .input(z.object({
      number: z.number().min(1).max(30),
      lang: z.string().default('id'),
    }))
    .query(async ({ ctx, input }) => {
      const ayahs = await ctx.db.ayah.findMany({
        where: { juzNumber: input.number },
        orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }],
        include: {
          surah: true,
          translations: {
            where: { language: input.lang },
          },
        },
      })

      return { juzNumber: input.number, ayahs }
    }),

  getPage: publicProcedure
    .input(z.object({
      number: z.number(),
      lang: z.string().default('id'),
    }))
    .query(async ({ ctx, input }) => {
      const ayahs = await ctx.db.ayah.findMany({
        where: { pageMushaf: input.number },
        orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }],
        include: {
          surah: true,
          translations: {
            where: { language: input.lang },
          },
        },
      })

      if (ayahs.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
      }

      return { pageNumber: input.number, ayahs }
    }),

  search: publicProcedure
    .input(z.object({
      q: z.string().min(3, 'Query must be at least 3 characters'),
      lang: z.string().default('id'),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.translation.findMany({
        where: {
          language: input.lang,
          text: {
            contains: input.q,
            mode: 'insensitive',
          },
        },
        take: input.limit,
        skip: input.offset,
        include: {
          ayah: {
            include: {
              surah: true,
            },
          },
        },
      })

      const total = await ctx.db.translation.count({
        where: {
          language: input.lang,
          text: {
            contains: input.q,
            mode: 'insensitive',
          },
        },
      })

      return {
        results,
        total,
        page: Math.floor(input.offset / input.limit) + 1,
        limit: input.limit,
        totalPages: Math.ceil(total / input.limit),
      }
    }),

  getBookmarks: protectedProcedure
    .input(z.object({ folder: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const bookmarks = await ctx.db.bookmark.findMany({
        where: {
          userId: ctx.userId,
          ...(input?.folder && { folderName: input.folder }),
        },
        orderBy: { createdAt: 'desc' },
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

      return bookmarks
    }),

  createBookmark: protectedProcedure
    .input(z.object({
      ayahId: z.string(),
      folderName: z.string().optional(),
      note: z.string().optional(),
      color: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.upsert({
        where: {
          userId_ayahId: {
            userId: ctx.userId,
            ayahId: input.ayahId,
          },
        },
        create: {
          userId: ctx.userId,
          ayahId: input.ayahId,
          folderName: input.folderName || 'Favorites',
          note: input.note,
          color: input.color,
        },
        update: {
          folderName: input.folderName,
          note: input.note,
          color: input.color,
        },
      })

      return bookmark
    }),

  deleteBookmark: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db.bookmark.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      })

      if (deleted.count === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Bookmark not found' })
      }

      return { deleted: true }
    }),

  getReadingProgress: protectedProcedure
    .query(async ({ ctx }) => {
      let progress = await ctx.db.readingProgress.findUnique({
        where: { userId: ctx.userId },
      })

      if (!progress) {
        progress = await ctx.db.readingProgress.create({
          data: { userId: ctx.userId },
        })
      }

      return progress
    }),

  saveReadingHistory: protectedProcedure
    .input(z.object({
      surahNumber: z.number(),
      ayahNumber: z.number(),
      durationSec: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.readingHistory.create({
        data: {
          userId: ctx.userId,
          surahNumber: input.surahNumber,
          ayahNumber: input.ayahNumber,
          durationSec: input.durationSec,
        },
      })

      await ctx.db.readingProgress.upsert({
        where: { userId: ctx.userId },
        create: {
          userId: ctx.userId,
          lastSurahNumber: input.surahNumber,
          lastAyahNumber: input.ayahNumber,
          totalAyahsRead: 1,
        },
        update: {
          lastSurahNumber: input.surahNumber,
          lastAyahNumber: input.ayahNumber,
          totalAyahsRead: { increment: 1 },
        },
      })

      return { saved: true }
    }),

  getLastRead: protectedProcedure
    .query(async ({ ctx }) => {
      const progress = await ctx.db.readingProgress.findUnique({
        where: { userId: ctx.userId },
      })

      if (!progress || !progress.lastSurahNumber) {
        return null
      }

      const ayah = await ctx.db.ayah.findUnique({
        where: {
          surahNumber_ayahNumber: {
            surahNumber: progress.lastSurahNumber,
            ayahNumber: progress.lastAyahNumber || 1,
          },
        },
        include: {
          surah: true,
        },
      })

      return ayah
    }),

  getHifzChallenge: protectedProcedure
    .input(z.object({ count: z.number().min(1).max(10).default(5) }).optional())
    .query(async ({ ctx, input }) => {
      const count = input?.count ?? 5
      const totalAyahs = await ctx.db.ayah.count()

      if (totalAyahs === 0) {
        return []
      }

      // Generate unique random offsets
      const offsets = new Set<number>()
      while (offsets.size < Math.min(count * 4, totalAyahs)) {
        offsets.add(Math.floor(Math.random() * totalAyahs))
      }

      const offsetArr = Array.from(offsets)

      // Fetch candidate ayahs
      const ayahs = await Promise.all(
        offsetArr.slice(0, count * 2).map((skip) =>
          ctx.db.ayah.findFirst({
            skip,
            include: {
              surah: true,
              translations: { where: { language: 'id' }, take: 1 },
            },
          })
        )
      )

      const validAyahs = ayahs.filter(
        (a) => a && a.textArabic.split(/\s+/).filter((w) => w.length > 1).length >= 3
      )

      // Fetch extra ayahs for wrong options
      const extraAyahs = await Promise.all(
        offsetArr.slice(count * 2).map((skip) =>
          ctx.db.ayah.findFirst({ skip })
        )
      )

      const wrongWordPool = extraAyahs
        .filter(Boolean)
        .flatMap((a) => a!.textArabic.split(/\s+/).filter((w) => w.length > 1))

      const questions = validAyahs.slice(0, count).map((ayah, i) => {
        const words = ayah!.textArabic.split(/\s+/).filter((w) => w.length > 1)
        const wordIndex = 1 + Math.floor(Math.random() * Math.max(1, words.length - 2))
        const missingWord = words[wordIndex]

        const verseWithBlank = words
          .map((w, idx) => (idx === wordIndex ? '؟؟؟' : w))
          .join(' ')

        // Pick 3 wrong options from the pool
        const wrongOptions: string[] = []
        const shuffledPool = [...wrongWordPool].sort(() => Math.random() - 0.5)
        for (const w of shuffledPool) {
          if (w !== missingWord && !wrongOptions.includes(w)) {
            wrongOptions.push(w)
          }
          if (wrongOptions.length >= 3) break
        }

        const options = [missingWord, ...wrongOptions].sort(() => Math.random() - 0.5)

        return {
          id: i + 1,
          ayahId: ayah!.id,
          verse: verseWithBlank,
          missingWord,
          options,
          translation: ayah!.translations?.[0]?.text ?? '',
          surahName: ayah!.surah.nameTransliteration,
          surahNumber: ayah!.surahNumber,
          ayahNumber: ayah!.ayahNumber,
        }
      })

      return questions
    }),

  getHifzJourney: protectedProcedure
    .query(async ({ ctx }) => {
      // Get Juz 30 surahs (78-114) in reverse order (memorization order)
      const surahs = await ctx.db.surah.findMany({
        where: { number: { gte: 78, lte: 114 } },
        orderBy: { number: 'desc' },
      })

      const progress = await ctx.db.readingProgress.findUnique({
        where: { userId: ctx.userId },
      })

      const completedSurahs: number[] = Array.isArray(progress?.surahsCompleted)
        ? (progress.surahsCompleted as number[])
        : []

      const completedSet = new Set(completedSurahs)
      let foundCurrent = false

      const nodes = surahs.map((surah) => {
        if (completedSet.has(surah.number)) {
          return {
            id: String(surah.number),
            name: `Surah ${surah.nameTransliteration}`,
            surahNumber: surah.number,
            status: 'completed' as const,
          }
        }

        if (!foundCurrent) {
          foundCurrent = true
          return {
            id: String(surah.number),
            name: `Surah ${surah.nameTransliteration}`,
            surahNumber: surah.number,
            status: 'current' as const,
          }
        }

        return {
          id: String(surah.number),
          name: `Surah ${surah.nameTransliteration}`,
          surahNumber: surah.number,
          status: 'locked' as const,
        }
      })

      return nodes
    }),
})
