"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateNotes,
  getScaleInfo,
  getChordIndices,
  KEYS,
  Note,
} from "./theory";
import PianoKey from "./PianoKey";

const KEY_TO_NOTE_INDEX: { [key: string]: number } = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11,
  k: 12, o: 13, l: 14, p: 15, ";": 16, "'": 17,
};

const Piano = () => {
  // --- State ---
  const [notes] = useState<Note[]>(() => generateNotes(2, 4));
  const [selectedKey, setSelectedKey] = useState<string>("C");

  const scaleInfo = useMemo(
    () => getScaleInfo(selectedKey, "Major"),
    [selectedKey],
  );
  const scaleNotes = scaleInfo.notes;
  const scaleDegrees = scaleInfo.degrees;

  const [melodyMode, setMelodyMode] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [scrollRatio, setScrollRatio] = useState<number>(0);
  const [viewportRatio, setViewportRatio] = useState<number>(0.2);
  const [pianoDimensions, setPianoDimensions] = useState({
    whiteKeyWidth: 48,
    whiteKeyHeight: 240,
    blackKeyWidth: 34,
    blackKeyHeight: 160,
  });

  // --- Refs ---
  const audioCache = useRef<{ [filename: string]: HTMLAudioElement }>({});
  // Ref for the scrollable container
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const isSmall = width < 768;
        setIsSmallScreen(isSmall);

        // Calculate responsive key sizes
        const whiteKeysCount = notes.filter((n) => !n.isBlack).length;

        let wkWidth;
        if (isSmall) {
          wkWidth = 44; // Fixed width for mobile to ensure scrollability
        } else {
          // On desktop, we want to fill the available space, but with a reasonable max/min
          wkWidth = Math.max(Math.min(width / whiteKeysCount, 64), 36);
        }

        setPianoDimensions({
          whiteKeyWidth: wkWidth,
          whiteKeyHeight: wkWidth * 5,
          blackKeyWidth: wkWidth * 0.7,
          blackKeyHeight: wkWidth * 3,
        });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [notes]);

  // --- Scroll Tracking ---
  useEffect(() => {
    const scrollEl = mainScrollRef.current;
    if (!scrollEl) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollRatio(scrollLeft / maxScroll);
        setViewportRatio(clientWidth / scrollWidth);
      }
    };

    scrollEl.addEventListener("scroll", handleScroll);
    // Initial calculation
    handleScroll();

    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [isSmallScreen, notes]);

  useEffect(() => {
    notes.forEach((note) => {
      const audio = new Audio(note.filename);
      audio.preload = "auto";
      audioCache.current[note.filename] = audio;
    });
  }, [notes]);


  const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainScrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickRatio = x / rect.width;

    const { scrollWidth, clientWidth } = mainScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    // Center the viewport around the click if possible
    const targetScroll = (clickRatio * scrollWidth) - (clientWidth / 2);

    mainScrollRef.current.scrollTo({
      left: Math.max(0, Math.min(maxScroll, targetScroll)),
      behavior: "smooth",
    });
  };

  // --- Audio Logic ---
  const playSound = (filename: string) => {
    const audio = audioCache.current[filename];
    if (audio) {
      const sound = audio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.6;
      sound.play().catch((e) => console.error("Audio play failed", e));
    }
  };

  const handleNoteTrigger = React.useCallback((note: Note, isPress: boolean) => {
    if (!isPress) {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(note.name);
        return next;
      });
      return;
    }

    if (melodyMode) {
      playSound(note.filename);
      setActiveNotes((prev) => new Set(prev).add(note.name));
    } else {
      const rootIndex = notes.findIndex((n) => n.name === note.name);
      if (rootIndex !== -1) {
        const indices = getChordIndices(rootIndex);
        const notesToPlay = indices.map((i) => notes[i]).filter(Boolean);
        notesToPlay.forEach((n) => playSound(n.filename));
        setActiveNotes((prev) => {
          const next = new Set(prev);
          notesToPlay.forEach((n) => next.add(n.name));
          return next;
        });
      }
    }
  }, [melodyMode, notes]);


  // --- Render Helpers ---
  const renderKeys = () => {
    const elements: React.ReactElement[] = [];
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.isBlack) continue;
      const nextNote = notes[i + 1];
      const hasBlack = nextNote?.isBlack;
      const isDimmed = scaleNotes.length > 0 && !scaleNotes.includes(note.name.replaceAll(/\d/g, ''));
      const degree = scaleDegrees.get(note.name.replaceAll(/\d/g, ''));

      elements.push(
        <div key={note.name} className="relative flex-shrink-0">
          <PianoKey
            note={note}
            isActive={activeNotes.has(note.name)}
            isDimmed={isDimmed}
            showLabel={showNotes}
            degree={degree}
            scaleNotes={scaleNotes}
            onMouseDown={() => handleNoteTrigger(note, true)}
            onMouseUp={() => handleNoteTrigger(note, false)}
            onMouseEnter={() => { }}
          />
          {hasBlack && (
            <div className="absolute top-0 -right-5 z-10" style={{ pointerEvents: "none" }}>
              <div className="pointer-events-auto">
                <PianoKey
                  note={nextNote}
                  isActive={activeNotes.has(nextNote.name)}
                  isDimmed={
                    scaleNotes.length > 0 &&
                    !(scaleNotes.includes(nextNote.sharp!) || scaleNotes.includes(nextNote.flat!))
                  }
                  showLabel={showNotes}
                  degree={scaleDegrees.get(nextNote.sharp!) || scaleDegrees.get(nextNote.flat!)}
                  scaleNotes={scaleNotes}
                  onMouseDown={() => handleNoteTrigger(nextNote, true)}
                  onMouseUp={() => handleNoteTrigger(nextNote, false)}
                  onMouseEnter={() => { }}
                />
              </div>
            </div>
          )}
        </div>,
      );
    }
    return elements;
  };

  // --- Keyboard Mapping ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      const noteIndex = KEY_TO_NOTE_INDEX[key];
      if (noteIndex !== undefined && notes[noteIndex]) {
        handleNoteTrigger(notes[noteIndex], true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const noteIndex = KEY_TO_NOTE_INDEX[key];
      if (noteIndex !== undefined && notes[noteIndex]) {
        handleNoteTrigger(notes[noteIndex], false);
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    globalThis.addEventListener("keyup", handleKeyUp);
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
      globalThis.removeEventListener("keyup", handleKeyUp);
    };
  }, [notes, handleNoteTrigger]);

  return (
    <div
      ref={containerRef}
      style={{
        "--white-key-width": `${pianoDimensions.whiteKeyWidth}px`,
        "--white-key-height": `${pianoDimensions.whiteKeyHeight}px`,
        "--black-key-width": `${pianoDimensions.blackKeyWidth}px`,
        "--black-key-height": `${pianoDimensions.blackKeyHeight}px`,
      } as React.CSSProperties}
      className="w-full bg-[#0A4A62] p-6 sm:p-10 rounded-[32px] flex flex-col gap-6 sm:gap-10 shadow-2xl overflow-hidden border border-white/10"
    >
      {/* --- Header Section --- */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">KEY OF {selectedKey.toUpperCase()}</h1>
        <p className="text-[10px] sm:text-xs font-black text-white/70 tracking-[0.2em] uppercase">
          Melody: Play a melody freely | Chord: Build a chord & play it back
        </p>
      </div>

      {/* --- Top Control Bar --- */}
      <div className="bg-[#1C5D76]/50 p-4 sm:p-6 rounded-[24px] flex flex-wrap items-center justify-between gap-6">
        {/* Left Toggle */}
        <div className="flex flex-col bg-black/20 p-1 rounded-xl w-32 sm:w-40 overflow-hidden">
          <button
            onClick={() => setMelodyMode(true)}
            className={cn(
              "py-3 text-xs font-black uppercase tracking-widest transition-all rounded-lg",
              melodyMode ? "bg-white text-[#0A4A62] shadow-lg" : "text-white/40 hover:text-white"
            )}
          >
            Melody
          </button>
          <button
            onClick={() => setMelodyMode(false)}
            className={cn(
              "py-3 text-xs font-black uppercase tracking-widest transition-all rounded-lg",
              !melodyMode ? "bg-white text-[#0A4A62] shadow-lg" : "text-white/40 hover:text-white"
            )}
          >
            Chord
          </button>
        </div>

        {/* mid section */}


        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="bg-white/10 border border-white/20 px-6 py-2.5 rounded-xl font-black text-xs text-white uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            {showNotes ? "Hide Notes" : "Show Notes"}
          </button>

          <div className="relative group">
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="appearance-none bg-white px-6 py-2.5 pr-12 rounded-xl font-black text-xs text-[#0A4A62] uppercase tracking-widest shadow-xl cursor-pointer focus:outline-none"
            >
              {KEYS.map(k => <option key={k} value={k}>{k} LOOP</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A4A62] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- MINI-MAP NAVIGATION (Visible only on mobile) --- */}
      {isSmallScreen && (
        <div className="w-full flex items-center gap-2 px-2">
          <button
            onClick={() => mainScrollRef.current?.scrollBy({ left: -100, behavior: 'smooth' })}
            className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <ChevronDown className="h-4 w-4 rotate-90" />
          </button>

          <div
            onClick={handleMiniMapClick}
            className="flex-1 h-12 bg-black/40 rounded-lg overflow-hidden border border-white/10 relative cursor-pointer group"
          >
            {/* The Mini Keyboard Strip */}
            <div className="flex w-full h-full opacity-60 pointer-events-none">
              {notes.map((note, i) => (
                <div
                  key={`mini-${i}`}
                  className={cn(
                    "flex-1 border-r border-black/20 last:border-0",
                    note.isBlack ? "bg-gray-800 h-3/5" : "bg-white h-full"
                  )}
                />
              ))}
            </div>

            {/* Viewport Highlight Overlay */}
            <div
              className="absolute top-0 bottom-0 bg-white/30 border-x border-white/50 backdrop-blur-[1px] transition-all duration-75 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              style={{
                left: `${scrollRatio * (1 - viewportRatio) * 100}%`,
                width: `${viewportRatio * 100}%`
              }}
            />
          </div>

          <button
            onClick={() => mainScrollRef.current?.scrollBy({ left: 100, behavior: 'smooth' })}
            className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>
        </div>
      )}

      {/* --- MAIN PIANO ROLL --- */}
      <div className="relative group">
        {/* Left Scroll Indicator Gradient */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#0F5F85] to-transparent z-20 pointer-events-none opacity-60" />

        <div
          ref={mainScrollRef}
          className={cn(
            "flex overflow-x-auto pb-6 pt-2 scrollbar-hide touch-pan-x snap-proximity snap-x",
            isSmallScreen ? "px-4" : "px-0 justify-center"
          )}
        >
          <div
            className="flex relative items-start"
            style={{ height: "var(--white-key-height)" }}
          >
            {renderKeys()}
          </div>
        </div>

        {/* Right Scroll Indicator Gradient */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#0F5F85] to-transparent z-20 pointer-events-none opacity-60" />

        {/* Swipe Hint Label */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] text-white uppercase font-bold tracking-tighter">Slide for more keys</span>
          <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-75" />
        </div>
      </div>

      {/* --- Orientation Warning --- */}
      {/* {isSmallScreen && (
        <div className="fixed inset-0 z-[100] bg-[#0F5F85]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 mb-4 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 border-2 border-[#D4AF37] rounded-lg rotate-90 flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-xl">!</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Better Experience Awaits</h2>
          <p className="text-[#4A9AC1] font-medium max-w-xs mb-6">Please tilt your device to landscape mode for the best piano experience.</p>
          <button
            onClick={() => setIsSmallScreen(false)}
            className="px-8 py-3 bg-[#D4AF37] text-black rounded-full font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
          >
            Continue anyway
          </button>
        </div>
      )} */}
    </div>
  );
};

export default Piano;