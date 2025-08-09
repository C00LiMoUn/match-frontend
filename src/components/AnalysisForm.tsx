// src/components/AnalysisForm.tsx
import { useState, useRef } from "react";
import { analyzeCommentary, analyzeMedia } from "@/lib/api";
import MatchTimeline from "./MatchTimeline";
import type { MatchResultResponse, RawMatchData } from "@/types/match";
import { mapRawToMatchEvents } from "@/lib/matchMapper";
import { FileUploader } from "@/components/ui/file-uploader";

// shadcn imports
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Send, History, FileText, UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function AnalysisForm() {
    const [commentary, setCommentary] = useState("");
    const [matchData, setMatchData] = useState<MatchResultResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState("text");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (activeTab === "file" && file) {
            if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
                return await handleMediaUpload(file);
            } else {
                const content = await readFileAsText(file);
                if (!content.trim()) {
                    toast.error("The file is empty");
                    return;
                }
                return await analyzeTextContent(content);
            }
        }

        if (!commentary.trim()) {
            toast.error("Please provide commentary to analyze");
            return;
        }

        await analyzeTextContent(commentary);
    };

    const handleMediaUpload = async (file: File) => {
        setLoading(true);
        setProgress(0);
        setMatchData(null);

        const toastId = toast.loading("Uploading media file...", {
            description: "Processing your audio/video file"
        });

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
            const data = await analyzeMedia(file);
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
                    onClick: () => handleMediaUpload(file),
                },
                duration: 5000,
            });
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    };

    const analyzeTextContent = async (content: string) => {
        setLoading(true);
        setProgress(0);
        setMatchData(null);

        const toastId = toast.loading("Analyzing commentary...", {
            description: "Processing your match data"
        });

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
            const data = await analyzeCommentary({ commentary: content });
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
                    onClick: () => analyzeTextContent(content),
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
        setActiveTab("text");
        setFile(null);
    };

    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    resolve(event.target.result as string);
                } else {
                    reject(new Error("Failed to read file"));
                }
            };
            reader.onerror = () => {
                reject(new Error("Error reading file"));
            };
            reader.readAsText(file);
        });
    };

    const homeTeam = { name: matchData?.home_team || "Home Team", logo: "/logo.png" };
    const awayTeam = { name: matchData?.away_team || "Away Team", logo: "/logo.png" };
    const { finalScore, events } = matchData
        ? mapRawToMatchEvents(matchData, homeTeam, awayTeam)
        : { finalScore: "0 - 0", events: [] };
    console.log("Analysis result:", events);
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Analyze Commentary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="text">
                                <FileText className="w-4 h-4 mr-2" />
                                Text Input
                            </TabsTrigger>
                            <TabsTrigger value="file">
                                <UploadCloud className="w-4 h-4 mr-2" />
                                File Upload
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="text" className="pt-4">
                            <Textarea
                                value={commentary}
                                onChange={(e) => setCommentary(e.target.value)}
                                placeholder="Paste match commentary here..."
                                className="min-h-32 max-h-40 resize-none overflow-auto p-3"
                                disabled={loading}
                            />
                        </TabsContent>

                        <TabsContent value="file" className="pt-4">
                            <FileUploader
                                value={file ? [file] : []}
                                onChange={(files) => setFile(files[0] || null)}
                                onRemove={() => setFile(null)}
                                isLoading={loading}
                            />
                        </TabsContent>
                    </Tabs>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={loading || (activeTab === "file" && !file)}
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