import { z } from 'zod'
import { hash, compare } from 'bcryptjs'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  getRefreshTokenExpiry,
} from '../../lib/jwt'

const SALT_ROUNDS = 12

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      name: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, jwtSecret, headers } = ctx

      const existing = await db.user.findUnique({
        where: { email: input.email.toLowerCase() },
      })

      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' })
      }

      const passwordHash = await hash(input.password, SALT_ROUNDS)

      const user = await db.user.create({
        data: {
          email: input.email.toLowerCase(),
          passwordHash,
          name: input.name,
          settings: { create: {} },
          gamification: { create: {} },
          preferences: { create: {} },
        },
        include: {
          settings: true,
          gamification: true,
          preferences: true,
        },
      })

      const tokenPayload = { userId: user.id, email: user.email }
      const accessToken = await generateAccessToken(tokenPayload, jwtSecret)
      const refreshToken = await generateRefreshToken(tokenPayload, jwtSecret)

      await db.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: getRefreshTokenExpiry(),
          deviceInfo: headers.get('User-Agent'),
          ipAddress: headers.get('CF-Connecting-IP') || headers.get('X-Forwarded-For'),
        },
      })

      const { passwordHash: _, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      }
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, jwtSecret, headers } = ctx

      const user = await db.user.findUnique({
        where: { email: input.email.toLowerCase() },
        include: {
          settings: true,
          gamification: true,
          preferences: true,
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' })
      }

      if (!user.passwordHash) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please set a password first' })
      }

      const isValidPassword = await compare(input.password, user.passwordHash)
      if (!isValidPassword) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' })
      }

      await db.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      })

      const tokenPayload = { userId: user.id, email: user.email }
      const accessToken = await generateAccessToken(tokenPayload, jwtSecret)
      const refreshToken = await generateRefreshToken(tokenPayload, jwtSecret)

      await db.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: getRefreshTokenExpiry(),
          deviceInfo: headers.get('User-Agent'),
          ipAddress: headers.get('CF-Connecting-IP') || headers.get('X-Forwarded-For'),
        },
      })

      const { passwordHash: _, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      }
    }),

  refresh: publicProcedure
    .input(z.object({
      refreshToken: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, jwtSecret } = ctx

      const payload = await verifyToken(input.refreshToken, jwtSecret)

      if (!payload || payload.type !== 'refresh') {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid refresh token' })
      }

      const storedToken = await db.refreshToken.findUnique({
        where: { token: input.refreshToken },
        include: { user: true },
      })

      if (!storedToken || storedToken.revokedAt) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Refresh token has been revoked' })
      }

      if (storedToken.expiresAt < new Date()) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Refresh token has expired' })
      }

      const tokenPayload = { userId: storedToken.userId, email: storedToken.user.email }
      const accessToken = await generateAccessToken(tokenPayload, jwtSecret)

      return { accessToken }
    }),

  logout: publicProcedure
    .input(z.object({
      refreshToken: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.refreshToken.updateMany({
        where: { token: input.refreshToken },
        data: { revokedAt: new Date() },
      })

      return { message: 'Logged out successfully' }
    }),

  logoutAll: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.refreshToken.updateMany({
        where: { userId: ctx.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      return { message: 'Logged out from all devices' }
    }),

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

  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
      })

      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const isValidPassword = await compare(input.currentPassword, user.passwordHash)
      if (!isValidPassword) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Current password is incorrect' })
      }

      const newPasswordHash = await hash(input.newPassword, SALT_ROUNDS)

      await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { passwordHash: newPasswordHash },
      })

      await ctx.db.refreshToken.updateMany({
        where: { userId: ctx.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      return { message: 'Password changed successfully. Please login again.' }
    }),
})
