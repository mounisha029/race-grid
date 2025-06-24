
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface TeamPerformanceChartsProps {
  teamId: string;
}

const TeamPerformanceCharts = ({ teamId }: TeamPerformanceChartsProps) => {
  // Mock data - replace with real data from your API
  const constructorPoints = [
    { race: "Bahrain", points: 43, position: 2 },
    { race: "Saudi Arabia", points: 61, position: 2 },
    { race: "Australia", points: 86, position: 1 },
    { race: "Japan", points: 104, position: 2 },
    { race: "China", points: 135, position: 1 },
    { race: "Miami", points: 158, position: 1 },
  ];

  const driverComparison = [
    { race: "Bahrain", driver1: 25, driver2: 18 },
    { race: "Saudi Arabia", driver1: 18, driver2: 0 },
    { race: "Australia", driver1: 25, driver2: 0 },
    { race: "Japan", driver1: 18, driver2: 0 },
    { race: "China", driver1: 15, driver2: 16 },
    { race: "Miami", driver1: 25, driver2: -2 },
  ];

  const reliability = [
    { race: "Bahrain", percentage: 100 },
    { race: "Saudi Arabia", percentage: 50 },
    { race: "Australia", percentage: 50 },
    { race: "Japan", percentage: 50 },
    { race: "China", percentage: 100 },
    { race: "Miami", percentage: 50 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Constructor Points Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={constructorPoints}>
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
            <CardTitle>Driver Points Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={driverComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="driver1" fill="#DC143C" name="Driver 1" />
                <Bar dataKey="driver2" fill="#FF6600" name="Driver 2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Race Reliability</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reliability}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamPerformanceCharts;
