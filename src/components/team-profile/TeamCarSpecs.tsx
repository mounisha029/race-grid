
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Gauge, Zap, Weight, Wrench } from "lucide-react";

interface TeamCarSpecsProps {
  team: any;
}

const TeamCarSpecs = ({ team }: TeamCarSpecsProps) => {
  // Mock car specifications data
  const carSpecs = {
    chassis: team.chassis || "RB20",
    powerUnit: team.power_unit || "Honda RBPT",
    weight: "798 kg",
    length: "5.63 m",
    width: "2.00 m", 
    height: "0.95 m",
    wheelbase: "3.70 m",
    fuelCapacity: "110 kg",
    gearbox: "8-speed sequential",
    suspension: "Carbon fiber wishbones"
  };

  const technicalSpecs = [
    {
      category: "Engine",
      icon: Zap,
      specs: [
        { label: "Power Unit", value: carSpecs.powerUnit },
        { label: "Configuration", value: "1.6L V6 Turbo Hybrid" },
        { label: "Fuel Flow Limit", value: "100 kg/h" },
        { label: "Rev Limit", value: "15,000 RPM" }
      ]
    },
    {
      category: "Chassis",
      icon: Car,
      specs: [
        { label: "Chassis Code", value: carSpecs.chassis },
        { label: "Material", value: "Carbon Fiber Monocoque" },
        { label: "Weight", value: carSpecs.weight },
        { label: "Wheelbase", value: carSpecs.wheelbase }
      ]
    },
    {
      category: "Dimensions",
      icon: Gauge,
      specs: [
        { label: "Length", value: carSpecs.length },
        { label: "Width", value: carSpecs.width },
        { label: "Height", value: carSpecs.height },
        { label: "Ground Clearance", value: "50-150 mm" }
      ]
    },
    {
      category: "Transmission",
      icon: Wrench,
      specs: [
        { label: "Gearbox", value: carSpecs.gearbox },
        { label: "Clutch", value: "Carbon Clutch" },
        { label: "Differential", value: "Limited Slip" },
        { label: "Gear Ratios", value: "Fixed per weekend" }
      ]
    }
  ];

  const aerodynamicsData = [
    { component: "Front Wing", description: "Multi-element wing with adjustable flaps", efficiency: 92 },
    { component: "Rear Wing", description: "DRS-enabled wing for reduced drag", efficiency: 89 },
    { component: "Floor", description: "Ground effect venturi tunnels", efficiency: 95 },
    { component: "Sidepods", description: "Optimized for cooling and airflow", efficiency: 87 },
    { component: "Diffuser", description: "Enhanced downforce generation", efficiency: 91 }
  ];

  return (
    <div className="space-y-6">
      {/* Car Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            2024 Car Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Key Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chassis:</span>
                    <Badge variant="outline">{carSpecs.chassis}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Power Unit:</span>
                    <Badge variant="outline">{carSpecs.powerUnit}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Weight:</span>
                    <span className="font-medium">{carSpecs.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Capacity:</span>
                    <span className="font-medium">{carSpecs.fuelCapacity}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <Car className="w-24 h-24 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Car Visualization</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicalSpecs.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Aerodynamics */}
      <Card>
        <CardHeader>
          <CardTitle>Aerodynamic Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aerodynamicsData.map((component) => (
              <div key={component.component} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{component.component}</h4>
                  <Badge variant="outline">{component.efficiency}% efficient</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-f1-red to-f1-orange h-2 rounded-full transition-all"
                    style={{ width: `${component.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Updates */}
      <Card>
        <CardHeader>
          <CardTitle>2024 Development Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-f1-red pl-4">
              <h4 className="font-semibold">Bahrain GP Update</h4>
              <p className="text-sm text-muted-foreground">New front wing endplates for improved airflow management</p>
              <Badge variant="outline" className="mt-2">Performance: +0.1s/lap</Badge>
            </div>
            <div className="border-l-4 border-f1-orange pl-4">
              <h4 className="font-semibold">Miami GP Update</h4>
              <p className="text-sm text-muted-foreground">Revised floor design with enhanced ground effect</p>
              <Badge variant="outline" className="mt-2">Performance: +0.15s/lap</Badge>
            </div>
            <div className="border-l-4 border-f1-yellow pl-4">
              <h4 className="font-semibold">Monaco GP Update</h4>
              <p className="text-sm text-muted-foreground">High downforce rear wing configuration</p>
              <Badge variant="outline" className="mt-2">Track-specific</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCarSpecs;
