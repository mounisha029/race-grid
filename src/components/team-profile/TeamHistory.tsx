
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Calendar, MapPin } from "lucide-react";

interface TeamHistoryProps {
  team: any;
}

const TeamHistory = ({ team }: TeamHistoryProps) => {
  // Mock historical data
  const teamHistory = [
    {
      year: "2025",
      position: team.position || 1,
      points: team.points || 158,
      wins: 3,
      podiums: 8,
      status: "current"
    },
    {
      year: "2024",
      position: 3,
      points: 285,
      wins: 2,
      podiums: 12,
      status: "past"
    },
    {
      year: "2023",
      position: 4,
      points: 234,
      wins: 1,
      podiums: 8,
      status: "past"
    },
  ];

  const majorAchievements = [
    {
      icon: <Trophy className="w-5 h-5 text-f1-yellow" />,
      title: "Constructor Championship",
      description: "First championship title",
      date: "2021"
    },
    {
      icon: <Award className="w-5 h-5 text-f1-orange" />,
      title: "First Grand Prix Victory",
      description: "Historic first race win",
      date: "2020"
    },
    {
      icon: <Calendar className="w-5 h-5 text-f1-red" />,
      title: "F1 Entry",
      description: "Joined Formula 1 grid",
      date: team.founded_year?.toString() || "2019"
    },
    {
      icon: <MapPin className="w-5 h-5 text-f1-yellow" />,
      title: "Team Founded",
      description: `Established in ${team.base_location || "Unknown"}`,
      date: team.founded_year?.toString() || "2019"
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Championship History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamHistory.map((season, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <Badge variant={season.status === "current" ? "default" : "secondary"}>
                    {season.year}
                  </Badge>
                  <div>
                    <div className="font-medium">P{season.position} • {season.points} points</div>
                    <div className="text-sm text-muted-foreground">
                      {season.wins} wins • {season.podiums} podiums
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
          <CardTitle>Major Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {majorAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-background">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{achievement.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamHistory;
