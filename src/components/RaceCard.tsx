
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Zap } from "lucide-react";

interface RaceCardProps {
  race: {
    id: string;
    name: string;
    location: string;
    country: string;
    date: string;
    time: string;
    round: number;
    status: "scheduled" | "practice" | "qualifying" | "race" | "completed" | "cancelled";
    circuit: string;
    season: number;
    weather_condition?: string;
    is_sprint_weekend: boolean;
  };
}

const RaceCard = ({ race }: RaceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "race":
        return "bg-f1-red text-white animate-pulse-fast";
      case "completed":
        return "bg-f1-green text-white";
      case "qualifying":
        return "bg-f1-orange text-white";
      case "practice":
        return "bg-f1-yellow text-black";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-f1-orange text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "race":
        return "🔴 LIVE RACE";
      case "completed":
        return "✅ FINISHED";
      case "qualifying":
        return "🏁 QUALIFYING";
      case "practice":
        return "🏎️ PRACTICE";
      case "cancelled":
        return "❌ CANCELLED";
      default:
        return "📅 UPCOMING";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
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
              {race.is_sprint_weekend && (
                <Badge variant="outline" className="text-f1-yellow border-f1-yellow">
                  <Zap className="w-3 h-3 mr-1" />
                  SPRINT
                </Badge>
              )}
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
          <span className="text-sm">{race.location}, {race.country}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(race.date)}</span>
        </div>
        
        {race.time && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatTime(race.time)}</span>
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">Circuit</p>
          <p className="text-sm font-medium">{race.circuit}</p>
        </div>

        {race.weather_condition && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Weather</p>
            <p className="text-sm font-medium capitalize">{race.weather_condition}</p>
          </div>
        )}

        {race.status === "race" && (
          <div className="racing-track relative h-1 bg-gradient-to-r from-f1-red via-f1-orange to-f1-yellow rounded-full mt-4" />
        )}
      </CardContent>
    </Card>
  );
};

export default RaceCard;
