import React from 'react';
import { Star } from 'lucide-react';

export function NamesOfAllah() {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:bg-white/25">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Star className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl text-white">99 Names of Allah</h3>
      </div>
      
      <div className="text-center space-y-4">
        <p className="text-4xl text-white mb-4" dir="rtl">الرَّحْمَٰن</p>
        <p className="text-xl text-white/90">Ar-Rahman</p>
        <p className="text-white/70 text-lg">The Compassionate</p>
        
        <div className="pt-4">
          <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all duration-200 shadow-sm backdrop-blur-sm border border-white/20">
            Next Name
          </button>
        </div>
      </div>
    </div>
  );
}