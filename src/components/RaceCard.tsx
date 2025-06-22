
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

interface RaceCardProps {
  race: {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    round: number;
    status: "upcoming" | "live" | "completed";
    circuit: string;
  };
}

const RaceCard = ({ race }: RaceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-f1-red text-white animate-pulse-fast";
      case "completed":
        return "bg-f1-green text-white";
      default:
        return "bg-f1-orange text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "🔴 LIVE";
      case "completed":
        return "✅ FINISHED";
      default:
        return "📅 UPCOMING";
    }
  };

  return (
    <Card className="racing-card group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-f1-red/5 via-transparent to-f1-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="position-badge">
                {race.round}
              </div>
              <Badge className={getStatusColor(race.status)}>
                {getStatusText(race.status)}
              </Badge>
            </div>
            <CardTitle className="racing-text text-lg group-hover:text-f1-red transition-colors">
              {race.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{race.location}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{race.date}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{race.time}</span>
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">Circuit</p>
          <p className="text-sm font-medium">{race.circuit}</p>
        </div>

        {race.status === "live" && (
          <div className="racing-track relative h-1 bg-gradient-to-r from-f1-red via-f1-orange to-f1-yellow rounded-full mt-4" />
        )}
      </CardContent>
    </Card>
  );
};

export default RaceCard;
