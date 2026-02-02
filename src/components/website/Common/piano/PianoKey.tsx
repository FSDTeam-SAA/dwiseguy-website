import React from "react";
import { cn } from "@/lib/utils"; // Assuming generic utility exists, or I will use standard class concatenation
import { Note } from "./theory";

interface PianoKeyProps {
  note: Note;
  isActive: boolean;
  isDimmed?: boolean;
  showLabel: boolean;
  degree?: number;
  scaleNotes?: string[]; // Names of notes in the selected scale
  onMouseDown: (note: Note) => void;
  onMouseUp: (note: Note) => void;
  onMouseEnter: (note: Note) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isActive,
  isDimmed = false,
  showLabel,
  degree,
  scaleNotes = [],
  onMouseDown,
  onMouseUp,
  onMouseEnter,
}) => {
  // Determine if this note is in the current scale (if one is selected)
  // If scaleNotes is empty, assume all are valid (not dimmed), unless explicitly passed as dimmed
  // However, the parent controls `isDimmed`.
  // We can also double check specifically for naming highlighting.

  const isBlack = note.isBlack;

  // Base styles for keys
  const whiteKeyStyles =
    "h-64 w-12 bg-white border border-gray-300 rounded-b-md z-0 relative hover:bg-gray-100 flex flex-col justify-end items-center pb-4 text-black font-bold text-xl shadow-sm transition-colors duration-75";
  const blackKeyStyles =
    "h-40 w-10 bg-black absolute z-10 -mx-5 rounded-b-md flex flex-col justify-end items-center pb-3 text-white text-xs leading-tight shadow-md transition-colors duration-75";

  // Active (pressed) styles
  const activeWhiteStyles =
    "!bg-yellow-400 !border-yellow-600 shadow-inner translate-y-[1px]";
  const activeBlackStyles = "!bg-yellow-500 shadow-inner translate-y-[1px]";

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
      className={cn(
        isBlack ? blackKeyStyles : whiteKeyStyles,
        isActive && (isBlack ? activeBlackStyles : activeWhiteStyles),
        isDimmed && dimmedStyles,
        "select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset",
      )}
      onMouseDown={() => onMouseDown(note)}
      onMouseUp={() => onMouseUp(note)}
      onMouseLeave={() => onMouseUp(note)} // Stop playing if dragged off
      onMouseEnter={() => onMouseEnter(note)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {showLabel && (
        <div className="pointer-events-none flex flex-col items-center gap-2">
          {/* Degree Indicator */}
          {degree && (
            <div className="w-6 h-6 rounded-full bg-[#D4AF37] border-2 border-[#B89628] flex items-center justify-center shadow-md">
              <span className="text-black text-xs font-bold">{degree}</span>
            </div>
          )}

          {isBlack ? (
            <div className="flex flex-col items-center scale-75 leading-none">
              {/* Sharp Name */}
              <span
                className={cn(
                  scaleNotes.length && !scaleNotes.includes(note.sharp || "")
                    ? "opacity-30"
                    : "",
                )}
              >
                {note.sharp}
              </span>
              <div className="h-px w-full bg-white/20 my-0.5" />
              {/* Flat Name */}
              <span
                className={cn(
                  scaleNotes.length && !scaleNotes.includes(note.flat || "")
                    ? "opacity-30"
                    : "",
                )}
              >
                {note.flat}
              </span>
            </div>
          ) : (
            <span className="text-lg">{note.name.replaceAll(/\d/g, '')}</span>
          )}
        </div>
      )}
    </button>
  );
};

export default PianoKey;
