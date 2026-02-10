import { TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function WeeklyStats() {
  return <AppProviders><WeeklyStatsInner /></AppProviders>;
}

function WeeklyStatsInner() {
  const { data: weeklyData, isLoading: weeklyLoading } = trpc.stats.weekly.useQuery(undefined, {
    retry: false,
  });
  const { data: gamification, isLoading: gamLoading } = trpc.user.getGamification.useQuery(undefined, {
    retry: false,
  });

  const isLoading = weeklyLoading || gamLoading;
  const totalPoints = gamification?.totalPoints ?? 0;

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Convert dailyStats Record<string, number> to array of 7 values
  const data = weeklyData
    ? Object.values(weeklyData.dailyStats)
    : [0, 0, 0, 0, 0, 0, 0];

  const maxValue = Math.max(...data, 1);
  const weeklyAverage = weeklyData?.weeklyAverage ?? 0;

  if (isLoading) {
    return (
      <div className="mx-5 mt-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Weekly Ibadah Stats</h2>
        <div className="bg-card rounded-2xl p-5 card-shadow">
          <div className="h-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-5 mt-6">
      <h2 className="text-base font-semibold text-foreground mb-4">Weekly Ibadah Stats</h2>

      <div className="bg-card rounded-2xl p-5 card-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Points</p>
            <p className="text-3xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-light px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">Avg {weeklyAverage}%</span>
          </div>
        </div>

        {/* Simple chart visualization */}
        <div className="h-32 flex items-end justify-between gap-2 mb-4">
          {data.map((value, index) => {
            const height = (value / maxValue) * 100;
            const isHighlight = value > 0 && value >= maxValue * 0.7;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    isHighlight ? 'bg-primary' : 'bg-primary/30'
                  }`}
                  style={{ height: `${height}%`, minHeight: '8px' }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          {days.map((day) => (
            <span key={day} className="text-[10px] text-muted-foreground font-medium">
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
