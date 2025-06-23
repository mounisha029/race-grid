
import DriverCard from "@/components/DriverCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Trophy } from "lucide-react";

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("position");

  const drivers = [
    {
      id: "1",
      name: "Max Verstappen",
      team: "Red Bull Racing",
      position: 1,
      points: 575,
      nationality: "Netherlands",
      number: 1,
      teamColor: "#001F5B",
      lastRacePosition: 1,
      trend: "stable" as const
    },
    {
      id: "2",
      name: "Lewis Hamilton",
      team: "Mercedes",
      position: 2,
      points: 234,
      nationality: "United Kingdom", 
      number: 44,
      teamColor: "#C0C0C0",
      lastRacePosition: 3,
      trend: "up" as const
    },
    {
      id: "3",
      name: "Charles Leclerc",
      team: "Ferrari",
      position: 3,
      points: 206,
      nationality: "Monaco",
      number: 16,
      teamColor: "#DC143C",
      lastRacePosition: 2,
      trend: "down" as const
    },
    {
      id: "4",
      name: "George Russell",
      team: "Mercedes",
      position: 4,
      points: 175,
      nationality: "United Kingdom",
      number: 63,
      teamColor: "#C0C0C0",
      lastRacePosition: 4,
      trend: "stable" as const
    },
    {
      id: "5",
      name: "Carlos Sainz",
      team: "Ferrari",
      position: 5,
      points: 153,
      nationality: "Spain",
      number: 55,
      teamColor: "#DC143C",
      lastRacePosition: 5,
      trend: "up" as const
    },
    {
      id: "6",
      name: "Sergio Pérez",
      team: "Red Bull Racing",
      position: 6,
      points: 285,
      nationality: "Mexico",
      number: 11,
      teamColor: "#001F5B",
      lastRacePosition: 6,
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
              2024 Formula 1 World Championship
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
