import { Home, BookOpenText, Moon, UserRound, Compass } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpenText, label: "Quran", path: "/quran" },
  { icon: null, label: "Hifz", path: "/hifz" },
  { icon: Moon, label: "Prayers", path: "/prayers" },
  { icon: UserRound, label: "Profile", path: "/profile" },
];

interface BottomNavProps {
  currentPath: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-md mx-auto grid grid-cols-5 relative h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          // Center floating button
          if (!item.icon) {
            return (
              <div key={item.path} className="relative flex items-center justify-center">
                <a
                  href={item.path}
                  className="absolute -top-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <Compass className="w-6 h-6 text-primary-foreground" />
                </a>
              </div>
            );
          }

          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
