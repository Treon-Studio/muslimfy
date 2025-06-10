import React, { useState, useEffect } from 'react';
import { DynamicBackground } from './DynamicBackground';
import { PrayerTimes } from './PrayerTimes';
import { VerseOfTheDay } from './VerseOfTheDay';
import { Tasbih } from './Tasbih';
import { DailyCeramah } from './DailyCeramah';

export function IslamicCompanion() {
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      setIsDaytime(hour >= 6 && hour < 18);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <DynamicBackground isDaytime={isDaytime} />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-semibold mb-2 tracking-wide">Assalamualaikum</h1>
        </div>
        
        {/* Main Content Grid - 780px width */}
        <div className="w-full max-w-[780px] grid grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Prayer Times - 196px height */}
            <div className="h-[196px]">
              <PrayerTimes />
            </div>
            
            {/* Verse of the Day - 371px height */}
            <div className="h-[371px]">
              <VerseOfTheDay />
            </div>
          </div>
          
          {/* Right Column - 1/3 width */}
          <div className="col-span-1 space-y-6">
            {/* Tasbih Counter - 226px height */}
            <div className="h-[226px]">
              <Tasbih />
            </div>
            
            {/* Daily Ceramah - 340px height */}
            <div className="h-[340px]">
              <DailyCeramah />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}