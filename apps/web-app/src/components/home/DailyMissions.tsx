import { Check, BookOpen, Sun, Moon, Heart, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function DailyMissions() {
  return <AppProviders><DailyMissionsInner /></AppProviders>;
}

const categoryIconMap: Record<string, typeof Check> = {
  PRAYER: Check,
  QURAN: BookOpen,
  SUNNAH: Sun,
  DHIKR: Moon,
  CHARITY: Heart,
  OTHER: Star,
};

function DailyMissionsInner() {
  const { data, isLoading } = trpc.stats.daily.useQuery(undefined, {
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mx-5 mt-6 mb-4">
        <h2 className="text-base font-semibold text-foreground mb-4">Daily Missions</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                <div className="w-16 h-3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const missions = data?.missions ?? [];

  if (missions.length === 0) {
    return (
      <div className="mx-5 mt-6 mb-4">
        <h2 className="text-base font-semibold text-foreground mb-4">Daily Missions</h2>
        <div className="bg-card rounded-2xl p-5 card-shadow text-center">
          <p className="text-sm text-muted-foreground">No missions yet. Start your journey!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-5 mt-6 mb-4">
      <h2 className="text-base font-semibold text-foreground mb-4">Daily Missions</h2>

      <div className="space-y-3">
        {missions.map((mission) => {
          const IconComponent = categoryIconMap[mission.category] ?? Star;

          return (
            <div
              key={mission.id}
              className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 animate-fade-in"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                mission.completed
                  ? 'bg-primary/10'
                  : 'bg-muted'
              }`}>
                <IconComponent className={`w-5 h-5 ${
                  mission.completed ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>

              <div className="flex-1">
                <h3 className={`text-sm font-medium ${
                  mission.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}>
                  {mission.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {mission.completed ? 'Completed' : (mission.description || mission.category)}
                </p>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                mission.completed
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground/30'
              }`}>
                {mission.completed && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
