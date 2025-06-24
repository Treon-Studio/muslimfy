import React, { useState, useEffect } from 'react';
import { PrayerTimes } from './prayer-times';
import { VerseOfTheDay } from './verse-of-the-day';
import { Tasbih } from './tasbih';
import { TodoList } from './todolist';
import { DynamicBackground } from './dynamic-background';
import { QuranReader } from './quran-reader';
import { Toaster } from './ui/sonner';

export function IslamicCompanion() {
  const [showQuranReader, setShowQuranReader] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDaytime, setIsDaytime] = useState(true);

  // Enhanced function to determine if it's daytime based on current user's local time
  const checkDaytime = (time: Date) => {
    // Get local time in user's timezone
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // More nuanced daytime detection for better user experience:
    // Dawn transition: 5:30 AM (330 minutes) - gradual light
    // Full day: 6:00 AM (360 minutes) - bright daylight
    // Evening transition: 6:00 PM (1080 minutes) - golden hour
    // Night: 6:30 PM (1110 minutes) - dark mode
    
    const dawnStart = 330;     // 5:30 AM - dawn begins
    const dayStart = 360;      // 6:00 AM - full day  
    const eveningStart = 1080; // 6:00 PM - evening begins
    const nightStart = 1110;   // 6:30 PM - night begins
    
    // Consider dawn and dusk as part of daytime for a more natural feel
    // This gives a 13-hour daytime window (5:30 AM - 6:30 PM)
    return timeInMinutes >= dawnStart && timeInMinutes < nightStart;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const daytimeStatus = checkDaytime(now);
      
      setCurrentTime(now);
      
      // Only update isDaytime if it actually changed to prevent unnecessary re-renders
      if (daytimeStatus !== isDaytime) {
        setIsDaytime(daytimeStatus);
        
        // Debug info for time checking - only log when status changes
        console.log(`🌅 Time mode changed: ${now.toLocaleTimeString()} - ${daytimeStatus ? 'Day' : 'Night'} mode activated`);
      }
    }, 1000);

    // Set initial daytime state
    const initialTime = new Date();
    const initialDaytimeStatus = checkDaytime(initialTime);
    setIsDaytime(initialDaytimeStatus);
    
    console.log(`🌍 Islamic Companion initialized with ${initialDaytimeStatus ? 'Day' : 'Night'} mode at ${initialTime.toLocaleTimeString()}`);

    return () => clearInterval(timer);
  }, [isDaytime]);

  // Enhanced audio playlist with your requested YouTube URL as the default/first track
  const audioTracks = [
    {
      id: '1',
      title: 'Tabligh Akbar: Kenikmatan Surga',
      artist: 'Ustadz Khalid Basalamah',
      url: 'https://www.youtube.com/watch?v=O9jAkKrZD6E',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      description: 'Tabligh Akbar: Kenikmatan Surga'
    },
    {
      id: '2',
      title: 'Solusi Cara Untuk Mendapat Pertolongan Allah',
      artist: 'Ustadz Adi Hidayat',
      url: 'https://www.youtube.com/watch?v=zUkLO85HZ-k',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop',
      description: 'Solusi Cara Untuk Mendapat Pertolongan Allah'
    },
    {
      id: '3',
      title: 'Mengenal Rasulullah Secara Detail',
      artist: 'Ustadz Khalid Basalamah',
      url: 'https://www.youtube.com/watch?v=ufuj0Iu2OPQ',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      description: 'Mengenal Rasulullah Secara Detail'
    },
    {
      id: '4',
      title: 'Setinggi Apa Iman Kita, Disitulah Kebahagiaan Kita Berada',
      artist: 'Ustadz Adi Hidayat',
      url: 'https://www.youtube.com/watch?v=IiXOKNNvMYs',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop',
      description: 'Setinggi Apa Iman Kita, Disitulah Kebahagiaan Kita Berada'
    },
    {
      id: '5',
      title: 'KALO LAGI MENTOK, HARUS GIMANA?',
      artist: 'Ustadz Hanan Attaki',
      url: 'https://www.youtube.com/watch?v=PSIychdfFVs',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      description: 'KALO LAGI MENTOK, HARUS GIMANA?'
    },
    {
      id: '6',
      title: 'KUNCI KETENANGAN HATI',
      artist: 'Ustadz Khalid Basalamah',
      url: 'https://www.youtube.com/watch?v=DMpkV5ptPOo',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      description: 'KUNCI KETENANGAN HATI'
    },
    {
      id: '                           7',
      title: 'Hadiah Allah Ketika Mengalami Kesulitan',
      artist: 'Ustadz Hanan Attaki',
      url: 'https://www.youtube.com/watch?v=izYUMrsvVDQ&t=4s',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      description: 'Hadiah Allah Ketika Mengalami Kesulitan'
    },
    {
      id: '8',
      title: 'Hadiah Allah Ketika Mengalami Kesulitan',
      artist: 'Ustadz Adi Hidayat',
      url: 'https://www.youtube.com/watch?v=izYUMrsvVDQ',
      type: 'youtube' as const,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop',
      description: 'Hadiah Allah Ketika Mengalami Kesulitan'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <DynamicBackground isDaytime={isDaytime} />
      
      {/* Main Content - Perfect Centering with Mobile First */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6">
          <div className="w-full max-w-[400px] sm:max-w-[640px] lg:max-w-[780px] mx-auto">
            {/* Clean Responsive Grid Layout */}
            <div className="grid gap-3 sm:gap-4 lg:gap-[6px]">
              
              {/* Mobile Layout - Single Column with Optimized Heights */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {/* Prayer Times */}
                <div className="h-[260px]">
                  <PrayerTimes />
                </div>
                
                {/* Tasbih Counter */}
                <div className="h-[250px]">
                  <Tasbih />
                </div>
                
                {/* Verse of the Day */}
                <div className="h-[280px]">
                  <VerseOfTheDay />
                </div>
                
                {/* Audio Player */}
                <div className="h-[320px]">
                  <TodoList />
                </div>
              </div>

              {/* Tablet Layout - Two Column with Better Heights */}
              <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4">
                {/* Top Row - Prayer Times */}
                <div className="col-span-2 h-[198px]">
                  <PrayerTimes />
                </div>
                
                {/* Middle Row - Tasbih and Audio */}
                <div className="h-[320px]">
                  <Tasbih />
                </div>
                <div className="h-[320px]">
                  <TodoList />
                </div>
                
                {/* Bottom Row - Verse of the Day */}
                <div className="col-span-2 h-[360px]">
                  <VerseOfTheDay onOpenQuranReader={() => setShowQuranReader(true)} />
                </div>
              </div>

              {/* Desktop Layout - Three Column Bento */}
              <div className="hidden lg:grid grid-cols-3 gap-[6px]">
                {/* Left Column */}
                <div className="col-span-2 space-y-[6px]">
                  {/* Prayer Times */}
                  <div className="h-[196px]">
                    <PrayerTimes />
                  </div>
                  
                  {/* Verse of the Day */}
                  <div className="h-[371px]">
                    <VerseOfTheDay onOpenQuranReader={() => setShowQuranReader(true)} />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="col-span-1 space-y-[6px]">
                  {/* Tasbih Counter */}
                  <div className="h-[250px]">
                    <Tasbih />
                  </div>
                  
                  {/* Audio Player */}
                  <div className="h-[320px]">
                    <TodoList />
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Footer */}
            <div className="mt-8 mb-4 text-center">
              <div className="text-white/40 text-xs sm:text-sm space-y-1">
                <div className="flex items-center justify-center gap-2 text-[rgba(255,255,255,0.72)]">
                  <span className="font-medium">Muslimfy</span>
                  <span className="text-white/30">•</span>
                  <span>v1.0.0</span>
                </div>
                <div className="text-white/70 text-[10px]">
                © 2025{' '}
                  <button
                    onClick={() => window.open('https://treonstudio.com', '_blank')}
                    className="text-white/80 hover:text-white/95 transition-colors duration-200 cursor-pointer underline decoration-white/60 hover:decoration-white/80 underline-offset-2 text-[10px]"
                  >
                    Treon Studio
                  </button>
                  . All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quran Reader Modal */}
      {showQuranReader && (
        <QuranReader onClose={() => setShowQuranReader(false)} />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#fff',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
}