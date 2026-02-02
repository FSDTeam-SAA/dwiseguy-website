"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Play, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateNotes,
  getScaleNotes,
  getChordIndices,
  KEYS,
  Note,
} from "./theory";
import PianoKey from "./PianoKey";

const Piano = () => {
  // --- State ---
  const [notes] = useState<Note[]>(() => generateNotes(2, 4)); // Range C2 - C5
  const [selectedKey, setSelectedKey] = useState<string>("C"); // Default Key
  const scaleNotes = useMemo(
    () => getScaleNotes(selectedKey, "Major"),
    [selectedKey],
  );
  const [melodyMode, setMelodyMode] = useState<boolean>(true); // true = Melody, false = Chord
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  // --- Audio Refs ---
  const audioCache = useRef<{ [filename: string]: HTMLAudioElement }>({});

  // --- Initialization ---
  useEffect(() => {
    // Preload Audio
    notes.forEach((note) => {
      const audio = new Audio(note.filename);
      audio.preload = "auto";
      audio.onerror = (e) => {
        console.warn(
          `Failed to load audio for ${note.name}:`,
          note.filename,
          e,
        );
      };
      audioCache.current[note.filename] = audio;
    });
  }, [notes]);

  // --- Audio Logic ---
  const playSound = (filename: string) => {
    const audio = audioCache.current[filename];
    if (audio) {
      // Clone to allow polyphony (same note played rapidly or in chords)
      // Or just reset currentTime. For piano decay, cloning is often safer for overlap.
      const sound = audio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.6;
      sound.play().catch((e) => console.error("Audio play failed", e));
    }
  };

  const handleNoteTrigger = (note: Note, isPress: boolean) => {
    if (!isPress) {
      // Release logic if needed (e.g. stop visual active state)
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(note.name);
        return next;
      });
      return;
    }

    // --- Play Logic ---
    if (melodyMode) {
      // Play Single
      playSound(note.filename);
      setActiveNotes((prev) => new Set(prev).add(note.name));
    } else {
      // Chord Mode
      // 1. Find root index in our `notes` array
      const rootIndex = notes.findIndex((n) => n.name === note.name);
      if (rootIndex !== -1) {
        // 2. Get chord indices (Root, 3rd, 5th)
        const indices = getChordIndices(rootIndex);

        // 3. Play all
        const notesToPlay = indices.map((i) => notes[i]).filter(Boolean);

        notesToPlay.forEach((n) => playSound(n.filename));

        // 4. Set all as active
        setActiveNotes((prev) => {
          const next = new Set(prev);
          notesToPlay.forEach((n) => next.add(n.name));
          return next;
        });
      }
    }
  };

  // --- Render Helpers ---
  // We strictly group by White keys to handle layout.
  // Every White key might have a Black key immediately after it.
  // If we just iterate `notes`, we have to be careful.
  const renderKeys = () => {
    const elements: React.ReactElement[] = [];

    // We iterate notes. If current is White, we render it.
    // Check if NEXT is Black. If so, render it "inside" or after.
    // If current is Black, we skip it (processed by previous white) - BUT `generateNotes` is flat list.

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.isBlack) continue; // Skip, handled by previous white key

      const nextNote = notes[i + 1];
      const hasBlack = nextNote && nextNote.isBlack;

      const isDimmed = scaleNotes.length > 0 && !scaleNotes.includes(note.name);

      elements.push(
        <div key={note.name} className="relative flex-shrink-0">
          <PianoKey
            note={note}
            isActive={activeNotes.has(note.name)}
            isDimmed={isDimmed}
            showLabel={showNotes}
            scaleNotes={scaleNotes} // Pass full scale to check for sharp/flat preference
            onMouseDown={() => handleNoteTrigger(note, true)}
            onMouseUp={() => handleNoteTrigger(note, false)}
            onMouseEnter={(n) => {
              // Optional: Implement drag-play
              if (activeNotes.size > 0 && false) {
                // Disable drag for now to prevent chaos
                handleNoteTrigger(n, true);
              }
            }}
          />

          {hasBlack && (
            <div
              className="absolute top-0 -right-5 z-10"
              style={{ pointerEvents: "none" }}
            >
              {" "}
              {/* Container to positioning */}
              {/* 
                               pointerEvents: none on wrapper, but Key needs pointerEvents: auto. 
                               But PianoKey has logic. 
                               Actually, just placing the component absolutely is enough.
                             */}
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
                  scaleNotes={scaleNotes}
                  onMouseDown={() => handleNoteTrigger(nextNote, true)}
                  onMouseUp={() => handleNoteTrigger(nextNote, false)}
                  onMouseEnter={() => {}}
                />
              </div>
            </div>
          )}
        </div>,
      );
    }
    return elements;
  };

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
                !melodyMode
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

          {/* Play It (Visual Only) */}
          {/* Triangular shape using clip-path or SVG */}
          <button className="h-14 w-14 relative hover:scale-110 transition-transform active:scale-95 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-[#D4AF37] border-4 border-[#B89628]"
              style={{ clipPath: "polygon(0 0, 0% 100%, 100% 50%)" }}
            ></div>
            {/* Inner Triangle Border hack or just SVG */}
            <svg
              width="50"
              height="50"
              viewBox="0 0 100 100"
              className="drop-shadow-lg filter overflow-visible"
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
          </button>
        </div>

        {/* Center/Right: Key Helpers */}
        <div className="flex items-center gap-4">
          {/* Key Display (Visual placeholder from image) */}
          <div className="bg-white px-4 py-2 rounded-md font-bold text-black border border-gray-300 shadow-sm">
            Key
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
      <div className="flex justify-center overflow-x-auto pb-4 pt-2 px-10">
        <div className="flex relative">{renderKeys()}</div>
      </div>
    </div>
  );
};

export default Piano;
