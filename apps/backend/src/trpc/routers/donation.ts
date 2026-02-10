import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'

export const donationRouter = router({
  getCharities: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const category = input?.category
      const limit = input?.limit ?? 20
      const offset = input?.offset ?? 0
      const cacheKey = `charities:${category || 'all'}:${limit}:${offset}`

      const cached = await ctx.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }

      const charities = await ctx.db.charity.findMany({
        where: {
          isActive: true,
          verificationStatus: 'VERIFIED',
          ...(category && { category: category as any }),
        },
        orderBy: { trustScore: 'desc' },
        take: limit,
        skip: offset,
      })

      const total = await ctx.db.charity.count({
        where: {
          isActive: true,
          verificationStatus: 'VERIFIED',
          ...(category && { category: category as any }),
        },
      })

      const result = {
        charities,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      }

      await ctx.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600)

      return result
    }),

  getCharity: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const charity = await ctx.db.charity.findUnique({
        where: { id: input.id },
        include: {
          campaigns: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!charity) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Charity not found' })
      }

      return charity
    }),

  getCategories: publicProcedure
    .query(async () => {
      return [
        { id: 'ZAKAT', name: 'Zakat', icon: '💰', description: 'Zakat wajib' },
        { id: 'INFAQ', name: 'Infaq', icon: '📿', description: 'Infaq di jalan Allah' },
        { id: 'SEDEKAH', name: 'Sedekah', icon: '🤲', description: 'Sedekah sukarela' },
        { id: 'WAKAF', name: 'Wakaf', icon: '🕌', description: 'Wakaf produktif' },
        { id: 'EMERGENCY', name: 'Darurat', icon: '🆘', description: 'Bantuan bencana' },
        { id: 'EDUCATION', name: 'Pendidikan', icon: '🎓', description: 'Beasiswa & sekolah' },
        { id: 'HEALTH', name: 'Kesehatan', icon: '🏥', description: 'Bantuan medis' },
        { id: 'FOOD', name: 'Pangan', icon: '🍲', description: 'Bantuan makanan' },
        { id: 'WATER', name: 'Air Bersih', icon: '💧', description: 'Akses air bersih' },
      ]
    }),

  getCampaigns: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      emergency: z.boolean().optional(),
      limit: z.number().default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      const campaigns = await ctx.db.campaign.findMany({
        where: {
          isActive: true,
          ...(input?.category && { category: input.category as any }),
          ...(input?.emergency && { isEmergency: true }),
        },
        orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
        take: input?.limit ?? 10,
        include: {
          charity: {
            select: { id: true, name: true, logoUrl: true },
          },
        },
      })

      return campaigns
    }),

  getCampaign: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const campaign = await ctx.db.campaign.findUnique({
        where: { id: input.id },
        include: {
          charity: true,
        },
      })

      if (!campaign) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Campaign not found' })
      }

      return campaign
    }),

  create: protectedProcedure
    .input(z.object({
      charityId: z.string(),
      campaignId: z.string().optional(),
      amount: z.number().min(1000, 'Minimum donation is Rp 1,000'),
      category: z.string(),
      paymentMethod: z.string().optional(),
      isAnonymous: z.boolean().default(false),
      isRecurring: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const charity = await ctx.db.charity.findUnique({
        where: { id: input.charityId },
      })

      if (!charity || !charity.isActive) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Charity not found or inactive' })
      }

      const donation = await ctx.db.donation.create({
        data: {
          userId: ctx.userId,
          charityId: input.charityId,
          campaignId: input.campaignId,
          amount: input.amount,
          category: input.category as any,
          paymentMethod: input.paymentMethod as any,
          isAnonymous: input.isAnonymous,
          isRecurring: input.isRecurring,
          paymentStatus: 'PENDING',
        },
      })

      return {
        donation,
        paymentUrl: `https://payment.muslimfy.app/pay/${donation.id}`,
      }
    }),

  list: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20
      const offset = input?.offset ?? 0

      const donations = await ctx.db.donation.findMany({
        where: {
          userId: ctx.userId,
          ...(input?.status && { paymentStatus: input.status as any }),
        },
        orderBy: { donatedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          charity: {
            select: { id: true, name: true, logoUrl: true },
          },
          campaign: {
            select: { id: true, title: true },
          },
        },
      })

      const total = await ctx.db.donation.count({
        where: {
          userId: ctx.userId,
          ...(input?.status && { paymentStatus: input.status as any }),
        },
      })

      return {
        donations,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const donation = await ctx.db.donation.findFirst({
        where: { id: input.id, userId: ctx.userId },
        include: {
          charity: true,
          campaign: true,
        },
      })

      if (!donation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Donation not found' })
      }

      return donation
    }),

  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      let stats = await ctx.db.donationStats.findUnique({
        where: { userId: ctx.userId },
      })

      if (!stats) {
        const donations = await ctx.db.donation.findMany({
          where: { userId: ctx.userId, paymentStatus: 'SUCCESS' },
        })

        const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
        const charityIds = new Set(donations.map((d) => d.charityId))

        stats = await ctx.db.donationStats.create({
          data: {
            userId: ctx.userId,
            totalDonated,
            donationCount: donations.length,
            charitiesSupported: charityIds.size,
          },
        })
      }

      return stats
    }),

  paymentCallback: publicProcedure
    .input(z.object({
      donationId: z.string(),
      status: z.string(),
      paymentId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const status = input.status === 'success' ? 'SUCCESS' :
                     input.status === 'failed' ? 'FAILED' :
                     input.status === 'expired' ? 'EXPIRED' : 'PENDING'

      const donation = await ctx.db.donation.update({
        where: { id: input.donationId },
        data: {
          paymentStatus: status as any,
          paymentId: input.paymentId,
          completedAt: status === 'SUCCESS' ? new Date() : null,
        },
      })

      if (status === 'SUCCESS') {
        await ctx.db.charity.update({
          where: { id: donation.charityId },
          data: { totalRaised: { increment: donation.amount } },
        })

        if (donation.campaignId) {
          await ctx.db.campaign.update({
            where: { id: donation.campaignId },
            data: { raisedAmount: { increment: donation.amount } },
          })
        }

        await ctx.db.donationStats.upsert({
          where: { userId: donation.userId },
          create: {
            userId: donation.userId,
            totalDonated: donation.amount,
            donationCount: 1,
            charitiesSupported: 1,
            lastDonationAt: new Date(),
          },
          update: {
            totalDonated: { increment: donation.amount },
            donationCount: { increment: 1 },
            lastDonationAt: new Date(),
          },
        })
      }

      return { received: true }
    }),
})
