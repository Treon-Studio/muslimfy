import { Trophy } from "lucide-react";

interface HifzProgressCardProps {
  totalAyats: number;
  todayProgress: number;
  todayGoal: number;
  onStartChallenge: () => void;
}

export function HifzProgressCard({ 
  totalAyats, 
  todayProgress, 
  todayGoal,
  onStartChallenge 
}: HifzProgressCardProps) {
  const progressPercent = (todayProgress / todayGoal) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div 
      className="bg-emerald-light rounded-2xl p-5 mb-6 cursor-pointer hover:bg-emerald-light/80 transition-colors"
      onClick={onStartChallenge}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-streak" />
            <span className="text-xs font-semibold text-streak uppercase tracking-wide">
              Hafiz in Training
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">
            {totalAyats.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            Total Ayats Memorized
          </p>
        </div>

        {/* Circular Progress */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="20"
              stroke="hsl(var(--border))"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="20"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-foreground">
              {todayProgress}/{todayGoal}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
