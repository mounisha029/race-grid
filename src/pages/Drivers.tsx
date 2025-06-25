import DriverCard from "@/components/DriverCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Trophy } from "lucide-react";

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("position");

  // Updated 2025 driver standings with correct team pairings
  const drivers = [
    {
      id: "1",
      name: "Max Verstappen",
      team: "Red Bull Racing",
      position: 1,
      points: 0, // 2025 season just started
      nationality: "Netherlands",
      number: 1,
      teamColor: "#001F5B",
      lastRacePosition: 1,
      trend: "stable" as const
    },
    {
      id: "2", 
      name: "Lewis Hamilton",
      team: "Ferrari", // Moved to Ferrari in 2025
      position: 2,
      points: 0,
      nationality: "United Kingdom",
      number: 44,
      teamColor: "#DC143C",
      lastRacePosition: 2,
      trend: "up" as const
    },
    {
      id: "3",
      name: "Charles Leclerc",
      team: "Ferrari",
      position: 3,
      points: 0,
      nationality: "Monaco",
      number: 16,
      teamColor: "#DC143C",
      lastRacePosition: 3,
      trend: "stable" as const
    },
    {
      id: "4",
      name: "Liam Lawson", // Replaced Sergio Perez at Red Bull
      team: "Red Bull Racing",
      position: 4,
      points: 0,
      nationality: "New Zealand",
      number: 30,
      teamColor: "#001F5B",
      lastRacePosition: 4,
      trend: "up" as const
    },
    {
      id: "5",
      name: "George Russell",
      team: "Mercedes",
      position: 5,
      points: 0,
      nationality: "United Kingdom",
      number: 63,
      teamColor: "#C0C0C0",
      lastRacePosition: 5,
      trend: "stable" as const
    },
    {
      id: "6",
      name: "Kimi Antonelli", // New Mercedes driver replacing Hamilton
      team: "Mercedes",
      position: 6,
      points: 0,
      nationality: "Italy",
      number: 12,
      teamColor: "#C0C0C0",
      lastRacePosition: 6,
      trend: "up" as const
    },
    {
      id: "7",
      name: "Lando Norris",
      team: "McLaren",
      position: 7,
      points: 0,
      nationality: "United Kingdom",
      number: 4,
      teamColor: "#FF6600",
      lastRacePosition: 7,
      trend: "stable" as const
    },
    {
      id: "8",
      name: "Oscar Piastri",
      team: "McLaren",
      position: 8,
      points: 0,
      nationality: "Australia",
      number: 81,
      teamColor: "#FF6600",
      lastRacePosition: 8,
      trend: "up" as const
    },
    {
      id: "9",
      name: "Fernando Alonso",
      team: "Aston Martin",
      position: 9,
      points: 0,
      nationality: "Spain",
      number: 14,
      teamColor: "#00A693",
      lastRacePosition: 9,
      trend: "stable" as const
    },
    {
      id: "10",
      name: "Lance Stroll",
      team: "Aston Martin",
      position: 10,
      points: 0,
      nationality: "Canada",
      number: 18,
      teamColor: "#00A693",
      lastRacePosition: 10,
      trend: "down" as const
    }
  ];

  const filteredDrivers = drivers
    .filter(driver => 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "points":
          return b.points - a.points;
        case "name":
          return a.name.localeCompare(b.name);
        case "team":
          return a.team.localeCompare(b.team);
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
              <Trophy className="w-16 h-16 text-f1-yellow" />
            </div>
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              Driver Standings
            </h1>
            <p className="text-xl text-muted-foreground">
              2025 Formula 1 World Championship
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <Input
              placeholder="Search drivers, teams, or nationality..."
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
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Drivers Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Drivers;
