// src/components/MatchTimeline.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoalIcon, YellowCardIcon } from "@/components/icons"; // Move icons to a folder
import type { MatchEvent, Player, Team } from "@/types/match";
import { type FC } from "react";

interface MatchTimelineProps {
    homeTeam: Team;
    awayTeam: Team;
    finalScore: string;
    events: MatchEvent[];
}

const MatchTimeline: FC<MatchTimelineProps> = ({
    homeTeam,
    awayTeam,
    finalScore,
    events,
}) => {
    return (
        <Card className="bg-black text-white border border-gray-700 rounded-lg overflow-hidden max-w-md mx-auto font-sans">
            {/* Match Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <TeamBadge team={homeTeam} isHome={true} />
                <div className="text-center">
                    <div className="text-xl font-bold">{finalScore}</div>
                    <div className="text-xs text-gray-400">Final</div>
                </div>
                <TeamBadge team={awayTeam} isHome={false} />
            </div>

            {/* Timeline */}
            <div className="relative border-l border-gray-700 ml-6 p-4 space-y-4">
                {events.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">No events recorded</p>
                ) : (
                    events.map((event, index) => (
                        <div key={index} className="relative">
                            {"time" in event && (
                                <span className="absolute -left-8 top-0 text-xs font-medium text-gray-400 bg-black w-12 text-center">
                                    {event.time}
                                </span>
                            )}

                            {event.type === "goal" && (
                                <div className="flex items-center gap-2 ml-2">
                                    <div
                                        className={`flex-1 text-right ${event.team === "away" ? "opacity-50" : ""}`}
                                    >
                                        {event.team === "home" && (
                                            <PlayerBadge player={event.player} />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center w-8">
                                        <GoalIcon />
                                        {event.score && (
                                            <span className="absolute -right-8 text-xs font-bold text-green-400">
                                                {event.score}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className={`flex-1 ${event.team === "home" ? "opacity-50" : ""}`}
                                    >
                                        {event.team === "away" && (
                                            <PlayerBadge player={event.player} />
                                        )}
                                    </div>
                                </div>
                            )}

                            {event.type === "yellow-card" && (
                                <div className="flex items-center gap-2 ml-2">
                                    <div
                                        className={`flex-1 text-right ${event.team === "away" ? "opacity-50" : ""}`}
                                    >
                                        {event.team === "home" && (
                                            <PlayerBadge player={event.player} icon={<YellowCardIcon />} />
                                        )}
                                    </div>
                                    <div className="w-8"></div>
                                    <div
                                        className={`flex-1 ${event.team === "home" ? "opacity-50" : ""}`}
                                    >
                                        {event.team === "away" && (
                                            <PlayerBadge player={event.player} icon={<YellowCardIcon />} />
                                        )}
                                    </div>
                                </div>
                            )}

                            {(event.type === "half" || event.type === "full") && (
                                <div className="bg-gray-900 rounded-md p-2 text-center text-xs text-gray-300">
                                    <span>{event.label}</span> • <span className="font-bold">{event.score}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

// Subcomponents
const TeamBadge: React.FC<{ team: Team; isHome: boolean }> = ({ team, isHome }) => (
    <div className="flex flex-col items-center gap-1">
        <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain" />
        <span className="text-xs text-gray-300 max-w-20 truncate">{team.name}</span>
    </div>
);

const PlayerBadge: React.FC<{ player: Player; icon?: React.ReactNode }> = ({ player, icon }) => (
    <div className="flex items-center justify-end gap-1 text-sm">
        {icon}
        <span className="text-white">{player.name}</span>
    </div>
);

export default MatchTimeline;