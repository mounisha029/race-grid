import DriverCard from "@/components/DriverCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Trophy } from "lucide-react";
import { useDriverStandings } from "@/hooks/useErgastData";

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("position");

  // Fetch 2025 driver standings from hyprace API
  const { data: drivers, isLoading, error } = useDriverStandings(2025);

  // Transform API data to match our component interface
  const transformedDrivers = drivers?.map((driver, index) => ({
    id: driver.id,
    name: `${driver.firstName} ${driver.lastName}`,
    team: driver.teamId || "Unknown Team",
    position: driver.position || index + 1,
    points: driver.points || 0,
    nationality: driver.nationality || "Unknown",
    number: driver.driverNumber || 0,
    teamColor: "#666666", // Default color since hyprace doesn't provide team colors
    lastRacePosition: driver.position || index + 1,
    trend: "stable" as const
  })) || [];

  const filteredDrivers = transformedDrivers
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-f1-red mx-auto mb-4"></div>
          <p className="text-lg">Loading driver standings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500">Error loading driver standings</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

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
          {filteredDrivers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No driver standings data available for 2025 season</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Drivers;
