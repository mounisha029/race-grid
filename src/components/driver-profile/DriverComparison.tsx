
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface DriverComparisonProps {
  currentDriver: any;
}

const DriverComparison = ({ currentDriver }: DriverComparisonProps) => {
  const [selectedDriver, setSelectedDriver] = useState("");

  // Mock data for comparison drivers
  const availableDrivers = [
    { id: "1", name: "Max Verstappen", points: 145 },
    { id: "2", name: "Lewis Hamilton", points: 98 },
    { id: "3", name: "Charles Leclerc", points: 87 },
  ];

  const comparisonStats = [
    { metric: "Points", current: currentDriver.points || 0, compare: 145 },
    { metric: "Wins", current: currentDriver.wins || 0, compare: 6 },
    { metric: "Podiums", current: currentDriver.podiums || 0, compare: 8 },
    { metric: "Pole Positions", current: currentDriver.pole_positions || 0, compare: 4 },
    { metric: "Fastest Laps", current: currentDriver.fastest_laps || 0, compare: 3 },
  ];

  const getPercentage = (value: number, maxValue: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Comparison</CardTitle>
        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
          <SelectTrigger>
            <SelectValue placeholder="Select driver to compare" />
          </SelectTrigger>
          <SelectContent>
            {availableDrivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {selectedDriver ? (
          <div className="space-y-6">
            {comparisonStats.map((stat, index) => {
              const maxValue = Math.max(stat.current, stat.compare);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{stat.metric}</span>
                    <div className="flex gap-4">
                      <span className="text-f1-red">{stat.current}</span>
                      <span className="text-f1-orange">{stat.compare}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={getPercentage(stat.current, maxValue)} 
                      className="h-2 bg-gray-200"
                    />
                    <Progress 
                      value={getPercentage(stat.compare, maxValue)} 
                      className="h-2 bg-f1-orange/20"
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 text-sm mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-f1-red rounded"></div>
                <span>{currentDriver.first_name} {currentDriver.last_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-f1-orange rounded"></div>
                <span>{availableDrivers.find(d => d.id === selectedDriver)?.name}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Select a driver to compare performance metrics
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverComparison;
