// src/components/website/Common/piano/PianoKey.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Note } from "./theory";

interface PianoKeyProps {
  note: Note;
  isActive: boolean;
  showLabel: boolean;
  degree?: number;
  onMouseDown: (note: Note) => void;
  onMouseUp: (note: Note) => void;
  onMouseEnter: (note: Note) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isActive,
  showLabel,
  degree,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
}) => {
  const isBlack = note.isBlack;

  // Senior Engineer Specs: Physical Proportion Refactor
  // White Key: w-24 (96px) / h-64 (256px) - 4:1 Ratio
  const whiteKeyStyles = cn(
    "relative z-0 flex flex-col justify-end items-center transition-all duration-100 shrink-0",
    "w-24 h-64 md:h-72 lg:flex-1 lg:w-auto",
    "bg-gradient-to-b from-white via-[#F9FAFB] to-[#E5E7EB]", // Professional Gradation
    "border-r border-b border-gray-400 rounded-b-[4px]", // Hardware edge
    "hover:brightness-105 active:brightness-95",
  );

  // Black Key: 60% height and width of White Key
  const blackKeyStyles = cn(
    "absolute z-10 top-0 left-full -translate-x-1/2 rounded-b-md flex flex-col justify-end items-center transition-all duration-100",
    "w-[60%] h-[60%]", // Precise Scaling
    "bg-gradient-to-b from-[#444] to-black",
    "shadow-[0_8px_10px_rgba(0,0,0,0.6)]", // Skeuomorphic depth
  );

  // Tactile "Press" depth Feedback
  const activeWhiteStyles = "scale-[0.98] shadow-inner bg-gradient-to-b from-gray-100 to-gray-200 z-0";
  const activeBlackStyles = "scale-[0.96] shadow-inner bg-gradient-to-b from-[#222] to-black z-20";

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

  return (
    <button
      type="button"
      aria-label={`${note.isBlack ? note.sharp + "/" + note.flat : note.name} octave ${note.octave}`}
      aria-pressed={isActive}
      className={cn(
        isBlack ? blackKeyStyles : whiteKeyStyles,
        isActive && (isBlack ? activeBlackStyles : activeWhiteStyles),
        "select-none cursor-pointer focus:outline-none group overflow-visible",
      )}
      onMouseDown={() => onMouseDown(note)}
      onMouseUp={() => onMouseUp(note)}
      onMouseLeave={() => onMouseUp(note)}
      onMouseEnter={() => onMouseEnter(note)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {/* Visual Alignment Container */}
      <div className="pointer-events-none flex flex-col items-center w-full h-full justify-end pb-2 gap-3">
        {/* Scale Degree - Only if note is in scale */}
        {degree && (
          <div className={cn(
            "rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center shadow-lg animate-in fade-in zoom-in-50",
            isBlack ? "w-6 h-6 mb-4" : "w-8 h-8 mb-2"
          )}>
            <span className={cn("text-black font-extrabold", isBlack ? "text-[10px]" : "text-sm")}>
              {degree}
            </span>
          </div>
        )}

        {/* Minimalist Labeling at the very bottom edge */}
        {showLabel && (
          <div className={cn(
            "font-black tracking-tighter text-gray-500 uppercase",
            isBlack ? "text-[10px] mb-3" : "text-xs mb-2"
          )}>
            <span>{note.name.replace(/\d/, "")}</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default PianoKey;
// import React from "react";
// import { cn } from "@/lib/utils";
// import { Note } from "./theory";

// interface PianoKeyProps {
//   note: Note;
//   isActive: boolean;
//   isDimmed?: boolean;
//   showLabel: boolean;
//   degree?: number;
//   onMouseDown: (note: Note) => void;
//   onMouseUp: (note: Note) => void;
// }

// const PianoKey: React.FC<PianoKeyProps> = ({
//   note, isActive, isDimmed, showLabel, degree, onMouseDown, onMouseUp
// }) => {
//   const isBlack = note.isBlack;

//   // White Key Styles: Standardized for mobile landscape visibility
//   const whiteKeyStyles = "h-64 md:h-80 w-12 md:w-14 bg-white border-r border-gray-300 z-0 relative flex flex-col justify-end items-center pb-6 text-black font-black text-sm transition-all active:bg-gray-200";

//   // Black Key Styles: "On the line" positioning (translate-x-1/2 left-full)
//   const blackKeyStyles = "h-40 md:h-48 w-8 md:w-10 bg-black absolute z-10 left-full -translate-x-1/2 top-0 rounded-b-md flex flex-col justify-end items-center pb-4 text-white text-[10px] shadow-xl transition-all";

//   // Active Highlight Styles
//   const activeStyles = isBlack ? "!bg-blue-600 shadow-inner" : "!bg-blue-100 shadow-inner";
//   const dimmedStyles = "opacity-40 grayscale-[0.5] pointer-events-none";

//   return (
//     <button
//       onMouseDown={() => onMouseDown(note)}
//       onMouseUp={() => onMouseUp(note)}
//       onMouseLeave={() => onMouseUp(note)}
//       className={cn(
//         isBlack ? blackKeyStyles : whiteKeyStyles,
//         isActive && activeStyles,
//         isDimmed && dimmedStyles,
//         "select-none outline-none"
//       )}
//     >
//       {showLabel && (
//         <div className="flex flex-col items-center gap-2 pointer-events-none">
//           {degree && (
//             <div className="w-6 h-6 rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center mb-1">
//               <span className="text-black text-[10px] font-bold">{degree}</span>
//             </div>
//           )}
//           {isBlack ? (
//             <div className="flex flex-col items-center leading-none opacity-80">
//               <span>{note.sharp}</span>
//               <div className="h-px w-4 bg-white/20 my-1" />
//               <span>{note.flat}</span>
//             </div>
//           ) : (
//             <span className="text-lg opacity-70">{note.name.replace(/\d/g, '')}</span>
//           )}
//         </div>
//       )}
//     </button>
//   );
// };

// export default PianoKey;
