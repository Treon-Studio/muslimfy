import React from 'react';
import { Calendar } from 'lucide-react';

export function IslamicCalendar() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Calendar className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl text-gray-900">Islamic Calendar</h3>
      </div>
      
      <div className="text-center">
        <div className="text-7xl text-gray-900 mb-3">15</div>
        <p className="text-gray-600 text-lg">Rabi' al-Awwal</p>
        <p className="text-gray-500">1446 AH</p>
      </div>
    </div>
  );
}