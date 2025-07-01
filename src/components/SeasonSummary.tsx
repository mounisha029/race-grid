
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flag, Users, Calendar, Crown, Star } from "lucide-react";
import { useChampionshipStandings, useTeams } from "@/hooks/useApi";
import { useRaces } from "@/hooks/useRaces";
import { ChampionshipResponse, DriverStanding, ConstructorStanding, TeamsResponse } from "@/types/api";

const SeasonSummary = () => {
  const { data: driverChampionshipData } = useChampionshipStandings("2025", "drivers");
  const { data: constructorChampionshipData } = useChampionshipStandings("2025", "constructors");
  const { data: teamsData } = useTeams();
  const { data: races = [] } = useRaces(2025);

  const championshipResponse = driverChampionshipData as ChampionshipResponse | undefined;
  const driverStandings = championshipResponse?.standings as DriverStanding[] | undefined;
  
  const constructorResponse = constructorChampionshipData as ChampionshipResponse | undefined;
  const constructorStandings = constructorResponse?.standings as ConstructorStanding[] | undefined;
  
  const teamsResponse = teamsData as TeamsResponse | undefined;

  const completedRaces = races.filter(race => race.status === 'completed').length;
  const totalRaces = races.length;
  const upcomingRaces = races.filter(race => race.status === 'scheduled').length;

  const driverLeader = driverStandings?.[0];
  const constructorLeader = constructorStandings?.[0];

  // Get team details for constructor leader
  const leadingTeam = teamsResponse?.teams?.find(team => team.id === constructorLeader?.entity_id);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="racing-text text-3xl md:text-4xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
          2025 Season Overview
        </h2>
        <p className="text-muted-foreground text-lg">
          An incredible championship battle unfolds with Max Verstappen leading the charge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-f1-red/10 to-f1-orange/10">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-f1-red" />
            <div className="text-2xl font-bold">{completedRaces}</div>
            <div className="text-sm text-muted-foreground">Races Completed</div>
            <div className="text-xs text-muted-foreground mt-1">
              {upcomingRaces} remaining
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-f1-yellow/10 to-f1-orange/10">
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-f1-yellow" />
            <div className="text-lg font-bold">
              {driverLeader?.drivers?.first_name} {driverLeader?.drivers?.last_name}
            </div>
            <div className="text-sm text-muted-foreground">Championship Leader</div>
            <div className="text-xs text-muted-foreground mt-1">
              {driverLeader?.points} points
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-f1-orange/10 to-f1-red/10">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-f1-orange" />
            <div className="text-lg font-bold">
              {constructorLeader?.teams?.name || leadingTeam?.name}
            </div>
            <div className="text-sm text-muted-foreground">Leading Constructor</div>
            <div className="text-xs text-muted-foreground mt-1">
              {constructorLeader?.points} points
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-f1-green/10 to-f1-yellow/10">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-f1-green" />
            <div className="text-2xl font-bold">
              {driverStandings?.reduce((total, driver) => total + (driver.wins || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Wins</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across all drivers
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-f1-yellow" />
              <span>Season Highlights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge className="bg-f1-red text-white">Breaking News</Badge>
              <p className="text-sm">
                <strong>Lewis Hamilton</strong> makes his Ferrari debut, bringing his experience to the Scuderia alongside Charles Leclerc.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-f1-orange text-white">Team Moves</Badge>
              <p className="text-sm">
                <strong>Carlos Sainz Jr</strong> joins Mercedes as their new driver, partnering with George Russell.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-f1-yellow text-black">Rising Star</Badge>
              <p className="text-sm">
                <strong>Liam Lawson</strong> secures his spot at RB, showing impressive pace in his rookie season.
              </p>
            </div>
            <div className="space-y-2">
              <Badge className="bg-f1-green text-white">Championship Battle</Badge>
              <p className="text-sm">
                <strong>Max Verstappen</strong> leads the championship but faces fierce competition from McLaren's Lando Norris.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="w-5 h-5 text-f1-red" />
              <span>Key Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-f1-red">
                  {Math.round(((completedRaces / totalRaces) * 100))}%
                </div>
                <div className="text-xs text-muted-foreground">Season Complete</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-f1-orange">
                  {driverStandings?.filter(d => (d.wins || 0) > 0).length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Different Winners</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-f1-yellow">
                  {constructorStandings?.filter(c => (c.wins || 0) > 0).length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Winning Teams</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold text-f1-green">
                  {races.filter(r => r.is_sprint_weekend).length}
                </div>
                <div className="text-xs text-muted-foreground">Sprint Weekends</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonSummary;
