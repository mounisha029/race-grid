
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, MapPin, Calendar, Share2, Heart, users } from "lucide-react";

interface TeamProfileHeaderProps {
  team: any;
}

const TeamProfileHeader = ({ team }: TeamProfileHeaderProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r opacity-10"
        style={{ 
          background: `linear-gradient(135deg, ${team.primary_color || '#FF1E00'}, ${team.secondary_color || '#000000'})` 
        }}
      />
      
      <CardContent className="relative p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Team Logo */}
          <div className="flex-shrink-0">
            <div 
              className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1"
              style={{ background: `linear-gradient(135deg, ${team.primary_color}, ${team.secondary_color})` }}
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold">
                {team.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  Position {team.position || 'N/A'}
                </Badge>
                <Badge 
                  style={{ backgroundColor: team.primary_color }}
                  className="text-white"
                >
                  Constructor
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold racing-text">
                {team.name}
              </h1>
              <p className="text-xl text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {team.base_location || 'Unknown'}
              </p>
              {team.team_principal && (
                <p className="text-lg text-muted-foreground">
                  Team Principal: {team.team_principal}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-f1-red">{team.position || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Championship Position</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-f1-orange">{team.points || 0}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-f1-yellow flex items-center justify-center gap-1">
                  <Trophy className="w-5 h-5" />
                  {team.championship_titles || 0}
                </div>
                <div className="text-sm text-muted-foreground">Championships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{team.founded_year || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Follow Team
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamProfileHeader;
