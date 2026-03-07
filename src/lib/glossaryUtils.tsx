import React from "react";
import { GLOSSARY_TERMS } from "@/constants/glossary";
import GlossaryTooltip from "@/components/GlossaryTooltip";

/**
 * Parses text and replaces glossary terms with GlossaryTooltip components.
 * Case-insensitive matching, but preserves original casing in the UI.
 */
export const GlossaryText: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;

    // Sort terms by length (descending) to match "Time Signature" before "Time"
    const sortedTerms = [...GLOSSARY_TERMS].sort((a, b) => b.term.length - a.term.length);

    // Create a regex that matches any of the terms (case-insensitive)
    // \b ensures we match whole words only
    const pattern = new RegExp(String.raw`\b(${sortedTerms.map(t => t.term).join("|")})\b`, "gi");

    const parts = text.split(pattern);

    return (
        <>
            {parts.map((part, i) => {
                const matchingTerm = sortedTerms.find(
                    t => t.term.toLowerCase() === part.toLowerCase()
                );

                if (matchingTerm) {
                    return (
                        <GlossaryTooltip
                            key={`term-${matchingTerm.term}-${i}`}
                            term={matchingTerm.term}
                            definition={matchingTerm.definition}
                        >
                            {part}
                        </GlossaryTooltip>
                    );
                }

                return <span key={`text-${i}`}>{part}</span>;
            })}
        </>
    );
};
