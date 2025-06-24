
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Trophy, Target } from "lucide-react";

interface PositionData {
  lap: number;
  position: number;
  driver: string;
  gap: number;
}

interface PositionAnalyticsProps {
  data: PositionData[];
}

const PositionAnalytics = ({ data }: PositionAnalyticsProps) => {
  const drivers = [...new Set(data.map(item => item.driver))];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

  const chartConfig = drivers.reduce((config, driver, index) => {
    config[driver] = {
      label: driver,
      color: colors[index % colors.length],
    };
    return config;
  }, {} as any);

  // Calculate position changes
  const positionChanges = drivers.map(driver => {
    const driverData = data.filter(item => item.driver === driver);
    const startPosition = driverData[0]?.position || 0;
    const endPosition = driverData[driverData.length - 1]?.position || 0;
    return {
      driver,
      change: startPosition - endPosition,
      startPosition,
      endPosition
    };
  }).sort((a, b) => b.change - a.change);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Position Analytics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Position Changes</h3>
            <div className="space-y-2">
              {positionChanges.slice(0, 5).map((item, index) => (
                <div key={item.driver} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                    <span className="font-medium">{item.driver}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      P{item.startPosition} → P{item.endPosition}
                    </span>
                    <span className={`font-bold ${item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {item.change > 0 ? '+' : ''}{item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Race Position Chart</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="lap" />
                  <YAxis reversed domain={[1, 20]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {drivers.slice(0, 8).map((driver, index) => (
                    <Line
                      key={driver}
                      type="monotone"
                      dataKey="position"
                      data={data.filter(item => item.driver === driver)}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionAnalytics;
