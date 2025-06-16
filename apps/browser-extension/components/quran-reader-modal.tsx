import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Copy,
  Share2,
  RotateCcw,
  Menu,
  X,
  Bookmark,
  BookmarkCheck,

  List,
  Settings,
  ZoomIn,
  Eye,
  EyeOff,
  Leaf,
  TreePine
} from 'lucide-react';
import { useQuranData, type Surah, type Ayah } from '../hooks/use-quran-data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Skeleton } from './ui/skeleton';

interface QuranReaderModalProps {
  onClose?: () => void;
}

export function QuranReaderModal({ onClose }: QuranReaderModalProps) {
  const {
    surahs,
    loading,
    error,
    apiStatus,
    loadSurahContent,
    refetch
  } = useQuranData();

  // State management
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [showSurahList, setShowSurahList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(new Set());
  const [fontSize, setFontSize] = useState([20]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation state
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Prevent background scroll when mobile surah list is open
  useEffect(() => {
    if (showSurahList && window.innerWidth < 1024) { // lg breakpoint
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showSurahList]);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      if (saved) {
        const bookmarks = JSON.parse(saved);
        const bookmarkSet = new Set(bookmarks.map((b: any) => `${b.surah}:${b.ayah}`));
        setBookmarkedAyahs(bookmarkSet as Set<string>);
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
        // Keep sidebar open - don't auto close
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
    navigator.clipboard.writeText(text).then(() => {
      alert('Ayah copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
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

  // Handle close with animation
  const handleClose = useCallback(() => {
    // Reset body overflow when closing
    document.body.style.overflow = 'unset';
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  // Filter surahs based on search
  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.includes(searchQuery)
  );

  // Loading Skeleton Component for Initial Load - Accurate Structure
  const InitialLoadingSkeleton = () => (
    <div 
      className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`bg-card border rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 transition-all duration-500 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        <div className="text-center space-y-4">
          {/* Icon Container - exact size */}
          <div className="w-16 h-16 mx-auto">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          
          {/* Title - "Loading Al-Quran" */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 mx-auto" />
            {/* Subtitle - "Preparing your reading experience..." */}
            <Skeleton className="h-4 w-56 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );

  // Surah Header Loading Skeleton - Matches exact structure (now inside scroll area)
  const SurahHeaderSkeleton = () => (
    <div className="border-b p-6 bg-card">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {/* Arabic Name - Large text */}
        <Skeleton className="h-8 w-48 mx-auto" />
        
        {/* English Name - Main title */}
        <Skeleton className="h-6 w-32 mx-auto" />
        
        {/* Transliteration */}
        <Skeleton className="h-4 w-28 mx-auto" />
        
        {/* Meta badges */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Description */}
        <div className="pt-2 space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mx-auto" />
          <Skeleton className="h-3 w-5/6 mx-auto" />
        </div>
      </div>
    </div>
  );

  // Ayah Content Loading Skeleton - Exact ayah structure
  const AyahContentSkeleton = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Multiple ayah skeletons */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="border-l-4 border-l-muted rounded-r p-4 bg-transparent space-y-4">
          {/* Ayah Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Ayah number circle */}
              <Skeleton className="w-8 h-8 rounded-full" />
              {/* "Ayah X of Y" text */}
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
          
          {/* Arabic Text - Right aligned, multiple lines */}
          <div className="space-y-2 text-right">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-11/12 ml-auto" />
            <Skeleton className="h-7 w-5/6 ml-auto" />
            {index % 2 === 0 && <Skeleton className="h-7 w-4/5 ml-auto" />}
          </div>
          
          {/* Translation Box */}
          <div className="pt-3 border-t border-muted space-y-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              {index % 3 === 0 && <Skeleton className="h-4 w-4/5" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Sidebar Loading Skeleton - Exact surah list structure
  const SidebarLoadingSkeleton = () => (
    <div className="p-4 space-y-2">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="p-3 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {/* Surah number */}
                <Skeleton className="w-6 h-6 rounded" />
                {/* Surah name */}
                <Skeleton className="h-4 w-20" />
                {/* Available badge */}
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
              {/* Subtitle: English name • X ayahs • Type */}
              <Skeleton className="h-3 w-40" />
            </div>
            {/* Arabic name */}
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  // Loading state for surah switching - Header now inside scroll area
  const SurahSwitchingSkeleton = () => (
    <div className="flex-1 flex flex-col">
      {/* Content Loading with Header inside ScrollArea */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto">
            {/* Surah Header Skeleton */}
            <SurahHeaderSkeleton />
            {/* Ayah Content Skeleton */}
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border-l-4 border-l-muted rounded-r p-4 bg-transparent space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-11/12 ml-auto" />
                    <Skeleton className="h-7 w-5/6 ml-auto" />
                  </div>
                  <div className="pt-3 border-t border-muted space-y-2">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Bottom Navigation Skeleton */}
      <div className="border-t p-4 bg-card">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Skeleton className="h-9 w-24 rounded-md" />
          <div className="text-center space-y-1">
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-1 w-32 rounded-full" />
          </div>
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <InitialLoadingSkeleton />;
  }

  if (error) {
    return (
      <div 
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`bg-card border rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Unable to Load</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={refetch} size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`h-full flex flex-col transition-all duration-500 ease-out ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Header - Removed sticky positioning */}
        <div className="border-b bg-card/95 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {/* Menu button for mobile/tablet to show surah list */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSurahList(!showSurahList)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {/* Desktop sidebar toggle */}
              {!showSurahList && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSurahList(true)}
                  className="hidden lg:flex text-muted-foreground hover:text-foreground"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Al-Quran Reader</h2>
                  {currentSurah && (
                    <p className="text-sm text-muted-foreground">
                      {currentSurah.name} • {currentSurah.numberOfAyahs} Ayahs
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Removed status badge */}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className={`text-muted-foreground hover:text-foreground ${
                  showSettings ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          <div className={`border-t bg-muted/50 transition-all duration-300 overflow-hidden ${
            showSettings ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <ZoomIn className="w-4 h-4" />
                    Font Size: {fontSize[0]}px
                  </label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    max={32}
                    min={14}
                    step={2}
                    className="w-full"
                  />
                </div>

                {/* Translation Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Eye className="w-4 h-4" />
                    Translation
                  </label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showTranslation}
                      onCheckedChange={setShowTranslation}
                    />
                    <span className="text-sm text-muted-foreground">
                      {showTranslation ? 'Shown' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Transliteration Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <EyeOff className="w-4 h-4" />
                    Transliteration
                  </label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showTransliteration}
                      onCheckedChange={setShowTransliteration}
                    />
                    <span className="text-sm text-muted-foreground">
                      {showTransliteration ? 'Shown' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Hidden on mobile/tablet, only show on desktop */}
          <div className={`hidden lg:flex border-r bg-card/50 backdrop-blur-sm flex-col transition-all duration-500 ease-out ${
            showSurahList ? 'w-80 opacity-100' : 'w-0 opacity-0'
          }`}>
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-medium text-foreground">Surahs</h3>
                  <Badge variant="secondary" className="text-xs">
                    {surahs.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSurahList(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search surahs..."
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1" style={{ overflow: 'scroll' }}>
              {loading ? (
                <SidebarLoadingSkeleton />
              ) : (
                <div className="p-4 space-y-2 overflow-scroll">
                  {filteredSurahs.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => handleLoadSurah(surah.id)}
                      disabled={loadingSurah}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                        currentSurah?.id === surah.id
                          ? 'bg-emerald-50 border-emerald-200 shadow-lg dark:bg-emerald-950 dark:border-emerald-800'
                          : 'bg-card hover:bg-accent border-border'
                      } ${loadingSurah ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {surah.id}
                            </div>
                            <span className="font-medium truncate text-foreground">
                              {surah.name}
                            </span>
                            {surah.ayahs.length > 0 && (
                              <Badge variant="outline" className="text-xs text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                                Available
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {surah.englishName} • {surah.numberOfAyahs} ayahs • {surah.revelationType}
                          </div>
                        </div>
                        <div className="text-right text-lg font-arabic text-muted-foreground" style={{ fontFamily: "'Amiri', serif" }}>
                          {surah.arabicName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Mobile/Tablet Surah List Overlay - Full Height */}
          {showSurahList && (
            <div 
              className="lg:hidden fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSurahList(false)}
            >
              <div className="h-full flex">
                <div 
                  className="w-full bg-card rounded-t-3xl flex flex-col"
                  style={{ height: '100vh' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile Surah List Header - Fixed */}
                  <div className="flex-shrink-0 p-4 border-b bg-muted/30 rounded-t-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <List className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-medium text-foreground">Pilih Surah</h3>
                        <Badge variant="secondary" className="text-xs">
                          {surahs.length}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSurahList(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari surah..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Mobile Surah List Content - Scrollable */}
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin mobile-scroll">
                    {loading ? (
                      <SidebarLoadingSkeleton />
                    ) : (
                      <div className="p-4 space-y-2">
                        {filteredSurahs.map((surah) => (
                          <button
                            key={surah.id}
                            onClick={() => {
                              handleLoadSurah(surah.id);
                              setShowSurahList(false); // Close overlay after selection
                            }}
                            disabled={loadingSurah}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                              currentSurah?.id === surah.id
                                ? 'bg-emerald-50 border-emerald-200 shadow-lg dark:bg-emerald-950 dark:border-emerald-800'
                                : 'bg-card hover:bg-accent border-border hover:border-emerald-200'
                            } ${loadingSurah ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                                  {surah.id}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium truncate text-foreground text-base">
                                    {surah.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {surah.englishName} • {surah.numberOfAyahs} ayat • {surah.revelationType}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-lg font-arabic text-muted-foreground flex-shrink-0 ml-3" style={{ fontFamily: "'Amiri', serif" }}>
                                {surah.arabicName}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-background">
            {loadingSurah ? (
              <SurahSwitchingSkeleton />
            ) : currentSurah ? (
              <>
                {/* Ayahs Content with Surah Header inside ScrollArea */}
                <div className="flex-1 overflow-hidden">
                  {currentSurah.ayahs.length > 0 ? (
                    <ScrollArea className="h-full">
                      <div className="max-w-4xl mx-auto">
                        {/* Surah Header - now inside scroll area */}
                        <div className="border-b p-6 bg-card">
                          <div className="text-center max-w-2xl mx-auto">
                            <div className="text-3xl font-arabic mb-2 text-foreground" style={{ fontFamily: "'Amiri', serif" }}>
                              {currentSurah.arabicName}
                            </div>
                            <h1 className="text-xl font-semibold mb-1 text-foreground">{currentSurah.name}</h1>
                            <p className="text-muted-foreground mb-3">{currentSurah.englishName}</p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                              <span className="px-3 py-1 bg-muted rounded-full">
                                {currentSurah.numberOfAyahs} Ayahs
                              </span>
                              <span className="px-3 py-1 bg-muted rounded-full">
                                {currentSurah.revelationType}
                              </span>
                            </div>
                            {currentSurah.description && (
                              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                {currentSurah.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Ayahs */}
                        <div className="p-6 space-y-4">
                          {currentSurah.ayahs.map((ayah) => {
                            const isBookmarked = bookmarkedAyahs.has(`${currentSurah.id}:${ayah.number}`);
                            const isSelected = selectedAyah === ayah.number;
                            
                            return (
                              <div
                                key={ayah.number}
                                className={`group border-l-4 rounded-r p-4 cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/50'
                                    : 'border-l-muted hover:border-l-emerald-300 hover:bg-muted/30 bg-transparent'
                                }`}
                                onClick={() => setSelectedAyah(isSelected ? null : ayah.number)}
                              >
                                {/* Ayah Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-sm font-medium">
                                      {ayah.number}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(currentSurah.id, ayah.number);
                                      }}
                                      className={`h-7 w-7 p-0 rounded transition-colors ${
                                        isBookmarked 
                                          ? 'text-amber-600 hover:text-amber-700' 
                                          : 'text-muted-foreground hover:text-foreground'
                                      }`}
                                    >
                                      {isBookmarked ? (
                                        <BookmarkCheck className="w-4 h-4" />
                                      ) : (
                                        <Bookmark className="w-4 h-4" />
                                      )}
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyAyah(ayah, currentSurah);
                                      }}
                                      className="h-7 w-7 p-0 rounded text-muted-foreground hover:text-foreground transition-colors"
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
                                      className="h-7 w-7 p-0 rounded text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Arabic Text */}
                                <div 
                                  className="text-right mb-3 leading-loose font-arabic text-foreground"
                                  style={{ 
                                    fontSize: `${fontSize[0]}px`,
                                    fontFamily: "'Amiri', 'Noto Sans Arabic', serif",
                                    lineHeight: '1.8'
                                  }}
                                  dir="rtl"
                                  lang="ar"
                                >
                                  {ayah.arabic}
                                </div>

                                {/* Transliteration */}
                                {showTransliteration && ayah.transliteration && (
                                  <div className="mb-3 pb-3 border-b border-muted">
                                    <p className="text-sm text-muted-foreground italic">
                                      {ayah.transliteration}
                                    </p>
                                  </div>
                                )}

                                {/* Translation */}
                                {showTranslation && (
                                  <div className="mt-3 pt-3 border-t border-muted">
                                    <p className="text-muted-foreground leading-relaxed">
                                      {ayah.translation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center max-w-md space-y-3">
                        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">Content Not Available</h3>
                          <p className="text-sm text-muted-foreground">
                            Ayahs for {currentSurah.name} are not available in {apiStatus === 'fallback' ? 'offline mode' : 'current mode'}
                          </p>
                          {apiStatus !== 'online' && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Try connecting to the internet for full content
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="border-t p-4 bg-card">
                  <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const prevSurah = surahs.find(s => s.id === currentSurah.id - 1);
                        if (prevSurah) handleLoadSurah(prevSurah.id);
                      }}
                      disabled={currentSurah.id <= 1 || loadingSurah}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">
                        Surah {currentSurah.id} of 114
                      </div>
                      <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500 ease-out"
                          style={{ width: `${(currentSurah.id / 114) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        const nextSurah = surahs.find(s => s.id === currentSurah.id + 1);
                        if (nextSurah) handleLoadSurah(nextSurah.id);
                      }}
                      disabled={currentSurah.id >= 114 || loadingSurah}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // Welcome Screen
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-auto p-8">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-emerald-50 dark:bg-emerald-950 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-lg">
                      <BookOpen className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Leaf className="w-8 h-8 text-emerald-500 animate-float" />
                    </div>
                    <div className="absolute -bottom-1 -left-1">
                      <TreePine className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-xiaomiFloat" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Selamat Datang di Al-Quran Reader</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Pilih surah untuk memulai perjalanan spiritual Anda melalui Al-Quran.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>📖</span>
                      <span>114 Surah Tersedia</span>
                      <span>•</span>
                      <span>6,236 Ayat</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!showSurahList && (
                      <Button 
                        onClick={() => setShowSurahList(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                      >
                        <List className="w-4 h-4 mr-2" />
                        Lihat Daftar Surah
                      </Button>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Gunakan menu untuk menjelajahi dan memilih surah</p>
                    </div>
                  </div>

                  {/* Quick access buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => handleLoadSurah(1)}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-foreground hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 text-sm"
                    >
                      Al-Fatihah
                      <br />
                      <span className="text-xs text-muted-foreground">Chapter 1</span>
                    </button>
                    <button
                      onClick={() => handleLoadSurah(2)}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-foreground hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 text-sm"
                    >
                      Al-Baqarah
                      <br />
                      <span className="text-xs text-muted-foreground">Chapter 2</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}