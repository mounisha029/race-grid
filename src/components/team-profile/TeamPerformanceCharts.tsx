
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface TeamPerformanceChartsProps {
  team: any;
  detailed?: boolean;
}

const TeamPerformanceCharts = ({ team, detailed = false }: TeamPerformanceChartsProps) => {
  // Mock data for charts
  const seasonProgression = [
    { round: 1, points: 44, position: 2 },
    { round: 2, points: 87, position: 2 },
    { round: 3, points: 125, position: 1 },
    { round: 4, points: 158, position: 1 },
    { round: 5, points: 201, position: 1 },
    { round: 6, points: 245, position: 1 },
    { round: 7, points: 289, position: 1 },
    { round: 8, points: 334, position: 1 },
  ];

  const raceResults = [
    { race: "Bahrain", driver1: 1, driver2: 3, points: 44 },
    { race: "Saudi Arabia", driver1: 2, driver2: 4, points: 43 },
    { race: "Australia", driver1: 1, driver2: 2, points: 38 },
    { race: "Japan", driver1: 3, driver2: 5, points: 33 },
    { race: "China", driver1: 1, driver2: 1, points: 43 },
    { race: "Miami", driver1: 2, driver2: 6, points: 44 },
  ];

  const driverComparison = [
    { metric: 'Points', driver1: 180, driver2: 154 },
    { metric: 'Wins', driver1: 3, driver2: 2 },
    { metric: 'Podiums', driver1: 6, driver2: 5 },
    { metric: 'Poles', driver1: 2, driver2: 2 },
    { metric: 'DNFs', driver1: 0, driver2: 1 }
  ];

  const performanceByTrack = [
    { type: 'Street Circuits', points: 85, percentage: 78 },
    { type: 'High Speed', points: 92, percentage: 85 },
    { type: 'Technical', points: 78, percentage: 72 },
    { type: 'Mixed', points: 89, percentage: 82 }
  ];

  const COLORS = ['#FF1E00', '#FF6600', '#FFD700', '#00C851'];

  return (
    <div className="space-y-6">
      {/* Season Points Progression */}
      <Card>
        <CardHeader>
          <CardTitle>2024 Constructor Championship Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={seasonProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="points" 
                stroke="#FF1E00" 
                fill="#FF1E00"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Race Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Race Points</CardTitle>
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

        {/* Driver vs Driver */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={driverComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="driver1" fill="#FF1E00" name="Driver 1" />
                <Bar dataKey="driver2" fill="#FF6600" name="Driver 2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Championship Position Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Championship Position Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={seasonProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis reversed domain={[1, 10]} />
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

          {/* Performance by Track Type */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Track Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={performanceByTrack}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {performanceByTrack.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {detailed && (
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-f1-red">92%</div>
                <div className="text-sm text-muted-foreground">Reliability Rate</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-f1-orange">3.2</div>
                <div className="text-sm text-muted-foreground">Avg Grid Position</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-f1-yellow">4.1</div>
                <div className="text-sm text-muted-foreground">Avg Race Position</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-500">89%</div>
                <div className="text-sm text-muted-foreground">Points Finish Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamPerformanceCharts;
