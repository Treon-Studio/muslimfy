import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Book, ChevronDown, BookOpen, X, Heart, Share, Star, Moon, RefreshCw, Loader2, Wifi, WifiOff, Database } from 'lucide-react';
import { useQuranData } from '../hooks/use-quran-data';
import { QuranReaderModal } from './quran-reader-modal';

interface VerseOfTheDayProps {
  onOpenQuranReader?: () => void;
}

export function VerseOfTheDay({ onOpenQuranReader }: VerseOfTheDayProps) {
  const { getRandomAyah, isOnline, apiStatus, surahs, loadSurahContent } = useQuranData();
  const [currentAyah, setCurrentAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuranModal, setShowQuranModal] = useState(false);

  const loadRandomAyah = async () => {
    try {
      setLoading(true);
      setError(null);
      const randomData = await getRandomAyah();
      if (randomData) {
        setCurrentAyah(randomData);
      } else {
        setError('Failed to load verse');
      }
    } catch (err) {
      console.error('Error loading random ayah:', err);
      setError('Failed to load verse');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomAyah();
  }, []);

  const handleRefresh = () => {
    loadRandomAyah();
  };

  const handleOpenQuranReader = () => {
      setShowQuranModal(true);
  };

  const handleShare = async () => {
    if (!currentAyah) return;
    
    const shareText = `${currentAyah.ayah.arabic}\n\n"${currentAyah.ayah.translation}"\n\nSurah ${currentAyah.surah.name} (${currentAyah.surah.id}:${currentAyah.ayah.number})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse of the Day',
          text: shareText,
        });
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Verse copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Verse copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const toggleBookmark = () => {
    setIsLiked(!isLiked);
    // Here you could save to localStorage or a bookmarks service
    const bookmarks = JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
    if (!isLiked) {
      bookmarks.push({
        surah: currentAyah.surah.id,
        ayah: currentAyah.ayah.number,
        timestamp: Date.now()
      });
    } else {
      const index = bookmarks.findIndex((b: any) => 
        b.surah === currentAyah.surah.id && b.ayah === currentAyah.ayah.number
      );
      if (index > -1) bookmarks.splice(index, 1);
    }
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
  };

  const getStatusInfo = () => {
    switch (apiStatus) {
      case 'online':
        return { icon: Wifi, text: 'Live', color: 'bg-green-100 text-green-700' };
      case 'offline':
        return { icon: WifiOff, text: 'Offline', color: 'bg-orange-100 text-orange-700' };
      case 'fallback':
        return { icon: Database, text: 'Local', color: 'bg-blue-100 text-blue-700' };
      default:
        return { icon: WifiOff, text: 'Unknown', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <div className="relative rounded-2xl overflow-hidden h-full bg-card">
        <div className="relative p-5 h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading verse...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentAyah) {
    return (
      <div className="relative rounded-2xl overflow-hidden h-full bg-card">
        <div className="relative p-5 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{error || 'No verse available'}</p>
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden h-full bg-card">
        <div className="relative p-5 h-full flex flex-col">
          {/* Simple Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                <Book className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Verse of the Day</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Surah {currentAyah.surah.name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Action buttons */}
              <button
                onClick={toggleBookmark}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isLiked 
                    ? 'bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400' 
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button 
                onClick={handleOpenQuranReader}
                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center space-y-8 relative px-2">

            {/* Arabic text */}
            <div className="relative py-4">
              <blockquote 
                className="text-3xl text-foreground leading-[1.8] font-light text-center relative" 
                dir="rtl"
                lang="ar"
                style={{ fontFamily: "'Amiri', 'Noto Sans Arabic', serif" }}
              >
                <span className="relative z-10">"{currentAyah.ayah.arabic}"</span>
              </blockquote>
            </div>
            
            {/* English translation */}
            <div className="relative py-2">
              <div className="px-4 py-6">
                <p className="text-lg text-muted-foreground/80 leading-[1.7] text-center font-light">
                  "{currentAyah.ayah.translation}"
                </p>
                {/* Transliteration */}
                {currentAyah.ayah.transliteration && (
                  <p className="text-sm text-muted-foreground/60 leading-relaxed text-center mt-4 italic font-light">
                    {currentAyah.ayah.transliteration}
                  </p>
                )}
              </div>
            </div>
            
            {/* Source citation */}
            <div className="text-center pt-4">
              <cite className="inline-flex items-center px-3 py-1.5 text-xs tracking-wide text-muted-foreground/70 font-medium">
                <Moon className="w-3 h-3 text-emerald-400/60 mr-2" />
                <span>Surah {currentAyah.surah.name} • {currentAyah.surah.id}:{currentAyah.ayah.number}</span>
              </cite>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Quran Reader Modal */}
      {showQuranModal && (
        <QuranReaderModal onClose={() => setShowQuranModal(false)} />
      )}
    </>
  );
}