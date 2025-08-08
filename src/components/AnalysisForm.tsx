// components/AnalysisForm.tsx
import { useState } from "react";
import { analyzeCommentary } from "@/lib/api";
import MatchTimeline from "./MatchTimeline";
import type { RawMatchData } from "@/types/match";
import { mapRawToMatchEvents } from "@/lib/matchMapper";

export default function AnalysisForm() {
    const [commentary, setCommentary] = useState("");
    const [matchData, setMatchData] = useState<RawMatchData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMatchData(null);

        try {
            const data = await analyzeCommentary({ commentary });
            setMatchData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Dummy teams for now (you can extract from data)
    const homeTeam = { name: matchData?.home_team || "Home Team", logo: "/logo.png" };
    const awayTeam = { name: matchData?.away_team || "Away Team", logo: "/logo.png" };

    const { finalScore, events } = matchData
        ? mapRawToMatchEvents(matchData, homeTeam, awayTeam)
        : { finalScore: "0 - 0", events: [] };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={commentary}
                    onChange={(e) => setCommentary(e.target.value)}
                    placeholder="Paste match commentary here..."
                    className="w-full h-40 p-3 border border-gray-600 rounded bg-gray-800 text-white resize-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white"
                >
                    {loading ? "Analyzing..." : "Analyze Match"}
                </button>
            </form>

            {error && <p className="text-red-400">Error: {error}</p>}

            {matchData && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Match Timeline</h2>
                    <MatchTimeline
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        finalScore={finalScore}
                        events={events}
                    />
                </div>
            )}
        </div>
    );
}