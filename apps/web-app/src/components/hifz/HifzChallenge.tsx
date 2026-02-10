import { useState } from "react";
import { X, Flame, Lightbulb, Languages, Play, Check, X as XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

interface HifzChallengeProps {
  onClose: () => void;
}

export function HifzChallenge({ onClose }: HifzChallengeProps) {
  const { data: questions, isLoading } = trpc.quran.getHifzChallenge.useQuery(
    { count: 5 },
    { retry: false }
  );
  const { data: gamification } = trpc.user.getGamification.useQuery(undefined, {
    retry: false,
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const streak = gamification?.currentStreak ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading challenge...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-lg font-semibold text-foreground mb-2">No questions available</p>
        <p className="text-sm text-muted-foreground mb-4">Please try again later.</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === question.missingWord;

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === question.missingWord) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setShowTranslation(false);
    } else {
      onClose();
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return "bg-card border-2 border-transparent hover:border-primary/30";
    }
    if (option === question.missingWord) {
      return "bg-primary/10 border-2 border-primary";
    }
    if (option === selectedAnswer && option !== question.missingWord) {
      return "bg-destructive/10 border-2 border-destructive";
    }
    return "bg-card border-2 border-transparent opacity-50";
  };

  const hint = `${question.surahName} ${question.surahNumber}:${question.ayahNumber}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="p-2 -ml-2 text-foreground">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Daily Hifz Challenge</h1>
          <div className="flex items-center gap-1 bg-streak/10 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-streak" />
            <span className="text-sm font-bold text-streak">{streak}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">
            {currentQuestion + 1}/{questions.length} Ayahs
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Verse Card */}
      <div className="mx-5 bg-emerald-light rounded-2xl p-6 mb-6">
        <div className="h-1 w-full bg-primary rounded-full mb-6" />
        <p
          className="text-2xl leading-loose text-center font-arabic text-foreground"
          dir="rtl"
        >
          {showResult
            ? question.verse.replace("؟؟؟", question.missingWord)
            : question.verse}
        </p>
        {showResult && (
          <div
            className={cn(
              "mt-4 flex items-center justify-center gap-2",
              isCorrect ? "text-primary" : "text-destructive"
            )}
          >
            {isCorrect ? (
              <>
                <Check className="w-5 h-5" />
                <span className="font-medium">Correct!</span>
              </>
            ) : (
              <>
                <XIcon className="w-5 h-5" />
                <span className="font-medium">The answer is: {question.missingWord}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectAnswer(option)}
            disabled={showResult}
            className={cn(
              "p-5 rounded-2xl card-shadow transition-all",
              getOptionStyle(option)
            )}
          >
            <p className="text-xl font-arabic text-foreground" dir="rtl">
              {option}
            </p>
          </button>
        ))}
      </div>

      {/* Helper buttons */}
      <div className="px-5 flex items-center justify-between mb-6">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">Show Hint</span>
        </button>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Languages className="w-4 h-4" />
          <span className="text-sm font-medium">Translation</span>
        </button>
      </div>

      {/* Hint/Translation display */}
      {(showHint || showTranslation) && (
        <div className="px-5 mb-6">
          <div className="bg-muted rounded-xl p-4">
            {showHint && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Hint:</span> {hint}
              </p>
            )}
            {showTranslation && question.translation && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-semibold">Translation:</span> {question.translation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Continue button */}
      <div className="flex-1" />
      {showResult && (
        <div className="px-5 pb-28">
          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto card-shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="w-6 h-6 text-primary-foreground" fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}
