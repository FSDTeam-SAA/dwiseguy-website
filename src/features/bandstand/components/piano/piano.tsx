// // src/features/bandstand/components/piano/piano.tsx
// "use client";

// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { ChevronDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   generateNotes,
//   getScaleInfo,
//   getChordIndices,
//   KEYS,
//   Note,
// } from "./theory";
// import PianoKey from "./PianoKey";

// const KEY_TO_NOTE_INDEX: { [key: string]: number } = {
//   a: 0, // C
//   w: 1, // C#
//   s: 2, // D
//   e: 3, // D#
//   d: 4, // E
//   f: 5, // F
//   t: 6, // F#
//   g: 7, // G
//   y: 8, // G#
//   h: 9, // A
//   u: 10, // A#
//   j: 11, // B
//   k: 12, // C
//   o: 13, // C#
//   l: 14, // D
//   p: 15, // D#
//   ";": 16, // E
//   "'": 17, // F
// };

// const Piano = () => {
//   // --- State ---
//   const [notes] = useState<Note[]>(() => generateNotes(2, 4)); // Range C2 - C5
//   const [selectedKey, setSelectedKey] = useState<string>("C"); // Default Key

//   const scaleInfo = useMemo(
//     () => getScaleInfo(selectedKey, "Major"),
//     [selectedKey],
//   );
//   const scaleNotes = scaleInfo.notes;
//   const scaleDegrees = scaleInfo.degrees;

//   const [melodyMode, setMelodyMode] = useState<boolean>(true); // true = Melody, false = Chord
//   const [showNotes, setShowNotes] = useState<boolean>(true);
//   const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
//   const [lastNoteName, setLastNoteName] = useState<string>("Key");
//   const [playBuffer, setPlayBuffer] = useState<Note[]>([]);
//   const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

//   // --- Audio Refs ---
//   const audioCache = useRef<{ [filename: string]: HTMLAudioElement }>({});

//   // --- Initialization ---
//   useEffect(() => {
//     // Check initial screen width
//     const checkWidth = () => {
//       setIsSmallScreen(globalThis.innerWidth < 756);
//     };

//     checkWidth();
//     globalThis.addEventListener("resize", checkWidth);
//     return () => globalThis.removeEventListener("resize", checkWidth);
//   }, []);

//   useEffect(() => {
//     // Preload Audio
//     notes.forEach((note) => {
//       const audio = new Audio(note.filename);
//       audio.preload = "auto";
//       audioCache.current[note.filename] = audio;
//     });
//   }, [notes]);

//   // --- Audio Logic ---
//   const playSound = (filename: string) => {
//     const audio = audioCache.current[filename];
//     if (audio) {
//       const sound = audio.cloneNode() as HTMLAudioElement;
//       sound.volume = 0.6;
//       sound.play().catch((e) => console.error("Audio play failed", e));
//     }
//   };

//   const handleNoteTrigger = React.useCallback((note: Note, isPress: boolean) => {
//     if (!isPress) {
//       setActiveNotes((prev) => {
//         const next = new Set(prev);
//         next.delete(note.name);
//         return next;
//       });
//       return;
//     }

//     // Update Display Name
//     const cleanName = note.isBlack ? (note.sharp + "/" + note.flat) : note.name.replaceAll(/\d/g, '');
//     setLastNoteName(cleanName);

//     // Update Play Buffer (Rotating queue of last 8 unique notes)
//     setPlayBuffer(prev => {
//       const filtered = prev.filter(n => n.name !== note.name);
//       const next = [note, ...filtered].slice(0, 8);
//       return next;
//     });

//     // --- Play Logic ---
//     if (melodyMode) {
//       playSound(note.filename);
//       setActiveNotes((prev) => new Set(prev).add(note.name));
//     } else {
//       const rootIndex = notes.findIndex((n) => n.name === note.name);
//       if (rootIndex !== -1) {
//         const indices = getChordIndices(rootIndex);
//         const notesToPlay = indices.map((i) => notes[i]).filter(Boolean);
//         notesToPlay.forEach((n) => playSound(n.filename));
//         setActiveNotes((prev) => {
//           const next = new Set(prev);
//           notesToPlay.forEach((n) => next.add(n.name));
//           return next;
//         });
//       }
//     }
//   }, [melodyMode, notes]);

//   const playAllBuffered = () => {
//     playBuffer.forEach(note => playSound(note.filename));
//     const nextActive = new Set(playBuffer.map(n => n.name));
//     setActiveNotes(nextActive);
//     setTimeout(() => {
//       setActiveNotes(new Set());
//     }, 1000);
//   };

//   // --- Render Helpers ---
//   const renderKeys = () => {
//     const elements: React.ReactElement[] = [];

//     for (let i = 0; i < notes.length; i++) {
//       const note = notes[i];
//       if (note.isBlack) continue;

//       const nextNote = notes[i + 1];
//       const hasBlack = nextNote?.isBlack;

//       const isDimmed = scaleNotes.length > 0 && !scaleNotes.includes(note.name.replaceAll(/\d/g, ''));
//       const degree = scaleDegrees.get(note.name.replaceAll(/\d/g, ''));

//       elements.push(
//         <div key={note.name} className="relative flex-shrink-0">
//           <PianoKey
//             note={note}
//             isActive={activeNotes.has(note.name)}
//             isDimmed={isDimmed}
//             showLabel={showNotes}
//             degree={degree}
//             scaleNotes={scaleNotes}
//             onMouseDown={() => handleNoteTrigger(note, true)}
//             onMouseUp={() => handleNoteTrigger(note, false)}
//             onMouseEnter={() => { }}
//           />

//           {hasBlack && (
//             <div
//               className="absolute top-0 -right-5 z-10"
//               style={{ pointerEvents: "none" }}
//             >
//               <div className="pointer-events-auto">
//                 <PianoKey
//                   note={nextNote}
//                   isActive={activeNotes.has(nextNote.name)}
//                   isDimmed={
//                     scaleNotes.length > 0 &&
//                     !(
//                       scaleNotes.includes(nextNote.sharp!) ||
//                       scaleNotes.includes(nextNote.flat!)
//                     )
//                   }
//                   showLabel={showNotes}
//                   degree={scaleDegrees.get(nextNote.sharp!) || scaleDegrees.get(nextNote.flat!)}
//                   scaleNotes={scaleNotes}
//                   onMouseDown={() => handleNoteTrigger(nextNote, true)}
//                   onMouseUp={() => handleNoteTrigger(nextNote, false)}
//                   onMouseEnter={() => { }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>,
//       );
//     }
//     return elements;
//   };

//   // --- Keyboard Mapping ---
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.repeat) return;
//       const key = e.key.toLowerCase();
//       const noteIndex = KEY_TO_NOTE_INDEX[key];

//       if (noteIndex !== undefined && notes[noteIndex]) {
//         handleNoteTrigger(notes[noteIndex], true);
//       }
//     };

//     const handleKeyUp = (e: KeyboardEvent) => {
//       const key = e.key.toLowerCase();
//       const noteIndex = KEY_TO_NOTE_INDEX[key];

//       if (noteIndex !== undefined && notes[noteIndex]) {
//         handleNoteTrigger(notes[noteIndex], false);
//       }
//     };

//     globalThis.addEventListener("keydown", handleKeyDown);
//     globalThis.addEventListener("keyup", handleKeyUp);

//     return () => {
//       globalThis.removeEventListener("keydown", handleKeyDown);
//       globalThis.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [notes, handleNoteTrigger]);

//   return (
//     <div className="w-full bg-[#0F5F85] p-6 rounded-xl flex flex-col gap-8 shadow-2xl">
//       {/* --- Top Control Bar --- */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         {/* Left: Modes & Actions */}
//         <div className="flex items-center gap-6">
//           {/* Mode Toggle */}
//           <div className="flex flex-col gap-1">
//             <button
//               onClick={() => setMelodyMode(true)}
//               className={cn(
//                 "px-6 py-2 rounded-md font-bold text-sm transition-all border shadow-sm",
//                 melodyMode
//                   ? "bg-white text-black border-transparent shadow-md transform scale-105"
//                   : "bg-[#2A7AA1] text-white border-[#4A9AC1] hover:bg-[#3A8AB1]",
//               )}
//             >
//               Melody Mode
//             </button>
//             <button
//               onClick={() => setMelodyMode(false)}
//               className={cn(
//                 "px-6 py-2 rounded-md font-bold text-sm transition-all border shadow-sm",
//                 melodyMode === false
//                   ? "bg-[#3b82f6] text-white border-transparent shadow-md transform scale-105"
//                   : "bg-[#2A7AA1] text-white border-[#4A9AC1] hover:bg-[#3A8AB1]",
//               )}
//             >
//               Chord Mode
//             </button>
//           </div>

//           {/* Spell It (Visual Only) */}
//           <button className="h-14 w-14 rounded-full bg-[#D4AF37] border-4 border-[#B89628] flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95">
//             <span className="text-[10px] font-bold text-black text-center leading-tight">
//               Spell It
//             </span>
//           </button>

//           {/* Play It */}
//           <button
//             onClick={playAllBuffered}
//             className="h-14 w-14 relative hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
//           >
//             <div
//               className="absolute inset-0 bg-[#D4AF37] border-4 border-[#B89628]"
//               style={{ clipPath: "polygon(0 0, 0% 100%, 100% 50%)" }}
//             ></div>
//             <svg
//               width="50"
//               height="50"
//               viewBox="0 0 100 100"
//               className="drop-shadow-lg filter overflow-visible z-10"
//             >
//               <path
//                 d="M 10 10 L 10 90 L 90 50 Z"
//                 fill="#D4AF37"
//                 stroke="#9A7D20"
//                 strokeWidth="4"
//               />
//               <text x="25" y="55" fontSize="12" fontWeight="bold" fill="black">
//                 Play It
//               </text>
//             </svg>
//             {playBuffer.length > 0 && (
//               <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold z-20">
//                 {playBuffer.length}
//               </div>
//             )}
//           </button>
//         </div>

//         {/* Center: Key Helpers */}
//         <div className="flex flex-col items-center">
//           <div className="bg-white px-8 py-2 rounded-md font-bold text-black border border-gray-300 shadow-inner min-w-[120px] text-center mb-1">
//             {lastNoteName}
//           </div>
//           <div className="text-white text-xs font-medium bg-[#2A7AA1] px-3 py-0.5 rounded-full">
//             Key of {selectedKey} Natural
//           </div>
//         </div>

//         {/* Far Right: Toggles */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setShowNotes(!showNotes)}
//             className="bg-white px-4 py-2 rounded-md font-bold text-black shadow-sm hover:bg-gray-100 transition-colors"
//           >
//             {showNotes ? "Hide Notes" : "Show Notes"}
//           </button>

//           <div className="relative">
//             <select
//               value={selectedKey}
//               onChange={(e) => setSelectedKey(e.target.value)}
//               className="appearance-none bg-white px-6 py-2 pr-10 rounded-md font-bold text-black shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               {KEYS.map((k) => (
//                 <option key={k} value={k}>
//                   {k}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {/* --- Piano Roll --- */}
//       <div className="flex justify-center overflow-x-auto pb-4 pt-2 px-10 scrollbar-hide">
//         <div className="flex relative items-start h-[280px]">
//           {renderKeys()}
//         </div>
//       </div>

//       {/* --- Orientation Warning --- */}
//       {isSmallScreen && (
//         <div className="fixed inset-0 z-[100] bg-[#0F5F85]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
//           <div className="w-24 h-24 mb-6 relative">
//             <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-xl opacity-20"></div>
//             <div className="absolute inset-0 flex items-center justify-center animate-bounce">
//               <svg
//                 width="64"
//                 height="64"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#D4AF37"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="rotate-90"
//               >
//                 <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
//                 <line x1="12" y1="18" x2="12.01" y2="18" />
//               </svg>
//             </div>
//             <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-[#D4AF37] rounded-full shadow-lg -mr-2 -mt-2">
//               <span className="text-black font-bold">!</span>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Better Experience Awaits</h2>
//           <p className="text-[#4A9AC1] font-medium max-w-xs">
//             Please tilt your device to landscape mode for the best piano experience.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Piano;

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

  useEffect(() => {
    notes.forEach((note) => {
      const audio = new Audio(note.filename);
      audio.preload = "auto";
      audioCache.current[note.filename] = audio;
    });
  }, [notes]);

  // --- NEW: Mobile Scroll Helper ---
  const scrollToNote = (index: number) => {
    if (!mainScrollRef.current) return;
    // Calculate scroll position based on white key width (w-12 = 48px)
    const whiteKeysBefore = notes.slice(0, index).filter(n => !n.isBlack).length;
    const scrollTarget = whiteKeysBefore * pianoDimensions.whiteKeyWidth;

    mainScrollRef.current.scrollTo({
      left: scrollTarget,
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
        <div className="w-full bg-black/30 rounded-lg p-2 flex flex-col items-center gap-1 border border-white/10">
          <div className="flex w-full h-8 bg-black/40 rounded overflow-hidden border border-white/5">
            {notes.map((note, i) => (
              <button
                key={`mini-${i}`}
                onClick={() => scrollToNote(i)}
                className={cn(
                  "flex-1 border-r border-white/5 last:border-0",
                  note.isBlack ? "bg-gray-800 h-2/3" : "bg-white h-full"
                )}
              />
            ))}
          </div>
          <span className="text-[9px] uppercase font-black text-white/40 tracking-widest">
            Quick Navigation
          </span>
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
      {isSmallScreen && (
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
      )}
    </div>
  );
};

export default Piano;