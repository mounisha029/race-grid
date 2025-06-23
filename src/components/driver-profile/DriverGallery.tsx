
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Calendar } from "lucide-react";

interface DriverGalleryProps {
  driver: any;
}

const DriverGallery = ({ driver }: DriverGalleryProps) => {
  // Mock gallery data
  const photos = [
    {
      id: 1,
      url: "/placeholder.svg",
      title: "Victory Celebration - Australian GP",
      date: "2024-03-24",
      category: "Race Win"
    },
    {
      id: 2,
      url: "/placeholder.svg", 
      title: "Pole Position - Miami GP",
      date: "2024-05-05",
      category: "Qualifying"
    },
    {
      id: 3,
      url: "/placeholder.svg",
      title: "Podium Celebration",
      date: "2024-04-21",
      category: "Podium"
    },
    {
      id: 4,
      url: "/placeholder.svg",
      title: "Driver Portrait",
      date: "2024-01-15",
      category: "Portrait"
    }
  ];

  const videos = [
    {
      id: 1,
      thumbnail: "/placeholder.svg",
      title: "Onboard: Pole Lap in Miami",
      duration: "1:23",
      date: "2024-05-05"
    },
    {
      id: 2,
      thumbnail: "/placeholder.svg",
      title: "Interview: After First Win",
      duration: "3:45",
      date: "2024-03-24"
    },
    {
      id: 3,
      thumbnail: "/placeholder.svg",
      title: "Best Overtakes Compilation",
      duration: "2:17",
      date: "2024-06-01"
    }
  ];

  const highlights = [
    {
      title: "First Formula 1 Victory",
      description: "Emotional win at the Australian Grand Prix after starting from 3rd position",
      date: "March 24, 2024",
      type: "Race Win"
    },
    {
      title: "Maiden Pole Position",
      description: "Secured first career pole at Miami with a stunning qualifying lap",
      date: "May 5, 2024", 
      type: "Qualifying"
    },
    {
      title: "Rookie Season Debut",
      description: "Made F1 debut with impressive points finish in first race",
      date: "March 20, 2022",
      type: "Milestone"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Photo Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
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
          <CardTitle>Video Highlights</CardTitle>
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

      {/* Career Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Career Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-f1-red mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{highlight.title}</h4>
                    <Badge variant="outline">{highlight.type}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{highlight.description}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {highlight.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Follow on Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Official Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverGallery;
