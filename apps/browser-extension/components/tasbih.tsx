import React, { useState } from 'react';
import { RotateCcw, ChevronDown, Infinity, X } from 'lucide-react';

interface DhikrOption {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  color: string;
}

const dhikrOptions: DhikrOption[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    count: 33,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is due to Allah',
    count: 33,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    count: 34,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    meaning: 'There is no power except with Allah',
    count: 100,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    count: 100,
    color: 'from-rose-500 to-rose-600'
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    meaning: 'O Allah, send blessings upon Muhammad',
    count: 100,
    color: 'from-teal-500 to-teal-600'
  }
];

export function Tasbih() {
  const [count, setCount] = useState(0);
  const [currentDhikr, setCurrentDhikr] = useState(dhikrOptions[0]);
  const [showDhikrSelector, setShowDhikrSelector] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  
  const handleIncrement = () => {
    setCount(prev => prev + 1);
    
    // Haptic feedback on mobile
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  const handleReset = () => {
    setCount(0);
  };

  const handleDhikrChange = (dhikr: DhikrOption) => {
    setCurrentDhikr(dhikr);
    setCount(0);
    setShowDhikrSelector(false);
  };

  const progressPercentage = currentDhikr.count === 0 ? 0 : Math.min((count % currentDhikr.count) / currentDhikr.count * 100, 100);
  const completedCycles = Math.floor(count / currentDhikr.count);

  return (
    <>
      <div className={`relative rounded-3xl overflow-hidden h-full bg-gradient-to-br ${currentDhikr.color} backdrop-blur-xl border border-white/20 shadow-2xl`}>
        {/* Enhanced glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-white/10 backdrop-blur-sm"></div>
        
        {/* Compact floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse blur-lg"></div>
          <div className="absolute top-6 right-6 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-6 w-3 h-3 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-6 right-4 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative p-4 h-full flex flex-col">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                  <span className="text-lg">📿</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              </div>
              <div>
                <h2 className="text-white font-semibold tracking-wide">Tasbih Counter</h2>
                <button
                  onClick={() => setShowDhikrSelector(!showDhikrSelector)}
                  className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-all duration-200 group"
                >
                  <span className="font-medium">{currentDhikr.transliteration}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${showDhikrSelector ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Compact cycle indicator */}
              {completedCycles > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                  <Infinity className="w-3.5 h-3.5 text-white" />
                  <span className="text-sm text-white font-semibold">{completedCycles}</span>
                </div>
              )}
              
              {/* Compact reset button */}
              <button 
                onClick={handleReset}
                className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-110 group"
                aria-label="Reset counter"
              >
                <RotateCcw className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>
          </div>
          
          {/* Compact main counter area */}
          <div className="flex-1 flex flex-col justify-center text-center relative">
            {/* Compact Arabic text */}
            <div className="mb-3" dir="rtl">
              <p className="text-lg text-white/95 font-light leading-relaxed px-2" style={{ fontFamily: "'Amiri', 'Noto Sans Arabic', serif" }}>
                {currentDhikr.arabic}
              </p>
            </div>

            {/* Compact counter button */}
            <button 
              onClick={handleIncrement}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              className="group mb-3 py-4 focus:outline-none relative"
              aria-label={`Current count: ${count}. Click to increment`}
            >
              {/* Compact ripple effect background */}
              <div className={`absolute inset-0 bg-white/20 rounded-3xl transition-all duration-200 ${isPressed ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}></div>
              
              <div className="relative">
                <div className={`text-4xl font-bold text-white mb-1 transition-all duration-200 ${isPressed ? 'scale-110' : 'scale-100'}`}>
                  {count}
                </div>
                

              </div>
            </button>
            
            {/* Compact dhikr info */}
            <div className="space-y-1 px-2">
              <p className="text-base font-semibold text-white tracking-wide">
                {currentDhikr.transliteration}
              </p>
              <p className="text-sm text-white/90 leading-relaxed">
                {currentDhikr.meaning}
              </p>

            </div>
          </div>
          
          {/* Compact progress section */}
          <div className="mt-3 space-y-2">
            {/* Compact progress info */}
            {currentDhikr.count > 0 && (
              <div className="flex items-center justify-between text-xs text-white/80 font-medium">
                <span>{count % currentDhikr.count} / {currentDhikr.count}</span>
                <span>{Math.floor(progressPercentage)}% complete</span>
              </div>
            )}
            
            {/* Compact progress bar */}
            <div className="relative">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
                <div 
                  className="h-full bg-white/90 rounded-full transition-all duration-500 relative shadow-sm"
                  style={{ width: `${currentDhikr.count === 0 ? 0 : progressPercentage}%` }}
                >
                  {/* Enhanced animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced dhikr selector popup */}
      {showDhikrSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Enhanced overlay */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowDhikrSelector(false)}
          />
          
          {/* Enhanced popup container */}
          <div className="relative w-full max-w-lg mx-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl max-h-[80vh] overflow-hidden">
            {/* Enhanced header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-white/80">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Choose Dhikr</h3>
                <p className="text-sm text-gray-600">Select your preferred recitation</p>
              </div>
              <button
                onClick={() => setShowDhikrSelector(false)}
                className="w-10 h-10 bg-gray-100/80 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Enhanced dhikr options list */}
            <div className="overflow-y-auto max-h-96">
              {dhikrOptions.map((dhikr, index) => (
                <button
                  key={dhikr.id}
                  onClick={() => handleDhikrChange(dhikr)}
                  className={`w-full text-left px-6 py-5 hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-100 last:border-b-0 group ${
                    dhikr.id === currentDhikr.id ? 'bg-blue-50 border-blue-100' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${dhikr.color} shadow-sm`}></div>
                        <div className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {dhikr.transliteration}
                        </div>
                        {dhikr.id === currentDhikr.id && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-600 font-semibold">Active</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {dhikr.meaning}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                          {dhikr.count === 0 ? 'Free count' : `${dhikr.count} times`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0" dir="rtl">
                      <div className="text-lg text-gray-800 leading-tight font-medium" style={{ fontFamily: "'Amiri', 'Noto Sans Arabic', serif" }}>
                        {dhikr.arabic}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Enhanced footer info */}
            <div className="p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-t border-gray-200/50">
              <p className="text-xs text-gray-500 text-center font-medium">
                Tap any dhikr to start counting. Your progress will be reset.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}