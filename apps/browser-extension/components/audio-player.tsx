import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, List, X } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration?: number;
}

const ceramahTracks: Track[] = [
  {
    id: 1,
    title: "Keikhlasan dalam Beribadah",
    artist: "Ustadz Abdul Somad",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Hikmah Sabar dalam Ujian",
    artist: "Ustadz Adi Hidayat",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Menghidupkan Qiyamul Lail",
    artist: "Ustadz Khalid Basalamah",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Berbakti kepada Orang Tua",
    artist: "Ustadz Hanan Attaki",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 5,
    title: "Mendekatkan Diri kepada Allah",
    artist: "Ustadz Felix Siauw",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);

  const currentCeramah = ceramahTracks[currentTrack];

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handlePrevious = () => {
    setCurrentTrack(prev => prev > 0 ? prev - 1 : ceramahTracks.length - 1);
  };

  const handleNext = () => {
    setCurrentTrack(prev => prev < ceramahTracks.length - 1 ? prev + 1 : 0);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0] / 100);
  };

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0] / 100);
    }
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    setMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-play functionality - when track ends, play next track automatically
  const handleEnded = () => {
    handleNext();
    // Keep playing automatically
    setTimeout(() => {
      setPlaying(true);
    }, 100);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    setShowPlaylist(false);
    // Auto-start playing when selecting from playlist
    setPlaying(true);
  };

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden h-full bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-2xl">
        {/* Hidden React Player */}
        <ReactPlayer
          ref={playerRef}
          url={currentCeramah.url}
          playing={playing}
          volume={muted ? 0 : volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          width="0"
          height="0"
          style={{ display: 'none' }}
        />

        <div className="relative p-6 h-full flex flex-col">
          {/* Header - Updated for Daily Ceramah */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 samsung-glass rounded-xl flex items-center justify-center">
                <Music className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Daily Ceramah</h2>
                <p className="text-white/70 text-sm">Dakwah &amp; Tausiyah</p>
              </div>
            </div>

          </div>

          {/* Track Info - Centered */}
          <div className="text-center mb-8 flex-1 flex flex-col justify-center">
            <h3 className="text-white text-2xl font-semibold mb-2">{currentCeramah.title}</h3>
            <p className="text-white/70">{currentCeramah.artist}</p>
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-sm text-white/60 mb-3">
            <span>{formatTime(duration * played)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-8 px-1">
            <div className="relative w-full group">
              {/* Custom Track Background with Gradient */}
              <div className="w-full h-1.5 bg-gradient-to-r from-white/10 via-white/15 to-white/10 rounded-full relative overflow-hidden">
                {/* Progress Fill with Gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-white/90 via-white to-white/90 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${played * 100}%` }}
                />
                
                {/* Glow Effect */}
                <div 
                  className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full blur-sm opacity-60"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
              
              {/* Custom Thumb */}
              <div 
                className="absolute top-1/2 w-4 h-4 bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-full transform -translate-y-1/2 shadow-lg border border-white/20 cursor-pointer transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl"
                style={{ left: `calc(${played * 100}% - 8px)` }}
                onMouseDown={handleSeekMouseDown}
              >
                {/* Inner Shine */}
                <div className="absolute inset-0.5 bg-gradient-to-br from-white/60 to-transparent rounded-full" />
                
                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              {/* Hidden Slider for Functionality */}
              <Slider
                value={[played * 100]}
                max={100}
                step={0.1}
                onValueChange={handleSeekChange}
                onPointerDown={handleSeekMouseDown}
                onPointerUp={(e) => handleSeekMouseUp([(e.target as HTMLInputElement).valueAsNumber || played * 100])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls - Fixed Layout */}
          <div className="flex items-center justify-center gap-4 px-2">
            {/* Previous */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="w-10 h-10 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 flex-shrink-0"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            {/* Volume */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="w-10 h-10 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 flex-shrink-0"
            >
              {muted || volume === 0 ? 
                <VolumeX className="w-4 h-4" /> : 
                <Volume2 className="w-4 h-4" />
              }
            </Button>
            
            {/* Play/Pause - Center */}
            <Button
              size="icon"
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full bg-white hover:bg-white/90 text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              {playing ? 
                <Pause className="w-6 h-6 fill-current" /> : 
                <Play className="w-6 h-6 ml-0.5 fill-current" />
              }
            </Button>

            {/* Playlist */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="w-10 h-10 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 flex-shrink-0"
            >
              <List className="w-4 h-4" />
            </Button>
            
            {/* Next */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="w-10 h-10 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 flex-shrink-0"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPlaylist(false)}
          />
          
          {/* Playlist Container */}
          <div className="relative w-full max-w-lg mx-4 samsung-glass-strong rounded-3xl shadow-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 samsung-glass rounded-xl flex items-center justify-center">
                  <List className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ceramah Playlist</h3>
                  <p className="text-sm text-white/60">Pilih ceramah yang ingin didengar</p>
                </div>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="w-10 h-10 samsung-glass rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>
            
            {/* Track List */}
            <div className="overflow-y-auto max-h-96">
              {ceramahTracks.map((ceramah, index) => (
                <button
                  key={ceramah.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`w-full text-left px-6 py-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0 group ${
                    index === currentTrack ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 samsung-glass rounded-lg flex items-center justify-center">
                      <Music className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate group-hover:text-white/90 transition-colors">
                        {ceramah.title}
                      </div>
                      <div className="text-sm text-white/60 truncate">
                        {ceramah.artist}
                      </div>
                    </div>
                    {index === currentTrack && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs text-white/80 font-medium">Playing</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <p className="text-xs text-white/50 text-center">
                Ketuk ceramah mana pun untuk mulai mendengarkan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}