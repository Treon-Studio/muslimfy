import { ArrowLeft, FileText, Shield, ThumbsUp, ChevronRight, Headphones, CheckCircle } from "lucide-react";
import { Twitter, Instagram, Globe } from "lucide-react";

const aboutItems = [
  { icon: FileText, label: "Terms of Service", path: "/terms" },
  { icon: Shield, label: "Privacy Policy", path: "/privacy" },
  { icon: ThumbsUp, label: "Rate the App", path: "/rate" },
];

const socialLinks = [
  { icon: Twitter, url: "https://twitter.com" },
  { icon: Instagram, url: "https://instagram.com" },
  { icon: Globe, url: "https://muslimfy.app" },
];

export function AboutContent() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-4 py-4 border-b border-border flex items-center gap-4">
        <a
          href="/settings"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </a>
        <h1 className="text-lg font-semibold text-foreground">About Muslimfy</h1>
      </div>

      <div className="p-5">
        {/* App Logo & Info */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-4 relative shadow-lg">
            {/* Mosque Icon */}
            <svg viewBox="0 0 64 64" className="w-14 h-14 text-primary-foreground" fill="currentColor">
              <path d="M32 8c-2 0-4 2-4 4v4h-4c-1 0-2 1-2 2v6h-6v-4c0-1-1-2-2-2s-2 1-2 2v4h-2c-1 0-2 1-2 2v20h8v-10c0-2 2-4 4-4h24c2 0 4 2 4 4v10h8V26c0-1-1-2-2-2h-2v-4c0-1-1-2-2-2s-2 1-2 2v4h-6v-6c0-1-1-2-2-2h-4v-4c0-2-2-4-4-4z"/>
              <circle cx="32" cy="20" r="4"/>
            </svg>
            {/* Heart Badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-background">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Muslimfy</h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">v2.0.4 (Build 342)</span>
          </div>

          <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-[280px]">
            Muslimfy is your daily spiritual companion designed to help you build consistent habits in worship. From prayer tracking to Quran reading goals, we're here to support your journey towards becoming a better Muslim, one day at a time.
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-8">
          {aboutItems.map((item) => (
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

        {/* Social Links */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">CONNECT WITH US</p>
          <div className="flex justify-center gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-card card-shadow flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <social.icon className="w-5 h-5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <button className="w-full bg-primary rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors mb-6">
          <Headphones className="w-5 h-5 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Contact Support</span>
        </button>

        <p className="text-center text-xs text-muted-foreground mb-8">
          &copy; 2024 Muslimfy Inc. All rights reserved.
        </p>
      </div>
    </>
  );
}
