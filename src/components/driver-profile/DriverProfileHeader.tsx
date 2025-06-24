
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Clock, Star } from "lucide-react";

interface DriverProfileHeaderProps {
  driver: any;
}

const DriverProfileHeader = ({ driver }: DriverProfileHeaderProps) => {
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
                className="text-2xl px-4 py-2 font-bold"
                style={{ backgroundColor: driver.teams?.primary_color || '#0070f3' }}
              >
                #{driver.driver_number}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {driver.nationality}
              </Badge>
            </div>
            
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent mb-2">
              {driver.first_name} {driver.last_name}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {driver.teams?.name || 'Free Agent'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-f1-yellow" />
                <div className="text-2xl font-bold">{driver.wins || 0}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-f1-orange" />
                <div className="text-2xl font-bold">{driver.podiums || 0}</div>
                <div className="text-sm text-muted-foreground">Podiums</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-f1-red" />
                <div className="text-2xl font-bold">{driver.pole_positions || 0}</div>
                <div className="text-sm text-muted-foreground">Poles</div>
              </div>
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-f1-yellow" />
                <div className="text-2xl font-bold">{driver.points || 0}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Card className="p-6 bg-background/80 backdrop-blur">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-f1-red to-f1-orange p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    {driver.profile_image_url ? (
                      <img 
                        src={driver.profile_image_url} 
                        alt={`${driver.first_name} ${driver.last_name}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-muted-foreground">
                        {driver.first_name[0]}{driver.last_name[0]}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Position #{driver.position || 'N/A'}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Championship Standing
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfileHeader;
