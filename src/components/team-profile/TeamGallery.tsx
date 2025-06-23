
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Calendar, Trophy } from "lucide-react";

interface TeamGalleryProps {
  team: any;
}

const TeamGallery = ({ team }: TeamGalleryProps) => {
  // Mock gallery data
  const photos = [
    {
      id: 1,
      url: "/placeholder.svg",
      title: "Constructor Championship Celebration",
      date: "2023-12-03",
      category: "Championship"
    },
    {
      id: 2,
      url: "/placeholder.svg",
      title: "2024 Car Launch",
      date: "2024-02-15",
      category: "Car Launch"
    },
    {
      id: 3,
      url: "/placeholder.svg",
      title: "Factory & Facilities",
      date: "2024-01-10",
      category: "Behind the Scenes"
    },
    {
      id: 4,
      url: "/placeholder.svg",
      title: "Team Strategy Meeting",
      date: "2024-03-20",
      category: "Team Life"
    }
  ];

  const videos = [
    {
      id: 1,
      thumbnail: "/placeholder.svg",
      title: "2024 Car Development Story",
      duration: "5:23",
      date: "2024-02-20"
    },
    {
      id: 2,
      thumbnail: "/placeholder.svg",
      title: "Inside the Factory Tour",
      duration: "8:15",
      date: "2024-01-25"
    },
    {
      id: 3,
      thumbnail: "/placeholder.svg",
      title: "Season Highlights Reel",
      duration: "3:47",
      date: "2024-06-01"
    }
  ];

  const achievements = [
    {
      title: "Constructor Championship 2023",
      description: "Secured the Constructor's title with dominant performance throughout the season",
      date: "December 3, 2023",
      type: "Championship"
    },
    {
      title: "Most Wins in a Season",
      description: "Record-breaking 21 wins in 22 races during the 2023 season",
      date: "November 26, 2023",
      type: "Record"
    },
    {
      title: "Fastest Pit Stop Record",
      description: "Set new world record with 1.82s pit stop at Brazilian Grand Prix",
      date: "November 5, 2023",
      type: "Record"
    }
  ];

  const teamHistory = [
    { year: "2023", achievement: "Constructor & Driver Championships", wins: 21 },
    { year: "2022", achievement: "Constructor & Driver Championships", wins: 17 },
    { year: "2021", achievement: "Constructor & Driver Championships", wins: 10 },
    { year: "2020", achievement: "2nd in Constructor Championship", wins: 2 },
    { year: "2019", achievement: "3rd in Constructor Championship", wins: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Photo Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Team Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs mb-1">
                    {photo.category}
                  </Badge>
                  <h4 className="font-medium text-sm">{photo.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {photo.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Team Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="group">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary">
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="font-medium">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">{video.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-f1-red mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <Badge variant="outline">{achievement.type}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{achievement.description}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {achievement.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Performance */}
      <Card>
        <CardHeader>
          <CardTitle>5-Year Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamHistory.map((year) => (
              <div key={year.year} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">{year.year} Season</div>
                  <div className="text-sm text-muted-foreground">{year.achievement}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-f1-orange">{year.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media & External Links */}
      <Card>
        <CardHeader>
          <CardTitle>Connect with the Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Official Website
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              YouTube Channel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamGallery;
