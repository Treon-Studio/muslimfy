import { Flame, BookOpen, Sun, Heart, Star, Trophy, Moon, Award } from "lucide-react";
import { type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function AchievementsGrid() {
  return <AppProviders><AchievementsGridInner /></AppProviders>;
}

const iconMap: Record<string, ReactNode> = {
  streak: <Flame className="w-6 h-6" />,
  quran: <BookOpen className="w-6 h-6" />,
  morning: <Sun className="w-6 h-6" />,
  charity: <Heart className="w-6 h-6" />,
  prayer: <Moon className="w-6 h-6" />,
  trophy: <Trophy className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
};

const categoryColorMap: Record<string, string> = {
  PRAYER: "bg-blue-100 text-blue-500",
  QURAN: "bg-emerald-100 text-emerald-500",
  STREAK: "bg-streak/10 text-streak",
  CHARITY: "bg-pink-100 text-pink-500",
  SUNNAH: "bg-amber-100 text-amber-500",
};

function AchievementsGridInner() {
  const { data: achievements, isLoading } = trpc.user.getAchievements.useQuery(undefined, {
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mx-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Achievements</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-4 card-shadow text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-muted animate-pulse" />
              <div className="w-16 h-4 bg-muted rounded mx-auto mb-1 animate-pulse" />
              <div className="w-12 h-3 bg-muted rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="mx-5 mt-4">
        <h2 className="text-base font-semibold text-foreground mb-4">Recent Achievements</h2>
        <div className="bg-card rounded-2xl p-5 card-shadow text-center">
          <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No achievements yet. Keep going!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Recent Achievements</h2>
        <button className="text-sm font-medium text-primary">View All</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.slice(0, 4).map((item) => {
          const iconKey = item.achievement.icon?.toLowerCase() ?? "star";
          const colorClass = categoryColorMap[item.achievement.category ?? ""] ?? "bg-muted text-muted-foreground";

          return (
            <div
              key={item.id}
              className="bg-card rounded-2xl p-4 card-shadow text-center animate-scale-in"
            >
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${colorClass}`}>
                {iconMap[iconKey] ?? <Star className="w-6 h-6" />}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-0.5">{item.achievement.name}</h3>
              <p className="text-xs text-muted-foreground">{item.achievement.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
