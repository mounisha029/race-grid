
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface DriverPerformanceChartsProps {
  driver: any;
  detailed?: boolean;
}

const DriverPerformanceCharts = ({ driver, detailed = false }: DriverPerformanceChartsProps) => {
  // Mock data for charts
  const seasonProgression = [
    { round: 1, points: 0, position: 20 },
    { round: 2, points: 8, position: 15 },
    { round: 3, points: 18, position: 12 },
    { round: 4, points: 43, position: 8 },
    { round: 5, points: 68, position: 6 },
    { round: 6, points: 101, position: 4 },
    { round: 7, points: 126, position: 3 },
    { round: 8, points: 151, position: 3 },
  ];

  const raceResults = [
    { race: "Bahrain", position: 3, points: 15 },
    { race: "Saudi Arabia", position: 2, points: 18 },
    { race: "Australia", position: 1, points: 25 },
    { race: "Japan", position: 4, points: 12 },
    { race: "China", position: 2, points: 18 },
    { race: "Miami", position: 1, points: 25 },
  ];

  const finishingPositions = [
    { position: "1st", count: 2 },
    { position: "2nd", count: 3 },
    { position: "3rd", count: 1 },
    { position: "4th-10th", count: 2 },
    { position: "11th+", count: 0 },
    { position: "DNF", count: 0 },
  ];

  const COLORS = ['#FF1E00', '#FF6600', '#FFD700', '#00C851', '#007bff', '#6c757d'];

  return (
    <div className="space-y-6">
      {/* Season Points Progression */}
      <Card>
        <CardHeader>
          <CardTitle>2024 Season Points Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={seasonProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#FF1E00" 
                strokeWidth={3}
                dot={{ fill: '#FF1E00' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Race Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Race Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={raceResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="#FF6600" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Finishing Positions Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Finishing Positions (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={finishingPositions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ position, count }) => `${position}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {finishingPositions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Championship Position Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Championship Position</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={seasonProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis reversed domain={[1, 20]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="position" 
                    stroke="#FFD700" 
                    strokeWidth={3}
                    dot={{ fill: '#FFD700' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Qualifying vs Race Performance</span>
                  <span className="text-green-500 font-semibold">+2.3 avg positions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Points per Race Average</span>
                  <span className="text-f1-orange font-semibold">15.8 points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Consistency Rating</span>
                  <span className="text-blue-500 font-semibold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wet Weather Performance</span>
                  <span className="text-purple-500 font-semibold">Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DriverPerformanceCharts;
