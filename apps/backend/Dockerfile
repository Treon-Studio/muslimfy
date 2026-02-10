# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ================================
# Stage 2: Builder
# ================================
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Build TypeScript (if needed)
RUN pnpm typecheck || true

# ================================
# Stage 3: Production Runner
# ================================
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat dumb-init
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Set ownership
RUN chown -R hono:nodejs /app

USER hono

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "--import", "tsx", "src/dev-server.ts"]
