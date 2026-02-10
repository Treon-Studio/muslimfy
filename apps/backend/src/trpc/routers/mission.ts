import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '../trpc'
import { getStartOfDay, parseDate } from '../../utils/date'

export const missionRouter = router({
  list: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      active: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const missions = await ctx.db.mission.findMany({
        where: {
          userId: ctx.userId,
          ...(input?.category && { category: input.category as any }),
          ...(input?.active !== undefined && { isActive: input.active }),
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      })
      return missions
    }),

  getTemplates: protectedProcedure
    .query(async ({ ctx }) => {
      const templates = await ctx.db.missionTemplate.findMany({
        orderBy: { category: 'asc' },
      })
      return templates
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      category: z.string(),
      icon: z.string(),
      description: z.string().optional(),
      priority: z.string().optional(),
      targetFrequency: z.string().optional(),
      targetCount: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const mission = await ctx.db.mission.create({
        data: {
          userId: ctx.userId,
          name: input.name,
          category: input.category as any,
          icon: input.icon,
          description: input.description,
          priority: (input.priority as any) || 'MEDIUM',
          targetFrequency: (input.targetFrequency as any) || 'DAILY',
          targetCount: input.targetCount || 1,
        },
      })
      return mission
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const mission = await ctx.db.mission.findFirst({
        where: { id: input.id, userId: ctx.userId },
      })

      if (!mission) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission not found' })
      }

      return mission
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: z.record(z.unknown()),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.mission.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data: input.data,
      })

      if (result.count === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission not found' })
      }

      const updated = await ctx.db.mission.findUnique({ where: { id: input.id } })
      return updated
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db.mission.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      })

      if (deleted.count === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission not found' })
      }

      return { deleted: true }
    }),

  complete: protectedProcedure
    .input(z.object({
      id: z.string(),
      date: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const completionDate = input.date ? parseDate(input.date) : getStartOfDay()

      const mission = await ctx.db.mission.findFirst({
        where: { id: input.id, userId: ctx.userId },
      })

      if (!mission) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mission not found' })
      }

      const completion = await ctx.db.missionCompletion.upsert({
        where: {
          missionId_completionDate: {
            missionId: input.id,
            completionDate,
          },
        },
        create: {
          missionId: input.id,
          userId: ctx.userId,
          completionDate,
          notes: input.notes,
        },
        update: {
          completedAt: new Date(),
          notes: input.notes,
        },
      })

      return completion
    }),

  uncomplete: protectedProcedure
    .input(z.object({
      id: z.string(),
      date: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const completionDate = input.date ? parseDate(input.date) : getStartOfDay()

      const deleted = await ctx.db.missionCompletion.deleteMany({
        where: {
          missionId: input.id,
          userId: ctx.userId,
          completionDate,
        },
      })

      if (deleted.count === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Completion not found' })
      }

      return { deleted: true }
    }),
})
