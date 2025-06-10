import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Book, ChevronDown, BookOpen, X, Heart, Share, Star, Moon } from 'lucide-react';

interface Verse {
  arabic: string;
  translation: string;
  context: string;
  ayah: number;
}

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  totalAyahs: number;
  verses: Verse[];
}

const surahs: Surah[] = [
  {
    id: 65,
    name: "At-Talaq",
    arabicName: "الطلاق",
    totalAyahs: 12,
    verses: [
      {
        arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        translation: "And whoever relies upon Allah - then He is sufficient for him.",
        context: "This verse reminds us that complete trust and reliance on Allah brings peace and sufficiency in all aspects of life.",
        ayah: 3
      },
      {
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        translation: "And whoever fears Allah - He will make for him a way out.",
        context: "Allah promises that those who are conscious of Him will find solutions to their difficulties.",
        ayah: 2
      }
    ]
  },
  {
    id: 2,
    name: "Al-Baqarah",
    arabicName: "البقرة",
    totalAyahs: 286,
    verses: [
      {
        arabic: "وَبَشِّرِ الصَّابِرِينَ",
        translation: "And give good tidings to the patient.",
        context: "Allah encourages patience and promises good news for those who persevere through difficulties.",
        ayah: 155
      },
      {
        arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
        translation: "And seek help through patience and prayer.",
        context: "The combination of patience and prayer is prescribed as a source of strength and guidance.",
        ayah: 45
      }
    ]
  },
  {
    id: 94,
    name: "Ash-Sharh",
    arabicName: "الشرح",
    totalAyahs: 8,
    verses: [
      {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "For indeed, with hardship [will be] ease.",
        context: "This powerful reminder assures us that every difficulty is followed by relief and ease.",
        ayah: 5
      },
      {
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Indeed, with hardship [will be] ease.",
        context: "The repetition emphasizes Allah's promise that ease will come after every hardship.",
        ayah: 6
      }
    ]
  }
];

export function VerseOfTheDay() {
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const [showFullSurah, setShowFullSurah] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const currentSurah = surahs[currentSurahIndex];
  const currentVerse = currentSurah.verses[currentVerseIndex];
  
  const canGoPrev = currentVerseIndex > 0;
  const canGoNext = currentVerseIndex < currentSurah.verses.length - 1;

  const handlePrevVerse = () => {
    if (canGoPrev) {
      setCurrentVerseIndex(prev => prev - 1);
    }
  };

  const handleNextVerse = () => {
    if (canGoNext) {
      setCurrentVerseIndex(prev => prev + 1);
    }
  };

  const handleSurahChange = (surahIndex: number) => {
    setCurrentSurahIndex(surahIndex);
    setCurrentVerseIndex(0);
    setShowSurahSelector(false);
  };

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden h-full bg-gradient-to-br from-slate-50/95 via-white/95 to-emerald-50/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        {/* Enhanced glassmorphism layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-emerald-100/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/5 via-transparent to-blue-800/5"></div>
        
        {/* Elegant floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-400/8 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 bg-blue-400/6 rounded-full animate-ping blur-lg" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-emerald-300/10 rounded-full animate-bounce blur-sm" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-200/15 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative p-5 h-full flex flex-col">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/15 to-blue-500/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                  <Book className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              </div>
              <div>
                <h2 className="text-slate-800 font-semibold tracking-wide">Verse of the Day</h2>
                <button
                  onClick={() => setShowSurahSelector(!showSurahSelector)}
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-emerald-600 transition-all duration-200 group"
                >
                  <span className="font-medium">Surah {currentSurah.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 group-hover:scale-110 ${showSurahSelector ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Compact action buttons */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-500/15 text-red-500 border border-red-200/50 scale-105' 
                    : 'bg-white/30 text-slate-500 border border-white/20 hover:bg-white/50 hover:scale-105'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="w-8 h-8 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-all duration-300 border border-white/20 hover:scale-105 group">
                <Share className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-600" />
              </button>
              
              <button
                onClick={() => setShowFullSurah(true)}
                className="w-8 h-8 rounded-xl bg-emerald-500/15 backdrop-blur-sm text-emerald-600 flex items-center justify-center transition-all duration-300 border border-emerald-200/50 hover:bg-emerald-500/25 hover:scale-105"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Enhanced Surah selector dropdown */}
          {showSurahSelector && (
            <div className="absolute top-16 left-5 right-5 z-20 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl max-h-40 overflow-y-auto">
              {surahs.map((surah, index) => (
                <button
                  key={surah.id}
                  onClick={() => handleSurahChange(index)}
                  className={`w-full text-left px-4 py-3 hover:bg-emerald-50/80 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl group ${
                    index === currentSurahIndex ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-400' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold group-hover:text-emerald-600 transition-colors text-sm">{surah.name}</div>
                      <div className="text-xs text-slate-500">{surah.totalAyahs} verses</div>
                    </div>
                    <div className="text-right" dir="rtl">
                      <div className="text-sm font-medium text-slate-600">{surah.arabicName}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Compact main content */}
          <div className="flex-1 flex flex-col justify-center space-y-4 relative">
            {/* Compact verse indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200/50 backdrop-blur-sm">
                <Star className="w-3 h-3" />
                <span>Ayah {currentVerse.ayah}</span>
                <span className="text-emerald-400">•</span>
                <span className="text-xs text-slate-500">{currentVerseIndex + 1}/{currentSurah.verses.length}</span>
              </div>
            </div>

            {/* Compact Arabic text */}
            <div className="relative">
              <blockquote 
                className="text-2xl text-slate-800 leading-[1.6] font-light text-center px-3 relative" 
                dir="rtl"
                lang="ar"
                style={{ fontFamily: "'Amiri', 'Noto Sans Arabic', serif" }}
              >
                <span className="relative z-10">"{currentVerse.arabic}"</span>
                {/* Smaller decorative quotation marks */}
                <div className="absolute top-0 left-0 text-4xl text-emerald-200/30 leading-none select-none pointer-events-none">"</div>
                <div className="absolute bottom-0 right-0 text-4xl text-emerald-200/30 leading-none select-none pointer-events-none" style={{ transform: 'rotate(180deg)' }}>"</div>
              </blockquote>
            </div>
            
            {/* Compact English translation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/60 via-white/40 to-emerald-50/30 backdrop-blur-sm rounded-xl p-4 mx-2 border border-white/30 shadow-lg">
                <p className="text-base text-slate-700 leading-relaxed text-center font-medium">
                  "{currentVerse.translation}"
                </p>
                {/* Subtle decorative elements */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-300/40 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-300/40 rounded-full"></div>
              </div>
            </div>
            
            {/* Compact Context */}
            <div className="relative px-4">
              <p className="text-sm text-slate-600 leading-relaxed text-center max-w-md mx-auto">
                {currentVerse.context}
              </p>
            </div>
            
            {/* Compact Source citation */}
            <div className="text-center pt-2">
              <cite className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100/80 to-emerald-100/60 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-700 border border-white/30 shadow-sm">
                <Moon className="w-3 h-3 text-emerald-500 mr-2" />
                <span>Surah {currentSurah.name} ({currentSurah.id}:{currentVerse.ayah})</span>
              </cite>
            </div>

            {/* Compact Navigation controls */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handlePrevVerse}
                disabled={!canGoPrev}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  canGoPrev 
                    ? 'bg-white/40 hover:bg-white/60 text-slate-600 border border-white/30 hover:scale-110 shadow-lg' 
                    : 'bg-slate-100/40 text-slate-400 cursor-not-allowed border border-slate-200/30'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              <div className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="text-xs text-slate-600 font-medium">
                  {currentVerseIndex + 1} of {currentSurah.verses.length}
                </span>
              </div>
              
              <button
                onClick={handleNextVerse}
                disabled={!canGoNext}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  canGoNext 
                    ? 'bg-white/40 hover:bg-white/60 text-slate-600 border border-white/30 hover:scale-110 shadow-lg' 
                    : 'bg-slate-100/40 text-slate-400 cursor-not-allowed border border-slate-200/30'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced overlay when selector is open */}
        {showSurahSelector && (
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10"
            onClick={() => setShowSurahSelector(false)}
          />
        )}
      </div>

      {/* Enhanced Full Surah Modal */}
      {showFullSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Enhanced Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-gradient-to-r from-emerald-50/80 via-white/80 to-blue-50/80">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/15 to-blue-500/15 rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                  <BookOpen className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                    Surah {currentSurah.name}
                  </h2>
                  <p className="text-sm text-slate-600 flex items-center gap-2" dir="rtl">
                    <span className="text-lg font-medium">{currentSurah.arabicName}</span>
                    <span className="text-slate-400">•</span>
                    <span>{currentSurah.totalAyahs} verses</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullSurah(false)}
                className="w-10 h-10 rounded-xl bg-white/60 hover:bg-white/80 flex items-center justify-center transition-all duration-200 border border-white/30 hover:scale-105"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Enhanced Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-8">
                {currentSurah.verses.map((verse, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      index === currentVerseIndex 
                        ? 'bg-gradient-to-br from-emerald-50 to-blue-50/50 border-emerald-200 shadow-lg scale-[1.02]' 
                        : 'bg-white/60 border-slate-200/50 hover:bg-slate-50/80 hover:border-slate-300/50'
                    }`}
                  >
                    {/* Enhanced Verse number */}
                    <div className="flex justify-center mb-6">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-sm font-semibold text-slate-700 border border-white/40 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Ayah {verse.ayah}</span>
                      </span>
                    </div>

                    {/* Enhanced Arabic text */}
                    <blockquote 
                      className="text-2xl text-slate-800 leading-[1.8] font-light text-center mb-6" 
                      dir="rtl"
                      lang="ar"
                      style={{ fontFamily: "'Amiri', 'Noto Sans Arabic', serif" }}
                    >
                      "{verse.arabic}"
                    </blockquote>
                    
                    {/* Enhanced Translation */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/40">
                      <p className="text-lg text-slate-700 leading-relaxed text-center font-medium">
                        "{verse.translation}"
                      </p>
                    </div>
                    
                    {/* Enhanced Context */}
                    <p className="text-sm text-slate-600 leading-relaxed text-center px-4">
                      {verse.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}