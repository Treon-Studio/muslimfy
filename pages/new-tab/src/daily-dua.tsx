import React, { useState } from 'react';
import { Play } from 'lucide-react';

export function DailyDua() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden h-full bg-gray-900/95 backdrop-blur-xl border border-gray-700/50">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-lg font-semibold">Daily Dua</h2>
            <p className="text-gray-400 text-sm">Morning Prayer</p>
          </div>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📖</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="text-center space-y-5">
            {/* Arabic text */}
            <blockquote 
              className="text-xl text-white leading-tight font-light" 
              dir="rtl"
              lang="ar"
            >
              "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ"
            </blockquote>
            
            {/* English translation */}
            <p className="text-base text-gray-300 leading-relaxed">
              "O Allah, help me remember You, thank You, and worship You perfectly"
            </p>
            
            {/* Description */}
            <p className="text-sm text-gray-400">
              A beautiful dua for seeking divine assistance
            </p>
          </div>
          
          {/* Listen button */}
          <div className="text-center">
            <button 
              onClick={handlePlayAudio}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${
                isPlaying 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'
              }`}
              aria-label={isPlaying ? 'Stop audio' : 'Play dua audio'}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Playing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  Listen
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Bottom indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}