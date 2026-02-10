import { Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function DailyWisdom() {
  return <AppProviders><DailyWisdomInner /></AppProviders>;
}

function DailyWisdomInner() {
  const { data: verse, isLoading } = trpc.dailyVerse.getToday.useQuery(undefined, {
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mx-5 p-5 rounded-2xl bg-wisdom-gradient card-shadow animate-pulse">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            Daily Wisdom
          </span>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="h-8 bg-muted rounded mx-auto w-3/4 mb-4" />
        <div className="w-12 h-0.5 bg-primary/30 mx-auto mb-4 rounded-full" />
        <div className="h-4 bg-muted rounded mx-auto w-2/3 mb-2" />
        <div className="h-3 bg-muted rounded mx-auto w-1/3" />
      </div>
    );
  }

  if (!verse) return null;

  const arabicText = verse.ayah?.textArabic ?? "";
  const translation = verse.ayah?.translations?.[0]?.text ?? "";
  const source = verse.ayah?.surah
    ? `Surah ${verse.ayah.surah.nameTransliteration} ${verse.ayah.surahNumber}:${verse.ayah.ayahNumber}`
    : "";

  return (
    <div className="mx-5 p-5 rounded-2xl bg-wisdom-gradient card-shadow animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
          Daily Wisdom
        </span>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <p className="text-2xl text-center font-arabic text-foreground leading-relaxed mb-4 dir-rtl" dir="rtl">
        {arabicText}
      </p>

      <div className="w-12 h-0.5 bg-primary/30 mx-auto mb-4 rounded-full" />

      <p className="text-sm text-center text-muted-foreground italic mb-2">
        "{translation}"
      </p>

      <p className="text-xs text-center text-primary font-medium">
        ({source})
      </p>
    </div>
  );
}
