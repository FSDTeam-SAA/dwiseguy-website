// src/features/bandstand/components/piano/PianoKey.tsx
import React from "react";
import { cn } from "@/lib/utils"; // Assuming generic utility exists, or I will use standard class concatenation
import { Note } from "./theory";

interface PianoKeyProps {
  note: Note;
  isActive: boolean;
  isDimmed?: boolean;
  showLabel: boolean;
  degree?: number;
  onMouseDown: (note: Note) => void;
  onMouseUp: (note: Note) => void;
  onMouseEnter: (note: Note) => void;
  scaleNotes?: string[];
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isActive,
  isDimmed = false,
  showLabel,
  degree,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  scaleNotes = [],
}) => {
  // Determine if this note is in the current scale (if one is selected)
  // If scaleNotes is empty, assume all are valid (not dimmed), unless explicitly passed as dimmed
  // However, the parent controls `isDimmed`.
  // We can also double check specifically for naming highlighting.

  const isBlack = note.isBlack;

  // Base styles for keys
  const whiteKeyStyles =
    "bg-gradient-to-b from-white via-white to-[#e8e8e8] border-x border-b border-gray-300 rounded-b-[18px] z-0 relative hover:bg-gray-100 flex flex-col justify-end items-center pb-6 text-black font-bold shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-all duration-75 active:scale-[0.98]";
  const blackKeyStyles =
    "bg-gradient-to-b from-[#444] via-[#111] to-black absolute z-10 rounded-b-[12px] flex flex-col justify-end items-center pb-4 text-white leading-tight shadow-[0_15px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-75 before:absolute before:inset-x-[2px] before:top-0 before:h-[2px] before:bg-white/10 active:scale-[0.96]";

  // Active (pressed) styles
  const activeWhiteStyles =
    "!bg-gradient-to-b !from-yellow-100 !to-yellow-300 !border-yellow-500 shadow-[inset_0_6px_12px_rgba(0,0,1,0.2)] translate-y-[3px]";
  const activeBlackStyles = "!bg-gradient-to-b !from-yellow-700 !to-yellow-900 shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)] translate-y-[2px]";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onMouseDown(note);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onMouseUp(note);
    }
  };

  // Dimmed (out of scale) styles
  const dimmedStyles = "opacity-50 pointer-events-none grayscale";

  return (
    <button
      type="button"
      tabIndex={isDimmed ? -1 : 0}
      aria-label={`${note.isBlack ? (note.sharp + "/" + note.flat) : note.name} octave ${note.octave}`}
      aria-pressed={isActive}
      style={{
        width: isBlack ? "var(--black-key-width)" : "var(--white-key-width)",
        height: isBlack ? "var(--black-key-height)" : "var(--white-key-height)",
        right: isBlack ? "calc(var(--black-key-width) / -2)" : "auto",
        fontSize: isBlack ? "calc(var(--white-key-width) * 0.2)" : "calc(var(--white-key-width) * 0.4)",
      }}
      className={cn(
        isBlack ? blackKeyStyles : whiteKeyStyles,
        isActive && (isBlack ? activeBlackStyles : activeWhiteStyles),
        isDimmed && dimmedStyles,
        "select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset touch-none",
      )}
      onMouseDown={() => onMouseDown(note)}
      onMouseUp={() => onMouseUp(note)}
      onMouseLeave={() => onMouseUp(note)} // Stop playing if dragged off
      onMouseEnter={() => onMouseEnter(note)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {showLabel && (
        <div className="pointer-events-none flex flex-col items-center gap-1 sm:gap-2">
          {isBlack ? (
            <div className="flex flex-col items-center font-black tracking-tighter scale-90 mb-1">
              <span className="text-[10px] opacity-90">
                {(scaleNotes && note.flat && scaleNotes.includes(note.flat))
                  ? note.flat.toUpperCase()
                  : note.sharp?.toUpperCase()}
              </span>
            </div>
          ) : (
            <>
              {/* Degree Indicator */}
              {degree && (
                <div
                  className="rounded-full bg-[#FFD700] border-2 border-[#B89628] flex items-center justify-center shadow-lg transform scale-90 sm:scale-100"
                  style={{ width: "calc(var(--white-key-width) * 0.6)", height: "calc(var(--white-key-width) * 0.6)" }}
                >
                  <span className="text-black text-xs sm:text-sm font-black">{degree}</span>
                </div>
              )}
              <span className="text-sm sm:text-base font-black text-gray-400 mt-1">{note.name.replaceAll(/\d/g, '').toUpperCase()}</span>
            </>
          )}
        </div>
      )}
    </button>
  );
};

export default PianoKey;
