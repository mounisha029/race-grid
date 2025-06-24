
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LapTimeAnalytics from "@/components/analytics/LapTimeAnalytics";
import PositionAnalytics from "@/components/analytics/PositionAnalytics";
import QualifyingVsRaceAnalytics from "@/components/analytics/QualifyingVsRaceAnalytics";
import WeatherImpactAnalytics from "@/components/analytics/WeatherImpactAnalytics";
import TireStrategyAnalytics from "@/components/analytics/TireStrategyAnalytics";
import SeasonComparisonAnalytics from "@/components/analytics/SeasonComparisonAnalytics";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { BarChart3, Clock, MapPin, Cloud, Circle, Calendar, Filter } from "lucide-react";

// Mock data - in a real app, this would come from your API
const mockLapTimeData = [
  { lap: 1, time: 92.5, driver: "Hamilton", tireCompound: "medium", position: 3 },
  { lap: 2, time: 91.8, driver: "Hamilton", tireCompound: "medium", position: 2 },
  { lap: 3, time: 91.2, driver: "Hamilton", tireCompound: "medium", position: 1 },
  // Add more mock data...
];

const mockPositionData = [
  { lap: 1, position: 3, driver: "Hamilton", gap: 0.5 },
  { lap: 2, position: 2, driver: "Hamilton", gap: 0.2 },
  { lap: 3, position: 1, driver: "Hamilton", gap: 0.0 },
  // Add more mock data...
];

const mockQualifyingRaceData = [
  { driver: "Hamilton", qualifyingPosition: 3, racePosition: 1, qualifyingTime: 91.2, raceTime: 5832.1, points: 25 },
  { driver: "Verstappen", qualifyingPosition: 1, racePosition: 2, qualifyingTime: 90.8, raceTime: 5834.7, points: 18 },
  // Add more mock data...
];

const mockWeatherData = [
  { lap: 1, lapTime: 92.5, weather: 'dry' as const, temperature: 25, humidity: 60, windSpeed: 15, driver: "Hamilton" },
  { lap: 2, lapTime: 91.8, weather: 'dry' as const, temperature: 26, humidity: 58, windSpeed: 12, driver: "Hamilton" },
  // Add more mock data...
];

const mockTireData = [
  { driver: "Hamilton", stint: 1, compound: 'medium' as const, stintLength: 25, averageLapTime: 91.5, degradation: 0.05, pitStopLap: 25 },
  { driver: "Hamilton", stint: 2, compound: 'hard' as const, stintLength: 30, averageLapTime: 92.1, degradation: 0.02, pitStopLap: 55 },
  // Add more mock data...
];

const mockSeasonData = [
  { race: 1, season: 2024, points: 25, position: 1, driver: "Hamilton", team: "Mercedes" },
  { race: 2, season: 2024, points: 18, position: 2, driver: "Hamilton", team: "Mercedes" },
  { race: 1, season: 2025, points: 18, position: 2, driver: "Hamilton", team: "Mercedes" },
  // Add more mock data...
];

const filterOptions = {
  drivers: ["Hamilton", "Verstappen", "Leclerc", "Russell", "Sainz"],
  teams: ["Mercedes", "Red Bull Racing", "Ferrari", "McLaren", "Aston Martin"],
  seasons: [2023, 2024, 2025],
  circuits: ["Monaco", "Silverstone", "Spa-Francorchamps", "Monza", "Suzuka"],
  weatherConditions: ["dry", "wet", "mixed"]
};

const Analytics = () => {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
    // In a real app, you would trigger data refetch here
  };

  const handleResetFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold racing-text mb-2">F1 Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive performance analysis and insights for drivers, teams, and races
          </p>
        </div>

        <div className="space-y-6">
          <AnalyticsFilters
            options={filterOptions}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          <Tabs defaultValue="lap-times" className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="lap-times" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Lap Times
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Positions
              </TabsTrigger>
              <TabsTrigger value="qualifying" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Qualifying vs Race
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Weather Impact
              </TabsTrigger>
              <TabsTrigger value="tires" className="flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Tire Strategy
              </TabsTrigger>
              <TabsTrigger value="seasons" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Season Comparison
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lap-times">
              <LapTimeAnalytics 
                data={mockLapTimeData} 
                drivers={filterOptions.drivers}
              />
            </TabsContent>

            <TabsContent value="positions">
              <PositionAnalytics data={mockPositionData} />
            </TabsContent>

            <TabsContent value="qualifying">
              <QualifyingVsRaceAnalytics data={mockQualifyingRaceData} />
            </TabsContent>

            <TabsContent value="weather">
              <WeatherImpactAnalytics data={mockWeatherData} />
            </TabsContent>

            <TabsContent value="tires">
              <TireStrategyAnalytics data={mockTireData} />
            </TabsContent>

            <TabsContent value="seasons">
              <SeasonComparisonAnalytics 
                data={mockSeasonData} 
                availableSeasons={filterOptions.seasons}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
