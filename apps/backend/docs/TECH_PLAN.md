# Muslimfy - Technical Plan

## Tech Stack

### Backend
| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Hono | 4.6.0 |
| Runtime | Cloudflare Workers / Node.js | - |
| Language | TypeScript | 5.7.0 |
| ORM | Prisma | 7.3.0 |
| Database | PostgreSQL | 15+ |
| Cache | Redis (ioredis) | 5.9.2 |
| Auth | JWT (jose) | 6.1.3 |
| Password Hashing | bcryptjs | 3.0.3 |

### Deployment
| Environment | Platform |
|-------------|----------|
| Production | Cloudflare Workers |
| Development | Node.js (local) |
| Database | PostgreSQL (self-hosted/managed) |
| Cache | Redis (self-hosted/managed) |

---

## Project Structure

```
apps/backend/
├── docs/
│   ├── PRD.md
│   └── TECH_PLAN.md
├── prisma/
│   ├── schema.prisma
│   ├── seed/
│   │   ├── index.ts
│   │   ├── quran.ts
│   │   ├── cities.ts
│   │   ├── mission-templates.ts
│   │   ├── achievements.ts
│   │   ├── daily-verses.ts
│   │   ├── charities.ts
│   │   └── data-sources.ts
│   └── prisma.config.ts
├── scripts/
│   └── test-redis.ts
├── src/
│   ├── index.ts              # Main app entry
│   ├── dev-server.ts         # Local dev server
│   ├── types.ts              # TypeScript types
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   ├── redis.ts          # Redis client
│   │   └── jwt.ts            # JWT utilities
│   ├── middleware/
│   │   └── auth.ts           # Auth middleware
│   ├── routes/
│   │   ├── auth.ts           # Authentication
│   │   ├── users.ts          # User management
│   │   ├── missions.ts       # Missions
│   │   ├── stats.ts          # Statistics
│   │   ├── prayer-times.ts   # Prayer times
│   │   ├── quran.ts          # Quran content
│   │   ├── daily-verse.ts    # Daily verse
│   │   └── donations.ts      # Donations
│   └── utils/
│       ├── response.ts       # Response helpers
│       └── date.ts           # Date utilities
├── .dev.vars                  # Environment variables
├── package.json
├── tsconfig.json
└── wrangler.toml
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────┐
│      User       │───────│   UserSettings   │
├─────────────────┤       └──────────────────┘
│ id              │
│ email           │───────┌──────────────────┐
│ passwordHash    │       │ UserGamification │
│ name            │       └──────────────────┘
│ avatarUrl       │
│ isVerified      │───────┌──────────────────┐
│ createdAt       │       │ UserPreferences  │
│ updatedAt       │       └──────────────────┘
└─────────────────┘
        │
        ├────────┬────────┬────────┬────────┐
        ▼        ▼        ▼        ▼        ▼
   ┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐
   │ Mission │ │Prayer│ │Quran │ │Donate│ │Achievement│
   │Completion│ │Compl.│ │Bookmark│ │     │ │          │
   └─────────┘ └──────┘ └──────┘ └──────┘ └──────────┘
```

### Models Overview

| Model | Description | Relations |
|-------|-------------|-----------|
| User | Core user entity | Settings, Gamification, Preferences |
| UserSettings | App settings | User |
| UserGamification | Points, level, streak | User |
| UserPreferences | Data source preferences | User, Qari, Translation, Tafsir |
| RefreshToken | JWT refresh tokens | User |
| Mission | User missions | User, MissionCompletion |
| MissionCompletion | Mission tracking | Mission, User |
| MissionTemplate | Pre-defined missions | - |
| City | Prayer time cities | - |
| PrayerTime | Cached prayer times | - |
| PrayerCompletion | Prayer tracking | User |
| Surah | Quran surahs | Ayah |
| Ayah | Quran verses | Surah, Translation, Bookmark |
| Translation | Verse translations | Ayah |
| Bookmark | User bookmarks | User, Ayah |
| ReadingHistory | Reading log | User |
| ReadingProgress | Quran progress | User |
| DailyVerse | Daily verse content | Ayah, DailyVerseFavorite |
| DailyVerseFavorite | User favorites | User, DailyVerse |
| Charity | Charity organizations | Campaign, Donation |
| Campaign | Fundraising campaigns | Charity, Donation |
| Donation | User donations | User, Charity, Campaign |
| DonationStats | Donation statistics | User |
| Achievement | Achievement definitions | UserAchievement |
| UserAchievement | User achievements | User, Achievement |
| Notification | Push notifications | User |
| Qari | Quran reciters | UserPreferences |
| TranslationSource | Translation sources | UserPreferences |
| TafsirSource | Tafsir sources | UserPreferences |

---

## API Architecture

### Base URL
```
Production: https://api.muslimfy.app/api/v1
Development: http://localhost:3000/api/v1
```

### Authentication Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│  Client │      │   API   │      │   DB    │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     │ POST /register │                │
     │───────────────>│                │
     │                │ Hash password  │
     │                │───────────────>│
     │                │<───────────────│
     │                │ Generate JWT   │
     │<───────────────│                │
     │                │                │
     │ POST /login    │                │
     │───────────────>│                │
     │                │ Verify password│
     │                │───────────────>│
     │                │<───────────────│
     │                │ Generate JWT   │
     │<───────────────│                │
     │                │                │
     │ GET /me        │                │
     │ + Bearer token │                │
     │───────────────>│                │
     │                │ Verify JWT     │
     │                │ Fetch user     │
     │                │───────────────>│
     │                │<───────────────│
     │<───────────────│                │
```

### JWT Token Structure

**Access Token** (15 min expiry):
```json
{
  "userId": "cuid",
  "email": "user@example.com",
  "type": "access",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Refresh Token** (7 days expiry):
```json
{
  "userId": "cuid",
  "email": "user@example.com",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1235172690
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | - | Register new user |
| POST | /auth/login | - | Login user |
| POST | /auth/refresh | - | Refresh access token |
| POST | /auth/logout | - | Logout (revoke token) |
| POST | /auth/logout-all | Bearer | Logout all devices |
| GET | /auth/me | Bearer | Get current user |
| PATCH | /auth/password | Bearer | Change password |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /users/me | Bearer | Get user profile |
| PATCH | /users/me | Bearer | Update profile |
| DELETE | /users/me | Bearer | Delete account |
| GET | /users/me/settings | Bearer | Get settings |
| PATCH | /users/me/settings | Bearer | Update settings |
| GET | /users/me/preferences | Bearer | Get preferences |
| PATCH | /users/me/preferences | Bearer | Update preferences |
| GET | /users/me/gamification | Bearer | Get gamification |
| POST | /users/me/gamification/add-points | Bearer | Add points |
| GET | /users/me/achievements | Bearer | Get achievements |
| GET | /users/leaderboard | Bearer | Get leaderboard |
| GET | /users/qaris | Bearer | List qaris |
| GET | /users/translation-sources | Bearer | List translations |
| GET | /users/tafsir-sources | Bearer | List tafsirs |

### Quran
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /quran/surahs | - | List all surahs |
| GET | /quran/surahs/:number | - | Get surah with ayahs |
| GET | /quran/ayahs/:surah/:ayah | - | Get single ayah |
| GET | /quran/juz/:number | - | Get juz content |
| GET | /quran/page/:number | - | Get mushaf page |
| GET | /quran/search | - | Search quran |
| GET | /quran/bookmarks | Bearer | Get bookmarks |
| POST | /quran/bookmarks | Bearer | Add bookmark |
| DELETE | /quran/bookmarks/:id | Bearer | Remove bookmark |
| GET | /quran/reading-progress | Bearer | Get progress |
| POST | /quran/reading-history | Bearer | Save history |
| GET | /quran/last-read | Bearer | Get last read |

### Daily Verse
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /daily-verse | Optional | Get today's verse |
| GET | /daily-verse/history | - | Get past verses |
| GET | /daily-verse/:date | - | Get verse by date |
| POST | /daily-verse/share | - | Track share |
| GET | /daily-verse/favorites | Bearer | Get favorites |
| POST | /daily-verse/favorite | Bearer | Add favorite |
| DELETE | /daily-verse/favorite/:id | Bearer | Remove favorite |

### Missions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /missions/templates | - | Get templates |
| GET | /missions | Bearer | Get user missions |
| POST | /missions | Bearer | Create mission |
| PATCH | /missions/:id | Bearer | Update mission |
| DELETE | /missions/:id | Bearer | Delete mission |
| POST | /missions/:id/complete | Bearer | Complete mission |
| GET | /missions/activity | Bearer | Get activity graph |

### Prayer Times
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /prayer-times | - | Get prayer times |
| GET | /prayer-times/cities | - | List cities |
| POST | /prayer-times/complete | Bearer | Mark completed |
| GET | /prayer-times/history | Bearer | Get history |

### Donations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /donations/charities | - | List charities |
| GET | /donations/charities/:id | - | Get charity |
| GET | /donations/campaigns | - | List campaigns |
| GET | /donations/campaigns/:id | - | Get campaign |
| POST | /donations | Bearer | Create donation |
| GET | /donations/history | Bearer | Get history |
| GET | /donations/stats | Bearer | Get stats |

### Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /stats/overview | Bearer | Get overview |
| GET | /stats/prayers | Bearer | Prayer stats |
| GET | /stats/quran | Bearer | Quran stats |
| GET | /stats/donations | Bearer | Donation stats |
| GET | /stats/activity | Bearer | Activity graph |

---

## Caching Strategy

### Redis Keys
| Key Pattern | TTL | Description |
|-------------|-----|-------------|
| `quran:surahs` | 24h | All surahs list |
| `quran:surah:{n}:{lang}` | 24h | Surah with ayahs |
| `daily-verse:{date}` | 24h | Daily verse |
| `prayer-times:{lat}:{lng}:{date}` | 24h | Prayer times |
| `user:{id}` | 1h | User cache |

### Cache Invalidation
- User data: Invalidate on update
- Quran data: Long TTL (static content)
- Prayer times: Daily refresh
- Daily verse: Daily refresh

---

## Security

### Authentication
- Password hashing: bcrypt (12 rounds)
- JWT signing: HS256
- Access token: 15 minutes
- Refresh token: 7 days
- Token stored in database (revokable)

### API Security
- CORS configured
- Secure headers (Hono secureHeaders)
- Rate limiting (TODO)
- Input validation
- SQL injection prevention (Prisma)

### Environment Variables
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
```

---

## Performance Considerations

### Database
- Indexed fields for common queries
- Compound indexes for complex queries
- Connection pooling via Prisma

### Caching
- Redis for frequently accessed data
- Response caching for static content
- Query result caching

### API
- Pagination for list endpoints
- Selective field loading
- Efficient N+1 query prevention

---

## Development

### Commands
```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Run seeds
pnpm db:seed
pnpm db:seed:quran

# Start development server
pnpm dev:local

# Start Cloudflare Workers dev
pnpm dev

# Deploy to Cloudflare
pnpm deploy

# Type checking
pnpm typecheck
```

### Environment Setup
1. Copy `.dev.vars.example` to `.dev.vars`
2. Set DATABASE_URL, REDIS_URL, JWT_SECRET
3. Run `pnpm db:push` to sync schema
4. Run `pnpm db:seed:quran && pnpm db:seed` to seed data
5. Run `pnpm dev:local` to start server

---

## Monitoring & Logging

### Logging
- Request/response logging (Hono logger)
- Error logging to console
- TODO: Structured logging (JSON)

### Monitoring (TODO)
- Health check endpoint: `/health`
- Metrics endpoint
- Error tracking (Sentry)
- APM integration

---

## Deployment

### Option 1: Docker (Recommended for Self-Hosted)

#### Files
```
Dockerfile              # Multi-stage build
docker-compose.yml      # Full stack (API + PostgreSQL + Redis)
docker-compose.external.yml  # API only (external DB/Redis)
.env.example            # Environment template
.dockerignore           # Build exclusions
```

#### Quick Start (Full Stack)
```bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec api pnpm db:push

# Seed data
docker-compose exec api pnpm db:seed:quran
docker-compose exec api pnpm db:seed
```

#### Connect to External PostgreSQL & Redis
```bash
# Edit .env with your external DB/Redis URLs
DATABASE_URL=postgresql://user:pass@your-postgres:5432/muslimfy
REDIS_URL=redis://:password@your-redis:6379/0

# Start API only
docker-compose -f docker-compose.external.yml up -d
```

#### Docker Commands
```bash
pnpm docker:build      # Build image
pnpm docker:up         # Start all services
pnpm docker:down       # Stop all services
pnpm docker:logs       # View logs
pnpm docker:external   # Start with external DB
```

### Option 2: VPS / Cloud VM

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone and setup
git clone <repo>
cd muslimfy/apps/backend
pnpm install
cp .env.example .env
# Edit .env with your database URLs

# Setup database
pnpm db:push
pnpm db:seed:quran
pnpm db:seed

# Start with PM2
npm install -g pm2
pm2 start "pnpm start" --name muslimfy-api
pm2 save
pm2 startup
```

### Option 3: Cloudflare Workers (Limited)

> **Note**: Workers tidak support self-hosted PostgreSQL/Redis langsung.
> Butuh: Neon/Supabase (PostgreSQL) + Upstash (Redis)

```toml
# wrangler.toml
name = "muslimfy-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"
```

### Database Migration
1. Use Prisma migrations for schema changes
2. Test migrations on staging first
3. Backup database before production migration
4. Use `prisma migrate deploy` for production

---

## Future Technical Improvements

### Phase 1 (Current)
- [x] Basic API structure
- [x] Authentication with JWT
- [x] Quran content & caching
- [x] Gamification system
- [x] User preferences

### Phase 2
- [ ] Rate limiting
- [ ] API versioning
- [ ] Structured logging
- [ ] Error tracking
- [ ] Unit tests
- [ ] Integration tests

### Phase 3
- [ ] GraphQL API
- [ ] WebSocket for real-time
- [ ] Push notifications
- [ ] Background jobs (Cloudflare Queues)

### Phase 4
- [ ] Multi-region deployment
- [ ] CDN for static assets
- [ ] A/B testing infrastructure
- [ ] Analytics pipeline
