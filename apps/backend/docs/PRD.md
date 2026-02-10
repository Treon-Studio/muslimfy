# Muslimfy - Product Requirements Document (PRD)

## Overview

**Muslimfy** adalah aplikasi pendamping harian Muslim yang menggabungkan fitur-fitur ibadah dengan gamifikasi untuk meningkatkan konsistensi dan motivasi pengguna.

### Vision
Menjadi aplikasi Muslim #1 di Indonesia yang membantu umat Islam menjalankan ibadah sehari-hari dengan lebih konsisten dan bermakna.

### Target Users
- Muslim di Indonesia (primary market)
- Usia 18-45 tahun
- Pengguna smartphone aktif
- Ingin meningkatkan kualitas ibadah

---

## Core Features

### 1. Authentication & User Management

#### 1.1 Registration & Login
- Register dengan email dan password
- Login dengan JWT token
- Refresh token mechanism
- Logout dari single/all devices
- Change password

#### 1.2 User Profile
- Nama dan avatar
- Email verification status
- Account settings

#### 1.3 User Settings
| Setting | Default | Description |
|---------|---------|-------------|
| Location | - | Latitude, longitude, city, country |
| Timezone | Asia/Jakarta | User timezone |
| Calculation Method | KEMENAG | Metode hitung waktu sholat |
| Prayer Notification | true | Notifikasi adzan |
| Prayer Sound | madinah | Sound adzan |
| Prayer Reminder | 10 min | Reminder sebelum adzan |
| Quran Font Size | 24 | Ukuran font Arab |
| Show Translation | true | Tampilkan terjemahan |
| Daily Verse Notification | true | Notifikasi ayat harian |
| Language | id | Bahasa aplikasi |
| Theme | light | Tema aplikasi |

---

### 2. Gamification System

#### 2.1 Points & Levels
- **Points**: Didapat dari aktivitas ibadah
- **Level**: 1-50+ dengan XP progression
- **XP Formula**: Level N+1 = Level N * 1.5

#### 2.2 Rank System
| Level Range | Rank |
|-------------|------|
| 1-4 | Pemula |
| 5-9 | Pelajar |
| 10-14 | Mujtahid |
| 15-19 | Mujahid |
| 20-29 | Muhsin |
| 30-39 | Muttaqin |
| 40-49 | Hafidz |
| 50+ | Ulama |

#### 2.3 Streak System
- Daily streak tracking
- Current streak & longest streak
- Streak break jika tidak aktif >1 hari

#### 2.4 Achievements
Kategori achievement:
- **PRAYER**: Konsistensi sholat
- **QURAN**: Progress membaca Al-Quran
- **DONATION**: Aktivitas donasi
- **STREAK**: Streak milestones
- **MILESTONE**: Pencapaian umum

#### 2.5 Leaderboard
- Global leaderboard
- Sort by: points, streak, level

---

### 3. Prayer Times (Jadwal Sholat)

#### 3.1 Features
- Jadwal sholat 5 waktu + Imsak + Sunrise
- Berdasarkan lokasi (GPS atau manual)
- Multiple calculation methods:
  - KEMENAG (default Indonesia)
  - MWL (Muslim World League)
  - ISNA
  - Egypt
  - Makkah
  - Karachi

#### 3.2 Prayer Tracking
- Mark sholat as completed
- On-time indicator
- Jamaah indicator
- Daily/weekly/monthly statistics

#### 3.3 Cities Database
57 kota besar Indonesia dengan koordinat

---

### 4. Al-Quran

#### 4.1 Quran Content
- 114 Surah
- 6,236 Ayat
- Arabic text (Uthmani script)
- Translations (Indonesian, English)
- Transliteration

#### 4.2 Navigation
- By Surah (1-114)
- By Juz (1-30)
- By Page/Mushaf (1-604)
- Search by translation text

#### 4.3 Reading Features
- Bookmark ayat
- Bookmark folders (organize bookmarks)
- Reading history
- Reading progress tracking
- Khatam counter

#### 4.4 Audio Features
- 10+ Qari options
- Audio quality settings (low/medium/high)
- Auto-play option

#### 4.5 User Preferences
- Preferred Qari
- Preferred Translation
- Preferred Tafsir
- Arabic font family
- Mushaf style (Madinah/Indo-Pak)

---

### 5. Daily Verse (Ayat Harian)

#### 5.1 Features
- Ayat pilihan setiap hari
- Theme-based (Patience, Gratitude, Hope, dll)
- Brief tafsir/explanation
- Share functionality
- Favorite system

#### 5.2 Themes
- PATIENCE
- GRATITUDE
- HOPE
- GUIDANCE
- MERCY
- LOVE
- KNOWLEDGE
- RIGHTEOUSNESS
- MOTIVATION
- REFLECTION

#### 5.3 History
- Browse past daily verses
- Filter by theme

---

### 6. Missions (Misi Harian)

#### 6.1 Mission Templates
Pre-defined missions:
- Sholat 5 waktu
- Sholat berjamaah
- Tadarus Al-Quran
- Sedekah harian
- Dzikir pagi/sore
- Sholat Dhuha
- Sholat Tahajud
- Puasa Senin-Kamis
- Dan lain-lain

#### 6.2 Custom Missions
- User dapat membuat mission sendiri
- Categories: PRAYER, FASTING, QURAN, CHARITY, DZIKIR, CUSTOM
- Priority: LOW, MEDIUM, HIGH
- Frequency: DAILY, WEEKLY, MONTHLY

#### 6.3 Mission Tracking
- Mark mission as completed
- Notes per completion
- Completion history
- GitHub-style activity graph

---

### 7. Donations (Donasi)

#### 7.1 Charity Partners
- Verified charity organizations
- Trust score system
- Categories:
  - ZAKAT
  - INFAQ
  - SEDEKAH
  - WAKAF
  - EMERGENCY
  - EDUCATION
  - HEALTH
  - FOOD
  - WATER

#### 7.2 Campaigns
- Active fundraising campaigns
- Target & raised amount
- Emergency campaigns
- Progress tracking

#### 7.3 Donation Flow
- Multiple payment methods:
  - GoPay, OVO, DANA, ShopeePay
  - Bank Transfer
  - Credit Card
  - QRIS
- Anonymous donation option
- Recurring donation option
- Digital receipt

#### 7.4 User Donation Stats
- Total donated
- Donation count
- Charities supported
- Monthly streak

---

### 8. Notifications

#### 8.1 Types
- Prayer time alerts
- Prayer reminders
- Daily verse notification
- Mission reminders
- Achievement unlocked
- Donation reminders
- System notifications

#### 8.2 Settings
- Enable/disable per type
- Custom reminder times
- Sound preferences

---

## Data Sources

### Quran Reciters (Qari)
| Qari | Country | Style |
|------|---------|-------|
| Mishary Rashid Alafasy | Kuwait | Murattal |
| Abdul Rahman Al-Sudais | Saudi Arabia | Murattal |
| Saad Al-Ghamdi | Saudi Arabia | Murattal |
| Maher Al Muaiqly | Saudi Arabia | Murattal |
| Abu Bakr Al Shatri | Saudi Arabia | Murattal |
| Ahmed Al-Ajmi | Saudi Arabia | Murattal |
| Muhammad Siddiq Al-Minshawi | Egypt | Mujawwad |
| Abdul Basit Abdul Samad | Egypt | Mujawwad |
| Mahmoud Khalil Al-Hussary | Egypt | Murattal |

### Translation Sources
- Kementerian Agama RI (Indonesian - default)
- Muhammadiyah (Indonesian)
- Sahih International (English - default)
- Pickthall (English)
- Yusuf Ali (English)

### Tafsir Sources
- Tafsir Kemenag (Indonesian - default)
- Tafsir Al-Jalalayn (Arabic)
- Tafsir Ibnu Katsir (Indonesian)
- Tafsir Al-Qurtubi (Arabic)

---

## Future Features (Roadmap)

### Phase 2
- [ ] Hijri calendar integration
- [ ] Qibla compass
- [ ] Nearby mosques
- [ ] Prayer time widgets
- [ ] Apple Watch / Wear OS support

### Phase 3
- [ ] Community features
- [ ] Study circles
- [ ] Live Quran sessions
- [ ] Islamic courses

### Phase 4
- [ ] AI-powered personalization
- [ ] Habit analysis
- [ ] Personalized recommendations

---

## Success Metrics

### Primary KPIs
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User retention (D1, D7, D30)
- Average session duration

### Secondary KPIs
- Prayer completion rate
- Quran reading streaks
- Mission completion rate
- Donation conversion rate

### Engagement Metrics
- Average level
- Average streak length
- Achievements unlocked
- Social shares
