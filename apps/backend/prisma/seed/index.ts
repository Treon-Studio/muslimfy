import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../node_modules/.prisma/client'
import { config } from 'dotenv'
import path from 'path'

import { missionTemplates } from './mission-templates'
import { cities } from './cities'
import { achievements } from './achievements'
import { dailyVerses } from './daily-verses'
import { charities, campaigns } from './charities'

// Load environment variables
config({ path: path.join(__dirname, '../../.dev.vars') })

// Create PostgreSQL pool and Prisma client
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...\n')

  // Seed Mission Templates
  console.log('📋 Seeding mission templates...')
  for (const template of missionTemplates) {
    const id = `template-${template.name.toLowerCase().replace(/\s+/g, '-')}`
    await prisma.missionTemplate.upsert({
      where: { id },
      update: {
        name: template.name,
        nameAr: template.nameAr,
        category: template.category as any,
        icon: template.icon,
        description: template.description,
        isDefault: template.isDefault,
      },
      create: {
        id,
        name: template.name,
        nameAr: template.nameAr,
        category: template.category as any,
        icon: template.icon,
        description: template.description,
        isDefault: template.isDefault,
      },
    })
  }
  console.log(`   ✅ ${missionTemplates.length} mission templates seeded\n`)

  // Seed Cities
  console.log('🏙️  Seeding cities...')
  for (const city of cities) {
    await prisma.city.upsert({
      where: {
        name_country: {
          name: city.name,
          country: city.country,
        },
      },
      update: city,
      create: city,
    })
  }
  console.log(`   ✅ ${cities.length} cities seeded\n`)

  // Seed Achievements
  console.log('🏆 Seeding achievements...')
  for (const achievement of achievements) {
    const id = `achievement-${achievement.name.toLowerCase().replace(/\s+/g, '-')}`
    await prisma.achievement.upsert({
      where: { id },
      update: {
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category as any,
        requirementType: achievement.requirementType,
        requirementValue: achievement.requirementValue,
      },
      create: {
        id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category as any,
        requirementType: achievement.requirementType,
        requirementValue: achievement.requirementValue,
      },
    })
  }
  console.log(`   ✅ ${achievements.length} achievements seeded\n`)

  // Seed Charities
  console.log('💚 Seeding charities...')
  const charityIds: string[] = []
  for (const charity of charities) {
    const id = `charity-${charity.name.toLowerCase().replace(/\s+/g, '-')}`
    const created = await prisma.charity.upsert({
      where: { id },
      update: {
        name: charity.name,
        description: charity.description,
        logoUrl: charity.logoUrl,
        category: charity.category as any,
        verificationStatus: charity.verificationStatus as any,
        registrationNumber: charity.registrationNumber,
        website: charity.website,
        email: charity.email,
        trustScore: charity.trustScore,
      },
      create: {
        id,
        name: charity.name,
        description: charity.description,
        logoUrl: charity.logoUrl,
        category: charity.category as any,
        verificationStatus: charity.verificationStatus as any,
        registrationNumber: charity.registrationNumber,
        website: charity.website,
        email: charity.email,
        trustScore: charity.trustScore,
      },
    })
    charityIds.push(created.id)
  }
  console.log(`   ✅ ${charities.length} charities seeded\n`)

  // Seed Campaigns
  console.log('📢 Seeding campaigns...')
  for (const campaign of campaigns) {
    const charityId = charityIds[campaign.charityIndex]
    const id = `campaign-${campaign.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`
    await prisma.campaign.upsert({
      where: { id },
      update: {
        charityId,
        title: campaign.title,
        description: campaign.description,
        imageUrls: campaign.imageUrls,
        targetAmount: campaign.targetAmount,
        category: campaign.category as any,
        isEmergency: campaign.isEmergency,
        startDate: new Date(),
      },
      create: {
        id,
        charityId,
        title: campaign.title,
        description: campaign.description,
        imageUrls: campaign.imageUrls,
        targetAmount: campaign.targetAmount,
        category: campaign.category as any,
        isEmergency: campaign.isEmergency,
        startDate: new Date(),
      },
    })
  }
  console.log(`   ✅ ${campaigns.length} campaigns seeded\n`)

  // Check if Quran data exists before seeding daily verses
  const surahCount = await prisma.surah.count()
  if (surahCount > 0) {
    console.log('📖 Seeding daily verses...')
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < dailyVerses.length; i++) {
      const verse = dailyVerses[i]
      const displayDate = new Date(startDate)
      displayDate.setDate(displayDate.getDate() + i)

      // Find the ayah
      const ayah = await prisma.ayah.findUnique({
        where: {
          surahNumber_ayahNumber: {
            surahNumber: verse.surahNumber,
            ayahNumber: verse.ayahNumber,
          },
        },
      })

      if (ayah) {
        await prisma.dailyVerse.upsert({
          where: { displayDate },
          update: {
            ayahId: ayah.id,
            theme: verse.theme as any,
            briefTafsir: verse.briefTafsir,
          },
          create: {
            ayahId: ayah.id,
            displayDate,
            theme: verse.theme as any,
            briefTafsir: verse.briefTafsir,
          },
        })
      }
    }
    console.log(`   ✅ ${dailyVerses.length} daily verses seeded\n`)
  } else {
    console.log('⚠️  Skipping daily verses (Quran data not found)')
    console.log('   Run `pnpm db:seed:quran` first to seed Quran data\n')
  }

  console.log('✨ Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
