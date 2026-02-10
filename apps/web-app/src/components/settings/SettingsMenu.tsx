import { ArrowLeft, User, Bell, Link, ChevronRight, Info, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function SettingsMenu() {
  return <AppProviders><SettingsMenuInner /></AppProviders>;
}

const settingsItems = [
  { icon: User, label: "Edit Profile", path: "/edit-profile" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Link, label: "Linked Accounts", path: "/linked-accounts" },
  { icon: Info, label: "About App", path: "/about" },
];

function SettingsMenuInner() {
  const logoutMutation = trpc.auth.logoutAll.useMutation({
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-4 py-4 border-b border-border flex items-center gap-4">
        <a
          href="/"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </a>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
      </div>

      <div className="p-5 space-y-3">
        {settingsItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="w-full bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-foreground">
              {item.label}
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </a>
        ))}
      </div>

      <div className="px-5 mt-4">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="text-sm font-semibold text-destructive">
            {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
          </span>
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 mb-8">
        Muslimfy v2.0.4 (Build 342)
      </p>
    </>
  );
}
