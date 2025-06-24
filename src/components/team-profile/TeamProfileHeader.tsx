
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Users, Calendar } from "lucide-react";

interface TeamProfileHeaderProps {
  team: any;
}

const TeamProfileHeader = ({ team }: TeamProfileHeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-f1-black via-slate-900 to-f1-black">
      <div className="absolute inset-0 bg-gradient-to-r from-f1-red/10 via-transparent to-f1-orange/10" />
      <div className="racing-track absolute top-1/2 left-0 w-full h-px" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <Badge 
                variant="secondary" 
                className="px-4 py-2"
                style={{ backgroundColor: team.primary_color || '#0070f3' }}
              >
                Constructor
              </Badge>
              <Badge variant="outline" className="text-sm">
                Founded {team.founded_year || 'N/A'}
              </Badge>
            </div>
            
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent mb-2">
              {team.name}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {team.base_location || 'Unknown Location'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-f1-yellow" />
                <div className="text-2xl font-bold">{team.championship_titles || 0}</div>
                <div className="text-sm text-muted-foreground">Championships</div>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-f1-orange" />
                <div className="text-2xl font-bold">{team.points || 0}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-f1-red" />
                <div className="text-2xl font-bold">{team.drivers?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Drivers</div>
              </div>
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-f1-yellow" />
                <div className="text-2xl font-bold">{new Date().getFullYear() - (team.founded_year || 2020)}</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Card className="p-6 bg-background/80 backdrop-blur">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-gradient-to-br from-f1-red to-f1-orange p-1">
                  <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                    {team.logo_url ? (
                      <img 
                        src={team.logo_url} 
                        alt={team.name}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-muted-foreground">
                        {team.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Position #{team.position || 'N/A'}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Constructor Standing
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfileHeader;
