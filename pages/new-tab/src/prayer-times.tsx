import React, { useState } from 'react';
import { Clock, Sunrise, Sun, Star, Sunset, Moon, Bell, BellOff } from 'lucide-react';

export function PrayerTimes() {
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    fajr: true,
    dhuhr: true,
    asr: false,
    maghrib: true,
    isha: false
  });

  const toggleReminder = () => {
    const allEnabled = Object.values(reminders).every(Boolean);
    const newState = !allEnabled;
    setReminders({
      fajr: newState,
      dhuhr: newState,
      asr: newState,
      maghrib: newState,
      isha: newState
    });
  };

  const prayers = [
    { 
      name: 'Fajr', 
      time: '5:30', 
      icon: Sunrise, 
      id: 'fajr',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-200',
      bgActive: 'bg-purple-500/30'
    },
    { 
      name: 'Dhuhr', 
      time: '12:15', 
      icon: Sun, 
      current: true, 
      id: 'dhuhr',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-200',
      bgActive: 'bg-yellow-500/30'
    },
    { 
      name: 'Asr', 
      time: '3:45', 
      icon: Star, 
      id: 'asr',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-200',
      bgActive: 'bg-blue-500/30'
    },
    { 
      name: 'Maghrib', 
      time: '6:20', 
      icon: Sunset, 
      id: 'maghrib',
      gradient: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-200',
      bgActive: 'bg-orange-500/30'
    },
    { 
      name: 'Isha', 
      time: '8:45', 
      icon: Moon, 
      id: 'isha',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      iconColor: 'text-indigo-200',
      bgActive: 'bg-indigo-500/30'
    }
  ];

  const enabledReminders = Object.values(reminders).filter(Boolean).length;

  return (
    <div className="relative rounded-3xl overflow-hidden h-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-lg">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
      
      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/20">
              <Clock className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Prayer Times</h2>
              <p className="text-gray-300 text-sm">Today's Schedule</p>
            </div>
          </div>
          
          {/* Reminder toggle button */}
          <button
            onClick={toggleReminder}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm rounded-xl border border-gray-600/30 transition-all duration-200 hover:scale-105"
          >
            {enabledReminders > 0 ? (
              <Bell className="w-4 h-4 text-blue-300" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs text-gray-300 font-medium">
              {enabledReminders}/5
            </span>
          </button>
        </div>
        
        {/* Prayer times grid */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-5 gap-3 w-full">
            {prayers.map((prayer) => {
              const IconComponent = prayer.icon;
              const hasReminder = reminders[prayer.id];
              
              return (
                <div 
                  key={prayer.id}
                  className={`group relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 border ${
                    prayer.current 
                      ? 'bg-gradient-to-br from-blue-600/40 to-blue-700/40 border-blue-400/30 shadow-lg shadow-blue-500/10' 
                      : 'bg-gray-800/40 hover:bg-gray-700/50 backdrop-blur-sm border-gray-600/20 hover:border-gray-500/30'
                  }`}
                >
                  {/* Gradient overlay for non-current prayers */}
                  {!prayer.current && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${prayer.gradient}`}></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative mb-3 mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    prayer.current 
                      ? 'bg-white/10 backdrop-blur-sm' 
                      : 'bg-gray-700/30 group-hover:bg-gray-600/40'
                  }`}>
                    <IconComponent 
                      className={`w-4 h-4 transition-colors duration-300 ${
                        prayer.current 
                          ? 'text-white' 
                          : `${prayer.iconColor} group-hover:text-white`
                      }`} 
                    />
                  </div>
                  
                  {/* Time */}
                  <div className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                    prayer.current ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {prayer.time}
                  </div>
                  
                  {/* Prayer name */}
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    prayer.current ? 'text-blue-100' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {prayer.name}
                  </div>
                  
                  {/* Current prayer indicator */}
                  {prayer.current && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                  )}
                  
                  {/* Reminder indicator */}
                  {hasReminder && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-gray-900">
                      <Bell className="w-1.5 h-1.5 text-white absolute top-0.5 left-0.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Progress section */}
        <div className="mt-6 space-y-3 pb-6">
          {/* Next prayer info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Next: Asr in 2h 30m</span>
            <span>40% of day passed</span>
          </div>
          
          {/* Progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-800/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 relative"
                style={{ width: '40%' }}
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}