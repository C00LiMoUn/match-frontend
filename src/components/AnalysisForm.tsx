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
import { Loader2, Send, History, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";


export default function AnalysisForm() {
    const [commentary, setCommentary] = useState("");
    const [matchData, setMatchData] = useState<RawMatchData | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentary.trim()) {
            toast.error("Please enter some commentary to analyze");
            return;
        }

        setLoading(true);
        setProgress(0);
        setMatchData(null);

        const toastId = toast.loading("Analyzing commentary...", {
            description: "Processing your match data"
        });

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 10;
            });
        }, 300);

        try {
            const data = await analyzeCommentary({ commentary });
            setMatchData(data);
            setProgress(100);

            toast.success("Analysis Complete", {
                id: toastId,
                description: "Match events have been successfully extracted",
                duration: 3000,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Analysis failed";
            toast.error("Analysis Error", {
                id: toastId,
                description: errorMessage,
                action: {
                    label: "Try again",
                    onClick: handleSubmit,
                },
                duration: 5000,
            });
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    };

    const handleExampleClick = () => {
        setCommentary(`45+2' - GOAL! Manchester United 1-0 Liverpool. Bruno Fernandes scores with a brilliant strike from outside the box!
        56' - Yellow card for Virgil van Dijk after a late challenge on Marcus Rashford.
        78' - GOAL! Manchester United 2-0 Liverpool. Marcus Rashford doubles the lead with a clinical finish!
        89' - Substitution for Liverpool: Thiago Alcântara replaces Jordan Henderson.`);
    };

    const homeTeam = { name: matchData?.home_team || "Home Team", logo: "/logo.png" };
    const awayTeam = { name: matchData?.away_team || "Away Team", logo: "/logo.png" };
    const { finalScore, events } = matchData
        ? mapRawToMatchEvents(matchData, homeTeam, awayTeam)
        : { finalScore: "0 - 0", events: [] };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Analyze Commentary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            value={commentary}
                            onChange={(e) => setCommentary(e.target.value)}
                            placeholder="Paste match commentary here..."
                            className="min-h-32 max-h-40 resize-none overflow-auto p-3"
                            disabled={loading}
                        />

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="flex-1"
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

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleExampleClick}
                                disabled={loading}
                            >
                                <History className="mr-2 h-4 w-4" />
                                Load Example
                            </Button>
                        </div>

                        {loading && (
                            <Progress value={progress} className="h-2" />
                        )}
                    </form>
                </CardContent>
            </Card>

            {matchData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Match Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MatchTimeline
                            homeTeam={homeTeam}
                            awayTeam={awayTeam}
                            finalScore={finalScore}
                            events={events}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}