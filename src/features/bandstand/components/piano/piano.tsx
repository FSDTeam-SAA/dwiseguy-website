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
  a: 0, // C
  w: 1, // C#
  s: 2, // D
  e: 3, // D#
  d: 4, // E
  f: 5, // F
  t: 6, // F#
  g: 7, // G
  y: 8, // G#
  h: 9, // A
  u: 10, // A#
  j: 11, // B
  k: 12, // C
  o: 13, // C#
  l: 14, // D
  p: 15, // D#
  ";": 16, // E
  "'": 17, // F
};

const Piano = () => {
  // --- State ---
  const [notes] = useState<Note[]>(() => generateNotes(2, 4)); // Range C2 - C5
  const [selectedKey, setSelectedKey] = useState<string>("C"); // Default Key

  const scaleInfo = useMemo(
    () => getScaleInfo(selectedKey, "Major"),
    [selectedKey],
  );
  const scaleNotes = scaleInfo.notes;
  const scaleDegrees = scaleInfo.degrees;

  const [melodyMode, setMelodyMode] = useState<boolean>(true); // true = Melody, false = Chord
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [lastNoteName, setLastNoteName] = useState<string>("Key");
  const [playBuffer, setPlayBuffer] = useState<Note[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // --- Audio Refs ---
  const audioCache = useRef<{ [filename: string]: HTMLAudioElement }>({});

  // --- Initialization ---
  useEffect(() => {
    // Check initial screen width
    const checkWidth = () => {
      setIsSmallScreen(globalThis.innerWidth < 756);
    };

    checkWidth();
    globalThis.addEventListener("resize", checkWidth);
    return () => globalThis.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    // Preload Audio
    notes.forEach((note) => {
      const audio = new Audio(note.filename);
      audio.preload = "auto";
      audioCache.current[note.filename] = audio;
    });
  }, [notes]);

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

    // Update Display Name
    const cleanName = note.isBlack ? (note.sharp + "/" + note.flat) : note.name.replaceAll(/\d/g, '');
    setLastNoteName(cleanName);

    // Update Play Buffer (Rotating queue of last 8 unique notes)
    setPlayBuffer(prev => {
      const filtered = prev.filter(n => n.name !== note.name);
      const next = [note, ...filtered].slice(0, 8);
      return next;
    });

    // --- Play Logic ---
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

  const playAllBuffered = () => {
    playBuffer.forEach(note => playSound(note.filename));
    const nextActive = new Set(playBuffer.map(n => n.name));
    setActiveNotes(nextActive);
    setTimeout(() => {
      setActiveNotes(new Set());
    }, 1000);
  };

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
            <div
              className="absolute top-0 -right-5 z-10"
              style={{ pointerEvents: "none" }}
            >
              <div className="pointer-events-auto">
                <PianoKey
                  note={nextNote}
                  isActive={activeNotes.has(nextNote.name)}
                  isDimmed={
                    scaleNotes.length > 0 &&
                    !(
                      scaleNotes.includes(nextNote.sharp!) ||
                      scaleNotes.includes(nextNote.flat!)
                    )
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
    <div className="w-full bg-[#0F5F85] p-6 rounded-xl flex flex-col gap-8 shadow-2xl">
      {/* --- Top Control Bar --- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Modes & Actions */}
        <div className="flex items-center gap-6">
          {/* Mode Toggle */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setMelodyMode(true)}
              className={cn(
                "px-6 py-2 rounded-md font-bold text-sm transition-all border shadow-sm",
                melodyMode
                  ? "bg-white text-black border-transparent shadow-md transform scale-105"
                  : "bg-[#2A7AA1] text-white border-[#4A9AC1] hover:bg-[#3A8AB1]",
              )}
            >
              Melody Mode
            </button>
            <button
              onClick={() => setMelodyMode(false)}
              className={cn(
                "px-6 py-2 rounded-md font-bold text-sm transition-all border shadow-sm",
                melodyMode === false
                  ? "bg-[#3b82f6] text-white border-transparent shadow-md transform scale-105"
                  : "bg-[#2A7AA1] text-white border-[#4A9AC1] hover:bg-[#3A8AB1]",
              )}
            >
              Chord Mode
            </button>
          </div>

          {/* Spell It (Visual Only) */}
          <button className="h-14 w-14 rounded-full bg-[#D4AF37] border-4 border-[#B89628] flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95">
            <span className="text-[10px] font-bold text-black text-center leading-tight">
              Spell It
            </span>
          </button>

          {/* Play It */}
          <button
            onClick={playAllBuffered}
            className="h-14 w-14 relative hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
          >
            <div
              className="absolute inset-0 bg-[#D4AF37] border-4 border-[#B89628]"
              style={{ clipPath: "polygon(0 0, 0% 100%, 100% 50%)" }}
            ></div>
            <svg
              width="50"
              height="50"
              viewBox="0 0 100 100"
              className="drop-shadow-lg filter overflow-visible z-10"
            >
              <path
                d="M 10 10 L 10 90 L 90 50 Z"
                fill="#D4AF37"
                stroke="#9A7D20"
                strokeWidth="4"
              />
              <text x="25" y="55" fontSize="12" fontWeight="bold" fill="black">
                Play It
              </text>
            </svg>
            {playBuffer.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold z-20">
                {playBuffer.length}
              </div>
            )}
          </button>
        </div>

        {/* Center: Key Helpers */}
        <div className="flex flex-col items-center">
          <div className="bg-white px-8 py-2 rounded-md font-bold text-black border border-gray-300 shadow-inner min-w-[120px] text-center mb-1">
            {lastNoteName}
          </div>
          <div className="text-white text-xs font-medium bg-[#2A7AA1] px-3 py-0.5 rounded-full">
            Key of {selectedKey} Natural
          </div>
        </div>

        {/* Far Right: Toggles */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="bg-white px-4 py-2 rounded-md font-bold text-black shadow-sm hover:bg-gray-100 transition-colors"
          >
            {showNotes ? "Hide Notes" : "Show Notes"}
          </button>

          <div className="relative">
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="appearance-none bg-white px-6 py-2 pr-10 rounded-md font-bold text-black shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- Piano Roll --- */}
      <div className="flex justify-center overflow-x-auto pb-4 pt-2 px-10 scrollbar-hide">
        <div className="flex relative items-start h-[280px]">
          {renderKeys()}
        </div>
      </div>

      {/* --- Orientation Warning --- */}
      {isSmallScreen && (
        <div className="fixed inset-0 z-[100] bg-[#0F5F85]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-xl opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center animate-bounce">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-90"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-[#D4AF37] rounded-full shadow-lg -mr-2 -mt-2">
              <span className="text-black font-bold">!</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Better Experience Awaits</h2>
          <p className="text-[#4A9AC1] font-medium max-w-xs">
            Please tilt your device to landscape mode for the best piano experience.
          </p>
        </div>
      )}
    </div>
  );
};

export default Piano;
