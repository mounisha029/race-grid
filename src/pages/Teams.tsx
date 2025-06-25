import TeamCard from "@/components/TeamCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Users } from "lucide-react";
import { useChampionshipStandings, useTeams } from "@/hooks/useApi";
import { ChampionshipResponse, ConstructorStanding, TeamsResponse } from "@/types/api";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("position");

  // Fetch 2025 constructor championship standings
  const { data: championshipData, isLoading: championshipLoading, error: championshipError } = useChampionshipStandings("2025", "constructors");
  const { data: teamsData, isLoading: teamsLoading } = useTeams();

  const isLoading = championshipLoading || teamsLoading;

  // Transform API data to match our component interface with proper type assertions
  const championshipResponse = championshipData as ChampionshipResponse | undefined;
  const constructorStandings = championshipResponse?.standings as ConstructorStanding[] | undefined;
  const teamsResponse = teamsData as TeamsResponse | undefined;

  const teams = constructorStandings?.map((standing) => {
    // Find team details from teams API
    const teamDetails = teamsResponse?.teams?.find((team) => team.id === standing.entity_id);
    
    return {
      id: standing.id,
      name: standing.teams?.name || teamDetails?.name || "Unknown Team",
      position: standing.position,
      points: standing.points || 0,
      color: standing.teams?.primary_color || teamDetails?.primary_color || "#666666",
      drivers: teamDetails?.drivers?.map((driver) => `${driver.first_name} ${driver.last_name}`) || [],
      wins: standing.wins || 0,
      podiums: standing.podiums || 0
    };
  }) || [];

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-f1-red mx-auto mb-4"></div>
          <p className="text-lg">Loading constructor standings...</p>
        </div>
      </div>
    );
  }

  if (championshipError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500">Error loading constructor standings</p>
          <p className="text-sm text-muted-foreground">{championshipError.message}</p>
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
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No constructor standings data available for 2025 season</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Teams;
