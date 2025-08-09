// src/lib/api.ts
import type { MatchResultResponse, RawMatchData } from "@/types/match";

export interface AnalyzeInput {
    commentary: string;
}

export interface ApiError {
    detail: string;
}


export const analyzeCommentary = async (
    input: AnalyzeInput
): Promise<MatchResultResponse> => {
    const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        let errorMessage = "تحليل التعليق فشل";
        try {
            const errorData: ApiError = await res.json();
            errorMessage = errorData.detail || errorMessage;
        } catch (e) {
            errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    const data: MatchResultResponse = await res.json();

    console.log("Raw match data:", data);
    // Fallback defaults if backend returns incomplete data
    return {
        ...data,
        score: data.score ?? { home: 0, away: 0 },
        analysis: {
            events: data.analysis?.events ?? [],
            players: data.analysis?.players ?? []
        },
    };
};

export const analyzeMedia = async (
    file: File
): Promise<MatchResultResponse> => {
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