
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, MapPin, Calendar, Share2, Heart } from "lucide-react";

interface DriverProfileHeaderProps {
  driver: any;
}

const DriverProfileHeader = ({ driver }: DriverProfileHeaderProps) => {
  const fullName = `${driver.first_name} ${driver.last_name}`;
  
  return (
    <Card className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r opacity-10"
        style={{ 
          background: `linear-gradient(135deg, ${driver.teams?.primary_color || '#FF1E00'}, ${driver.teams?.secondary_color || '#000000'})` 
        }}
      />
      
      <CardContent className="relative p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Driver Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-f1-red to-f1-orange p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold">
                {driver.driver_number || fullName.charAt(0)}
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  #{driver.driver_number}
                </Badge>
                <Badge 
                  style={{ backgroundColor: driver.teams?.primary_color }}
                  className="text-white"
                >
                  {driver.teams?.name}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold racing-text">
                {fullName}
              </h1>
              <p className="text-xl text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {driver.nationality || 'Unknown'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-f1-red">{driver.position || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Championship Position</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-f1-orange">{driver.points || 0}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-f1-yellow flex items-center justify-center gap-1">
                  <Trophy className="w-5 h-5" />
                  {driver.wins || 0}
                </div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{driver.podiums || 0}</div>
                <div className="text-sm text-muted-foreground">Podiums</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Follow
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

export default DriverProfileHeader;
