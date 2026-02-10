import { Building2, Clock, MapPin, Volume2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { AppProviders } from "@/components/layout/AppProviders";

export function PrayersContent() {
  return <AppProviders><PrayersContentInner /></AppProviders>;
}

interface PrayerEntry {
  name: string;
  time: string;
  passed: boolean;
  current: boolean;
}

function parsePrayerTimes(data: {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): PrayerEntry[] {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const entries = [
    { name: "Fajr", time: data.fajr },
    { name: "Sunrise", time: data.sunrise },
    { name: "Dhuhr", time: data.dhuhr },
    { name: "Asr", time: data.asr },
    { name: "Maghrib", time: data.maghrib },
    { name: "Isha", time: data.isha },
  ];

  const prayerMinutes = entries.map((e) => {
    const [h, m] = e.time.split(":").map(Number);
    return h * 60 + m;
  });

  let currentIndex = -1;
  for (let i = 0; i < prayerMinutes.length; i++) {
    if (currentMinutes < prayerMinutes[i]) {
      currentIndex = i;
      break;
    }
  }

  return entries.map((e, i) => ({
    name: e.name,
    time: e.time,
    passed: currentIndex === -1 ? true : i < currentIndex,
    current: i === currentIndex,
  }));
}

function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

function getTimeUntil(time: string): string {
  const now = new Date();
  const [h, m] = time.split(":").map(Number);
  const target = h * 60 + m;
  const current = now.getHours() * 60 + now.getMinutes();
  const diff = target - current;
  if (diff <= 0) return "";
  if (diff < 60) return `in ${diff} min`;
  return `in ${Math.floor(diff / 60)}h ${diff % 60}m`;
}

function PrayersContentInner() {
  const { data: prayerTimes, isLoading } = trpc.prayer.getTimes.useQuery(undefined, {
    retry: false,
  });

  const prayers = useMemo(() => {
    if (!prayerTimes) return [];
    return parsePrayerTimes(prayerTimes);
  }, [prayerTimes]);

  const nextPrayer = prayers.find((p) => p.current);

  if (isLoading) {
    return (
      <>
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-xl font-bold text-foreground mb-1">Prayer Times</h1>
          <div className="w-32 h-3 bg-muted rounded animate-pulse mt-1" />
        </div>
        <div className="mx-5 bg-primary rounded-2xl p-5 card-shadow-lg mb-6">
          <div className="h-24 animate-pulse bg-primary-foreground/10 rounded" />
        </div>
        <div className="mx-5 mb-4 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1">
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-16 h-4 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">Prayer Times</h1>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">
                {prayerTimes?.city || "Your Location"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-sm font-semibold text-foreground">{dateStr}</p>
          </div>
        </div>
      </div>

      {/* Next Prayer Card */}
      {nextPrayer && (
        <div className="mx-5 bg-primary rounded-2xl p-5 card-shadow-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary-foreground/80 font-medium uppercase tracking-wide">
              Next Prayer
            </span>
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-primary-foreground/80" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary-foreground mb-1">{nextPrayer.name}</h2>
              <p className="text-primary-foreground/80">{formatTimeDisplay(nextPrayer.time)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary-foreground/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{getTimeUntil(nextPrayer.time)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times List */}
      <div className="mx-5 mb-4">
        <h2 className="text-base font-semibold text-foreground mb-4">Today's Schedule</h2>

        <div className="space-y-2">
          {prayers.map((prayer) => (
            <div
              key={prayer.name}
              className={`rounded-2xl p-4 flex items-center gap-4 transition-colors ${
                prayer.current
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'bg-card card-shadow'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                prayer.passed
                  ? 'bg-muted'
                  : prayer.current
                    ? 'bg-primary'
                    : 'bg-secondary'
              }`}>
                <Building2 className={`w-5 h-5 ${
                  prayer.passed
                    ? 'text-muted-foreground'
                    : prayer.current
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground'
                }`} />
              </div>

              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${
                  prayer.passed ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {prayer.name}
                </h3>
              </div>

              <span className={`text-sm font-medium ${
                prayer.current ? 'text-primary' : prayer.passed ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {formatTimeDisplay(prayer.time)}
              </span>

              {prayer.passed && (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
