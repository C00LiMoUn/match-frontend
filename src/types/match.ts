// types/match.ts

export type Player = {
    name: string;
    id?: number; // optional since not in your JSON
    href?: string; // optional, we can generate or omit
};

export type Team = {
    name: string;
    id?: number;
    href?: string;
    logo?: string; // will use placeholder or dynamic
};

// Event types
type GoalEvent = {
    type: "goal";
    time: string;
    player: Player;
    team: "home" | "away";
    score?: string;
};

type CardEvent = {
    type: "yellow-card" | "red-yellow-card";
    time: string;
    player: Player;
    team: "home" | "away";
};

type HalfEvent = {
    type: "half" | "full";
    label: string;
    score: string;
};

export type MatchEvent = GoalEvent | CardEvent | HalfEvent;

// Raw JSON structure
export type RawMatchData = {
    match_id: string;
    home_team: string;
    away_team: string;
    score: Record<string, number>;
    analysis: {
        events: Array<{
            type: "goal" | "yellow_card";
            player: string;
            team: string;
            time: string;
            details: string;
            confidence: number;
        }>;
        players: Array<{
            name: string;
            team: string;
            position: string;
        }>;
    };
};