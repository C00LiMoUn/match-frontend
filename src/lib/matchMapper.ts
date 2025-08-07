// lib/matchMapper.ts
import type { MatchEvent, Player, Team } from "@/types/match";

export const mapRawToMatchEvents = (
    data: any, // RawMatchData (or any for flexibility)
    homeTeamObj: Team,
    awayTeamObj: Team
): {
    finalScore: string;
    events: MatchEvent[];
} => {
    const { home_team, away_team, score, analysis } = data;
    const { events: rawEvents } = analysis;

    const homeScore = score[home_team] ?? 0;
    const awayScore = score[away_team] ?? 0;

    const finalScore = `${homeScore} - ${awayScore}`;

    const events: MatchEvent[] = [];

    // Add "HT" event if needed
    events.push({
        type: "half",
        label: "HT",
        score: `${homeScore} - ${awayScore}`,
    });

    // Process events
    interface RawEvent {
        type: string;
        team: string;
        player: string;
        time: number;
    }

    (rawEvents as RawEvent[]).forEach((ev: RawEvent) => {
        const isHome: boolean = ev.team === home_team;
        const team: "home" | "away" = isHome ? "home" : "away";

        const player: Player = { name: ev.player };

        const time: string = `${ev.time}'`;

        if (ev.type === "goal") {
            const goalScore: string = `${isHome ? score[home_team] : score[away_team]} - ${isHome ? score[away_team] : score[home_team]}`;
            events.push({
                type: "goal",
                time,
                player,
                team,
                score: goalScore,
            });
        }

        if (ev.type === "yellow_card") {
            events.push({
                type: "yellow-card",
                time,
                player,
                team,
            });
        }
    });

    // Final event
    events.push({
        type: "full",
        label: "FT",
        score: finalScore,
    });

    return { finalScore, events };
};