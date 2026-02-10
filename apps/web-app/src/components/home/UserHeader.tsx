import { Bell } from "lucide-react";
import avatarImage from "@/assets/avatar-male.png";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function UserHeader() {
  return <AppProviders><UserHeaderInner /></AppProviders>;
}

function UserHeaderInner() {
  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });

  const name = user?.name?.split(" ")[0] ?? "Guest";

  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-light">
          <img
            src={user?.avatarUrl || avatarImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Assalamu'alaikum,</p>
          {isLoading ? (
            <div className="w-20 h-5 bg-muted rounded animate-pulse mt-1" />
          ) : (
            <h1 className="text-lg font-semibold text-foreground">{name}</h1>
          )}
        </div>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
        <Bell className="w-5 h-5 text-foreground" />
      </button>
    </header>
  );
}
