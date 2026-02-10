import { Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function ActivityGrid() {
  return <AppProviders><ActivityGridInner /></AppProviders>;
}

function ActivityGridInner() {
  const { data, isLoading } = trpc.stats.activityGrid.useQuery(
    { weeks: 20 },
    { retry: false }
  );

  if (isLoading) {
    return (
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-foreground" />
            <h2 className="text-base font-semibold text-foreground">Worship Consistency</h2>
          </div>
          <span className="text-xs text-muted-foreground">Last 365 Days</span>
        </div>
        <div className="bg-card rounded-2xl p-4 card-shadow">
          <div className="h-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const grid = data.grid;
  const activeDays = grid.filter((d) => d.level > 0).length;

  // Group flat grid into weekly columns (7 days per column)
  const weeks: number[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7).map((d) => d.level));
  }

  return (
    <div className="mx-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-foreground" />
          <h2 className="text-base font-semibold text-foreground">Worship Consistency</h2>
        </div>
        <span className="text-xs text-muted-foreground">Last 365 Days</span>
      </div>

      <div className="bg-card rounded-2xl p-4 card-shadow">
        <div className="flex items-center gap-4 mb-3">
          <div>
            <span className="text-3xl font-bold text-foreground">{activeDays}</span>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--muted))]" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[hsl(158_50%_80%)]" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[hsl(158_55%_65%)]" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[hsl(158_60%_50%)]" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--primary))]" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>

        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
            gridTemplateRows: 'repeat(7, 1fr)',
          }}
        >
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`aspect-square rounded-sm activity-${day}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
