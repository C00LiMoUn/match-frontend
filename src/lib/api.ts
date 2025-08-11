// src/lib/api.ts
import type { MatchResultResponse } from "@/types/match";
import { http } from "@/lib/http";

export interface AnalyzeInput {
    commentary: string;
}

export interface ApiError {
    detail: string;
}


export const analyzeCommentary = async (
    input: AnalyzeInput
): Promise<MatchResultResponse> => {
    const data = await http<MatchResultResponse>({
        path: "/analyze",
        method: "POST",
        body: input,
    });

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

    return await http<MatchResultResponse>({
        path: "/analyze-media",
        method: "POST",
        asFormData: true,
        // body typed as unknown to keep http generic
        body: formData as unknown as BodyInit,
    });
};