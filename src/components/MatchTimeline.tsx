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
        <Card className="overflow-hidden w-full">
            {/* Match Header - Responsive layout */}
            <div className="flex items-center justify-center p-4 border-b gap-2 sm:gap-8">
                <TeamBadge team={homeTeam} isHome={true} />
                <div className="text-center min-w-[100px]">
                    <div className="text-lg sm:text-xl font-bold">{finalScore}</div>
                    <div className="text-xs text-muted-foreground">Final</div>
                </div>
                <TeamBadge team={awayTeam} isHome={false} />
            </div>

            {/* Timeline */}
            <div
                ref={timelineRef}
                className="relative max-h-[500px] overflow-y-auto overflow-x-hidden"
            >
                <div className="relative border-l border-muted ml-4 sm:ml-6 p-2 sm:p-4 space-y-3 sm:space-y-4">
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
                                    {"time" in event && event.type !== "half" && event.type !== "full" && (
                                        <span className="absolute -left-6 sm:-left-8 top-0 text-xs font-medium text-muted-foreground w-10 sm:w-12 text-center">
                                            {event.time}
                                        </span>
                                    )}

                                    {/* Goal Event */}
                                    {event.type === "goal" && (
                                        <div className="flex items-center gap-1 sm:gap-2 ml-2">
                                            {/* Home team scorer */}
                                            <div className={`flex flex-1 min-w-0 justify-end ${event.team === "away" ? "opacity-50" : ""}`}>
                                                {event.team === "home" && (
                                                    <PlayerBadge
                                                        player={event.player}
                                                        icon={<GoalIcon />}
                                                        className="text-xs sm:text-sm"
                                                    />
                                                )}
                                            </div>

                                            {/* Score */}
                                            <div className="flex items-center justify-center min-w-[2rem] sm:min-w-[3rem]">
                                                {event.score && (
                                                    <span className="text-xs font-bold text-green-500 whitespace-nowrap">
                                                        {event.score}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Away team scorer */}
                                            <div className={`flex flex-1 min-w-0 justify-start ${event.team === "home" ? "opacity-50" : ""}`}>
                                                {event.team === "away" && (
                                                    <PlayerBadge
                                                        player={event.player}
                                                        icon={<GoalIcon />}
                                                        iconAfter
                                                        className="text-xs sm:text-sm"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Yellow Card Event */}
                                    {event.type === "yellow-card" && (
                                        <div className="flex items-center gap-1 sm:gap-2 ml-2">
                                            <div className={`flex flex-1 min-w-0 justify-end ${event.team === "away" ? "opacity-50" : ""}`}>
                                                {event.team === "home" && (
                                                    <PlayerBadge
                                                        player={event.player}
                                                        icon={<YellowCardIcon />}
                                                        className="text-xs sm:text-sm"
                                                    />
                                                )}
                                            </div>
                                            <div className="w-4 sm:w-8"></div>
                                            <div className={`flex flex-1 min-w-0 justify-start ${event.team === "home" ? "opacity-50" : ""}`}>
                                                {event.team === "away" && (
                                                    <PlayerBadge
                                                        player={event.player}
                                                        icon={<YellowCardIcon />}
                                                        iconAfter
                                                        className="text-xs sm:text-sm"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Half Time / Full Time */}
                                    {(event.type === "half" || event.type === "full") && (
                                        <div className="flex items-center justify-between ml-2 py-1 px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground bg-muted rounded-md">
                                            <span>{event.label}</span>
                                            <span className="font-bold ml-2">{event.score}</span>
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

// Team badge with responsive sizing
const TeamBadge: React.FC<{ team: Team; isHome: boolean }> = ({
    team,
    isHome,
}) => (
    <div className="flex flex-col items-center gap-1 ">
        <div className="rounded-full bg-muted flex items-center justify-center">
            {team.logo ? (
                <img
                    src={team.logo}
                    alt={team.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
            ) : (
                <span className="text-xs">{team.name.charAt(0)}</span>
            )}
        </div>
        <span className="text-xs text-muted-foreground truncate text-center w-full">
            {team.name}
        </span>
    </div>
);

// Player badge with responsive text and optional icon placement
const PlayerBadge: React.FC<{
    player: Player;
    icon?: React.ReactNode;
    iconAfter?: boolean;
    className?: string;
}> = ({
    player,
    icon,
    iconAfter,
    className = ""
}) => (
        <div className={`flex items-center gap-1 min-w-0 ${className}`}>
            {!iconAfter && icon}
            <span className="truncate font-medium">{player.name}</span>
            {iconAfter && icon}
        </div>
    );

export default MatchTimeline;