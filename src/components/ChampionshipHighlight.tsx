
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Star, TrendingUp } from "lucide-react";
import { useChampionshipStandings } from "@/hooks/useApi";
import { ChampionshipResponse, DriverStanding } from "@/types/api";

interface ChampionshipHighlightProps {
  season: number;
}

const ChampionshipHighlight = ({ season }: ChampionshipHighlightProps) => {
  const { data: championshipData, isLoading } = useChampionshipStandings(season.toString(), "drivers");
  
  const championshipResponse = championshipData as ChampionshipResponse | undefined;
  const driverStandings = championshipResponse?.standings as DriverStanding[] | undefined;
  
  const leader = driverStandings?.[0];
  const secondPlace = driverStandings?.[1];
  const thirdPlace = driverStandings?.[2];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!leader) {
    return (
      <Card className="bg-gradient-to-br from-f1-red/10 to-f1-orange/10">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Championship data not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-f1-red/10 via-f1-orange/10 to-f1-yellow/10 border-f1-red/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <Crown className="w-8 h-8 text-f1-yellow" />
          <span className="racing-text">Championship Battle</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-f1-red text-white px-4 py-2 text-lg font-bold">
            CHAMPIONSHIP LEADER
          </Badge>
          <h3 className="racing-text text-3xl text-f1-red">
            {leader.drivers?.first_name} {leader.drivers?.last_name}
          </h3>
          <p className="text-lg text-muted-foreground">
            {leader.drivers?.teams?.name} • #{leader.drivers?.driver_number}
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-f1-yellow">{leader.points}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-f1-orange">{leader.wins || 0}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-f1-red">{leader.podiums || 0}</div>
              <div className="text-sm text-muted-foreground">Podiums</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondPlace && (
            <Card className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-gray-400" />
                  <Badge variant="secondary">P2</Badge>
                </div>
                <h4 className="font-bold text-lg">
                  {secondPlace.drivers?.first_name} {secondPlace.drivers?.last_name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {secondPlace.drivers?.teams?.name}
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="text-center">
                    <div className="font-bold text-xl">{secondPlace.points}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{secondPlace.wins || 0}</div>
                    <div className="text-xs text-muted-foreground">wins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {thirdPlace && (
            <Card className="bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-900">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  <Badge variant="secondary" className="bg-amber-600 text-white">P3</Badge>
                </div>
                <h4 className="font-bold text-lg">
                  {thirdPlace.drivers?.first_name} {thirdPlace.drivers?.last_name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {thirdPlace.drivers?.teams?.name}
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="text-center">
                    <div className="font-bold text-xl">{thirdPlace.points}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{thirdPlace.wins || 0}</div>
                    <div className="text-xs text-muted-foreground">wins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-f1-green" />
              <span className="font-medium">Championship Gap</span>
            </div>
            <div className="text-right">
              {secondPlace && (
                <div className="font-bold text-lg">
                  {Math.abs((leader.points || 0) - (secondPlace.points || 0))} points
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Leader advantage
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChampionshipHighlight;
