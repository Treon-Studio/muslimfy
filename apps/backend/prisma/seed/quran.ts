import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../node_modules/.prisma/client'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../../.dev.vars') })

// Create PostgreSQL pool and Prisma client
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const QURAN_API = 'https://api.quran.com/api/v4'
const KEMENAG_TRANSLATION_ID = 33 // Indonesian - Kemenag

interface QuranSurah {
  id: number
  revelation_place: string
  revelation_order: number
  bismillah_pre: boolean
  name_simple: string
  name_complex: string
  name_arabic: string
  verses_count: number
  translated_name: {
    language_name: string
    name: string
  }
}

interface QuranVerse {
  id: number
  verse_number: number
  verse_key: string
  hizb_number: number
  rub_el_hizb_number: number
  ruku_number: number
  manzil_number: number
  page_number: number
  juz_number: number
  text_uthmani: string
  text_uthmani_simple: string
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      console.log(`   Retry ${i + 1}/${retries}...`)
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

async function seedSurahs(): Promise<void> {
  console.log('📖 Fetching surah list...')

  const data = await fetchWithRetry(`${QURAN_API}/chapters`)
  const surahs: QuranSurah[] = data.chapters

  for (const surah of surahs) {
    await prisma.surah.upsert({
      where: { number: surah.id },
      update: {
        nameArabic: surah.name_arabic,
        nameIndonesian: surah.translated_name.name,
        nameTransliteration: surah.name_simple,
        revelationType: surah.revelation_place === 'makkah' ? 'MAKKI' : 'MADANI',
        totalVerses: surah.verses_count,
        orderRevelation: surah.revelation_order,
      },
      create: {
        id: surah.id,
        number: surah.id,
        nameArabic: surah.name_arabic,
        nameIndonesian: surah.translated_name.name,
        nameTransliteration: surah.name_simple,
        revelationType: surah.revelation_place === 'makkah' ? 'MAKKI' : 'MADANI',
        totalVerses: surah.verses_count,
        orderRevelation: surah.revelation_order,
      },
    })
  }

  console.log(`   ✅ ${surahs.length} surahs seeded`)
}

async function seedAyahsForSurah(surahNumber: number): Promise<void> {
  // Fetch verses with page info
  const versesData = await fetchWithRetry(
    `${QURAN_API}/verses/by_chapter/${surahNumber}?words=false&per_page=300&fields=verse_number,verse_key,juz_number,hizb_number,rub_el_hizb_number,page_number,text_uthmani`
  )
  const verses: QuranVerse[] = versesData.verses

  // Fetch translations
  const translationData = await fetchWithRetry(
    `${QURAN_API}/quran/translations/${KEMENAG_TRANSLATION_ID}?chapter_number=${surahNumber}`
  )
  const translations: { verse_key: string; text: string }[] = translationData.translations

  // Create translation map
  const translationMap = new Map<string, string>()
  translations.forEach(t => {
    // Clean HTML tags from translation
    const cleanText = t.text.replace(/<[^>]*>/g, '').trim()
    translationMap.set(t.verse_key, cleanText)
  })

  for (const verse of verses) {
    // Skip if verse_number is missing or invalid
    if (!verse.verse_number || verse.verse_number < 1) {
      console.log(`   Skipping invalid verse: ${JSON.stringify(verse)}`)
      continue
    }

    const ayah = await prisma.ayah.upsert({
      where: {
        surahNumber_ayahNumber: {
          surahNumber,
          ayahNumber: verse.verse_number,
        },
      },
      update: {
        textArabic: verse.text_uthmani || '',
        textTransliteration: '',
        juzNumber: verse.juz_number || 1,
        pageMushaf: verse.page_number || 1,
        hizbQuarter: verse.rub_el_hizb_number || null,
      },
      create: {
        surahNumber,
        ayahNumber: verse.verse_number,
        textArabic: verse.text_uthmani || '',
        textTransliteration: '',
        juzNumber: verse.juz_number || 1,
        pageMushaf: verse.page_number || 1,
        hizbQuarter: verse.rub_el_hizb_number || null,
      },
    })

    // Seed translation
    const verseKey = `${surahNumber}:${verse.verse_number}`
    const translationText = translationMap.get(verseKey) || translationMap.get(verse.verse_key)
    if (translationText) {
      await prisma.translation.upsert({
        where: {
          ayahId_language_translatorName: {
            ayahId: ayah.id,
            language: 'id',
            translatorName: 'Kemenag',
          },
        },
        update: {
          text: translationText,
        },
        create: {
          ayahId: ayah.id,
          language: 'id',
          text: translationText,
          translatorName: 'Kemenag',
        },
      })
    }
  }
}

async function main() {
  console.log('🕋 Starting Quran data seed...\n')
  console.log('⚠️  This may take 10-15 minutes to complete.\n')

  // Seed surahs first
  await seedSurahs()

  // Seed ayahs for each surah
  console.log('\n📜 Fetching and seeding ayahs...')

  for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
    process.stdout.write(`   Surah ${surahNumber}/114...`)
    try {
      await seedAyahsForSurah(surahNumber)
      console.log(' ✅')
    } catch (error) {
      console.log(' ❌')
      console.error(`   Error seeding surah ${surahNumber}:`, error)
    }

    // Rate limiting - wait 300ms between requests
    await new Promise(r => setTimeout(r, 300))
  }

  // Count totals
  const surahCount = await prisma.surah.count()
  const ayahCount = await prisma.ayah.count()
  const translationCount = await prisma.translation.count()

  console.log('\n✨ Quran data seed completed!')
  console.log(`   📖 ${surahCount} Surahs`)
  console.log(`   📜 ${ayahCount} Ayahs`)
  console.log(`   🌐 ${translationCount} Translations`)
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
