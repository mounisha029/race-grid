
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

const LiveRaceIndicator = () => {
  const [isLive, setIsLive] = useState(false);
  const [raceStatus, setRaceStatus] = useState<string>("");

  useEffect(() => {
    // Simulate checking for live race status
    // In a real app, this would connect to your live timing service
    const checkLiveStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Mock: Show as live during typical F1 race hours (14:00-16:00 UTC on Sundays)
      const isRaceDay = now.getDay() === 0; // Sunday
      const isRaceTime = hour >= 14 && hour <= 16;
      
      if (isRaceDay && isRaceTime) {
        setIsLive(true);
        setRaceStatus("Race in Progress");
      } else {
        setIsLive(false);
        setRaceStatus("");
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (!isLive) return null;

  return (
    <Badge 
      variant="destructive" 
      className="animate-pulse bg-f1-red hover:bg-f1-red/90 flex items-center space-x-1"
    >
      <Radio className="w-3 h-3" />
      <span className="text-xs font-medium">LIVE</span>
    </Badge>
  );
};

export default LiveRaceIndicator;
