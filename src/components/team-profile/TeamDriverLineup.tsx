
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamDriverLineupProps {
  team: any;
}

const TeamDriverLineup = ({ team }: TeamDriverLineupProps) => {
  const navigate = useNavigate();

  // Mock driver data - would normally come from team.drivers
  const drivers = [
    {
      id: "1",
      first_name: "Max",
      last_name: "Verstappen",
      driver_number: 1,
      nationality: "Netherlands",
      points: 180,
      position: 1,
      wins: 3,
      podiums: 6,
      poles: 2,
      fastestLaps: 3,
      contractUntil: 2028,
      joinedTeam: 2016
    },
    {
      id: "2", 
      first_name: "Sergio",
      last_name: "Pérez",
      driver_number: 11,
      nationality: "Mexico",
      points: 154,
      position: 3,
      wins: 2,
      podiums: 5,
      poles: 2,
      fastestLaps: 1,
      contractUntil: 2026,
      joinedTeam: 2021
    }
  ];

  const getDriverStats = (driver: any) => [
    { label: "Wins", value: driver.wins, icon: Trophy, color: "text-f1-yellow" },
    { label: "Podiums", value: driver.podiums, icon: Target, color: "text-green-500" },
    { label: "Poles", value: driver.poles, icon: Zap, color: "text-blue-500" },
    { label: "Fastest Laps", value: driver.fastestLaps, icon: Clock, color: "text-purple-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Driver Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {drivers.map((driver) => (
          <Card key={driver.id} className="overflow-hidden">
            <CardHeader 
              className="bg-gradient-to-r from-muted/50 to-transparent"
              style={{ 
                background: `linear-gradient(135deg, ${team.primary_color}15, transparent)` 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {driver.first_name} {driver.last_name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">#{driver.driver_number}</Badge>
                    <Badge variant="outline">{driver.nationality}</Badge>
                    <Badge 
                      style={{ backgroundColor: team.primary_color }}
                      className="text-white"
                    >
                      P{driver.position}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{driver.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Season Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {getDriverStats(driver).map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                      <div className="font-bold text-lg">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Contract Info */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Until:</span>
                  <span className="font-medium">{driver.contractUntil}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined Team:</span>
                  <span className="font-medium">{driver.joinedTeam}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Years with Team:</span>
                  <span className="font-medium">{2024 - driver.joinedTeam} years</span>
                </div>
              </div>

              {/* Performance Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Season Progress</span>
                  <span>{Math.round((driver.points / 400) * 100)}%</span>
                </div>
                <Progress value={(driver.points / 400) * 100} />
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate(`/drivers/${driver.id}`)}
              >
                View Full Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Dynamics */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Partnership Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-f1-orange">334</div>
              <div className="text-sm text-muted-foreground">Combined Points</div>
              <div className="text-xs text-green-500 mt-1">+45 vs last season</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-f1-red">5</div>
              <div className="text-sm text-muted-foreground">Combined Wins</div>
              <div className="text-xs text-green-500 mt-1">+2 vs last season</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-f1-yellow">11</div>
              <div className="text-sm text-muted-foreground">Combined Podiums</div>
              <div className="text-xs text-green-500 mt-1">+3 vs last season</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Qualifying Battle</h4>
              <div className="flex items-center justify-between">
                <span>{drivers[0].first_name} {drivers[0].last_name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-f1-red rounded"></div>
                  <span className="font-bold">6</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>{drivers[1].first_name} {drivers[1].last_name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-f1-orange rounded"></div>
                  <span className="font-bold">4</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Race Head-to-Head</h4>
              <div className="flex items-center justify-between">
                <span>{drivers[0].first_name} {drivers[0].last_name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-f1-red rounded"></div>
                  <span className="font-bold">7</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>{drivers[1].first_name} {drivers[1].last_name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-2 bg-f1-orange rounded"></div>
                  <span className="font-bold">3</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reserve/Test Drivers */}
      <Card>
        <CardHeader>
          <CardTitle>Reserve & Test Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Nyck de Vries</h4>
              <p className="text-sm text-muted-foreground">Reserve Driver</p>
              <Badge variant="outline" className="mt-2">Available for racing</Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Liam Lawson</h4>
              <p className="text-sm text-muted-foreground">Test Driver</p>
              <Badge variant="outline" className="mt-2">Development focus</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDriverLineup;
