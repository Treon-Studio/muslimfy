import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

export function MosquesTasbih() {
  const [count, setCount] = useState(33);
  
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };
  
  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:bg-white/25">
      {/* Nearby Mosques Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl text-white">Nearby Mosques</h3>
        </div>
        
        <div className="text-center">
          <div className="text-5xl text-white mb-2">5</div>
          <p className="text-white/90">Mosques</p>
          <p className="text-white/70">Within 2 miles</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/20 mb-8"></div>

      {/* Tasbih Section */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📿</span>
          </div>
          <h3 className="text-xl text-white">Tasbih Counter</h3>
        </div>
        
        <div className="text-center">
          <button 
            onClick={handleIncrement}
            className="text-5xl text-white mb-2 hover:scale-105 transition-transform block w-full p-4 rounded-2xl hover:bg-white/10"
          >
            {count}
          </button>
          <p className="text-white/90 mb-4">SubhanAllah</p>
          
          <button 
            onClick={handleReset}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all duration-200 shadow-sm backdrop-blur-sm border border-white/20"
          >
            Reset Counter
          </button>
        </div>
      </div>
    </div>
  );
}