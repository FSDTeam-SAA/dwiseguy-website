export interface GlossaryTerm {
    term: string;
    definition: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    {
        term: "Staff",
        definition: "A set of horizontal (side to side) lines and spaces where music notation is written.",
    },
    {
        term: "Time Signature",
        definition: "A symbol that shows how many beats will be in each measure.",
    },
    {
        term: "Measure",
        definition: "Vertical (up and down) line that divide space on the staff where music is written.",
    },
    {
        term: "Tempo",
        definition: "A symbol that indicates the pace (slow - fast) of the beats in a measure or song. Identified by Beats Per Minute or BPM.",
    },
    {
        term: "Clef",
        definition: "A specific symbol that shows where the note names (pitch) are placed on the staff. (Bass, Treble, Drum, Piano, etc).",
    },
    {
        term: "Note Value",
        definition: "A symbol that indicates the duration of a sound. (whole, half, quarter, eighth).",
    },
    {
        term: "Rest",
        definition: "A specific symbol that indicates the duration of silence between notes/sound.",
    },
];
