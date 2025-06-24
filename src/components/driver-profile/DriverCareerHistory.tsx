
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Award } from "lucide-react";

interface DriverCareerHistoryProps {
  driver: any;
}

const DriverCareerHistory = ({ driver }: DriverCareerHistoryProps) => {
  // Mock career data - replace with real data
  const careerHistory = [
    {
      year: "2025",
      team: driver.teams?.name || "Current Team",
      achievements: ["3 Wins", "5 Podiums", "2 Pole Positions"],
      status: "current"
    },
    {
      year: "2024",
      team: "Previous Team",
      achievements: ["2 Wins", "8 Podiums", "3 Pole Positions"],
      status: "past"
    },
    {
      year: "2023",
      team: "Another Team",
      achievements: ["1 Win", "6 Podiums", "1 Pole Position"],
      status: "past"
    },
  ];

  const careerHighlights = [
    {
      icon: <Trophy className="w-5 h-5 text-f1-yellow" />,
      title: "First F1 Victory",
      description: "Monaco Grand Prix 2023",
      date: "May 28, 2023"
    },
    {
      icon: <Award className="w-5 h-5 text-f1-orange" />,
      title: "First Pole Position",
      description: "British Grand Prix 2023",
      date: "July 9, 2023"
    },
    {
      icon: <Calendar className="w-5 h-5 text-f1-red" />,
      title: "F1 Debut",
      description: "Australian Grand Prix 2022",
      date: "April 10, 2022"
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Career History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {careerHistory.map((season, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <Badge variant={season.status === "current" ? "default" : "secondary"}>
                    {season.year}
                  </Badge>
                  <div>
                    <div className="font-medium">{season.team}</div>
                    <div className="text-sm text-muted-foreground">
                      {season.achievements.join(" • ")}
                    </div>
                  </div>
                </div>
                {season.status === "current" && (
                  <Badge variant="outline" className="text-f1-red border-f1-red">
                    Current
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {careerHighlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-background">
                  {highlight.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{highlight.title}</div>
                  <div className="text-sm text-muted-foreground">{highlight.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{highlight.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverCareerHistory;
