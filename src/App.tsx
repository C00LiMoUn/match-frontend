
import './App.css'
import MatchTimeline from "@/components/MatchTimeline";
// app/MatchPage.tsx
import { mapRawToMatchEvents } from "@/lib/matchMapper";
import type { Team } from "@/types/match";

// Your JSON data
const rawData = {
  match_id: "0fc68638-09be-451a-ab0f-9a16fa58a148",
  home_team: "الترجي الرياضي التونسي",
  away_team: "النادي الرياضي البنزرتي",
  score: {
    "الترجي الرياضي التونسي": 2,
    "النادي الرياضي البنزرتي": 1,
  },
  analysis: {
    events: [
      {
        type: "goal",
        player: "أنيس بدري",
        team: "الترجي الرياضي التونسي",
        time: "49",
        details: "الهدف الثاني للترجي الرياضي التونسي عن طريق أنيس بدري",
        confidence: 1,
      },
      {
        type: "goal",
        player: "أنيس بدري",
        team: "الترجي الرياضي التونسي",
        time: "69",
        details: "الهدف الثالث للترجي عن طريق أنيس بدري",
        confidence: 1,
      },
      {
        type: "goal",
        player: "بلال السعيداني",
        team: "النادي الرياضي البنزرتي",
        time: "72",
        details: "هدف لبلال السعيداني يقلص الفارق للنادي البنزرتي",
        confidence: 1,
      },
      {
        type: "yellow_card",
        player: "فرانك كوم",
        team: "الترجي الرياضي التونسي",
        time: "75",
        details: "بطاقة صفراء لفرانك كوم",
        confidence: 1,
      },
      {
        type: "yellow_card",
        player: "طه ياسين الخنيسي",
        team: "الترجي الرياضي التونسي",
        time: "90",
        details: "إنذار لطه ياسين الخنيسي بعد لمس الكرة الثانية",
        confidence: 0.9,
      },
    ],
    players: [/* ... */],
  },
};

// Team objects (you can enhance with logos later)
const homeTeam: Team = {
  name: "الترجي الرياضي التونسي",
  logo: "/logos/tunisia/etst.png", // placeholder
};

const awayTeam: Team = {
  name: "النادي الرياضي البنزرتي",
  logo: "/logos/tunisia/csb.png", // placeholder
};

// Map to timeline format
const { finalScore, events } = mapRawToMatchEvents(rawData, homeTeam, awayTeam);

export default function MatchPage() {
  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <MatchTimeline
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        finalScore={finalScore}
        events={events}
      />
    </div>
  );
}