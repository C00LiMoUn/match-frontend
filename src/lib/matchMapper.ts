// src/lib/matchMapper.ts
import type { MatchEvent, Player, Team } from "@/types/match";

export const mapRawToMatchEvents = (
    data: any,
    homeTeamObj: Team,
    awayTeamObj: Team
): {
    finalScore: string;
    events: MatchEvent[];
} => {
    const { home_team, away_team, score, analysis } = data;
    const { events: rawEvents } = analysis;

    // Initialize score tracking
    let homeScore = 0;
    let awayScore = 0;
    const events: MatchEvent[] = [];

    // First half events
    const firstHalfEvents = (rawEvents as any[])
        .filter(ev => ev.time <= 45)
        .sort((a, b) => a.time - b.time);

    // Process first half events
    firstHalfEvents.forEach(ev => {
        const isHome = ev.team === home_team;
        const team: "home" | "away" = isHome ? "home" : "away";
        const player: Player = { name: ev.player };
        const time = `${ev.time}'`;

        if (ev.type === "goal") {
            if (isHome) homeScore++;
            else awayScore++;

            events.push({
                type: "goal",
                time,
                player,
                team,
                score: `${homeScore} - ${awayScore}`
            });
        } else if (ev.type === "yellow_card") {
            events.push({
                type: "yellow-card",
                time,
                player,
                team
            });
        }
    });

    // Add halftime event with current score
    if (firstHalfEvents.length > 0) {
        events.push({
            type: "half",
            label: "HT",
            score: `${homeScore} - ${awayScore}`,
            time: "45'"
        });
    }

    // Second half events
    const secondHalfEvents = (rawEvents as any[])
        .filter(ev => ev.time > 45)
        .sort((a, b) => a.time - b.time);

    // Process second half events
    secondHalfEvents.forEach(ev => {
        const isHome = ev.team === home_team;
        const team: "home" | "away" = isHome ? "home" : "away";
        const player: Player = { name: ev.player };
        const time = `${ev.time}'`;

        if (ev.type === "goal") {
            if (isHome) homeScore++;
            else awayScore++;

            events.push({
                type: "goal",
                time,
                player,
                team,
                score: `${homeScore} - ${awayScore}`
            });
        } else if (ev.type === "yellow_card") {
            events.push({
                type: "yellow-card",
                time,
                player,
                team
            });
        }
    });

    // Final score
    const finalScore = `${homeScore} - ${awayScore}`;
    events.push({
        type: "full",
        label: "FT",
        score: finalScore,
        time: "90'"
    });

    // Sort all events by time
    // events.sort((a, b) => {
    //     const parseTime = (t: string) => parseInt(t.replace(/[^0-9]/g, ''), 10) || 0;
    //     return parseTime(a.time) - parseTime(b.time);
    // });

    return { finalScore, events };
};