import { Settings, ChevronRight } from "lucide-react";

export function AccountSettings() {
  return (
    <div className="mx-5 mt-6 mb-8">
      <h2 className="text-base font-semibold text-foreground mb-4">Account Settings</h2>

      <a
        href="/settings"
        className="w-full bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 hover:bg-muted/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
        <span className="flex-1 text-left text-sm font-medium text-foreground">
          Settings
        </span>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </a>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Muslimfy v2.0.4 (Build 342)
      </p>
    </div>
  );
}
