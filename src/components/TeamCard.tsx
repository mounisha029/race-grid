
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, TrendingUp } from "lucide-react";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    position: number;
    points: number;
    color: string;
    drivers: string[];
    wins: number;
    podiums: number;
  };
}

const TeamCard = ({ team }: TeamCardProps) => {
  const getPositionGradient = (position: number) => {
    if (position === 1) return "from-yellow-400 via-yellow-500 to-amber-600";
    if (position === 2) return "from-gray-300 via-gray-400 to-gray-600";
    if (position === 3) return "from-amber-600 via-orange-500 to-red-600";
    return "from-slate-400 via-slate-500 to-slate-600";
  };

  return (
    <Card className="racing-card group overflow-hidden">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: team.color }}
      />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${getPositionGradient(team.position)} rounded-lg flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold">
                {team.position}
              </span>
            </div>
            <div>
              <CardTitle className="racing-text group-hover:text-f1-red transition-colors">
                {team.name}
              </CardTitle>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-f1-yellow">
              <Trophy className="w-4 h-4" />
              <span className="font-bold text-lg">{team.points}</span>
            </div>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-f1-yellow mb-1">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{team.wins}</span>
            </div>
            <p className="text-xs text-muted-foreground">Wins</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-f1-orange mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold">{team.podiums}</span>
            </div>
            <p className="text-xs text-muted-foreground">Podiums</p>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Drivers</span>
          </div>
          <div className="space-y-1">
            {team.drivers.map((driver, index) => (
              <p key={index} className="text-sm font-medium">
                {driver}
              </p>
            ))}
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              backgroundColor: team.color,
              width: `${Math.min((team.points / 600) * 100, 100)}%`
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
