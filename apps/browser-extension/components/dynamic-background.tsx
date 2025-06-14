import React, { useState, useEffect } from 'react';

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  tailLength: number;
  angle: number;
}

export function DynamicBackground({ isDaytime }: { isDaytime: boolean }) {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Algorithm to generate shooting stars with random intervals
  useEffect(() => {
    if (isDaytime) return;

    const generateShootingStar = (): ShootingStar => {
      const colors = [
        { color: 'white', intensity: 1 },
        { color: 'blue-100', intensity: 0.8 },
        { color: 'yellow-100', intensity: 0.9 },
        { color: 'purple-100', intensity: 0.7 },
        { color: 'pink-100', intensity: 0.6 },
        { color: 'cyan-100', intensity: 0.8 }
      ];
      
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        id: Math.random(),
        startX: Math.random() * -200 - 100, // Start from far left
        startY: Math.random() * -300 - 50,  // Start from above screen
        color: randomColor.color,
        size: Math.random() * 1.5 + 1, // 1-2.5px
        duration: Math.random() * 8 + 6, // 6-14 seconds
        delay: Math.random() * 3, // 0-3 seconds delay
        tailLength: Math.random() * 20 + 25, // 25-45px tail
        angle: Math.random() * 20 + 35 // 35-55 degrees
      };
    };

    const createShootingStar = () => {
      const newStar = generateShootingStar();
      setShootingStars(prev => [...prev, newStar]);
      
      // Remove star after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
      }, (newStar.duration + newStar.delay + 1) * 1000);
    };

    // Initial stars
    for (let i = 0; i < 3; i++) {
      setTimeout(createShootingStar, Math.random() * 5000);
    }

    // Random interval algorithm: exponential backoff with jitter
    const scheduleNextStar = () => {
      const baseInterval = 8000; // 8 seconds base
      const jitter = Math.random() * 12000; // 0-12 seconds jitter
      const exponentialFactor = Math.random() * 0.5 + 0.5; // 0.5-1.0 multiplier
      
      const nextInterval = (baseInterval + jitter) * exponentialFactor;
      
      setTimeout(() => {
        createShootingStar();
        scheduleNextStar(); // Recursive scheduling
      }, nextInterval);
    };

    scheduleNextStar();

  }, [isDaytime]);

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string, shadow: string, gradient: string } } = {
      'white': {
        bg: 'bg-white',
        shadow: '0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.7)',
        gradient: 'from-transparent via-white/70 to-white'
      },
      'blue-100': {
        bg: 'bg-blue-100',
        shadow: '0 0 12px rgba(191, 219, 254, 1), 0 0 25px rgba(191, 219, 254, 0.6)',
        gradient: 'from-transparent via-blue-200/60 to-blue-100'
      },
      'yellow-100': {
        bg: 'bg-yellow-100',
        shadow: '0 0 10px rgba(254, 240, 138, 0.9), 0 0 20px rgba(254, 240, 138, 0.5)',
        gradient: 'from-transparent via-yellow-200/50 to-yellow-100'
      },
      'purple-100': {
        bg: 'bg-purple-100',
        shadow: '0 0 14px rgba(221, 214, 254, 1), 0 0 28px rgba(221, 214, 254, 0.6)',
        gradient: 'from-transparent via-purple-200/60 to-purple-100'
      },
      'pink-100': {
        bg: 'bg-pink-100',
        shadow: '0 0 11px rgba(252, 231, 243, 0.9), 0 0 22px rgba(252, 231, 243, 0.5)',
        gradient: 'from-transparent via-pink-200/50 to-pink-100'
      },
      'cyan-100': {
        bg: 'bg-cyan-100',
        shadow: '0 0 13px rgba(207, 250, 254, 0.9), 0 0 26px rgba(207, 250, 254, 0.6)',
        gradient: 'from-transparent via-cyan-200/60 to-cyan-100'
      }
    };
    
    return colorMap[color] || colorMap['white'];
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {/* Primary dramatic gradient background */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        isDaytime 
          ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' 
          : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900'
      }`} />
      
      {/* Secondary gradient overlay for more depth */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        isDaytime
          ? 'bg-gradient-to-t from-blue-600/60 via-sky-400/30 to-cyan-300/40'
          : 'bg-gradient-to-t from-slate-900/80 via-indigo-800/50 to-purple-700/60'
      }`} />
      
      {/* Radial gradient from center for dramatic lighting */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        isDaytime
          ? 'bg-gradient-radial from-yellow-200/40 via-sky-300/20 to-blue-600/30'
          : 'bg-gradient-radial from-blue-400/30 via-indigo-700/40 to-slate-900/50'
      }`} style={{
        background: isDaytime 
          ? 'radial-gradient(ellipse at center, rgba(254, 240, 138, 0.4) 0%, rgba(125, 211, 252, 0.2) 35%, rgba(37, 99, 235, 0.3) 100%)'
          : 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.3) 0%, rgba(79, 70, 229, 0.4) 35%, rgba(15, 23, 42, 0.5) 100%)'
      }} />
      
      {/* Day time elements - Enhanced clouds and sun effects */}
      {isDaytime && (
        <>
          {/* Dramatic sun effect */}
          <div className="absolute top-16 right-16 w-48 h-48 bg-yellow-300/30 rounded-full blur-3xl animate-sunGlow" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl animate-sunGlow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-24 right-24 w-20 h-20 bg-yellow-100/50 rounded-full blur-xl animate-sunGlow" style={{ animationDelay: '4s' }} />
          
          {/* Sun rays */}
          <div className="absolute top-12 right-12 w-64 h-64 opacity-30">
            <div className="absolute inset-0 bg-gradient-conic from-yellow-200/40 via-transparent to-yellow-200/40 animate-xiaomiRotate" />
          </div>
          
          {/* Enhanced floating clouds - More clouds for richer sky */}
          <div className="absolute top-20 left-1/4 w-96 h-40 bg-white/35 rounded-full blur-2xl animate-cloudFloat opacity-60" />
          <div 
            className="absolute top-36 right-1/3 w-80 h-32 bg-white/30 rounded-full blur-xl animate-cloudFloat opacity-50" 
            style={{ animationDelay: '5s', animationDirection: 'reverse' }} 
          />
          <div 
            className="absolute top-56 left-1/6 w-64 h-28 bg-white/40 rounded-full blur-lg animate-cloudFloat opacity-55" 
            style={{ animationDelay: '10s' }} 
          />
          <div 
            className="absolute top-32 right-1/5 w-72 h-36 bg-white/32 rounded-full blur-xl animate-cloudFloat opacity-45" 
            style={{ animationDelay: '15s', animationDirection: 'reverse' }} 
          />
          <div 
            className="absolute top-64 left-2/3 w-56 h-24 bg-white/38 rounded-full blur-lg animate-cloudFloat opacity-50" 
            style={{ animationDelay: '8s' }} 
          />
          <div 
            className="absolute top-48 left-1/3 w-48 h-20 bg-white/25 rounded-full blur-md animate-cloudFloat opacity-40" 
            style={{ animationDelay: '12s' }} 
          />
          <div 
            className="absolute top-72 right-2/3 w-40 h-16 bg-white/35 rounded-full blur-sm animate-cloudFloat opacity-45" 
            style={{ animationDelay: '18s', animationDirection: 'reverse' }} 
          />
          
          {/* Additional cloud layers for more depth */}
          <div 
            className="absolute top-28 left-1/8 w-60 h-30 bg-white/28 rounded-full blur-lg animate-cloudFloat opacity-35" 
            style={{ animationDelay: '20s' }} 
          />
          <div 
            className="absolute top-44 right-1/8 w-52 h-26 bg-white/32 rounded-full blur-md animate-cloudFloat opacity-40" 
            style={{ animationDelay: '25s', animationDirection: 'reverse' }} 
          />
          <div 
            className="absolute top-80 left-1/2 w-44 h-22 bg-white/30 rounded-full blur-lg animate-cloudFloat opacity-38" 
            style={{ animationDelay: '30s' }} 
          />
          
          {/* Enhanced floating particles */}
          <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-white/50 rounded-full blur-sm animate-particleFloat" />
          <div 
            className="absolute top-2/3 right-1/4 w-4 h-4 bg-white/60 rounded-full blur-sm animate-particleFloat" 
            style={{ animationDelay: '3s' }} 
          />
          <div 
            className="absolute top-1/2 left-1/3 w-3 h-3 bg-white/55 rounded-full blur-sm animate-particleFloat" 
            style={{ animationDelay: '7s' }} 
          />
          <div 
            className="absolute top-3/4 right-1/2 w-5 h-5 bg-white/45 rounded-full blur-sm animate-particleFloat" 
            style={{ animationDelay: '11s' }} 
          />
        </>
      )}
      
      {/* Night time elements - Enhanced stars and moon */}
      {!isDaytime && (
        <>
          {/* Enhanced moon glow effect */}
          <div className="absolute top-12 right-12 w-56 h-56 bg-blue-100/15 rounded-full blur-3xl animate-moonGlow" />
          <div className="absolute top-16 right-16 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl animate-moonGlow" style={{ animationDelay: '3s' }} />
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-moonGlow" style={{ animationDelay: '6s' }} />
          
          {/* Subtly enhanced twinkling stars with blur and reduced opacity */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-twinkleSubtle blur-sm" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.4)' }} />
          <div 
            className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '1s', boxShadow: '0 0 5px rgba(255,255,255,0.3)' }} 
          />
          <div 
            className="absolute top-48 left-1/6 w-2 h-2 bg-white/65 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '3s', boxShadow: '0 0 7px rgba(255,255,255,0.5)' }} 
          />
          <div 
            className="absolute top-24 right-1/5 w-1.5 h-1.5 bg-white/55 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '2s', boxShadow: '0 0 5px rgba(255,255,255,0.4)' }} 
          />
          <div 
            className="absolute top-60 left-2/3 w-2 h-2 bg-white/60 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '4s', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }} 
          />
          <div 
            className="absolute top-40 right-2/3 w-1 h-1 bg-white/45 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '5s', boxShadow: '0 0 4px rgba(255,255,255,0.3)' }} 
          />
          <div 
            className="absolute top-80 left-1/5 w-2.5 h-2.5 bg-white/70 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '0.5s', boxShadow: '0 0 8px rgba(255,255,255,0.5)' }} 
          />
          <div 
            className="absolute top-72 right-1/6 w-1.5 h-1.5 bg-white/50 rounded-full animate-twinkleSubtle blur-sm" 
            style={{ animationDelay: '6s', boxShadow: '0 0 5px rgba(255,255,255,0.3)' }} 
          />
          
          {/* Additional subtle stars with more blur */}
          <div className="absolute top-36 left-1/8 w-1 h-1 bg-white/40 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '8s', boxShadow: '0 0 3px rgba(255,255,255,0.2)' }} />
          <div className="absolute top-52 right-1/8 w-1.5 h-1.5 bg-white/45 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '9s', boxShadow: '0 0 4px rgba(255,255,255,0.3)' }} />
          <div className="absolute top-68 left-3/4 w-1 h-1 bg-white/40 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '10s', boxShadow: '0 0 3px rgba(255,255,255,0.2)' }} />
          <div className="absolute top-84 right-3/4 w-2 h-2 bg-white/55 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '11s', boxShadow: '0 0 5px rgba(255,255,255,0.4)' }} />
          
          {/* Enhanced constellation patterns with subtle glow */}
          <div className="absolute top-28 left-1/2 w-1 h-1 bg-white/35 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '7s', boxShadow: '0 0 2px rgba(255,255,255,0.2)' }} />
          <div className="absolute top-36 left-1/2 translate-x-6 w-1 h-1 bg-white/35 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '7.5s', boxShadow: '0 0 2px rgba(255,255,255,0.2)' }} />
          <div className="absolute top-32 left-1/2 translate-x-12 w-1 h-1 bg-white/35 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '8s', boxShadow: '0 0 2px rgba(255,255,255,0.2)' }} />
          <div className="absolute top-40 left-1/2 translate-x-9 w-1 h-1 bg-white/35 rounded-full animate-twinkleSubtle blur-sm" style={{ animationDelay: '8.5s', boxShadow: '0 0 2px rgba(255,255,255,0.2)' }} />
          
          {/* Dynamic shooting stars */}
          {shootingStars.map((star) => {
            const colorClasses = getColorClasses(star.color);
            return (
              <div 
                key={star.id}
                className="shooting-star-dynamic absolute"
                style={{
                  left: `${star.startX}vw`,
                  top: `${star.startY}px`,
                  animation: `dynamicShootingStar ${star.duration}s ease-out ${star.delay}s forwards`
                }}
              >
                {/* Tail positioned behind the head */}
                <div 
                  className={`shooting-star-tail absolute bg-gradient-to-r ${colorClasses.gradient} transform blur-sm`}
                  style={{ 
                    width: `${star.tailLength}px`,
                    height: `${star.size * 0.3}px`,
                    top: `${-star.size * 0.15}px`,
                    left: `${-star.tailLength * 0.7}px`,
                    transform: `rotate(${star.angle}deg)`,
                    transformOrigin: 'right center',
                    opacity: 0.8
                  }}
                />
                {/* Head at the front */}
                <div 
                  className={`shooting-star-head relative z-10 ${colorClasses.bg} rounded-full shadow-lg`}
                  style={{ 
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    boxShadow: colorClasses.shadow
                  }}
                />
              </div>
            );
          })}
        </>
      )}
      
      {/* Enhanced ambient floating orbs for depth */}
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-xiaomiFloat transition-all duration-2000 ${
        isDaytime ? 'bg-blue-200/20' : 'bg-indigo-400/25'
      }`} />
      <div 
        className={`absolute top-3/4 right-1/3 w-[400px] h-[400px] rounded-full blur-2xl animate-xiaomiFloat transition-all duration-2000 ${
          isDaytime ? 'bg-sky-300/25' : 'bg-blue-400/20'
        }`}
        style={{ animationDelay: '3s', animationDirection: 'reverse' }} 
      />
      <div 
        className={`absolute bottom-1/4 left-1/2 w-[360px] h-[360px] rounded-full blur-3xl animate-xiaomiPulse transition-all duration-2000 ${
          isDaytime ? 'bg-white/20' : 'bg-blue-300/20'
        }`}
        style={{ animationDelay: '6s' }} 
      />
      <div 
        className={`absolute top-1/2 right-1/6 w-[300px] h-[300px] rounded-full blur-2xl animate-xiaomiFloat transition-all duration-2000 ${
          isDaytime ? 'bg-cyan-200/18' : 'bg-purple-400/22'
        }`}
        style={{ animationDelay: '9s' }} 
      />
      
      {/* Additional atmospheric effects */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        isDaytime
          ? 'bg-gradient-to-br from-transparent via-white/5 to-blue-100/10'
          : 'bg-gradient-to-br from-transparent via-indigo-500/8 to-purple-900/15'
      }`} />
      
      {/* Subtle texture overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent opacity-80" />
    </div>
  );
}