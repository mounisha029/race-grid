import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Users, Flag, Zap } from "lucide-react";

const SeasonSummary = () => {
  const topDrivers = [
    { position: 1, name: "Oscar Piastri", team: "McLaren", points: 285, wins: 4, color: "#FF8700" },
    { position: 2, name: "Max Verstappen", team: "Red Bull", points: 268, wins: 3, color: "#0600EF" },
    { position: 3, name: "Lando Norris", team: "McLaren", points: 245, wins: 2, color: "#FF8700" },
    { position: 4, name: "Lewis Hamilton", team: "Ferrari", points: 198, wins: 1, color: "#DC143C" },
    { position: 5, name: "Charles Leclerc", team: "Ferrari", points: 187, wins: 2, color: "#DC143C" },
  ];

  const topTeams = [
    { position: 1, name: "McLaren", points: 530, wins: 6, color: "#FF8700" },
    { position: 2, name: "Red Bull", points: 396, wins: 3, color: "#0600EF" },
    { position: 3, name: "Ferrari", points: 385, wins: 3, color: "#DC143C" },
    { position: 4, name: "Mercedes", points: 354, wins: 0, color: "#00D2BE" },
    { position: 5, name: "Aston Martin", points: 174, wins: 0, color: "#006F62" },
  ];

  const seasonStats = {
    totalRaces: 24,
    completedRaces: 16,
    sprintWeekends: 6,
    differentWinners: 6,
    polePositions: { "McLaren": 7, "Red Bull": 2, "Ferrari": 3, "Mercedes": 2, "Others": 2 }
  };

  return (
    <div className="space-y-6">
      {/* Season Overview */}
      <Card className="racing-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-f1-red" />
            <span>2025 Season Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-red">{seasonStats.completedRaces}</div>
              <div className="text-sm text-muted-foreground">Races Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-orange">{seasonStats.totalRaces}</div>
              <div className="text-sm text-muted-foreground">Total Races</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-yellow">{seasonStats.sprintWeekends}</div>
              <div className="text-sm text-muted-foreground">Sprint Weekends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-f1-green">{seasonStats.differentWinners}</div>
              <div className="text-sm text-muted-foreground">Different Winners</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Drivers */}
        <Card className="racing-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-f1-red" />
              <span>Top 5 Drivers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDrivers.map((driver, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: driver.color }}
                    >
                      {driver.position}
                    </div>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-muted-foreground">{driver.team}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{driver.points} pts</div>
                    <div className="text-sm text-muted-foreground">{driver.wins} wins</div>
                  </div>
                </div>
                {index < topDrivers.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top 5 Teams */}
        <Card className="racing-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-f1-orange" />
              <span>Top 5 Constructors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTeams.map((team, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.position}
                    </div>
                    <div className="font-medium">{team.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{team.points} pts</div>
                    <div className="text-sm text-muted-foreground">{team.wins} wins</div>
                  </div>
                </div>
                {index < topTeams.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Storylines */}
      <Card className="racing-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-f1-yellow" />
            <span>2025 Season Storylines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <h4 className="font-semibold text-orange-600 mb-2">Oscar's Breakthrough</h4>
              <p className="text-sm text-muted-foreground">
                Oscar Piastri leads the championship in his third season, showcasing McLaren's resurgence with 4 wins and 12 podiums.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-semibold text-red-600 mb-2">Lewis at Ferrari</h4>
              <p className="text-sm text-muted-foreground">
                Lewis Hamilton's move to Ferrari brings experience and speed, currently P4 in the championship with 1 win.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-600 mb-2">McLaren Dominance</h4>
              <p className="text-sm text-muted-foreground">
                McLaren leads both championships with Piastri and Norris forming a formidable partnership.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-600 mb-2">Tight Midfield</h4>
              <p className="text-sm text-muted-foreground">
                Mercedes, Aston Martin, and Alpine battle for best-of-the-rest behind the top 3 teams.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonSummary;
