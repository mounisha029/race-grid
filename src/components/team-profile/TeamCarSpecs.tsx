
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Zap, Gauge, Wrench } from "lucide-react";

interface TeamCarSpecsProps {
  team: any;
}

const TeamCarSpecs = ({ team }: TeamCarSpecsProps) => {
  // Mock car specifications data
  const carSpecs = {
    chassis: team.chassis || "2025 Chassis",
    powerUnit: team.power_unit || "Power Unit",
    weight: "798 kg",
    fuelCapacity: "110 kg",
    gears: "8 + reverse",
    suspension: "Carbon fiber",
    brakes: "Carbon discs",
    wheels: "13 inch",
  };

  const technicalFeatures = [
    { icon: <Car className="w-4 h-4" />, label: "Aerodynamics", value: "Advanced", color: "bg-green-500" },
    { icon: <Zap className="w-4 h-4" />, label: "ERS System", value: "Optimized", color: "bg-blue-500" },
    { icon: <Gauge className="w-4 h-4" />, label: "Efficiency", value: "High", color: "bg-orange-500" },
    { icon: <Wrench className="w-4 h-4" />, label: "Reliability", value: "94%", color: "bg-purple-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Car Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">TECHNICAL SPECS</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Chassis:</span>
              <div className="font-medium">{carSpecs.chassis}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Power Unit:</span>
              <div className="font-medium">{carSpecs.powerUnit}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Weight:</span>
              <div className="font-medium">{carSpecs.weight}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Fuel:</span>
              <div className="font-medium">{carSpecs.fuelCapacity}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Gears:</span>
              <div className="font-medium">{carSpecs.gears}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Wheels:</span>
              <div className="font-medium">{carSpecs.wheels}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">PERFORMANCE FEATURES</h4>
          <div className="space-y-3">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.label}</span>
                </div>
                <Badge variant="secondary">{feature.value}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-f1-red/10 to-f1-orange/10 border border-f1-red/20">
          <div className="text-sm font-medium mb-2">Team Principal</div>
          <div className="text-lg font-bold">{team.team_principal || "TBA"}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCarSpecs;
