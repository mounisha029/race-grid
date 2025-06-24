
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, ExternalLink } from "lucide-react";

interface DriverGalleryProps {
  driver: any;
}

const DriverGallery = ({ driver }: DriverGalleryProps) => {
  // Mock gallery data
  const galleryImages = [
    {
      url: "/placeholder.svg",
      title: "Victory Celebration",
      description: "Celebrating victory at Monaco GP",
      category: "Race"
    },
    {
      url: "/placeholder.svg",
      title: "Helmet Design",
      description: "Special helmet for home race",
      category: "Equipment"
    },
    {
      url: "/placeholder.svg",
      title: "Podium Moment",
      description: "First career podium finish",
      category: "Achievement"
    },
  ];

  const socialLinks = [
    { platform: "Instagram", handle: "@driver_official", followers: "2.5M" },
    { platform: "Twitter", handle: "@driver", followers: "1.8M" },
    { platform: "Official Website", handle: "driver-official.com", followers: "" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge variant="secondary" className="mb-1 text-xs">
                      {image.category}
                    </Badge>
                    <div className="text-white text-sm font-medium">{image.title}</div>
                    <div className="text-gray-300 text-xs">{image.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-medium">{link.platform}</div>
                  <div className="text-sm text-muted-foreground">{link.handle}</div>
                </div>
                <div className="flex items-center gap-2">
                  {link.followers && (
                    <span className="text-sm text-muted-foreground">{link.followers}</span>
                  )}
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverGallery;
