import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(__dirname, '../../.dev.vars') })

import { createPrismaClient } from '../../src/lib/db'

const db = createPrismaClient(process.env.DATABASE_URL!)

async function seedDataSources() {
  console.log('📚 Seeding data sources...\n')

  // Seed Qaris (Reciters)
  const qaris = [
    {
      name: 'Mishary Rashid Alafasy',
      nameArabic: 'مشاري راشد العفاسي',
      country: 'Kuwait',
      style: 'Murattal',
      isPopular: true,
      audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy',
    },
    {
      name: 'Abdul Rahman Al-Sudais',
      nameArabic: 'عبد الرحمن السديس',
      country: 'Saudi Arabia',
      style: 'Murattal',
      isPopular: true,
      audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais',
    },
    {
      name: 'Saad Al-Ghamdi',
      nameArabic: 'سعد الغامدي',
      country: 'Saudi Arabia',
      style: 'Murattal',
      isPopular: true,
      audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.saoodshuraym',
    },
    {
      name: 'Maher Al Muaiqly',
      nameArabic: 'ماهر المعيقلي',
      country: 'Saudi Arabia',
      style: 'Murattal',
      isPopular: true,
      audioBaseUrl: 'https://cdn.islamic.network/quran/audio/128/ar.maaborahimalmuayqli',
    },
    {
      name: 'Abu Bakr Al Shatri',
      nameArabic: 'أبو بكر الشاطري',
      country: 'Saudi Arabia',
      style: 'Murattal',
      isPopular: true,
    },
    {
      name: 'Hani Ar-Rifai',
      nameArabic: 'هاني الرفاعي',
      country: 'Saudi Arabia',
      style: 'Murattal',
      isPopular: false,
    },
    {
      name: 'Ahmed Al-Ajmi',
      nameArabic: 'أحمد العجمي',
      country: 'Saudi Arabia',
      style: 'Murattal',
      isPopular: true,
    },
    {
      name: 'Muhammad Siddiq Al-Minshawi',
      nameArabic: 'محمد صديق المنشاوي',
      country: 'Egypt',
      style: 'Mujawwad',
      isPopular: true,
    },
    {
      name: 'Abdul Basit Abdul Samad',
      nameArabic: 'عبد الباسط عبد الصمد',
      country: 'Egypt',
      style: 'Mujawwad',
      isPopular: true,
    },
    {
      name: 'Mahmoud Khalil Al-Hussary',
      nameArabic: 'محمود خليل الحصري',
      country: 'Egypt',
      style: 'Murattal',
      isPopular: true,
    },
  ]

  for (const qari of qaris) {
    await db.qari.upsert({
      where: { id: qari.name.toLowerCase().replace(/\s+/g, '-') },
      update: qari,
      create: {
        id: qari.name.toLowerCase().replace(/\s+/g, '-'),
        ...qari,
      },
    })
  }
  console.log(`   ✅ ${qaris.length} Qaris seeded`)

  // Seed Translation Sources
  const translationSources = [
    {
      id: 'kemenag-id',
      name: 'Kementerian Agama RI',
      language: 'id',
      authorName: 'Kemenag RI',
      type: 'TRANSLATION',
      isDefault: true,
    },
    {
      id: 'muhammadiyah-id',
      name: 'Muhammadiyah',
      language: 'id',
      authorName: 'PP Muhammadiyah',
      type: 'TRANSLATION',
      isDefault: false,
    },
    {
      id: 'sahih-en',
      name: 'Sahih International',
      language: 'en',
      authorName: 'Sahih International',
      type: 'TRANSLATION',
      isDefault: true,
    },
    {
      id: 'pickthall-en',
      name: 'Pickthall',
      language: 'en',
      authorName: 'Mohammed Marmaduke Pickthall',
      type: 'TRANSLATION',
      isDefault: false,
    },
    {
      id: 'yusufali-en',
      name: 'Yusuf Ali',
      language: 'en',
      authorName: 'Abdullah Yusuf Ali',
      type: 'TRANSLATION',
      isDefault: false,
    },
    {
      id: 'transliteration',
      name: 'Transliteration',
      language: 'en',
      authorName: 'Latin Script',
      type: 'TRANSLITERATION',
      isDefault: false,
    },
  ]

  for (const source of translationSources) {
    await db.translationSource.upsert({
      where: { id: source.id },
      update: source,
      create: source,
    })
  }
  console.log(`   ✅ ${translationSources.length} Translation Sources seeded`)

  // Seed Tafsir Sources
  const tafsirSources = [
    {
      id: 'tafsir-kemenag',
      name: 'Tafsir Kemenag',
      language: 'id',
      authorName: 'Kementerian Agama RI',
      isDefault: true,
    },
    {
      id: 'tafsir-jalalayn',
      name: 'Tafsir Al-Jalalayn',
      language: 'ar',
      authorName: 'Jalaluddin Al-Mahalli & Jalaluddin As-Suyuthi',
      isDefault: false,
    },
    {
      id: 'tafsir-ibnu-katsir',
      name: 'Tafsir Ibnu Katsir',
      language: 'id',
      authorName: 'Ibnu Katsir',
      isDefault: false,
    },
    {
      id: 'tafsir-qurtubi',
      name: 'Tafsir Al-Qurtubi',
      language: 'ar',
      authorName: 'Imam Al-Qurtubi',
      isDefault: false,
    },
  ]

  for (const source of tafsirSources) {
    await db.tafsirSource.upsert({
      where: { id: source.id },
      update: source,
      create: source,
    })
  }
  console.log(`   ✅ ${tafsirSources.length} Tafsir Sources seeded`)

  console.log('\n✨ Data sources seeding completed!')
}

seedDataSources()
  .catch(console.error)
  .finally(() => db.$disconnect())
