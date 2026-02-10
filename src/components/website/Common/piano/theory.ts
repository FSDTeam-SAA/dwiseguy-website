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

// Helper to generate notes across octaves shifted by a root key
export const generateNotes = (rootKey: string): Note[] => {
  const masterPool: Note[] = [];
  const startOctave = 1;
  const endOctave = 6;

  // Generate a master pool of notes across multiple octaves
  for (let oct = startOctave; oct <= endOctave; oct++) {
    BASE_NOTES.forEach((base) => {
      const fileNoteName = base.flat || base.name;
      const filename = `/music/mp3/${fileNoteName}${oct}.mp3`;

      masterPool.push({
        ...base,
        octave: oct,
        filename,
        name: `${base.name}${oct}`,
        sharp: base.sharp,
        flat: base.flat
      });
    });
  }

  // Find the first index of the rootKey in the master pool (starting at octave 2 for a good middle range)
  let startIndex = masterPool.findIndex(n => {
    const nName = n.name.replaceAll(/\d/g, '');
    const nFlat = n.flat?.replaceAll(/\d/g, '');
    const nSharp = n.sharp?.replaceAll(/\d/g, '');
    return (nName === rootKey || nFlat === rootKey || nSharp === rootKey) && n.octave >= 2;
  });

  if (startIndex === -1) {
    // Fallback: try to find it in octave 1 if 2 fails, or just default to C2 (index 12 usually)
    startIndex = masterPool.findIndex(n => {
      const nName = n.name.replaceAll(/\d/g, '');
      return nName === 'C' && n.octave === 2;
    });
    if (startIndex === -1) startIndex = 0;
  }

  // Ensure we have enough notes. If not, we might need to extend generation or handle edge case.
  // 37 notes = 3 octaves inclusively (0..36)
  return masterPool.slice(startIndex, startIndex + 37);
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
export const getChordIndices = (rootIndex: number): number[] => {
  return [rootIndex, rootIndex + 4, rootIndex + 7]; // Default Major for now
};

export const getDiatonicChordIndices = (
  rootIndex: number,
  allNotes: Note[],
  scaleNotes: string[]
): number[] => {
  const rootNote = allNotes[rootIndex];
  const rootNameOnly = rootNote.name.replaceAll(/\d/g, '');

  // If the note isn't in the scale, default to a Major Triad (0, 4, 7 semitones)
  if (!scaleNotes.includes(rootNameOnly)) {
    return [rootIndex, rootIndex + 4, rootIndex + 7];
  }

  // Find the next scale degrees (skip 1 for the 3rd, skip 3 for the 5th)
  const chordIndices = [rootIndex];
  let found = 1;
  let checkIndex = rootIndex + 1;

  while (found < 3 && checkIndex < allNotes.length) {
    const checkName = allNotes[checkIndex].name.replaceAll(/\d/g, '');
    const isNextDegree = scaleNotes.includes(checkName);

    if (isNextDegree) {
      const degreesInBetween = countScaleDegreesBetween(rootIndex, checkIndex, allNotes, scaleNotes);
      if ((found === 1 && degreesInBetween === 2) || (found === 2 && degreesInBetween === 4)) {
        chordIndices.push(checkIndex);
        found++;
      }
    }
    checkIndex++;
  }

  return chordIndices;
};

// Helper to count how many scale notes are between two indices
const countScaleDegreesBetween = (start: number, end: number, allNotes: Note[], scaleNotes: string[]) => {
  let count = 0;
  for (let i = start + 1; i <= end; i++) {
    if (scaleNotes.includes(allNotes[i].name.replaceAll(/\d/g, ''))) count++;
  }
  return count;
};

