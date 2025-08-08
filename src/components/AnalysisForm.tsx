// src/components/AnalysisForm.tsx
import { useState } from "react";
import { analyzeCommentary } from "@/lib/api";
import MatchTimeline from "./MatchTimeline";
import type { RawMatchData } from "@/types/match";
import { mapRawToMatchEvents } from "@/lib/matchMapper";

// shadcn imports
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

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
            setError(err instanceof Error ? err.message : "Analysis failed");
        } finally {
            setLoading(false);
        }
    };

    const homeTeam = { name: matchData?.home_team || "Home Team", logo: "/logo.png" };
    const awayTeam = { name: matchData?.away_team || "Away Team", logo: "/logo.png" };
    const { finalScore, events } = matchData
        ? mapRawToMatchEvents(matchData, homeTeam, awayTeam)
        : { finalScore: "0 - 0", events: [] };

    return (
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Soccer Commentary Analyzer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Textarea
                        value={commentary}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentary(e.target.value)}
                        placeholder="Paste match commentary here..."
                        className="min-h-32 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Analyze Match
                            </>
                        )}
                    </Button>
                </form>

                {error && (
                    <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded border border-red-800">
                        {error}
                    </p>
                )}

                {matchData && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">Match Timeline</h2>
                        <MatchTimeline
                            homeTeam={homeTeam}
                            awayTeam={awayTeam}
                            finalScore={finalScore}
                            events={events}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}