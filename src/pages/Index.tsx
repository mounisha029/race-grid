
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy, Users, Calendar, Flag, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import DriverCard from "@/components/DriverCard";
import TeamCard from "@/components/TeamCard";
import RaceCard from "@/components/RaceCard";
import ChampionshipHighlight from "@/components/ChampionshipHighlight";
import SeasonSummary from "@/components/SeasonSummary";
import { useChampionshipStandings, useTeams } from "@/hooks/useApi";
import { useRaces } from "@/hooks/useRaces";
import { ChampionshipResponse, DriverStanding, ConstructorStanding, TeamsResponse } from "@/types/api";

const Index = () => {
  const { data: driverChampionshipData, isLoading: driversLoading } = useChampionshipStandings("2025", "drivers");
  const { data: constructorChampionshipData, isLoading: constructorsLoading } = useChampionshipStandings("2025", "constructors");
  const { data: teamsData } = useTeams();
  const { data: races = [] } = useRaces(2025);

  // Transform data
  const championshipResponse = driverChampionshipData as ChampionshipResponse | undefined;
  const driverStandings = championshipResponse?.standings as DriverStanding[] | undefined;
  
  const constructorResponse = constructorChampionshipData as ChampionshipResponse | undefined;
  const constructorStandings = constructorResponse?.standings as ConstructorStanding[] | undefined;
  
  const teamsResponse = teamsData as TeamsResponse | undefined;

  // Get top 5 drivers for display
  const topDrivers = driverStandings?.slice(0, 5).map((standing) => ({
    id: standing.id,
    name: `${standing.drivers?.first_name || ''} ${standing.drivers?.last_name || ''}`,
    team: standing.drivers?.teams?.name || "Unknown Team",
    position: standing.position,
    points: standing.points || 0,
    nationality: standing.drivers?.nationality || "Unknown",
    number: standing.drivers?.driver_number || 0,
    teamColor: standing.drivers?.teams?.primary_color || "#666666",
    lastRacePosition: standing.position,
    trend: "stable" as const
  })) || [];

  // Get top 5 teams for display
  const topTeams = constructorStandings?.slice(0, 5).map((standing) => {
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

  // Get next 3 upcoming races
  const upcomingRaces = races.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-f1-black via-slate-900 to-f1-black py-20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-f1-red/20 via-transparent to-f1-orange/20" />
        <div className="racing-track absolute top-1/2 left-0 w-full h-px" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-6">
            <Badge className="bg-f1-red text-white px-4 py-2 text-sm font-medium animate-pulse-fast">
              🔴 LIVE SEASON 2025
            </Badge>
            <h1 className="racing-text text-5xl md:text-7xl bg-gradient-to-r from-f1-red via-f1-orange to-f1-yellow bg-clip-text text-transparent">
              F1 Box Box
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Your ultimate destination for Formula 1 championship standings, race results, and real-time updates
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/drivers">
                <Button size="lg" className="bg-f1-red hover:bg-f1-red/90 text-white px-8">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Standings
                </Button>
              </Link>
              <Link to="/races">
                <Button size="lg" variant="outline" className="border-f1-orange text-f1-orange hover:bg-f1-orange hover:text-white px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Race Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Championship Highlights */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="racing-text text-3xl md:text-4xl mb-4">
              2025 Championship Highlights
            </h2>
            <p className="text-muted-foreground text-lg">
              Oscar Piastri leads an incredible season with McLaren's dominant performance
            </p>
          </div>
          
          <ChampionshipHighlight season={2025} />
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="standings" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Standings</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <SeasonSummary />
            </TabsContent>

            <TabsContent value="standings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Drivers Championship */}
                <Card className="racing-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-f1-red" />
                      <span>Drivers Championship</span>
                    </CardTitle>
                    <Link to="/drivers">
                      <Button variant="ghost" size="sm">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {driversLoading ? (
                      <div className="text-center py-8">Loading drivers...</div>
                    ) : topDrivers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No driver standings available
                      </div>
                    ) : (
                      topDrivers.map((driver) => (
                        <DriverCard key={driver.id} driver={driver} />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Constructors Championship */}
                <Card className="racing-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-f1-orange" />
                      <span>Constructors Championship</span>
                    </CardTitle>
                    <Link to="/teams">
                      <Button variant="ghost" size="sm">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {constructorsLoading ? (
                      <div className="text-center py-8">Loading teams...</div>
                    ) : topTeams.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No constructor standings available
                      </div>
                    ) : (
                      topTeams.map((team) => (
                        <TeamCard key={team.id} team={team} />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-8">
              <Card className="racing-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-f1-yellow" />
                    <span>Upcoming Races</span>
                  </CardTitle>
                  <Link to="/races">
                    <Button variant="ghost" size="sm">
                      Full Calendar <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingRaces.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No upcoming races available
                      </div>
                    ) : (
                      upcomingRaces.map((race) => (
                        <RaceCard key={race.id} race={race} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gradient-to-r from-f1-red/10 via-f1-orange/10 to-f1-yellow/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-f1-red">24</div>
              <div className="text-muted-foreground">Total Races</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-f1-orange">20</div>
              <div className="text-muted-foreground">Drivers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-f1-yellow">10</div>
              <div className="text-muted-foreground">Teams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-f1-green">6</div>
              <div className="text-muted-foreground">Sprint Weekends</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
