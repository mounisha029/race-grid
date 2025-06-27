
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { useRaceResults, RaceResult } from "@/hooks/useRaceResults";

interface RaceResultsCardProps {
  raceId: string;
  raceName: string;
}

const RaceResultsCard = ({ raceId, raceName }: RaceResultsCardProps) => {
  const { data: results = [], isLoading, error } = useRaceResults(raceId);

  if (isLoading) {
    return (
      <Card className="racing-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-f1-yellow" />
            <span>Race Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || results.length === 0) {
    return (
      <Card className="racing-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-f1-yellow" />
            <span>Race Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No race results available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2: return <Medal className="w-4 h-4 text-gray-400" />;
      case 3: return <Award className="w-4 h-4 text-orange-600" />;
      default: return <span className="w-4 h-4 text-center text-sm font-bold">{position}</span>;
    }
  };

  const getStatusBadge = (result: RaceResult) => {
    switch (result.status) {
      case 'finished':
        return result.position <= 10 ? (
          <Badge variant="default" className="bg-f1-green text-white">
            +{result.points_awarded} pts
          </Badge>
        ) : (
          <Badge variant="outline">Finished</Badge>
        );
      case 'dnf':
        return <Badge variant="destructive">DNF</Badge>;
      case 'dns':
        return <Badge variant="outline">DNS</Badge>;
      case 'dsq':
        return <Badge variant="destructive">DSQ</Badge>;
      default:
        return <Badge variant="outline">{result.status}</Badge>;
    }
  };

  return (
    <Card className="racing-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-f1-yellow" />
          <span>{raceName} - Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {results.map((result) => (
          <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              {getPositionIcon(result.position)}
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: result.teams.primary_color }}
                />
                <span className="font-medium">
                  {result.drivers.first_name} {result.drivers.last_name}
                </span>
                <span className="text-sm text-muted-foreground">
                  #{result.drivers.driver_number}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {result.final_time && (
                <span className="text-sm text-muted-foreground">
                  {result.final_time}
                </span>
              )}
              {getStatusBadge(result)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RaceResultsCard;
