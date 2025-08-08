// src/lib/api.ts
import type { RawMatchData } from "@/types/match";

export interface AnalyzeInput {
    commentary: string;
}

export const analyzeCommentary = async (
    input: AnalyzeInput
): Promise<RawMatchData> => {
    const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        throw new Error("Analysis failed");
    }

    return res.json();
};

export const analyzeMedia = async (
    file: File
): Promise<RawMatchData> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch("http://localhost:8000/analyze-media", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Media analysis failed");
    }

    return res.json();
};