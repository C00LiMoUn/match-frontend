// types/match.ts

export type Player = {
    name: string;
    id: number;
    href: string;
};

export type Team = {
    name: string;
    id: number;
    href: string;
    logo: string;
};

// Event types with discriminant `type`
type GoalEvent = {
    type: "goal";
    time: string;
    player: Player;
    team: "home" | "away";
    score: string;
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