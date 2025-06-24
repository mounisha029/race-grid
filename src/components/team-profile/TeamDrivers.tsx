
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface TeamDriversProps {
  team: any;
}

const TeamDrivers = ({ team }: TeamDriversProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Team Drivers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {team.drivers?.map((driver: any, index: number) => (
            <div key={driver.id} className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-f1-red to-f1-orange p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  {driver.profile_image_url ? (
                    <img 
                      src={driver.profile_image_url} 
                      alt={`${driver.first_name} ${driver.last_name}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-sm font-bold text-muted-foreground">
                      {driver.first_name[0]}{driver.last_name[0]}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="font-medium">
                  {driver.first_name} {driver.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  #{driver.driver_number}
                </div>
              </div>
              
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  P{driver.position || 'N/A'}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {driver.points || 0} pts
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-muted-foreground">
              No drivers found for this team
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamDrivers;
