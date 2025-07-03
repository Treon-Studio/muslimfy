"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import googleLogo from '@/assets/GoogleLogo.png';

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the interval when the tab is not visible
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation(); // Restart the interval when the tab becomes visible
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
    ctx.fillStyle = "#000";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const performGoogleSearch = (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Encode the search query to handle special characters
      const encodedQuery = encodeURIComponent(query.trim());
      // Create Google search URL
      const googleSearchUrl = `https://www.google.com/search?q=${encodedQuery}`;
      // Open in new tab
      window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error performing Google search:', error);
      // Fallback: try direct navigation
      const fallbackUrl = `https://www.google.com/search?q=${query.trim().replace(/\s+/g, '+')}`;
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const vanishAndSubmit = () => {
    const currentValue = inputRef.current?.value?.trim() || "";
    
    if (!currentValue) {
      // If no value, just focus the input
      inputRef.current?.focus();
      return;
    }

    setAnimating(true);
    draw();

    if (currentValue && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      
      // Start the vanish animation
      animate(maxX);
      
      // Perform Google search after a short delay to let animation start
      setTimeout(() => {
        performGoogleSearch(currentValue);
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Call the original onSubmit if provided
    if (onSubmit) {
      onSubmit(e);
    }
    
    // Always perform Google search
    vanishAndSubmit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!animating) {
      setValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    }
  };

  return (
    <form
      className={cn(
        "w-full relative mx-auto transition-all duration-300",
        // Responsive width adjustments
        "max-w-[350px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px]",
        // Height adjustments
        "h-14 sm:h-16",
        // White background styling without border
        "bg-white",
        "rounded-full overflow-hidden",
        // Enhanced shadows for depth without border
        "shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
        // Focus state enhancement
        value && "shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
        // Dark mode support - keeping white for consistency
        "dark:bg-white",
        // Inter font family
        "font-['Inter',system-ui,sans-serif]"
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left pr-20",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      <input
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        autoComplete="off"
        spellCheck="false"
        className={cn(
          "w-full relative z-50 border-none bg-transparent h-full rounded-full focus:outline-none focus:ring-0 transition-all duration-200",
          // Text styling for white background with Inter font
          "text-gray-900 placeholder:text-gray-500 text-sm sm:text-base",
          "font-['Inter',system-ui,sans-serif] font-normal",
          // Enhanced font rendering
          "antialiased tracking-normal leading-relaxed",
          // Padding adjustments for Google button
          "pl-5 sm:pl-8 pr-16 sm:pr-18",
          // Animation states
          animating && "text-transparent",
          // Focus states
          "focus:placeholder:text-gray-400"
        )}
      />

      {/* Google Search Button with Official Logo */}
      <motion.button
        disabled={!value || animating}
        type="submit"
        whileHover={{ scale: value && !animating ? 1.05 : 1 }}
        whileTap={{ scale: value && !animating ? 0.95 : 1 }}
        className={cn(
          "absolute right-2 sm:right-3 top-1/2 z-50 -translate-y-1/2 transition-all duration-200",
          // Google button styling
          "h-11 w-11 sm:h-12 sm:w-12 rounded-full",
          "flex items-center justify-center",
          // White background for Google logo contrast
          "bg-white hover:bg-gray-50",
          "disabled:bg-white/50 disabled:hover:bg-white/50",
          // Enhanced shadows for Google style
          "shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
          "disabled:shadow-[0_2px_8px_rgba(0,0,0,0.1)]",
          // Border for depth
          "border border-gray-200 hover:border-gray-300",
          "disabled:border-gray-200/50",
          // Cursor states
          value && !animating ? "cursor-pointer" : "cursor-default"
        )}
        title={value ? "Search Google" : "Enter search query"}
      >
        {/* Official Google Logo */}
        <motion.img
          src={googleLogo}
          alt="Google Search"
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
            "object-contain",
            !value && "opacity-60",
            value && !animating && "opacity-100",
            animating && "opacity-40"
          )}
          animate={{
            scale: value && !animating ? 1 : 0.9,
            opacity: animating ? 0.4 : value ? 1 : 0.6
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        />
      </motion.button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className={cn(
                "text-gray-500 font-normal text-left truncate transition-colors duration-200",
                // Inter font family and enhanced typography
                "font-['Inter',system-ui,sans-serif] antialiased tracking-normal",
                // Responsive text sizing
                "text-sm sm:text-base",
                // Padding adjustments
                "pl-5 sm:pl-8 w-[calc(100%-4rem)] sm:w-[calc(100%-5rem)]",
                // Hover effects
                "group-hover:text-gray-400"
              )}
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}