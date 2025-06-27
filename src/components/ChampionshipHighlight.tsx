
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, TrendingUp } from "lucide-react";

interface ChampionshipHighlightProps {
  season: number;
}

const ChampionshipHighlight = ({ season = 2025 }: ChampionshipHighlightProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Driver Championship Leader */}
      <Card className="racing-card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-f1-red/10 via-transparent to-f1-orange/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-f1-yellow" />
              <span>Championship Leader</span>
            </CardTitle>
            <Badge className="bg-f1-red text-white">
              {season}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <div className="flex-1">
              <h3 className="racing-text text-xl text-f1-red">
                #81 Oscar Piastri
              </h3>
              <p className="text-muted-foreground">Australian • McLaren</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-f1-yellow" />
                  <span className="font-bold">285 pts</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  4 wins • 12 podiums
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Season Highlights</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Wins:</span>
                <span className="ml-2 font-medium">4</span>
              </div>
              <div>
                <span className="text-muted-foreground">Poles:</span>
                <span className="ml-2 font-medium">3</span>
              </div>
              <div>
                <span className="text-muted-foreground">Podiums:</span>
                <span className="ml-2 font-medium">12</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fastest Laps:</span>
                <span className="ml-2 font-medium">2</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Constructor Championship Leader */}
      <Card className="racing-card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-f1-orange" />
              <span>Constructor Leader</span>
            </CardTitle>
            <Badge className="bg-f1-orange text-white">
              {season}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <div className="flex-1">
              <h3 className="racing-text text-xl text-f1-orange">
                McLaren F1 Team
              </h3>
              <p className="text-muted-foreground">Woking, United Kingdom</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-f1-yellow" />
                  <span className="font-bold">530 pts</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  6 wins • 21 podiums
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Team Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Drivers:</span>
                <span className="ml-2 font-medium">Piastri, Norris</span>
              </div>
              <div>
                <span className="text-muted-foreground">Poles:</span>
                <span className="ml-2 font-medium">7</span>
              </div>
              <div>
                <span className="text-muted-foreground">1-2 Finishes:</span>
                <span className="ml-2 font-medium">3</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fastest Laps:</span>
                <span className="ml-2 font-medium">3</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChampionshipHighlight;
