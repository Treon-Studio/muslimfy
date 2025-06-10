import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, List, Clock, User, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Ceramah {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  description: string;
  audioUrl: string; // Mock URL - in real app would be actual audio files
  category: string;
  coverUrl: string;
}

const ceramahList: Ceramah[] = [
  {
    id: '1',
    title: 'Keberkahan Sholat Fajr',
    speaker: 'Ustadz Abdul Rahman',
    duration: '12:45',
    description: 'Pentingnya menjaga sholat subuh dan keberkahannya',
    audioUrl: '/audio/ceramah-1.mp3',
    category: 'Ibadah',
    coverUrl: 'https://images.unsplash.com/photo-1564769662632-1925ab60c1ef?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: '2',
    title: 'Sabar dalam Menghadapi Ujian',
    speaker: 'Ustadz Muhammad Hasan',
    duration: '18:30',
    description: 'Hikmah sabar dan cara menghadapi cobaan hidup',
    audioUrl: '/audio/ceramah-2.mp3',
    category: 'Akhlak',
    coverUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: '3',
    title: 'Kemuliaan Bulan Ramadhan',
    speaker: 'Ustadz Ahmad Yusuf',
    duration: '22:15',
    description: 'Mempersiapkan diri menyambut bulan yang penuh berkah',
    audioUrl: '/audio/ceramah-3.mp3',
    category: 'Ramadhan',
    coverUrl: 'https://images.unsplash.com/photo-1552316241-db3cb1e4eb12?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: '4',
    title: 'Taqwa Jalan Menuju Surga',
    speaker: 'Ustadz Ibrahim Ali',
    duration: '16:20',
    description: 'Memahami makna taqwa dan cara mengamalkannya',
    audioUrl: '/audio/ceramah-4.mp3',
    category: 'Aqidah',
    coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: '5',
    title: 'Adab Bermuamalah',
    speaker: 'Ustadz Hamza Malik',
    duration: '14:10',
    description: 'Etika dalam berinteraksi sesama muslim',
    audioUrl: '/audio/ceramah-5.mp3',
    category: 'Muamalah',
    coverUrl: 'https://images.unsplash.com/photo-1591622180999-5296de4b2545?w=400&h=400&fit=crop&crop=center'
  }
];

export function DailyCeramah() {
  const [currentCeramah, setCurrentCeramah] = useState(ceramahList[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Mock audio functionality since we don't have real audio files
  useEffect(() => {
    // Simulate audio duration based on ceramah duration
    const [minutes, seconds] = currentCeramah.duration.split(':').map(Number);
    setDuration(minutes * 60 + seconds);
  }, [currentCeramah]);

  // Mock progress update
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }, 800);
    }
  };

  const handleNext = () => {
    const currentIndex = ceramahList.findIndex(c => c.id === currentCeramah.id);
    const nextIndex = (currentIndex + 1) % ceramahList.length;
    setCurrentCeramah(ceramahList[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    const currentIndex = ceramahList.findIndex(c => c.id === currentCeramah.id);
    const prevIndex = currentIndex === 0 ? ceramahList.length - 1 : currentIndex - 1;
    setCurrentCeramah(ceramahList[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCeramahSelect = (ceramah: Ceramah) => {
    setCurrentCeramah(ceramah);
    setCurrentTime(0);
    setIsPlaying(false);
    setShowPlaylist(false);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Enhanced glassmorphism with layered effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-white/4 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-emerald-800/10"></div>
        
        {/* Refined animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-400/8 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-300/10 rounded-full animate-ping blur-lg" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-6 w-3 h-3 bg-emerald-200/15 rounded-full animate-bounce blur-sm" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative p-5 h-full flex flex-col">
          {/* Refined Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-400/20 shadow-lg">
                <span className="text-lg">🎧</span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm tracking-wide">Audio Player</h2>
                <p className="text-emerald-200/80 text-xs">Ceramah Harian</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:scale-105 hover:rotate-3"
            >
              <List className="w-4 h-4 text-white/80" />
            </button>
          </div>

          {/* Enhanced Cover Art & Info Section */}
          <div className="mb-4 flex-1 flex flex-col justify-center">
            {/* Cover Art - Centered and larger */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <ImageWithFallback
                    src={currentCeramah.coverUrl}
                    alt={`Cover for ${currentCeramah.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Enhanced play overlay indicator */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-emerald-500/25 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/90 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                </div>
                {/* Glowing effect for cover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
              </div>
            </div>

            {/* Track Info - Better typography */}
            <div className="text-center space-y-2">
              <h3 className="text-white text-base font-semibold leading-tight line-clamp-2 px-2 tracking-wide">
                {currentCeramah.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 text-xs text-white/70">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-24">{currentCeramah.speaker.split(' ')[1] || currentCeramah.speaker}</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentCeramah.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block text-xs bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-200 px-3 py-1 rounded-full border border-emerald-400/20 backdrop-blur-sm">
                  {currentCeramah.category}
                </span>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                      : 'bg-white/10 text-white/60 border border-white/10 hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Progress bar */}
          <div className="mb-4 space-y-2">
            <div 
              ref={progressRef}
              onClick={handleProgressClick}
              className="relative h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm border border-white/10 group"
            >
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Enhanced progress shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
              </div>
              
              {/* Enhanced progress thumb */}
              <div 
                className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 border-emerald-300"
                style={{ left: `calc(${progressPercentage}% - 6px)` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-white/60 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Enhanced Control buttons */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={handlePrevious}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:scale-110 group"
            >
              <SkipBack className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
            </button>
            
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 disabled:opacity-70 border border-emerald-400/30 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5 group-hover:scale-110 transition-transform" />
              )}
            </button>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:scale-110 group"
            >
              <SkipForward className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Enhanced Volume control */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-white/60 flex-shrink-0" />
            <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-hidden group">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-200"
                style={{ width: `${volume * 100}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Volume thumb */}
              <div 
                className="absolute top-1/2 w-2 h-2 bg-white rounded-full shadow-md transform -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ left: `calc(${volume * 100}% - 4px)` }}
              ></div>
            </div>
            <span className="text-xs text-white/50 w-8 text-right font-mono">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Playlist popup */}
      {showPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Enhanced Overlay */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowPlaylist(false)}
          />
          
          {/* Playlist container */}
          <div className="relative w-full max-w-lg mx-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl max-h-[70vh] overflow-hidden">
            {/* Enhanced Header */}
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Daftar Ceramah</h3>
              <p className="text-sm text-gray-600">Pilih ceramah yang ingin didengar</p>
            </div>
            
            {/* Enhanced Ceramah list */}
            <div className="overflow-y-auto max-h-80">
              {ceramahList.map((ceramah, index) => (
                <button
                  key={ceramah.id}
                  onClick={() => handleCeramahSelect(ceramah)}
                  className={`w-full text-left px-6 py-4 hover:bg-emerald-50/80 transition-all duration-200 border-b border-gray-100 last:border-b-0 group ${
                    ceramah.id === currentCeramah.id ? 'bg-emerald-50 border-emerald-100' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Enhanced Cover thumbnail */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <ImageWithFallback
                        src={ceramah.coverUrl}
                        alt={`Cover for ${ceramah.title}`}
                        className="w-full h-full object-cover"
                      />
                      {ceramah.id === currentCeramah.id && (
                        <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">
                          {ceramah.category}
                        </span>
                        {ceramah.id === currentCeramah.id && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-600 font-semibold">Playing</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 truncate text-sm group-hover:text-emerald-700 transition-colors">
                        {ceramah.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                        {ceramah.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ceramah.speaker}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ceramah.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Enhanced Footer */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50/50 border-t border-gray-200/50">
              <p className="text-xs text-gray-500 text-center font-medium">
                {ceramahList.length} ceramah tersedia untuk mendengar
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}