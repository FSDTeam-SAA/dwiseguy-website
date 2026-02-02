export type Note = {
  name: string;
  sharp?: string;
  flat?: string;
  filename: string;
  isBlack: boolean;
  octave: number;
};

// Base notes for one octave
const BASE_NOTES = [
  { name: 'C', isBlack: false },
  { name: 'C#', sharp: 'C#', flat: 'Db', isBlack: true },
  { name: 'D', isBlack: false },
  { name: 'D#', sharp: 'D#', flat: 'Eb', isBlack: true },
  { name: 'E', isBlack: false },
  { name: 'F', isBlack: false },
  { name: 'F#', sharp: 'F#', flat: 'Gb', isBlack: true },
  { name: 'G', isBlack: false },
  { name: 'G#', sharp: 'G#', flat: 'Ab', isBlack: true },
  { name: 'A', isBlack: false },
  { name: 'A#', sharp: 'A#', flat: 'Bb', isBlack: true },
  { name: 'B', isBlack: false },
];

// Helper to generate notes across octaves
export const generateNotes = (startOctave: number, endOctave: number): Note[] => {
  const notes: Note[] = [];
  for (let oct = startOctave; oct <= endOctave; oct++) {
    BASE_NOTES.forEach((base) => {
      // Use Flat notation for filenames as per the directory structure
      const fileNoteName = base.flat || base.name;
      const filename = `/music/mp3/${fileNoteName}${oct}.mp3`;

      notes.push({
        ...base,
        octave: oct,
        filename,
        // Unique identifier combining name and octave
        name: `${base.name}${oct}`,
        // Keep canonical sharp/flat names for display
        sharp: base.sharp,
        flat: base.flat
      });
    });
  }
  // Remove notes that might be out of range if needed, or stick to full octaves
  // For a standard starting C to C, we usually end on the first note of the next octave
  notes.push({
    name: `C${endOctave + 1}`,
    filename: `/music/mp3/C${endOctave + 1}.mp3`,
    isBlack: false,
    octave: endOctave + 1
  })

  return notes;
};

// Intervals (semitones)
const SCALES_INTERVALS: { [key: string]: number[] } = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10], // Natural Minor
};

export const KEYS = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
];

export const getScaleInfo = (root: string, scaleType: 'Major' | 'Minor' = 'Major') => {
  const chromatic = BASE_NOTES.map(n => n.name);
  let rootIndex = chromatic.findIndex(n => n === root);
  if (rootIndex === -1) {
    const alias = BASE_NOTES.find(n => n.flat === root || n.sharp === root);
    if (alias) rootIndex = chromatic.indexOf(alias.name);
  }

  if (rootIndex === -1) return { notes: [], degrees: new Map<string, number>() };

  const intervals = SCALES_INTERVALS[scaleType];
  const degrees = new Map<string, number>();
  const notes: string[] = [];

  intervals.forEach((interval, index) => {
    const noteIndex = (rootIndex + interval) % 12;
    const note = BASE_NOTES[noteIndex];
    const aliases = [note.name, note.flat, note.sharp].filter(Boolean) as string[];

    aliases.forEach(alias => {
      notes.push(alias);
      degrees.set(alias, index + 1);
    });
  });

  return { notes, degrees };
};

export const getScaleNotes = (root: string, scaleType: 'Major' | 'Minor' = 'Major'): string[] => {
  return getScaleInfo(root, scaleType).notes;
};

// Get Triad (Root, 3rd, 5th) indices relative to the note's position in the full array
// This expects the 'index' to be the index in the full generated notes array
export const getChordIndices = (rootIndex: number): number[] => {
  // Major triad: 0, 4, 7 semitones
  // We explicitly requested "based on the selected musical key" -> "Root, 3rd, 5th"
  // However, usually "Chord Mode" on a simple piano roll often just implies the chord *built on that key*
  // If the request means "Scalic Chords" (e.g. I, ii, iii), that's more complex.
  // The prompt says: "clicking a single key should trigger the corresponding triad (Root, 3rd, 5th) based on the selected musical key."
  // This strongly implies diatonic chords. If we are in C Major, and click D, we should get D Minor (D, F, A).
  // If we click E, we get E Minor.
  // However, implementing full diatonic chord logic requires knowing which scale degree the clicked note is.

  // START SIMPLE: Let's assume Chromatic Major Chords first, OR if a key is selected, we try to fit it.
  // Re-reading: "based on the selected musical key".
  // Strategy: 
  // 1. Identify if the clicked note is in the selected scale.
  // 2. If yes, find its indices for 3rd and 5th WITHIN the scale, then map back to chromatic.
  // 3. If no, just play a Major triad? Or mute? Let's default to Major Triad (0, 4, 7) if no key or out of key, 
  //    and Diatonic if in key.

  // Actually, for a visualization tool, "Chord Mode" usually just plays a fixed shape or a smart shape.
  // Let's implement function `getDiatonicTriad` that takes the note and the current Scale to return frequency/indices.

  return [rootIndex, rootIndex + 4, rootIndex + 7]; // Default Major for now, will refine in component logic
};
