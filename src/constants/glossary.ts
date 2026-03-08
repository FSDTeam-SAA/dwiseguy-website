export interface GlossaryTerm {
    term: string;
    definition: string;
    image?: string;
    lesson?: string;
    category: "Fundamentals" | "Rhythm" | "Note Anatomy" | "Values & Rests";
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    // LESSON 1: THE ELEMENTS
    {
        term: "Staff",
        lesson: "Lesson 1",
        category: "Fundamentals",
        image: "/images/glossary/Staff.png",
        definition: "A set of horizontal (side to side) lines and spaces where music notation is written. Think of it like lined notebook paper or a ruler.",
    },
    {
        term: "Measure",
        lesson: "Lesson 1",
        category: "Fundamentals",
        image: "/images/glossary/Measure.png",
        definition: "Vertical (up and down) lines that divide space on the staff where music is written. Similar to the inch line on a ruler.",
    },
    {
        term: "Time Signature",
        lesson: "Lesson 1",
        category: "Rhythm",
        image: "/images/glossary/Time Signature.png",
        definition: "A symbol that shows how many beats will be in each measure. The most common is 4 beats.",
    },
    {
        term: "Clef",
        lesson: "Lesson 1",
        category: "Fundamentals",
        image: "/images/glossary/Bass Clef.png",
        definition: "A specific symbol that shows where the note names (pitch) are placed on the staff. Common types include Bass, Treble, Drum, and Piano.",
    },
    {
        term: "Key Signature",
        lesson: "Lesson 1",
        category: "Fundamentals",
        image: "/images/glossary/Key Signature.png",
        definition: "A collection of sharp and flat symbols that determine how notes interact and what key a song is in.",
    },
    {
        term: "Tempo",
        lesson: "Lesson 1",
        category: "Rhythm",
        definition: "The pace of the music—how slow or fast it is played. Identified by Beats Per Minute (BPM).",
    },
    {
        term: "BPM",
        lesson: "Lesson 1",
        category: "Rhythm",
        definition: "Beats Per Minute. A numerical value that identifies the tempo of a song.",
    },

    // LESSON 2: NOTE ANATOMY
    {
        term: "Note Head",
        lesson: "Lesson 2",
        category: "Note Anatomy",
        definition: "The solid or hollow oval part of a note symbol.",
    },
    {
        term: "Stem",
        lesson: "Lesson 2",
        category: "Note Anatomy",
        definition: "The single vertical line attached to the left or right of a note head.",
    },
    {
        term: "Flag",
        lesson: "Lesson 2",
        category: "Note Anatomy",
        definition: "A curvy marking attached to the top or bottom of a note stem.",
    },
    {
        term: "Beam",
        lesson: "Lesson 2",
        category: "Note Anatomy",
        definition: "A horizontal line that groups and replaces at least two flag markings when notes are side by side.",
    },

    // LESSON 2: NOTE VALUES
    {
        term: "Note Value",
        lesson: "Lesson 2",
        category: "Values & Rests",
        definition: "A symbol that indicates the duration of a sound (how long or short it is played).",
    },
    {
        term: "Whole Note",
        lesson: "Lesson 2",
        category: "Values & Rests",
        definition: "A hollow oval note with no stem. It uses all 4 beats in a standard measure.",
    },
    {
        term: "Half Note",
        lesson: "Lesson 2",
        category: "Values & Rests",
        definition: "A hollow oval note with a stem. It uses 2 beats (half of a standard measure).",
    },
    {
        term: "Quarter Note",
        lesson: "Lesson 2",
        category: "Values & Rests",
        definition: "A solid oval note with a stem. It uses 1 beat (a quarter of a standard measure).",
    },
    {
        term: "Eighth Note",
        lesson: "Lesson 2",
        category: "Values & Rests",
        definition: "A solid oval note with a stem and a flag or beam. It uses 1/2 of a single beat.",
    },

    // LESSON 4: RESTS
    {
        term: "Rest",
        lesson: "Lesson 4",
        category: "Values & Rests",
        definition: "A specific symbol that indicates the duration of silence between notes or sounds.",
    },
];
