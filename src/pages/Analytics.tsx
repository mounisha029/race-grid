
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Trophy, Users, Flag } from "lucide-react";
import { useChampionshipStandings, useTeams } from "@/hooks/useApi";
import { ChampionshipResponse, DriverStanding, ConstructorStanding, TeamsResponse } from "@/types/api";

const Analytics = () => {
  const { data: driverChampionshipData, isLoading: driversLoading } = useChampionshipStandings("2025", "drivers");
  const { data: constructorChampionshipData, isLoading: constructorsLoading } = useChampionshipStandings("2025", "constructors");
  const { data: teamsData } = useTeams();

  const championshipResponse = driverChampionshipData as ChampionshipResponse | undefined;
  const driverStandings = championshipResponse?.standings as DriverStanding[] | undefined;
  
  const constructorResponse = constructorChampionshipData as ChampionshipResponse | undefined;
  const constructorStandings = constructorResponse?.standings as ConstructorStanding[] | undefined;
  
  const teamsResponse = teamsData as TeamsResponse | undefined;

  // Prepare data for charts
  const topDriversData = driverStandings?.slice(0, 10).map((standing) => ({
    name: `${standing.drivers?.first_name?.charAt(0)}. ${standing.drivers?.last_name}`,
    points: standing.points || 0,
    wins: standing.wins || 0,
    podiums: standing.podiums || 0,
    team: standing.drivers?.teams?.name || "Unknown"
  })) || [];

  const constructorData = constructorStandings?.map((standing) => ({
    name: standing.teams?.name || "Unknown",
    points: standing.points || 0,
    wins: standing.wins || 0,
    podiums: standing.podiums || 0,
    color: standing.teams?.primary_color || "#666666"
  })) || [];

  const COLORS = ['#FF8700', '#DC143C', '#0600EF', '#00D2BE', '#006F62', '#0090FF', '#FFFFFF', '#6692FF', '#005AFF', '#52E252'];

  if (driversLoading || constructorsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-f1-red mx-auto mb-4"></div>
          <p className="text-lg">Loading analytics...</p>
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
              <TrendingUp className="w-16 h-16 text-f1-green" />
            </div>
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              F1 Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Deep insights into the 2025 Formula 1 season performance
            </p>
          </div>
        </div>
      </section>

      {/* Analytics Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="drivers" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="drivers" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Drivers</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center space-x-2">
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drivers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Driver Championship Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={topDriversData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="points" fill="#DC143C" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Race Wins Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={topDriversData.filter(d => d.wins > 0)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="wins" fill="#FF8700" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Drivers Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {topDriversData.slice(0, 5).map((driver, index) => (
                      <div key={driver.name} className="text-center p-4 bg-muted/30 rounded-lg">
                        <Badge className="mb-2">P{index + 1}</Badge>
                        <h3 className="font-bold text-lg">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">{driver.team}</p>
                        <div className="mt-2 space-y-1">
                          <div className="text-xl font-bold text-f1-red">{driver.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                          <div className="text-sm">{driver.wins} wins</div>
                          <div className="text-sm">{driver.podiums} podiums</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Constructor Championship</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={constructorData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="points" fill="#0600EF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Points Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={constructorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="points"
                        >
                          {constructorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Team Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {constructorData.slice(0, 5).map((team, index) => (
                      <div key={team.name} className="text-center p-4 bg-muted/30 rounded-lg">
                        <Badge className="mb-2">P{index + 1}</Badge>
                        <h3 className="font-bold text-lg">{team.name}</h3>
                        <div className="mt-2 space-y-1">
                          <div className="text-xl font-bold text-f1-orange">{team.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                          <div className="text-sm">{team.wins} wins</div>
                          <div className="text-sm">{team.podiums} podiums</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Points Progression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={topDriversData.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="points" stroke="#DC143C" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Season Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-f1-red/10 rounded-lg">
                        <div className="text-2xl font-bold text-f1-red">
                          {driverStandings?.reduce((total, driver) => total + (driver.wins || 0), 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Race Wins</div>
                      </div>
                      <div className="text-center p-4 bg-f1-orange/10 rounded-lg">
                        <div className="text-2xl font-bold text-f1-orange">
                          {driverStandings?.reduce((total, driver) => total + (driver.podiums || 0), 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Podiums</div>
                      </div>
                      <div className="text-center p-4 bg-f1-yellow/10 rounded-lg">
                        <div className="text-2xl font-bold text-f1-yellow">
                          {driverStandings?.filter(d => (d.wins || 0) > 0).length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Different Winners</div>
                      </div>
                      <div className="text-center p-4 bg-f1-green/10 rounded-lg">
                        <div className="text-2xl font-bold text-f1-green">
                          {constructorStandings?.filter(c => (c.wins || 0) > 0).length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Winning Teams</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
