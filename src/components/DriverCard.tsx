
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface DriverCardProps {
  driver: {
    id: string;
    name: string;
    team: string;
    position: number;
    points: number;
    nationality: string;
    number: number;
    teamColor: string;
    lastRacePosition?: number;
    trend: "up" | "down" | "stable";
  };
}

const DriverCard = ({ driver }: DriverCardProps) => {
  const getTrendIcon = () => {
    switch (driver.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return "from-yellow-400 to-yellow-600";
    if (position === 2) return "from-gray-300 to-gray-500";
    if (position === 3) return "from-amber-600 to-amber-800";
    return "from-slate-400 to-slate-600";
  };

  return (
    <Card className="racing-card group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getPositionColor(driver.position)} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">
                {driver.position}
              </span>
            </div>
            <div>
              <h3 className="racing-text text-lg group-hover:text-f1-red transition-colors">
                #{driver.number} {driver.name}
              </h3>
              <p className="text-sm text-muted-foreground">{driver.nationality}</p>
            </div>
          </div>
          {getTrendIcon()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge 
            className="text-white font-medium"
            style={{ backgroundColor: driver.teamColor }}
          >
            {driver.team}
          </Badge>
          <div className="flex items-center space-x-1 text-f1-yellow">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{driver.points}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        </div>

        {driver.lastRacePosition && (
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Last Race</p>
            <p className="text-sm font-medium">
              P{driver.lastRacePosition}
            </p>
          </div>
        )}

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-f1-red to-f1-orange transition-all duration-500"
            style={{ width: `${Math.min((driver.points / 400) * 100, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverCard;
