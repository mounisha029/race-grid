
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Thermometer, 
  Wind, 
  Gauge, 
  Clock,
  Activity
} from "lucide-react";

interface WeatherPanelProps {
  raceId: string;
}

const WeatherPanel = ({ raceId }: WeatherPanelProps) => {
  // Mock weather data - in real implementation, this would come from the API
  const currentWeather = {
    airTemp: 24,
    trackTemp: 42,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NW',
    pressure: 1013,
    conditions: 'Partly Cloudy',
    rainChance: 15
  };

  const forecast = [
    { time: '15:00', temp: 24, rainChance: 15, conditions: 'Partly Cloudy' },
    { time: '15:30', temp: 25, rainChance: 20, conditions: 'Partly Cloudy' },
    { time: '16:00', temp: 26, rainChance: 35, conditions: 'Cloudy' },
    { time: '16:30', temp: 25, rainChance: 45, conditions: 'Light Rain' },
    { time: '17:00', temp: 23, rainChance: 60, conditions: 'Rain' },
  ];

  const trackStatus = {
    surface: 'Dry',
    grip: 95,
    temperature: 42,
    degradation: 'Medium'
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'text-yellow-600';
      case 'partly cloudy': return 'text-blue-500';
      case 'cloudy': return 'text-gray-600';
      case 'light rain': return 'text-blue-600';
      case 'rain': return 'text-blue-700';
      case 'heavy rain': return 'text-blue-800';
      default: return 'text-foreground';
    }
  };

  const getRainChanceColor = (chance: number) => {
    if (chance < 20) return 'text-green-600';
    if (chance < 50) return 'text-yellow-600';
    if (chance < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTemperatureColor = (temp: number, type: 'air' | 'track') => {
    const threshold = type === 'air' ? [20, 30] : [35, 50];
    if (temp < threshold[0]) return 'text-blue-600';
    if (temp > threshold[1]) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Current Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Air Temperature</div>
                <div className={`text-2xl font-bold ${getTemperatureColor(currentWeather.airTemp, 'air')}`}>
                  {currentWeather.airTemp}°C
                </div>
              </div>
              <Thermometer className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Track Temperature</div>
                <div className={`text-2xl font-bold ${getTemperatureColor(currentWeather.trackTemp, 'track')}`}>
                  {currentWeather.trackTemp}°C
                </div>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
                <div className="text-2xl font-bold">
                  {currentWeather.windSpeed} km/h
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentWeather.windDirection}
                </div>
              </div>
              <Wind className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Rain Chance</div>
                <div className={`text-2xl font-bold ${getRainChanceColor(currentWeather.rainChance)}`}>
                  {currentWeather.rainChance}%
                </div>
              </div>
              <Gauge className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecast.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-16 text-center">
                      {item.time}
                    </Badge>
                    <div>
                      <div className={`font-medium ${getConditionColor(item.conditions)}`}>
                        {item.conditions}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className={getTemperatureColor(item.temp, 'air')}>
                      {item.temp}°C
                    </div>
                    <div className={getRainChanceColor(item.rainChance)}>
                      {item.rainChance}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Track Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Track Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Surface</div>
                <div className="font-bold text-lg">{trackStatus.surface}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Degradation</div>
                <div className="font-bold text-lg">{trackStatus.degradation}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Grip Level</span>
                  <span>{trackStatus.grip}%</span>
                </div>
                <Progress value={trackStatus.grip} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Humidity</span>
                  <span>{currentWeather.humidity}%</span>
                </div>
                <Progress value={currentWeather.humidity} className="h-2" />
              </div>
            </div>

            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-2">Current Conditions</div>
              <div className={`font-medium ${getConditionColor(currentWeather.conditions)}`}>
                {currentWeather.conditions}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Pressure: {currentWeather.pressure} hPa
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherPanel;
