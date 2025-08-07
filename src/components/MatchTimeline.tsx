// components/MatchTimeline.tsx
import { Card } from "@/components/ui/card";
import type { MatchEvent, Player, Team } from "@/types/match";
import { type FC } from "react"; // <-- type-only import

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
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-700">
                <div className="flex-1 text-center">
                    <img
                        src={homeTeam.logo}
                        alt={homeTeam.name}
                        className="w-8 h-8 mx-auto object-contain"
                    />
                    <span className="text-xs text-gray-300">{homeTeam.name}</span>
                </div>
                <div className="mx-4 text-center">
                    <div className="text-lg font-bold">{finalScore}</div>
                    <div className="text-xs text-gray-400">Fin de match</div>
                </div>
                <div className="flex-1 text-center">
                    <img
                        src={awayTeam.logo}
                        alt={awayTeam.name}
                        className="w-8 h-8 mx-auto object-contain"
                    />
                    <span className="text-xs text-gray-300">{awayTeam.name}</span>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative border-l border-gray-700 ml-6 pb-4">
                {events.map((event, index) => (
                    <div key={index} className="mb-4 relative">
                        {/* Time */}
                        {"time" in event && (
                            <span className="absolute -left-7 top-0 text-xs text-gray-400 bg-black w-12 text-center">
                                {event.time}
                            </span>
                        )}

                        {/* Event */}
                        {event.type === "half" || event.type === "full" ? (
                            <div className="bg-gray-900 rounded-md p-2 text-center text-xs flex items-center justify-between mx-2">
                                <span>{event.label}</span>
                                <span className="font-bold">{event.score}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                {/* Home Player */}
                                <div
                                    className={`flex-1 text-right ${event.team === "away" ? "opacity-50" : ""
                                        }`}
                                >
                                    {event.team === "home" && <PlayerLink player={event.player} />}
                                </div>

                                {/* Icon */}
                                <div className="flex items-center justify-center w-8">
                                    {event.type === "yellow-card" && <YellowCardIcon />}
                                    {event.type === "red-yellow-card" && <RedYellowCardIcon />}
                                    {event.type === "goal" && (
                                        <>
                                            <GoalIcon />
                                            <span className="absolute -right-8 text-sm font-bold">
                                                {event.score}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Away Player */}
                                <div
                                    className={`flex-1 ${event.team === "home" ? "opacity-50" : ""
                                        }`}
                                >
                                    {event.team === "away" && <PlayerLink player={event.player} />}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

// Subcomponents
const PlayerLink: React.FC<{ player: Player }> = ({ player }) => (
    <a href={player.href} className="text-white hover:underline text-sm">
        {player.name}
    </a>
);

const YellowCardIcon = () => (
    <svg width="11" height="14" className="text-yellow-400">
        <rect width="10" height="14" x="1" rx="2" fill="#FFCE00" />
    </svg>
);

const RedYellowCardIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <path fill="#ffce00" d="M13.714 4.571h9.143c2.525 0 4.571 2.047 4.571 4.571v18.286c0 2.525-2.047 4.571-4.571 4.571h-9.143c-2.525 0-4.571-2.047-4.571-4.571v-18.286c0-2.525 2.047-4.571 4.571-4.571z" />
        <path fill="#df2357" d="M9.143 0h9.143c2.525 0 4.571 2.047 4.571 4.571v18.286c0 2.525-2.047 4.571-4.571 4.571h-9.143c-2.525 0-4.571-2.047-4.571-4.571v-18.286c0-2.525 2.047-4.571 4.571-4.571z" />
    </svg>
);

const GoalIcon = () => (
    <svg width="15" height="15">
        <g transform="translate(.63 .5)" fill="none" fillRule="evenodd">
            <circle cx="7" cy="7" r="6" fill="#FDFDFD" />
            <path
                fill="#222"
                d="M7 0h.28H7a6.8 6.8 0 01.56.02l.14.01.25.03h.02l.04.01.22.04.13.02.14.03.13.03.24.06.08.03.23.07.04.01.53.2.03.01c.95.42 1.8 1.03 2.47 1.8a5.96 5.96 0 01.62.82l.08.13.06.1c.42.7.72 1.49.87 2.32l.02.07a7.47 7.47 0 01.07 1.85 6.97 6.97 0 01-.94 2.9l-.03.05-.08.13.1-.18-.2.34-.03.04-.37.5-.04.03c-.12.16-.26.3-.4.45l-.05.05-.12.12-.4.35-.07.05-.19.15-.04.02v.01l-.25.17.25-.18a7.3 7.3 0 01-1.67.9l-.05.02-.22.08-.06.02a5.9 5.9 0 01-.37.1l-.16.04a6.95 6.95 0 01-3.11.01l-.06-.01-.15-.04-.09-.02-.03-.01a6.16 6.16 0 01-.24-.07l-.09-.03-.2-.07-.06-.02a7.96 7.96 0 01-.24-.1h-.03c-.5-.22-.96-.48-1.38-.79h-.01l-.04-.03-.2-.16.24.18a6.66 6.66 0 01-.82-.7l-.05-.04a6.47 6.47 0 01-.4-.45l-.04-.04A6.97 6.97 0 01.03 7.66a7.5 7.5 0 010-1.34l.02-.13.01-.11.04-.27.02-.11c.16-.82.45-1.59.87-2.28l.06-.1.08-.13A6.94 6.94 0 014.22.58l.04-.02.51-.2.06-.01.23-.08.06-.01.25-.07c.05 0 .09-.02.13-.03l.14-.03.13-.02L6 .07h.06L6.3.03h.14A3.85 3.85 0 017 0zm1.88 1.3L7.44 2.45a.7.7 0 01-.8.05l-.08-.05L5.12 1.3a6 6 0 00-2.96 2.16l.65 1.72a.7.7 0 01-.2.78L2.54 6 1 7.02v.2a5.96 5.96 0 001.14 3.29l1.83-.09a.7.7 0 01.68.43l.03.09.49 1.77a5.94 5.94 0 003.66 0l.49-1.77a.7.7 0 01.62-.51h.09l1.84.08A5.96 5.96 0 0013 7.02l-1.54-1.01a.7.7 0 01-.3-.75l.03-.08.65-1.72A6.01 6.01 0 008.88 1.3zM7.4 4.5l1.84 1.33c.24.18.35.5.25.79l-.7 2.16a.7.7 0 01-.66.48H5.86a.7.7 0 01-.66-.48l-.7-2.16a.7.7 0 01.25-.78L6.59 4.5a.7.7 0 01.82 0z"
            />
            <g transform="translate(6 6)">
                <circle cx="4" cy="4" r="4" fill="#23DF8C" transform="matrix(1 0 0 -1 0 8)" />
                <path
                    fill="#111111"
                    d="M3.52 6.34c.27 0 .47-.1.6-.3l2.2-3.17c.1-.14.14-.3.14-.42a.68.68 0 00-.7-.67c-.26 0-.44.1-.6.34L3.52 4.65l-.79-.81a.65.65 0 00-.5-.22c-.4 0-.7.3-.7.68 0 .17.05.3.2.47L2.96 6.1a.7.7 0 00.56.24z"
                />
            </g>
        </g>
    </svg>
);

export default MatchTimeline;