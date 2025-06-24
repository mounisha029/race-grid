
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { useState } from "react";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";

interface LapTimeData {
  lap: number;
  time: number;
  driver: string;
  tireCompound: string;
  position: number;
}

interface LapTimeAnalyticsProps {
  data: LapTimeData[];
  drivers: string[];
}

const LapTimeAnalytics = ({ data, drivers }: LapTimeAnalyticsProps) => {
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [selectedTire, setSelectedTire] = useState<string>("all");

  const filteredData = data.filter(item => {
    if (selectedDriver !== "all" && item.driver !== selectedDriver) return false;
    if (selectedTire !== "all" && item.tireCompound !== selectedTire) return false;
    return true;
  });

  const averageLapTime = filteredData.reduce((sum, item) => sum + item.time, 0) / filteredData.length;
  const bestLap = Math.min(...filteredData.map(item => item.time));
  const worstLap = Math.max(...filteredData.map(item => item.time));

  const chartConfig = {
    time: {
      label: "Lap Time",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Lap Time Analytics
        </CardTitle>
        <div className="flex gap-4">
          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {drivers.map(driver => (
                <SelectItem key={driver} value={driver}>{driver}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTire} onValueChange={setSelectedTire}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select tire compound" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Compounds</SelectItem>
              <SelectItem value="soft">Soft</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{bestLap.toFixed(3)}s</div>
            <div className="text-sm text-muted-foreground">Best Lap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{averageLapTime.toFixed(3)}s</div>
            <div className="text-sm text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{worstLap.toFixed(3)}s</div>
            <div className="text-sm text-muted-foreground">Worst Lap</div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <XAxis dataKey="lap" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="var(--color-time)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LapTimeAnalytics;
