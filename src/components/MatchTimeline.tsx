// src/components/MatchTimeline.tsx
import { Card } from "@/components/ui/card";
import { GoalIcon, YellowCardIcon } from "@/components/icons";
import type { MatchEvent, Player, Team } from "@/types/match";
import { useEffect, useRef } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (timelineRef.current && events.length > 0) {
            timelineRef.current.scrollTo({
                top: timelineRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [events]);

    return (
        <Card className="overflow-hidden max-w-full">
            {/* Match Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <TeamBadge team={homeTeam} isHome={true} />
                <div className="text-center">
                    <div className="text-xl font-bold">{finalScore}</div>
                    <div className="text-xs text-muted-foreground">Final</div>
                </div>
                <TeamBadge team={awayTeam} isHome={false} />
            </div>

            {/* Timeline */}
            <div
                ref={timelineRef}
                className="relative max-h-[500px] overflow-y-auto overflow-x-hidden"
            >
                <div className="relative border-l border-muted ml-6 p-4 space-y-4">
                    <AnimatePresence>
                        {events.length === 0 ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-muted-foreground text-sm"
                            >
                                No events recorded
                            </motion.p>
                        ) : (
                            events.map((event, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative"
                                >
                                    {"time" in event && (
                                        <span className="absolute -left-8 top-0 text-xs font-medium text-muted-foreground bg-background w-12 text-center">
                                            {event.time}
                                        </span>
                                    )}

                                    {/* Goal Event */}
                                    {event.type === "goal" && (
                                        <div className="flex items-center gap-2 ml-2">
                                            {/* Home team player on left */}
                                            <div className={`flex flex-1 min-w-0 justify-end ${event.team === "away" ? "opacity-50" : ""}`}>
                                                {event.team === "home" && (
                                                    <PlayerBadge player={event.player} />
                                                )}
                                            </div>

                                            {/* Goal icon & score in the center */}
                                            <div className="flex items-center gap-1 min-w-[2rem] justify-center">
                                                <GoalIcon />
                                                {event.score && (
                                                    <span className="text-xs font-bold text-green-500 whitespace-nowrap">
                                                        {event.score}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Away team player on right */}
                                            <div className={`flex flex-1 min-w-0 justify-start ${event.team === "home" ? "opacity-50" : ""}`}>
                                                {event.team === "away" && (
                                                    <PlayerBadge player={event.player} />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Yellow Card Event */}
                                    {event.type === "yellow-card" && (
                                        <div className="flex items-center gap-2 ml-2">
                                            <div
                                                className={`flex-1 min-w-0 text-right ${event.team === "away" ? "opacity-50" : ""
                                                    }`}
                                            >
                                                {event.team === "home" && (
                                                    <PlayerBadge
                                                        player={event.player}
                                                        icon={<YellowCardIcon />}
                                                    />
                                                )}
                                            </div>
                                            <div className="w-8"></div>
                                            <div
                                                className={`flex-1 min-w-0 ${event.team === "home" ? "opacity-50" : ""
                                                    }`}
                                            >
                                                {event.team === "away" && (
                                                    <PlayerBadge
                                                        player={event.player}
                                                        icon={<YellowCardIcon />}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Half Time / Full Time */}
                                    {(event.type === "half" || event.type === "full") && (
                                        <div className="bg-muted rounded-md p-2 text-center text-xs text-muted-foreground">
                                            <span>{event.label}</span> •{" "}
                                            <span className="font-bold">{event.score}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
};

// Team badge
const TeamBadge: React.FC<{ team: Team; isHome: boolean }> = ({
    team,
    isHome,
}) => (
    <div className="flex flex-col items-center gap-1 min-w-[80px] max-w-[80px]">
        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
            {team.logo ? (
                <img
                    src={team.logo}
                    alt={team.name}
                    className="w-8 h-8 object-contain"
                />
            ) : (
                <span className="text-xs">{team.name.charAt(0)}</span>
            )}
        </div>
        <span className="text-xs text-muted-foreground truncate">{team.name}</span>
    </div>
);

// Player badge
const PlayerBadge: React.FC<{ player: Player; icon?: React.ReactNode }> = ({
    player,
    icon,
}) => (
    <div className="flex items-center justify-end gap-1 text-sm min-w-0">
        {icon}
        <span className="font-medium truncate">{player.name}</span>
    </div>
);

export default MatchTimeline;
