import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Copy,
  Share2,
  RotateCcw,
  X,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Wifi,
  WifiOff,
  Database,
  List,
  Settings,
  Type,
  Eye,
  EyeOff,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { useQuranData, type Surah, type Ayah } from '../hooks/use-quran-data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from './ui/drawer';

interface QuranReaderProps {
  onClose?: () => void;
}

export function QuranReader({ onClose }: QuranReaderProps) {
  const {
    surahs,
    loading,
    error,
    isOnline,
    apiStatus,
    loadSurahContent,
    refetch
  } = useQuranData();

  // State management
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'reading'>('list'); // Start with list
  const [showSurahDrawer, setShowSurahDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(new Set());
  const [fontSize, setFontSize] = useState(18);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loadingSurah, setLoadingSurah] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      if (saved) {
        const bookmarks = JSON.parse(saved);
        const bookmarkSet = new Set(bookmarks.map((b: any) => `${b.surah}:${b.ayah}`));
        setBookmarkedAyahs(bookmarkSet);
      }
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    }
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = useCallback((bookmarks: Set<string>) => {
    try {
      const bookmarksArray = Array.from(bookmarks).map(key => {
        const [surah, ayah] = key.split(':');
        return { surah: parseInt(surah), ayah: parseInt(ayah), timestamp: Date.now() };
      });
      localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarksArray));
    } catch (error) {
      console.warn('Failed to save bookmarks:', error);
    }
  }, []);

  // Load specific surah
  const handleLoadSurah = useCallback(async (surahId: number) => {
    try {
      setLoadingSurah(true);
      const surah = await loadSurahContent(surahId);
      if (surah) {
        setCurrentSurah(surah);
        setSelectedAyah(null);
        setViewMode('reading'); // Switch to reading mode
        setShowSurahDrawer(false); // Close drawer if open
      }
    } catch (err) {
      console.error('Failed to load surah:', err);
    } finally {
      setLoadingSurah(false);
    }
  }, [loadSurahContent]);

  // Toggle bookmark
  const toggleBookmark = useCallback((surahId: number, ayahNumber: number) => {
    const key = `${surahId}:${ayahNumber}`;
    const newBookmarks = new Set(bookmarkedAyahs);
    
    if (newBookmarks.has(key)) {
      newBookmarks.delete(key);
    } else {
      newBookmarks.add(key);
    }
    
    setBookmarkedAyahs(newBookmarks);
    saveBookmarks(newBookmarks);
  }, [bookmarkedAyahs, saveBookmarks]);

  // Copy ayah
  const copyAyah = useCallback((ayah: Ayah, surah: Surah) => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n\nSurah ${surah.name} (${surah.id}:${ayah.number})`;
    navigator.clipboard.writeText(text);
  }, []);

  // Share ayah
  const shareAyah = useCallback(async (ayah: Ayah, surah: Surah) => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n\nSurah ${surah.name} (${surah.id}:${ayah.number})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran - Surah ${surah.name}`,
          text: text,
        });
      } catch (err) {
        copyAyah(ayah, surah);
      }
    } else {
      copyAyah(ayah, surah);
    }
  }, [copyAyah]);

  // Filter surahs based on search
  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.includes(searchQuery)
  );

  // Navigation functions
  const goToPreviousSurah = () => {
    if (currentSurah && currentSurah.id > 1) {
      const prevSurah = surahs.find(s => s.id === currentSurah.id - 1);
      if (prevSurah) handleLoadSurah(prevSurah.id);
    }
  };

  const goToNextSurah = () => {
    if (currentSurah && currentSurah.id < 114) {
      const nextSurah = surahs.find(s => s.id === currentSurah.id + 1);
      if (nextSurah) handleLoadSurah(nextSurah.id);
    }
  };

  // Back to surah list
  const backToSurahList = () => {
    setViewMode('list');
    setCurrentSurah(null);
    setSelectedAyah(null);
    setShowSettings(false);
  };

  // Get status info
  const getStatusInfo = () => {
    switch (apiStatus) {
      case 'online':
        return { icon: Wifi, text: 'Online', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'offline':
        return { icon: WifiOff, text: 'Offline', color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'fallback':
        return { icon: Database, text: 'Local', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      default:
        return { icon: WifiOff, text: 'Unknown', color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  const statusInfo = getStatusInfo();

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4 mx-auto" />
          <p className="text-gray-700 font-medium">Memuat Al-Quran...</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <statusInfo.icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">{statusInfo.text}</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center px-6 max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-800 mb-6 font-medium">{error}</p>
          <Button 
            onClick={refetch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left: Back/Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={viewMode === 'list' ? onClose : backToSurahList}
            className="w-10 h-10 p-0 rounded-full hover:bg-gray-100"
          >
            {viewMode === 'list' ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            )}
          </Button>

          {/* Center: Title */}
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg font-semibold text-gray-900">
              {viewMode === 'list' ? 'Al-Quran Kareem' : (currentSurah?.name || 'Al-Quran Kareem')}
            </h1>
            {viewMode === 'reading' && currentSurah && (
              <p className="text-sm text-gray-500">
                {currentSurah.numberOfAyahs} Ayat • Surah {currentSurah.id}/114
              </p>
            )}
          </div>

          {/* Right: Settings or Status */}
          {viewMode === 'reading' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 p-0 rounded-full hover:bg-gray-100"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          ) : (
            <Badge className={`${statusInfo.color} text-xs px-2 py-1 rounded-full border`}>
              <statusInfo.icon className="w-3 h-3 mr-1" />
              {statusInfo.text}
            </Badge>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && viewMode === 'reading' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Ukuran Font</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                    className="w-8 h-8 p-0 rounded-lg"
                  >
                    <Type className="w-3 h-3" />
                  </Button>
                  <span className="text-sm text-gray-600 w-6 text-center font-medium">{fontSize}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                    className="w-8 h-8 p-0 rounded-lg"
                  >
                    <Type className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Terjemahan</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`w-12 h-6 p-0 rounded-full transition-colors ${
                    showTranslation ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    showTranslation ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Transliterasi</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTransliteration(!showTransliteration)}
                  className={`w-12 h-6 p-0 rounded-full transition-colors ${
                    showTransliteration ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    showTransliteration ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 h-[calc(100vh-80px)] overflow-hidden">
        {/* Surah List View */}
        {viewMode === 'list' && (
          <div className="h-full flex flex-col">
            {/* Search */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari surah..."
                  className="pl-10 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Surah List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.id}
                    onClick={() => handleLoadSurah(surah.id)}
                    disabled={loadingSurah}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                      loadingSurah && currentSurah?.id === surah.id
                        ? 'bg-emerald-50 border-emerald-200 opacity-75'
                        : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    } ${loadingSurah ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-semibold text-sm">{surah.id}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate">{surah.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {surah.englishName} • {surah.numberOfAyahs} ayat • {surah.revelationType}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div 
                          className="text-lg text-gray-700 flex-shrink-0" 
                          style={{ fontFamily: "'Amiri', serif" }}
                        >
                          {surah.arabicName}
                        </div>
                        {loadingSurah && currentSurah?.id === surah.id && (
                          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Reading View */}
        {viewMode === 'reading' && currentSurah && (
          <div className="h-full flex flex-col">
            {/* Surah Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-6 border-b border-gray-200">
              <div className="text-center">
                <div 
                  className="text-2xl font-bold text-gray-900 mb-2" 
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {currentSurah.arabicName}
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-1">{currentSurah.name}</div>
                <div className="text-gray-600">{currentSurah.englishName}</div>
                <div className="text-sm text-gray-500 mt-2">
                  {currentSurah.numberOfAyahs} Ayat • {currentSurah.revelationType} • Surah {currentSurah.id}/114
                </div>
              </div>
            </div>

            {/* Reading Content */}
            <div className="flex-1 overflow-hidden">
              {loadingSurah ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4 mx-auto" />
                    <p className="text-gray-600">Memuat {currentSurah.name}...</p>
                  </div>
                </div>
              ) : currentSurah.ayahs.length > 0 ? (
                <ScrollArea className="h-full">
                  <div className="px-4 py-4 space-y-4 pb-24">
                    {currentSurah.ayahs.map((ayah) => {
                      const isBookmarked = bookmarkedAyahs.has(`${currentSurah.id}:${ayah.number}`);
                      const isSelected = selectedAyah === ayah.number;
                      
                      return (
                        <div
                          key={ayah.number}
                          className={`bg-white rounded-xl border-2 p-4 transition-all duration-200 ${
                            isSelected
                              ? 'border-emerald-200 bg-emerald-50/50 shadow-md'
                              : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedAyah(isSelected ? null : ayah.number)}
                        >
                          {/* Ayah Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-sm font-semibold">{ayah.number}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(currentSurah.id, ayah.number);
                                }}
                                className={`w-8 h-8 p-0 rounded-lg transition-colors ${
                                  isBookmarked ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                {isBookmarked ? (
                                  <Heart className="w-4 h-4 fill-current" />
                                ) : (
                                  <Heart className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyAyah(ayah, currentSurah);
                                }}
                                className="w-8 h-8 p-0 rounded-lg text-gray-400 hover:text-gray-600"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareAyah(ayah, currentSurah);
                                }}
                                className="w-8 h-8 p-0 rounded-lg text-gray-400 hover:text-gray-600"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Arabic Text */}
                          <div 
                            className="text-right mb-4 leading-loose text-gray-900"
                            style={{ 
                              fontSize: `${fontSize}px`,
                              fontFamily: "'Amiri', 'Noto Sans Arabic', serif",
                              lineHeight: '2'
                            }}
                            dir="rtl"
                            lang="ar"
                          >
                            {ayah.arabic}
                          </div>

                          {/* Transliteration */}
                          {showTransliteration && ayah.transliteration && (
                            <div className="text-gray-600 italic text-sm mb-3 leading-relaxed">
                              {ayah.transliteration}
                            </div>
                          )}

                          {/* Translation */}
                          {showTranslation && (
                            <div className="text-gray-700 leading-relaxed text-sm">
                              {ayah.translation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Konten tidak tersedia</p>
                    <p className="text-gray-500 text-sm">Pastikan koneksi internet aktif</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            {!showSettings && (
              <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={goToPreviousSurah}
                    disabled={!currentSurah || currentSurah.id <= 1 || loadingSurah}
                    className="flex-1 py-3 rounded-xl disabled:opacity-50 border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Sebelumnya
                  </Button>

                  <Drawer open={showSurahDrawer} onOpenChange={setShowSurahDrawer}>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-4 py-3 rounded-xl border-gray-300"
                      >
                        <List className="w-5 h-5" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh]">
                      <DrawerHeader>
                        <DrawerTitle>Pilih Surah</DrawerTitle>
                      </DrawerHeader>
                      <div className="p-4 border-t border-gray-200">
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari surah..."
                            className="pl-10 py-3 rounded-xl border-gray-300 bg-gray-50"
                          />
                        </div>
                        <ScrollArea className="h-64">
                          <div className="space-y-2">
                            {filteredSurahs.map((surah) => (
                              <button
                                key={surah.id}
                                onClick={() => handleLoadSurah(surah.id)}
                                disabled={loadingSurah}
                                className={`w-full text-left p-3 rounded-xl transition-colors border-2 ${
                                  currentSurah?.id === surah.id
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                                } ${loadingSurah ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-white text-sm font-semibold">{surah.id}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-semibold text-gray-900 truncate text-sm">{surah.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {surah.englishName} • {surah.numberOfAyahs} ayat
                                      </div>
                                    </div>
                                  </div>
                                  <div 
                                    className="text-base text-gray-700 flex-shrink-0 ml-3" 
                                    style={{ fontFamily: "'Amiri', serif" }}
                                  >
                                    {surah.arabicName}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </DrawerContent>
                  </Drawer>

                  <Button
                    variant="outline"
                    onClick={goToNextSurah}
                    disabled={!currentSurah || currentSurah.id >= 114 || loadingSurah}
                    className="flex-1 py-3 rounded-xl disabled:opacity-50 border-gray-300"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}