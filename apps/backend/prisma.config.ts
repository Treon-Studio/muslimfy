import path from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Load .dev.vars for local development
config({ path: path.join(__dirname, '.dev.vars') })

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    url: process.env.DATABASE_URL!,
  },
})
