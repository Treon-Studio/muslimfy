import { Heart, ArrowRight } from "lucide-react";

export function DonationCard() {
  return (
    <div className="mx-5 mt-4 bg-card rounded-2xl p-4 card-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-primary" fill="currentColor" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Support Our Cause</h3>
          <p className="text-xs text-muted-foreground">
            Your Sadaqah helps us maintain this app for the community.
          </p>
        </div>
        <button className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all">
          Donate
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
