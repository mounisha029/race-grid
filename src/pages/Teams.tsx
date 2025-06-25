import TeamCard from "@/components/TeamCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Users } from "lucide-react";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("position");

  // Updated 2025 constructor standings with correct driver pairings
  const teams = [
    {
      id: "1",
      name: "Red Bull Racing",
      position: 1,
      points: 0, // 2025 season just started
      color: "#001F5B",
      drivers: ["Max Verstappen", "Liam Lawson"], // Updated pairing
      wins: 0,
      podiums: 0
    },
    {
      id: "2",
      name: "Ferrari",
      position: 2,
      points: 0,
      color: "#DC143C", 
      drivers: ["Lewis Hamilton", "Charles Leclerc"], // Hamilton moved to Ferrari
      wins: 0,
      podiums: 0
    },
    {
      id: "3",
      name: "Mercedes",
      position: 3,
      points: 0,
      color: "#C0C0C0",
      drivers: ["George Russell", "Kimi Antonelli"], // Antonelli replaced Hamilton
      wins: 0,
      podiums: 0
    },
    {
      id: "4",
      name: "McLaren",
      position: 4,
      points: 0,
      color: "#FF6600",
      drivers: ["Lando Norris", "Oscar Piastri"],
      wins: 0,
      podiums: 0
    },
    {
      id: "5",
      name: "Aston Martin",
      position: 5,
      points: 0,
      color: "#00A693",
      drivers: ["Fernando Alonso", "Lance Stroll"],
      wins: 0,
      podiums: 0
    },
    {
      id: "6",
      name: "Alpine",
      position: 6,
      points: 0,
      color: "#0070C0",
      drivers: ["Pierre Gasly", "Jack Doohan"], // Doohan replaced Ocon
      wins: 0,
      podiums: 0
    },
    {
      id: "7",
      name: "Williams",
      position: 7,
      points: 0,
      color: "#005AFF",
      drivers: ["Alex Albon", "Carlos Sainz"], // Sainz moved to Williams
      wins: 0,
      podiums: 0
    },
    {
      id: "8",
      name: "RB",
      position: 8,
      points: 0,
      color: "#6692FF",
      drivers: ["Yuki Tsunoda", "Isack Hadjar"], // New pairing
      wins: 0,
      podiums: 0
    },
    {
      id: "9",
      name: "Haas",
      position: 9,
      points: 0,
      color: "#B6BABD",
      drivers: ["Esteban Ocon", "Oliver Bearman"], // Ocon moved to Haas
      wins: 0,
      podiums: 0
    },
    {
      id: "10",
      name: "Sauber",
      position: 10,
      points: 0,
      color: "#52E252",
      drivers: ["Nico Hülkenberg", "Gabriel Bortoleto"], // New lineup
      wins: 0,
      podiums: 0
    }
  ];

  const filteredTeams = teams
    .filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.drivers.some(driver => driver.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "points":
          return b.points - a.points;
        case "name":
          return a.name.localeCompare(b.name);
        case "wins":
          return b.wins - a.wins;
        case "podiums":
          return b.podiums - a.podiums;
        default:
          return a.position - b.position;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-f1-black via-slate-900 to-f1-black py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-f1-red/10 via-transparent to-f1-orange/10" />
        <div className="racing-track absolute top-1/2 left-0 w-full h-px" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <Users className="w-16 h-16 text-f1-orange" />
            </div>
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              Constructor Standings
            </h1>
            <p className="text-xl text-muted-foreground">
              2025 Formula 1 World Championship Teams
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <Input
              placeholder="Search teams or drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="position">Championship Position</SelectItem>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="wins">Wins</SelectItem>
                <SelectItem value="podiums">Podiums</SelectItem>
                <SelectItem value="name">Team Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Teams;
