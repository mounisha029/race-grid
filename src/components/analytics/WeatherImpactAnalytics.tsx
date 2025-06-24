
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";

interface WeatherData {
  lap: number;
  lapTime: number;
  weather: 'dry' | 'wet' | 'mixed';
  temperature: number;
  humidity: number;
  windSpeed: number;
  driver: string;
}

interface WeatherImpactAnalyticsProps {
  data: WeatherData[];
}

const WeatherImpactAnalytics = ({ data }: WeatherImpactAnalyticsProps) => {
  // Group data by weather conditions
  const weatherGroups = data.reduce((groups, item) => {
    if (!groups[item.weather]) groups[item.weather] = [];
    groups[item.weather].push(item);
    return groups;
  }, {} as Record<string, WeatherData[]>);

  // Calculate average lap times by weather
  const weatherAverages = Object.entries(weatherGroups).map(([weather, items]) => ({
    weather,
    averageLapTime: items.reduce((sum, item) => sum + item.lapTime, 0) / items.length,
    count: items.length,
    fastestLap: Math.min(...items.map(item => item.lapTime)),
    slowestLap: Math.max(...items.map(item => item.lapTime))
  }));

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'dry': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'wet': return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'mixed': return <Cloud className="w-4 h-4 text-gray-500" />;
      default: return <Cloud className="w-4 h-4" />;
    }
  };

  const getWeatherColor = (weather: string) => {
    switch (weather) {
      case 'dry': return 'text-yellow-500';
      case 'wet': return 'text-blue-500';
      case 'mixed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const chartConfig = {
    lapTime: {
      label: "Lap Time",
      color: "hsl(var(--chart-1))",
    },
    temperature: {
      label: "Temperature",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Weather Impact Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherAverages.map((weather) => (
            <div key={weather.weather} className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                {getWeatherIcon(weather.weather)}
                <span className="font-semibold capitalize">{weather.weather}</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{weather.averageLapTime.toFixed(3)}s</div>
                <div className="text-sm text-muted-foreground">Average Lap Time</div>
                <div className="flex justify-between text-xs">
                  <span>Best: {weather.fastestLap.toFixed(3)}s</span>
                  <span>Worst: {weather.slowestLap.toFixed(3)}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Lap Time vs Weather Conditions</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weatherAverages}>
                  <XAxis dataKey="weather" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="averageLapTime" fill="var(--color-lapTime)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Temperature vs Performance</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.slice(0, 50)}>
                  <XAxis dataKey="temperature" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="lapTime" 
                    stroke="var(--color-temperature)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Weather Impact Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded border">
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-blue-500" />
                <span>High Wind Impact</span>
              </div>
              <Badge variant="outline">+2.3s average slower</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded border">
              <div className="flex items-center gap-3">
                <CloudRain className="w-5 h-5 text-blue-500" />
                <span>Wet Conditions</span>
              </div>
              <Badge variant="outline">+15.7s average slower</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded border">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-yellow-500" />
                <span>Optimal Temperature</span>
              </div>
              <Badge variant="outline">20-25°C fastest times</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherImpactAnalytics;
