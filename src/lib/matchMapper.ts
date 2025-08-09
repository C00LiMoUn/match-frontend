// src/lib/matchMapper.ts
import type { MatchEvent, MatchResultResponse, Player, Team } from "@/types/match";

export const mapRawToMatchEvents = (
    rawData: MatchResultResponse,
    homeTeamObj: Team,
    awayTeamObj: Team
): {
    finalScore: string;
    events: MatchEvent[];
    // players: Player[];
} => {
    console.log("Mapping raw data to match events:", rawData);
    const { home_team, away_team, score, analysis } = rawData;
    const { events: rawEvents } = analysis;

    // Safe extraction with defaults
    const events: MatchEvent[] = Array.isArray(rawEvents)
        ? rawEvents
            .filter((e): e is MatchEvent => e !== null && typeof e === "object")
            .map((e): MatchEvent => ({
                ...e,
                player: e.player || null,
                player_in: e.player_in || null,
                player_out: e.player_out || null,
                team: e.team || null,
                time: e.time || "?",
                details: e.details || "",
            }))
        : [];

    // Initialize score tracking
    let homeScore = 0;
    let awayScore = 0;
    const sorted_events: MatchEvent[] = [];

    const firstHalfEvents: MatchEvent[] = events
        .filter(ev => {
            const numericTime = parseInt(ev.time, 10);
            return !isNaN(numericTime) && numericTime <= 45;
        })
        .sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));

    // Process first half events
    firstHalfEvents.forEach(ev => {
        const isHome = ev.team === home_team;
        const team: "home" | "away" = isHome ? "home" : "away";
        const player = ev.player;
        const time = `${ev.time}'`;

        if (ev.type === "goal") {
            if (isHome) homeScore++;
            else awayScore++;

            sorted_events.push({
                type: "goal",
                time: time,
                player: player,
                team: team,
                score: `${homeScore} - ${awayScore}`
            });
        } else if (ev.type === "yellow_card") {
            sorted_events.push({
                type: "yellow_card",
                time,
                player,
                team
            });
        }
    });

    // Add halftime event with current score
    if (firstHalfEvents.length > 0) {
        sorted_events.push({
            type: "half",
            label: "HT",
            score: `${homeScore} - ${awayScore}`,
            time: "45'"
        });
    }


    // Second half events
    const secondHalfEvents: MatchEvent[] = events
        .filter(ev => {
            const numericTime = parseInt(ev.time, 10);
            return !isNaN(numericTime) && numericTime > 45;
        })
        .sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));

    // Process second half events
    secondHalfEvents.forEach(ev => {
        const isHome = ev.team === home_team;
        const team: "home" | "away" = isHome ? "home" : "away";
        const player = ev.player;
        const time = `${ev.time}'`;

        if (ev.type === "goal") {
            if (isHome) homeScore++;
            else awayScore++;

            sorted_events.push({
                type: "goal",
                time,
                player,
                team,
                score: `${homeScore} - ${awayScore}`
            });
        } else if (ev.type === "yellow_card") {
            sorted_events.push({
                type: "yellow_card",
                time,
                player,
                team
            });
        }
    });

    // Final score
    const finalScore = `${homeScore} - ${awayScore}`;
    sorted_events.push({
        type: "full",
        label: "FT",
        score: finalScore,
        time: "90'"
    });

    // Add synthetic substitution event at 60'
    sorted_events.push({
        type: "substitution",
        time: "15'",
        team: "away",
        player_out: "زياد العونلي",
        player_in: "محمد الحبيب يكن",
    });

    // Add synthetic penalty goal event at 75'
    homeScore++; // update score if penalty is scored

    sorted_events.push({
        type: "penalty",
        time: "75'",
        team: "home",
        player: "Leo Striker",
        score: `${homeScore} - ${awayScore}`,
    });
    // Sort all events by time
    sorted_events.sort((a, b) => {
        const parseTime = (t: string) => parseInt(t.replace(/[^0-9]/g, ''), 10) || 0;
        return parseTime(a.time) - parseTime(b.time);
    });



    console.log("Sorted events:", sorted_events);
    return { finalScore, events: sorted_events };
};