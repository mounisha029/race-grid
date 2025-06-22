
import Header from "@/components/Header";
import TeamCard from "@/components/TeamCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Users } from "lucide-react";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("position");

  const teams = [
    {
      id: "1",
      name: "Red Bull Racing",
      position: 1,
      points: 860,
      color: "#001F5B",
      drivers: ["Max Verstappen", "Sergio Pérez"],
      wins: 21,
      podiums: 35
    },
    {
      id: "2",
      name: "Mercedes",
      position: 2,
      points: 409,
      color: "#C0C0C0",
      drivers: ["Lewis Hamilton", "George Russell"],
      wins: 1,
      podiums: 8
    },
    {
      id: "3",
      name: "Ferrari",
      position: 3,
      points: 359,
      color: "#DC143C",
      drivers: ["Charles Leclerc", "Carlos Sainz"],
      wins: 1,
      podiums: 12
    },
    {
      id: "4",
      name: "McLaren",
      position: 4,
      points: 302,
      color: "#FF6600",
      drivers: ["Lando Norris", "Oscar Piastri"],
      wins: 0,
      podiums: 7
    },
    {
      id: "5",
      name: "Aston Martin",
      position: 5,
      points: 280,
      color: "#00A693",
      drivers: ["Fernando Alonso", "Lance Stroll"],
      wins: 0,
      podiums: 8
    },
    {
      id: "6",
      name: "Alpine",
      position: 6,
      points: 120,
      color: "#0070C0",
      drivers: ["Pierre Gasly", "Esteban Ocon"],
      wins: 0,
      podiums: 2
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
      <Header />
      
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
              2024 Formula 1 World Championship Teams
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
