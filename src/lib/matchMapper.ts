// src/lib/matchMapper.ts
import type { MatchEvent, MatchResultResponse } from "@/types/match";
import { logger } from "@/lib/logger";

export const mapRawToMatchEvents = (
    rawData: MatchResultResponse
): {
    finalScore: string;
    events: MatchEvent[];
} => {
    logger.debug("Mapping raw data to match events:", rawData);
    const { home_team, analysis } = rawData;
    const { events: rawEvents } = analysis;

    // Safe extraction with defaults
    const eventsRaw: MatchEvent[] = Array.isArray(rawEvents)
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

    // Merge yellow + red shown to the same player in the same minute into a single yellow_red
    const events: MatchEvent[] = (() => {
        const toRemove = new Set<number>();
        const indexByKey: Record<string, number[]> = {};
        const makeKey = (ev: MatchEvent): string => {
            const minute = parseInt(ev.time, 10) || 0;
            const playerKey = ev.player || "";
            const teamKey = ev.team || "";
            return `${minute}|${teamKey}|${playerKey}`;
        };
        eventsRaw.forEach((ev, idx) => {
            if (!ev.player || !ev.team) return; // only merge when player and team are known
            const key = makeKey(ev);
            (indexByKey[key] ||= []).push(idx);
        });
        Object.values(indexByKey).forEach((indices) => {
            const types = indices.map(i => eventsRaw[i].type);
            const hasYellow = types.includes("yellow_card");
            const hasRed = types.includes("red_card");
            if (hasYellow && hasRed) {
                // Find the red card event; repurpose it into yellow_red and drop yellow
                const redIndex = indices.find(i => eventsRaw[i].type === "red_card");
                if (redIndex !== undefined) {
                    eventsRaw[redIndex] = { ...eventsRaw[redIndex], type: "yellow_red", label: eventsRaw[redIndex].label || "Second yellow → Red" };
                }
                indices.forEach(i => { if (eventsRaw[i].type === "yellow_card") toRemove.add(i); });
            }
        });
        return eventsRaw.filter((_, idx) => !toRemove.has(idx));
    })();

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
        } else if (ev.type === "red_card") {
            sorted_events.push({
                type: "red_card",
                time,
                player,
                team,
            });
        } else if (ev.type === "yellow_red") {
            sorted_events.push({
                type: "yellow_red",
                time,
                player,
                team,
            });
        } else if (ev.type === "substitution") {
            sorted_events.push({
                type: "substitution",
                time,
                team,
                player_in: ev.player_in || null,
                player_out: ev.player_out || null,
            });
        } else if (ev.type === "penalty") {
            sorted_events.push({
                type: "penalty",
                time,
                player,
                team,
                score: ev.score || undefined,
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
        } else if (ev.type === "red_card") {
            sorted_events.push({
                type: "red_card",
                time,
                player,
                team,
            });
        } else if (ev.type === "substitution") {
            sorted_events.push({
                type: "substitution",
                time,
                team,
                player_in: ev.player_in || null,
                player_out: ev.player_out || null,
            });
        } else if (ev.type === "penalty") {
            sorted_events.push({
                type: "penalty",
                time,
                player,
                team,
                score: ev.score || undefined,
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

    // Remove demo synthetic events; rely on backend data only
    // Sort all events by time
    sorted_events.sort((a, b) => {
        const parseTime = (t: string) => parseInt(t.replace(/[^0-9]/g, ''), 10) || 0;
        return parseTime(a.time) - parseTime(b.time);
    });

    logger.debug("Sorted events:", sorted_events);
    return { finalScore, events: sorted_events };
};