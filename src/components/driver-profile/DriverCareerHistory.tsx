
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin } from "lucide-react";

interface DriverCareerHistoryProps {
  driver: any;
}

const DriverCareerHistory = ({ driver }: DriverCareerHistoryProps) => {
  // Mock career data
  const careerSeasons = [
    {
      year: 2024,
      team: "Red Bull Racing",
      position: 3,
      points: 151,
      wins: 2,
      podiums: 5,
      highlights: ["First win at Australian GP", "Pole position in Miami"]
    },
    {
      year: 2023,
      team: "Red Bull Racing", 
      position: 6,
      points: 234,
      wins: 1,
      podiums: 3,
      highlights: ["Breakthrough win at Hungary", "Rookie of the Year nominee"]
    },
    {
      year: 2022,
      team: "AlphaTauri",
      position: 12,
      points: 45,
      wins: 0,
      podiums: 1,
      highlights: ["First podium at Monza", "F1 debut at Bahrain GP"]
    }
  ];

  const achievements = [
    {
      title: "Formula 1 Debut",
      date: "March 2022",
      description: "Made F1 debut with AlphaTauri at Bahrain Grand Prix"
    },
    {
      title: "First Points",
      date: "April 2022", 
      description: "Scored first championship points with 6th place in Imola"
    },
    {
      title: "First Podium",
      date: "September 2022",
      description: "Achieved first podium finish with 3rd place at Monza"
    },
    {
      title: "First Win",
      date: "July 2023",
      description: "Won first Grand Prix at Hungarian Grand Prix"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Career Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Career Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {careerSeasons.map((season) => (
              <div key={season.year} className="border-l-2 border-f1-red pl-6 relative">
                <div className="absolute w-3 h-3 bg-f1-red rounded-full -left-2 top-2"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{season.year} Season</h3>
                    <p className="text-muted-foreground">{season.team}</p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Badge variant="outline">P{season.position}</Badge>
                    <Badge variant="outline">{season.points} pts</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-f1-yellow">{season.wins}</div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{season.podiums}</div>
                    <div className="text-xs text-muted-foreground">Podiums</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-f1-orange">{season.points}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Season Highlights:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {season.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-f1-red">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Career Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Career Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <Badge variant="outline">{achievement.date}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pre-F1 Career */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Formula 1 Career</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">Formula 2</h4>
                <p className="text-2xl font-bold text-f1-orange">2021</p>
                <p className="text-sm text-muted-foreground">Champion</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">Formula 3</h4>
                <p className="text-2xl font-bold text-f1-red">2020</p>
                <p className="text-sm text-muted-foreground">2nd Place</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold">Karting</h4>
                <p className="text-2xl font-bold text-f1-yellow">2015-2019</p>
                <p className="text-sm text-muted-foreground">Multiple wins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverCareerHistory;
