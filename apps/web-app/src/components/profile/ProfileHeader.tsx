import { Settings, CheckCircle2 } from "lucide-react";
import avatarImage from "@/assets/avatar-male.png";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function ProfileHeader() {
  return <AppProviders><ProfileHeaderInner /></AppProviders>;
}

function ProfileHeaderInner() {
  const { data: user, isLoading: userLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });
  const { data: gamification, isLoading: gamLoading } = trpc.user.getGamification.useQuery(undefined, {
    retry: false,
  });

  const isLoading = userLoading || gamLoading;
  const name = user?.name ?? "—";
  const badge = gamification?.rank ?? "Pemula";
  const streak = gamification?.currentStreak ?? 0;
  const totalPoints = gamification?.totalPoints ?? 0;
  const level = gamification?.level ?? 1;

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="w-10" />
        <h1 className="text-lg font-semibold text-foreground">My Profile</h1>
        <a
          href="/settings"
          className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </a>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-light ring-4 ring-secondary">
            <img
              src={user?.avatarUrl || avatarImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        {isLoading ? (
          <div className="w-32 h-6 bg-muted rounded animate-pulse mb-2" />
        ) : (
          <h2 className="text-xl font-bold text-foreground mb-2">{name}</h2>
        )}

        <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full mb-5">
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <span className="text-[8px] text-primary-foreground font-bold">+</span>
          </div>
          <span className="text-xs font-medium text-secondary-foreground uppercase tracking-wide">
            {badge}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            {isLoading ? (
              <div className="w-10 h-7 bg-muted rounded animate-pulse mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{streak}</p>
            )}
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
          <div className="text-center">
            {isLoading ? (
              <div className="w-10 h-7 bg-muted rounded animate-pulse mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">Lv.{level}</p>
            )}
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="text-center">
            {isLoading ? (
              <div className="w-10 h-7 bg-muted rounded animate-pulse mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
            )}
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
        </div>
      </div>
    </div>
  );
}
