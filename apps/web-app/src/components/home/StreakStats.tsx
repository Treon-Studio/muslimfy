import { Flame, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function StreakStats() {
  return <AppProviders><StreakStatsInner /></AppProviders>;
}

function StreakStatsInner() {
  const { data, isLoading } = trpc.stats.streaks.useQuery(undefined, {
    retry: false,
  });

  const currentStreak = data?.currentStreak ?? 0;
  const bestStreak = data?.bestStreak ?? 0;

  return (
    <div className="mx-5 mt-4 flex gap-3">
      <div className="flex-1 bg-streak-light rounded-2xl p-4 card-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-streak/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-streak" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase">Streak</span>
        </div>
        {isLoading ? (
          <div className="w-12 h-8 bg-muted rounded animate-pulse mb-1" />
        ) : (
          <p className="text-3xl font-bold text-foreground">{currentStreak}</p>
        )}
        <p className="text-xs text-muted-foreground">Days</p>
      </div>

      <div className="flex-1 bg-secondary rounded-2xl p-4 card-shadow relative overflow-hidden">
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-primary/10 rounded-full" />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase">Best</span>
        </div>
        {isLoading ? (
          <div className="w-12 h-8 bg-muted rounded animate-pulse mb-1" />
        ) : (
          <p className="text-3xl font-bold text-foreground">{bestStreak}</p>
        )}
        <p className="text-xs text-muted-foreground">Days</p>
      </div>
    </div>
  );
}
