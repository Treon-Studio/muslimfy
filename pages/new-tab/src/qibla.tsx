import React from 'react';
import { Navigation } from 'lucide-react';

export function Qibla() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Navigation className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl text-gray-900">Qibla</h3>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          {/* Compass circle */}
          <div className="w-28 h-28 border-4 border-gray-200 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
            {/* Compass needle */}
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-16 bg-gray-800 rounded-full shadow-sm"></div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-red-500"></div>
            </div>
          </div>
          
          {/* Direction indicator */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600">Direction: 58° NE</p>
        <p className="text-sm text-gray-500 mt-1">Distance: 5,847 miles</p>
      </div>
    </div>
  );
}