// src/components/website/Common/piano/piano.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateNotes, getScaleInfo, KEYS, Note } from "./theory";
import PianoKey from "./PianoKey";
import Image from "next/image";

const KEY_TO_NOTE_INDEX: { [key: string]: number } = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
  o: 13,
  l: 14,
  p: 15,
  ";": 16,
  "'": 17,
  z: 18,
  x: 19,
  c: 20,
  v: 21,
  b: 22,
  n: 23,
  m: 24,
  ",": 25,
  ".": 26,
  "/": 27,
  q: 28,
  "2": 29,
  "3": 30,
  "4": 31,
  "5": 32,
  "6": 33,
  "7": 34,
  "8": 35,
  "9": 36,
};

interface PianoProps {
  targetNotes?: string[];
  onSuccess?: () => void;
}

const Piano: React.FC<PianoProps> = ({ targetNotes, onSuccess }) => {
  // --- State ---
  const [selectedKey, setSelectedKey] = useState<string>("C");

  // Physically rotate the keyboard starting from selectedKey
  const notes = useMemo(() => generateNotes(selectedKey), [selectedKey]);

  const { degrees: scaleDegrees } = useMemo(
    () => getScaleInfo(selectedKey, "Major"),
    [selectedKey],
  );

  const [melodyMode, setMelodyMode] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [trackerNotes, setTrackerNotes] = useState<Set<string>>(new Set());

  const [sequenceBuffer, setSequenceBuffer] = useState<Note[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  const [scrollRatio, setScrollRatio] = useState<number>(0);
  const [viewportRatio, setViewportRatio] = useState<number>(0.2);

  // --- Refs ---
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<{ [filename: string]: AudioBuffer }>({});
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Ensure AudioContext is initialized and resumed
  const ensureAudioContext = React.useCallback(async () => {
    audioContextRef.current ??= new (
      globalThis.AudioContext ||
      (
        globalThis as unknown as Window & {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext
    )();

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const audioHardStop = () => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Source might have already stopped
      }
    });
    activeSourcesRef.current.clear();
  };

  const handleKeyChange = (newKey: string) => {
    audioHardStop();
    setSelectedKey(newKey);
    setSequenceBuffer([]);
    setActiveNotes(new Set());
    setIsRecording(false);
  };

  // --- Initialization (Landscape Warning check) ---
  useEffect(() => {
    const checkWidth = () => {
      // Threshold set to 425px as requested
      setIsSmallScreen(globalThis.innerWidth < 426);
    };
    checkWidth();
    globalThis.addEventListener("resize", checkWidth);
    return () => globalThis.removeEventListener("resize", checkWidth);
  }, []);

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
    handleScroll(); // Initial calc

    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [notes]);

  const syncScroll = React.useCallback(
    (clientX: number, isSmooth: boolean = false) => {
      if (!mainScrollRef.current || !miniMapRef.current) return;
      const rect = miniMapRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));

      const { scrollWidth, clientWidth } = mainScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      const targetScroll = ratio * scrollWidth - clientWidth / 2;

      mainScrollRef.current.scrollTo({
        left: Math.max(0, Math.min(maxScroll, targetScroll)),
        behavior: isSmooth ? "smooth" : "auto",
      });
    },
    [],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    syncScroll(e.clientX, true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    syncScroll(e.touches[0].clientX, true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX;
      syncScroll(clientX);
    };

    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, syncScroll]);

  // Preloading Logic
  useEffect(() => {
    const loadNotes = async () => {
      // We don't need to resume context here, just create it if it doesn't exist
      audioContextRef.current ??= new (
        globalThis.AudioContext ||
        (
          globalThis as unknown as Window & {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext
      )();

      const ctx = audioContextRef.current;

      const loadPromises = notes.map(async (note) => {
        if (audioBuffersRef.current[note.filename]) return;

        try {
          const response = await fetch(note.filename);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          audioBuffersRef.current[note.filename] = audioBuffer;
        } catch (e) {
          console.error(`Failed to load/decode audio: ${note.filename}`, e);
        }
      });

      await Promise.all(loadPromises);
    };

    loadNotes();
  }, [notes]);

  const playSound = React.useCallback(
    async (filename: string, startTime: number = 0) => {
      const ctx = await ensureAudioContext();
      const buffer = audioBuffersRef.current[filename];

      if (buffer) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gainNode = ctx.createGain();
        // Target volume 0.85
        const targetVolume = 0.85;

        // prevent "clicking" or "popping" (Derek's request)
        const now = startTime || ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(targetVolume, now + 0.005);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Track active source for Panic button
        activeSourcesRef.current.add(source);
        source.onended = () => {
          activeSourcesRef.current.delete(source);
        };

        source.start(now);
      }
    },
    [ensureAudioContext],
  );

  // --- Core Logic Functions ---
  const clearBuffer = () => {
    audioHardStop();
    setSequenceBuffer([]);
    setActiveNotes(new Set());
    setIsRecording(false);
  };

  const playSequence = async () => {
    if (sequenceBuffer.length === 0 || isPlaybackActive) return;
    setIsPlaybackActive(true);
    setIsRecording(false);

    const ctx = await ensureAudioContext();
    const startTime = ctx.currentTime + 0.05; // Small offset for tightness

    // Play all notes in the buffer simultaneously (Chord Mode)
    sequenceBuffer.forEach((note) => playSound(note.filename, startTime));

    // Highlight all associated keys in blue
    const allActive = new Set(sequenceBuffer.map((n) => n.name));
    setActiveNotes(allActive);

    // Brief highlight duration
    await new Promise((resolve) => setTimeout(resolve, 800));

    setActiveNotes(new Set());
    setIsPlaybackActive(false);
  };

  const handleNoteTrigger = React.useCallback(
    (note: Note, isPress: boolean) => {
      if (!isPress) {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(note.name);
          return next;
        });
        return;
      }

      // Add to persistent tracker
      setTrackerNotes((prev) => new Set(prev).add(note.name));

      // Play sound immediately
      if (melodyMode || !isRecording) {
        playSound(note.filename);
        setActiveNotes((prev) => new Set(prev).add(note.name));
      } else if (sequenceBuffer.length < 8) {
        // Chord Mode - Recording (Limit to 8 notes for a chord)
        setSequenceBuffer((prev) => [...prev, note]);
        playSound(note.filename);
        setActiveNotes((prev) => new Set(prev).add(note.name));
      }
    },
    [melodyMode, isRecording, sequenceBuffer.length, playSound],
  );

  // --- Render Helpers ---
  const renderKeys = () => {
    const elements: React.ReactElement[] = [];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.isBlack) continue;

      // Find the next note if it's black (Skeuomorphic sibling anchoring)
      const nextNote = notes[i + 1];
      const hasBlack = nextNote?.isBlack;
      const strippedName = note.name.replaceAll(/\d/g, "");
      const degree = scaleDegrees.get(strippedName);

      elements.push(
        <div
          key={note.name}
          className="relative flex-1 min-w-[80px] lg:min-w-0 flex shrink-0"
        >
          <PianoKey
            note={note}
            isActive={activeNotes.has(note.name)}
            showLabel={showNotes}
            degree={degree}
            scaleNotes={getScaleInfo(selectedKey, "Major").notes}
            onMouseDown={() => handleNoteTrigger(note, true)}
            onMouseUp={() => handleNoteTrigger(note, false)}
            onMouseEnter={() => {}}
          />

          {hasBlack && (
            <PianoKey
              note={nextNote}
              isActive={activeNotes.has(nextNote.name)}
              showLabel={showNotes}
              degree={
                scaleDegrees.get(nextNote.sharp!) ||
                scaleDegrees.get(nextNote.flat!)
              }
              scaleNotes={getScaleInfo(selectedKey, "Major").notes}
              onMouseDown={() => handleNoteTrigger(nextNote, true)}
              onMouseUp={() => handleNoteTrigger(nextNote, false)}
              onMouseEnter={() => {}}
            />
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

  // --- Exercise Matching Logic ---
  useEffect(() => {
    if (!targetNotes || targetNotes.length === 0 || !onSuccess) return;

    const normalize = (note: string) => {
      return note.toLowerCase().replace(/\s+/g, "");
    };

    const isMatch = (playedNote: string, targetNote: string) => {
      const normalizedPlayed = normalize(playedNote);
      const normalizedTarget = normalize(targetNote);

      // Direct match (e.g., "c1" === "c1")
      if (normalizedPlayed === normalizedTarget) return true;

      // Match without octave (e.g., "c" in target matches "c1", "c2" in played)
      // Or if target is just "c#", it should match "db1", "c#1", etc.
      const playedNoteOnly = normalizedPlayed.replace(/\d+/, "");
      const targetNoteOnly = normalizedTarget.replace(/\d+/, "");

      // Handle Enharmonic Equivalents (C# == Db)
      const getEnharmonic = (n: string) => {
        const enharmonics: { [key: string]: string } = {
          "c#": "db",
          db: "c#",
          "d#": "eb",
          eb: "d#",
          "f#": "gb",
          gb: "f#",
          "g#": "ab",
          ab: "g#",
          "a#": "bb",
          bb: "a#",
        };
        return enharmonics[n] || n;
      };

      if (playedNoteOnly === targetNoteOnly) return true;
      if (getEnharmonic(playedNoteOnly) === targetNoteOnly) return true;

      // Specific octave match if target HAS octave
      // If target is "c#1", it must match "db1" or "c#1"
      if (/\d/.test(normalizedTarget)) {
        // If target has octave, it's already covered by the first direct match check or should be precisely matched
        // But played might be "db1" and target "c#1"
        const playedOctave = normalizedPlayed.match(/\d+/)?.[0];
        const targetOctave = normalizedTarget.match(/\d+/)?.[0];
        if (
          playedOctave === targetOctave &&
          getEnharmonic(playedNoteOnly) === targetNoteOnly
        )
          return true;
      }

      return false;
    };

    const playedNotesArr = Array.from(trackerNotes);
    const allMatched = targetNotes.every((target) =>
      playedNotesArr.some((played) => isMatch(played, target)),
    );

    if (allMatched && trackerNotes.size > 0) {
      onSuccess();
    }
  }, [trackerNotes, targetNotes, onSuccess]);

  return (
    <div className="w-full bg-[#0F5F85] p-6 rounded-xl flex flex-col gap-1 shadow-2xl min-h-[600px] relative">
      {/* Dynamic Header & Instructions */}
      <div className="flex flex-col items-center justify-center text-center py-4">
        <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md">
          Key of {selectedKey}
        </h1>
        <p className="text-white/80 font-bold text-xs uppercase tracking-[0.2em] mt-2">
          Melody: Play a melody freely | Chord: Build a chord & play it back
        </p>
      </div>

      {/* --- Top Control Bar --- */}
      <div className="flex flex-row items-center justify-between px-3 sm:px-4 lg:px-6 py-4 lg:py-6 bg-[#0B4D6B] rounded-t-xl border-b border-white/10 shadow-lg gap-2 lg:gap-0">
        {/* Left: Modes & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-6 w-auto justify-center">
          <div className="flex flex-col gap-2 p-1.5 bg-black/20 rounded-lg border border-white/5 shadow-inner">
            <button
              onClick={() => {
                setMelodyMode(true);
                clearBuffer();
              }}
              className={cn(
                "w-28 sm:w-32 lg:w-36 py-2 px-2 lg:px-4 rounded-md font-black text-xs lg:text-sm transition-all uppercase tracking-wider",
                melodyMode
                  ? "bg-white text-[#0F5F85] shadow-lg scale-105"
                  : "text-white/40 hover:text-white",
              )}
            >
              Melody
            </button>
            <button
              onClick={() => {
                setMelodyMode(false);
                audioHardStop();
              }}
              className={cn(
                "w-28 sm:w-32 lg:w-36 py-2 px-2 lg:px-4 rounded-md font-black text-xs lg:text-sm transition-all uppercase tracking-wider",
                melodyMode === false
                  ? "bg-[#3B82F6] text-white shadow-lg scale-105"
                  : "text-white/40 hover:text-white",
              )}
            >
              Chord
            </button>
          </div>

          {!melodyMode && (
            <div className="flex items-center gap-3 lg:gap-4 animate-in fade-in slide-in-from-left-4 duration-300 ml-0 lg:ml-4">
              {/* Spell It (Record) */}
              <button
                onClick={() => {
                  if (isRecording) audioHardStop();
                  setIsRecording(!isRecording);
                }}
                className={cn(
                  "h-12 w-12 lg:h-16 lg:w-16 rounded-full border-4 flex flex-col items-center justify-center transition-all shadow-xl group relative overflow-hidden",
                  isRecording
                    ? "bg-red-500 border-red-300 animate-pulse"
                    : "bg-[#D4AF37] border-[#B89628] hover:scale-110 active:scale-95",
                )}
                title="Start Recording Notes"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[8px] lg:text-[10px] font-black text-black leading-tight uppercase text-center px-1 z-10">
                  Spell It
                </div>
              </button>

              {/* Play It (Triangle) */}
              <button
                onClick={playSequence}
                disabled={sequenceBuffer.length === 0 || isPlaybackActive}
                className="h-12 w-12 lg:h-16 lg:w-16 relative transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:scale-100 group"
                title="Play Stored Chord"
              >
                <div
                  className="absolute inset-0 bg-[#D4AF37] border-4 border-[#B89628] shadow-xl origin-center transition-transform"
                  style={{ clipPath: "polygon(10% 0, 10% 100%, 100% 50%)" }}
                />
                <div
                  className="absolute inset-0 bg-[#B89628] opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ clipPath: "polygon(10% 0, 10% 100%, 100% 50%)" }}
                />
              </button>
              <span className="hidden sm:inline text-white/50 text-xs font-bold uppercase tracking-widest -ml-2">
                Play It
              </span>

              {/* Clear */}
              <button
                onClick={clearBuffer}
                className="h-10 w-10 ml-2 rounded-md bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center transition-all border border-white/10 hover:border-white/30 shadow-lg active:scale-95"
                title="Clear Chord"
              >
                <Square className="text-white fill-current" size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Middle: Key Tracker */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  activeNotes.size > 0
                    ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                    : "bg-white/20",
                )}
              />
              <div className="flex flex-col leading-none">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                  Tracker
                </span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-0.5">
                  Live
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <div className="flex items-center gap-3 min-w-[200px] justify-center relative group/list">
              {trackerNotes.size > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                  {Array.from(trackerNotes).map((noteName) => (
                    <span
                      key={noteName}
                      className={cn(
                        "font-extrabold text-sm uppercase transition-all duration-200",
                        activeNotes.has(noteName)
                          ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] scale-110"
                          : "text-white/60",
                      )}
                    >
                      {noteName.replace(/\d/, "")}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] italic">
                  Start playing to track keys
                </span>
              )}
            </div>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-xs bg-white/10 px-2.5 py-1 rounded-lg min-w-[32px] text-center border border-white/5">
                  {trackerNotes.size}
                </span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Total
                </span>
              </div>

              {trackerNotes.size > 0 && (
                <button
                  onClick={() => setTrackerNotes(new Set())}
                  className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors group/clear border border-transparent hover:border-red-500/30"
                  title="Clear Tracker"
                >
                  <X
                    size={14}
                    className="text-white/40 group-hover/clear:text-red-400 transition-colors"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-4 w-auto justify-center">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="bg-white/10 justify-center hover:bg-white/20 text-white min-w-[90px] px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-bold shadow-sm transition-colors text-[10px] sm:text-xs lg:text-sm border border-white/10 backdrop-blur-sm"
          >
            {showNotes ? "Hide" : "Show"}
          </button>

          <div className="relative group">
            <div className="flex items-center gap-1 sm:gap-2 bg-white px-3 sm:px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg border-2 border-transparent hover:border-white/20 shadow-lg cursor-pointer transition-all active:scale-95">
              <span className="text-[#0B4D6B] font-black text-[10px] sm:text-xs lg:text-lg uppercase tracking-wide">
                {selectedKey}
              </span>
              <ChevronDown className="h-5 w-5 text-[#0B4D6B]" />
              <select
                value={selectedKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                {KEYS.map((k) => (
                  <option key={k} value={k} className="text-black">
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- MINI-MAP NAVIGATION (Holographic Slider) --- */}
      <div className="px-4 mb-2 lg:hidden">
        <div
          ref={miniMapRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="w-full h-12 bg-black/40 rounded-xl overflow-hidden border border-white/10 relative cursor-pointer group shadow-inner touch-none"
        >
          {/* Mini-keys visualization */}
          <div className="flex w-full h-full opacity-40 pointer-events-none">
            {notes.map((note, i) => (
              <div
                key={`mini-${i}`}
                className={cn(
                  "flex-1 border-r border-black/10 last:border-0",
                  note.isBlack ? "bg-gray-700 h-1/2" : "bg-white h-full",
                )}
              />
            ))}
          </div>

          {/* Viewport Highlight Slider */}
          <div
            className="absolute top-0 bottom-0 bg-white/20 border-x border-white/40 backdrop-blur-[2px] transition-all duration-75 ease-out shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-sm"
            style={{
              left: `${scrollRatio * (1 - viewportRatio) * 100}%`,
              width: `${viewportRatio * 100}%`,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">
              Slide to Navigate
            </span>
          </div>
        </div>
      </div>

      {/* --- Piano Roll --- */}
      <div className="flex-1 bg-[#093d56] rounded-b-xl overflow-hidden flex flex-col">
        <div
          ref={mainScrollRef}
          className="flex-1 overflow-x-auto pb-4 scrollbar-hide touch-pan-x"
        >
          <div className="flex relative justify-start items-start h-full w-full min-w-max bg-[#093d56]">
            {renderKeys()}
          </div>
        </div>
      </div>

      {/* --- Mobile Landscape Warning --- */}
      {isSmallScreen && (
        <div className="fixed inset-0 z-99999 bg-[#0F5F85] flex flex-col items-center justify-center p-8 text-center overscroll-none touch-none scale-in duration-300">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Image
                src="/images/piano-middle.png"
                alt="Rotate"
                width={50}
                height={50}
                className="opacity-80 object-contain rotate-90"
              />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              Better Experience Awaits
            </h2>
            <p className="text-white/80 font-medium text-lg leading-relaxed mb-6">
              Please tilt your device to landscape mode to play the piano.
            </p>
            <div className="px-4 py-2 bg-white/20 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest">
              Rotate Device
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Piano;
