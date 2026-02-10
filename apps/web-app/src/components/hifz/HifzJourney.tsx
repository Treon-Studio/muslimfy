import { useState } from "react";
import { HifzProgressCard } from "@/components/hifz/HifzProgressCard";
import { HifzJourneyMap } from "@/components/hifz/HifzJourneyMap";
import { HifzChallenge } from "@/components/hifz/HifzChallenge";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function HifzJourney() {
  return <AppProviders><HifzJourneyInner /></AppProviders>;
}

function HifzJourneyInner() {
  const [showChallenge, setShowChallenge] = useState(false);

  const { data: readingProgress, isLoading } = trpc.quran.getReadingProgress.useQuery(undefined, {
    retry: false,
  });

  if (showChallenge) {
    return <HifzChallenge onClose={() => setShowChallenge(false)} />;
  }

  const totalAyats = readingProgress?.totalAyahsRead ?? 0;
  // todayProgress and todayGoal could come from a daily stats endpoint
  // For now derive a simple daily goal
  const todayGoal = 5;
  const todayProgress = Math.min(totalAyats % todayGoal, todayGoal);

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="p-2 -ml-2 text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Hifz Journey</h1>
        <button className="p-2 -mr-2 text-muted-foreground">
          <BarChart3 className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="bg-emerald-light rounded-2xl p-5 mb-6">
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
      ) : (
        <HifzProgressCard
          totalAyats={totalAyats}
          todayProgress={todayProgress}
          todayGoal={todayGoal}
          onStartChallenge={() => setShowChallenge(true)}
        />
      )}

      <HifzJourneyMap onStartChallenge={() => setShowChallenge(true)} />
    </div>
  );
}
