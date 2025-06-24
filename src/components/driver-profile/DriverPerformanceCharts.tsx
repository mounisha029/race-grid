
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DriverPerformanceChartsProps {
  driverId: string;
}

const DriverPerformanceCharts = ({ driverId }: DriverPerformanceChartsProps) => {
  // Mock data - replace with real data from your API
  const seasonProgression = [
    { race: "Bahrain", points: 25, position: 1 },
    { race: "Saudi Arabia", points: 43, position: 2 },
    { race: "Australia", points: 61, position: 1 },
    { race: "Japan", points: 79, position: 3 },
    { race: "China", points: 97, position: 2 },
    { race: "Miami", points: 115, position: 1 },
  ];

  const qualifyingPerformance = [
    { race: "Bahrain", position: 1, gap: 0 },
    { race: "Saudi Arabia", position: 3, gap: 0.156 },
    { race: "Australia", position: 1, gap: 0 },
    { race: "Japan", position: 2, gap: 0.043 },
    { race: "China", position: 1, gap: 0 },
    { race: "Miami", position: 2, gap: 0.087 },
  ];

  const raceResults = [
    { race: "Bahrain", position: 1, points: 25 },
    { race: "Saudi Arabia", position: 2, points: 18 },
    { race: "Australia", position: 1, points: 25 },
    { race: "Japan", position: 3, points: 15 },
    { race: "China", position: 2, points: 18 },
    { race: "Miami", position: 1, points: 25 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Season Points Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={seasonProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="race" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#DC143C" 
                strokeWidth={3}
                dot={{ fill: "#DC143C", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Qualifying Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={qualifyingPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="position" fill="#FF6600" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Race Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={raceResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="position" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverPerformanceCharts;
