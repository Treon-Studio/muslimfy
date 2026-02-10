import { Play, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function QuranContent() {
  return <AppProviders><QuranContentInner /></AppProviders>;
}

function QuranContentInner() {
  const { data: surahs, isLoading: surahsLoading } = trpc.quran.getSurahs.useQuery(undefined, {
    retry: false,
  });
  const { data: lastRead, isLoading: lastReadLoading } = trpc.quran.getLastRead.useQuery(undefined, {
    retry: false,
  });

  return (
    <>
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground mb-1">Al-Quran</h1>
        <p className="text-sm text-muted-foreground">Continue your reading journey</p>
      </div>

      {/* Continue Reading Card */}
      {lastReadLoading ? (
        <div className="mx-5 bg-primary rounded-2xl p-5 card-shadow-lg mb-6">
          <div className="h-24 animate-pulse bg-primary-foreground/10 rounded" />
        </div>
      ) : lastRead ? (
        <div className="mx-5 bg-primary rounded-2xl p-5 card-shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary-foreground/80" />
            <span className="text-xs text-primary-foreground/80 font-medium">Continue Reading</span>
          </div>
          <h3 className="text-lg font-bold text-primary-foreground mb-1">
            Surah {lastRead.surah?.nameTransliteration ?? `#${lastRead.surahNumber}`}
          </h3>
          <p className="text-sm text-primary-foreground/80 mb-4">
            Ayah {lastRead.ayahNumber} &bull; Juz {lastRead.juzNumber}
          </p>
          <button className="flex items-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 px-4 py-2 rounded-full transition-colors">
            <Play className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            <span className="text-sm font-medium text-primary-foreground">Continue</span>
          </button>
        </div>
      ) : null}

      {/* Surah List */}
      <div className="mx-5 mb-4">
        <h2 className="text-base font-semibold text-foreground mb-4">All Surahs</h2>

        {surahsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(surahs ?? []).map((surah) => (
              <button
                key={surah.number}
                className="w-full bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary-foreground">{surah.number}</span>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-foreground">{surah.nameTransliteration}</h3>
                  <p className="text-xs text-muted-foreground">
                    {surah.totalVerses} verses &bull; {surah.revelationType}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-arabic text-foreground mb-1" dir="rtl">{surah.nameArabic}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
