import { Check, Flag, Star, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface HifzJourneyMapProps {
  onStartChallenge: () => void;
}

const positionCycle = ["center", "right", "center", "left"] as const;

export function HifzJourneyMap({ onStartChallenge }: HifzJourneyMapProps) {
  const { data: journeyNodes, isLoading } = trpc.quran.getHifzJourney.useQuery(undefined, {
    retry: false,
  });

  const getPositionClass = (position: string) => {
    switch (position) {
      case "left": return "mr-auto ml-8";
      case "right": return "ml-auto mr-8";
      default: return "mx-auto";
    }
  };

  const getNodeStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-foreground";
      case "current":
        return "bg-streak text-white ring-4 ring-streak/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIconStyle = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5" />;
      case "current":
        return <Star className="w-5 h-5" fill="currentColor" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="relative py-4 space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center mx-auto">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="w-20 h-4 bg-muted rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const nodes = journeyNodes ?? [];

  if (nodes.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">No journey data available.</p>
      </div>
    );
  }

  return (
    <div className="relative py-4">
      {/* Dashed path line */}
      <svg
        className="absolute left-0 top-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <path
          d="M 180 40 Q 260 100, 180 150 Q 100 200, 180 250 Q 260 300, 120 360 Q 80 400, 180 450 Q 280 500, 180 550"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.4"
        />
      </svg>

      {/* Journey nodes */}
      <div className="relative z-10 space-y-6">
        {nodes.slice(0, 10).map((node, index) => {
          const position = positionCycle[index % positionCycle.length];

          return (
            <div
              key={node.id}
              className={`flex flex-col items-center ${getPositionClass(position)}`}
            >
              {/* Start flag for first node */}
              {index === 0 && (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-2">
                  <Flag className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              {index !== 0 && (
                <button
                  onClick={node.status === "current" ? onStartChallenge : undefined}
                  disabled={node.status === "locked"}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${getNodeStyle(node.status)}`}
                >
                  {getIconStyle(node.status)}
                </button>
              )}

              {/* Label */}
              <div className={`mt-2 text-center ${node.status === "current" ? "bg-card rounded-xl px-4 py-2 card-shadow" : ""}`}>
                {node.status === "current" && (
                  <p className="text-xs font-semibold text-streak uppercase mb-0.5">Current Goal</p>
                )}
                {node.status === "completed" && (
                  <p className="text-xs font-medium text-primary mb-0.5">Completed</p>
                )}
                <p className={`text-sm font-semibold ${node.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
                  {node.name}
                </p>
                {node.status === "current" && (
                  <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-1/3 bg-streak rounded-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
