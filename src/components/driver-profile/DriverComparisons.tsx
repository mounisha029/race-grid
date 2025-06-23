
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface DriverComparisonsProps {
  driver: any;
}

const DriverComparisons = ({ driver }: DriverComparisonsProps) => {
  const [compareDriver, setCompareDriver] = useState("lewis-hamilton");

  // Mock comparison data
  const drivers = [
    { id: "lewis-hamilton", name: "Lewis Hamilton", team: "Mercedes" },
    { id: "charles-leclerc", name: "Charles Leclerc", team: "Ferrari" },
    { id: "lando-norris", name: "Lando Norris", team: "McLaren" },
    { id: "george-russell", name: "George Russell", team: "Mercedes" }
  ];

  const comparisonStats = {
    "lewis-hamilton": {
      points: 234,
      wins: 1,
      podiums: 8,
      poles: 3,
      fastestLaps: 2,
      avgQualifying: 4.2,
      avgRace: 3.8,
      consistency: 92
    }
  };

  const selectedDriver = drivers.find(d => d.id === compareDriver);
  const stats = comparisonStats[compareDriver as keyof typeof comparisonStats];

  const radarData = [
    { skill: 'Pace', current: 95, compare: 98 },
    { skill: 'Racecraft', current: 88, compare: 96 },
    { skill: 'Qualifying', current: 92, compare: 89 },
    { skill: 'Wet Weather', current: 85, compare: 99 },
    { skill: 'Consistency', current: 90, compare: 94 },
    { skill: 'Overtaking', current: 87, compare: 91 }
  ];

  const headToHeadData = [
    { metric: 'Points', current: 151, compare: stats?.points || 0 },
    { metric: 'Wins', current: 2, compare: stats?.wins || 0 },
    { metric: 'Podiums', current: 5, compare: stats?.podiums || 0 },
    { metric: 'Poles', current: 1, compare: stats?.poles || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Driver Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Compare with Another Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={compareDriver} onValueChange={setCompareDriver}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select a driver to compare" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name} ({d.team})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Head-to-Head Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Head-to-Head Comparison (2024 Season)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="font-bold text-lg">{driver.first_name} {driver.last_name}</div>
                <Badge variant="outline">{driver.teams?.name}</Badge>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
              <div className="text-center">
                <div className="font-bold text-lg">{selectedDriver?.name}</div>
                <Badge variant="outline">{selectedDriver?.team}</Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={headToHeadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#FF1E00" name={`${driver.first_name} ${driver.last_name}`} />
                <Bar dataKey="compare" fill="#FF6600" name={selectedDriver?.name} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Skills Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={0} domain={[0, 100]} />
              <Radar
                name={`${driver.first_name} ${driver.last_name}`}
                dataKey="current"
                stroke="#FF1E00"
                fill="#FF1E00"
                fillOpacity={0.3}
              />
              <Radar
                name={selectedDriver?.name}
                dataKey="compare"
                stroke="#FF6600"
                fill="#FF6600"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{driver.first_name} {driver.last_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Qualifying Position</span>
                <span className="font-semibold">4.5</span>
              </div>
              <Progress value={82} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Race Position</span>
                <span className="font-semibold">4.1</span>
              </div>
              <Progress value={85} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Consistency Rating</span>
                <span className="font-semibold">90%</span>
              </div>
              <Progress value={90} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedDriver?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Qualifying Position</span>
                <span className="font-semibold">{stats?.avgQualifying || 'N/A'}</span>
              </div>
              <Progress value={stats ? (20 - stats.avgQualifying) * 5 : 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Race Position</span>
                <span className="font-semibold">{stats?.avgRace || 'N/A'}</span>
              </div>
              <Progress value={stats ? (20 - stats.avgRace) * 5 : 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Consistency Rating</span>
                <span className="font-semibold">{stats?.consistency || 'N/A'}%</span>
              </div>
              <Progress value={stats?.consistency || 0} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverComparisons;
