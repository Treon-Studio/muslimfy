import React from 'react';
import { Navigation, Calendar } from 'lucide-react';

export function QiblaCalendar() {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:bg-white/25">
      {/* Qibla Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Navigation className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl text-white">Qibla Direction</h3>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            {/* Compass circle */}
            <div className="w-24 h-24 border-4 border-white/40 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-inner">
              {/* Compass needle */}
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-12 bg-white rounded-full shadow-lg"></div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-red-400"></div>
              </div>
            </div>
            
            {/* Direction indicator */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-white/90">58° NE</p>
          <p className="text-sm text-white/70">5,847 miles</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/20 mb-8"></div>

      {/* Islamic Calendar Section */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl text-white">Islamic Calendar</h3>
        </div>
        
        <div className="text-center">
          <div className="text-5xl text-white mb-2">15</div>
          <p className="text-white/90">Rabi' al-Awwal</p>
          <p className="text-white/70">1446 AH</p>
        </div>
      </div>
    </div>
  );
}