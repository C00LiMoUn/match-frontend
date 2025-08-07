
import './App.css'
import MatchTimeline from "@/components/MatchTimeline";
import type { MatchEvent } from '@/types/match';

export default function MatchPage() {
  const homeTeam = {
    name: "Kairat Almaty",
    id: 7366,
    href: "/fr/football/team/kairat-almaty/7366/overview/",
    logo: "https://lsm-static-prod.livescore.com/high/enet/8037.png",
  };

  const awayTeam = {
    name: "Slovan Bratislava",
    id: 6793,
    href: "/fr/football/team/slovan-bratislava/6793/overview/",
    logo: "https://lsm-static-prod.livescore.com/high/enet/6019.png",
  };

  const events: MatchEvent[] = [
    { type: "yellow-card", time: "15'", player: { name: "T. Barseghyan", id: 11655, href: "/fr/season-stats/tigran-barseghyan/11655/" }, team: "home" },
    { type: "yellow-card", time: "25'", player: { name: "E. Tapalov", id: 68371, href: "/fr/season-stats/erkin-tapalov/68371/" }, team: "away" },
    { type: "half", label: "Mitps", score: "0 - 0" },
    { type: "yellow-card", time: "51'", player: { name: "R. Ibrahim", id: 11552, href: "/fr/season-stats/rahim-ibrahim/11552/" }, team: "home" },
    { type: "yellow-card", time: "55'", player: { name: "D. Kassabulat", id: 35793, href: "/fr/season-stats/damir-kassabulat/35793/" }, team: "away" },
    { type: "red-yellow-card", time: "65'", player: { name: "R. Ibrahim", id: 11552, href: "/fr/season-stats/rahim-ibrahim/11552/" }, team: "home" },
    { type: "yellow-card", time: "67'", player: { name: "D. Satpaev", id: 101838, href: "/fr/season-stats/dastan-satpaev/101838/" }, team: "away" },
    { type: "yellow-card", time: "72'", player: { name: "D. Strelec", id: 17163, href: "/fr/season-stats/david-strelec/17163/" }, team: "home" },
    { type: "yellow-card", time: "88'", player: { name: "G. Kashia", id: 11652, href: "/fr/season-stats/guram-kashia/11652/" }, team: "home" },
    { type: "goal", time: "90'", player: { name: "D. Satpaev", id: 101838, href: "/fr/season-stats/dastan-satpaev/101838/" }, team: "away", score: "1 - 0" },
    { type: "yellow-card", time: "90 + 2'", player: { name: "K. Bajric", id: 3398, href: "/fr/season-stats/kenan-bajric/3398/" }, team: "home" },
    { type: "full", label: "FT", score: "1 - 0" },
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <MatchTimeline
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        finalScore="1 - 0"
        events={events}
      />
    </div>
  );
}