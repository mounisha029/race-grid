
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Flag, 
  Clock, 
  Thermometer, 
  Wind, 
  Activity, 
  Timer,
  Play,
  Pause,
  CircleStop
} from "lucide-react";
import { useLiveTiming } from "@/hooks/useLiveTiming";
import { useF1LiveUpdates } from "@/hooks/useWebSocket";
import LiveLeaderboard from "./race-tracking/LiveLeaderboard";
import LiveTimingPanel from "./race-tracking/LiveTimingPanel";
import PitStopTracker from "./race-tracking/PitStopTracker";
import WeatherPanel from "./race-tracking/WeatherPanel";
import TrackMap from "./race-tracking/TrackMap";
import GapAnalysis from "./race-tracking/GapAnalysis";

interface LiveRaceTrackerProps {
  raceId: string;
  raceName?: string;
}

const LiveRaceTracker = ({ raceId, raceName = "Current Race" }: LiveRaceTrackerProps) => {
  const [selectedTab, setSelectedTab] = useState("leaderboard");
  const [isLive, setIsLive] = useState(false);
  const [currentLap, setCurrentLap] = useState(1);
  const [totalLaps, setTotalLaps] = useState(70);
  const [raceStatus, setRaceStatus] = useState<'scheduled' | 'formation' | 'race' | 'safety_car' | 'virtual_safety_car' | 'red_flag' | 'finished'>('race');
  
  const { liveData, isLoading, error, isConnected } = useLiveTiming(raceId, 'race');
  const { 
    connect: connectWebSocket, 
    disconnect: disconnectWebSocket, 
    subscribeToRace, 
    lastMessage, 
    isConnected: wsConnected 
  } = useF1LiveUpdates();

  useEffect(() => {
    if (isLive && raceId) {
      connectWebSocket();
      subscribeToRace(raceId);
    } else {
      disconnectWebSocket();
    }

    return () => disconnectWebSocket();
  }, [isLive, raceId]);

  useEffect(() => {
    if (lastMessage?.type === 'live_update') {
      console.log('Received live timing update:', lastMessage);
      // Update local state based on WebSocket data
    }
  }, [lastMessage]);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  const getRaceStatusColor = (status: string) => {
    switch (status) {
      case 'race': return 'bg-f1-green text-white';
      case 'safety_car': return 'bg-f1-yellow text-black';
      case 'virtual_safety_car': return 'bg-f1-orange text-white';
      case 'red_flag': return 'bg-f1-red text-white';
      case 'formation': return 'bg-blue-500 text-white';
      case 'finished': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getRaceStatusText = (status: string) => {
    switch (status) {
      case 'race': return 'GREEN FLAG';
      case 'safety_car': return 'SAFETY CAR';
      case 'virtual_safety_car': return 'VIRTUAL SAFETY CAR';
      case 'red_flag': return 'RED FLAG';
      case 'formation': return 'FORMATION LAP';
      case 'finished': return 'RACE FINISHED';
      default: return 'STANDBY';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-f1-red border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading live race data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          <p>Error loading race data: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Race Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Flag className="w-6 h-6 text-f1-red" />
                {raceName}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Lap {currentLap} of {totalLaps}</span>
                </div>
                <Progress value={(currentLap / totalLaps) * 100} className="w-32" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className={`${getRaceStatusColor(raceStatus)} animate-pulse`}>
                {getRaceStatusText(raceStatus)}
              </Badge>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-f1-green' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <Button
                onClick={toggleLiveMode}
                variant={isLive ? "destructive" : "default"}
                size="sm"
                className="flex items-center gap-2"
              >
                {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isLive ? 'Pause Live' : 'Go Live'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Dashboard */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
          <TabsTrigger value="pitstops">Pit Stops</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="track">Track Map</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6">
          <LiveLeaderboard 
            liveData={liveData} 
            raceStatus={raceStatus}
            currentLap={currentLap}
          />
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <LiveTimingPanel 
            liveData={liveData}
            raceId={raceId}
          />
        </TabsContent>

        <TabsContent value="pitstops" className="space-y-6">
          <PitStopTracker 
            liveData={liveData}
            raceId={raceId}
          />
        </TabsContent>

        <TabsContent value="weather" className="space-y-6">
          <WeatherPanel raceId={raceId} />
        </TabsContent>

        <TabsContent value="track" className="space-y-6">
          <TrackMap 
            liveData={liveData}
            raceId={raceId}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <GapAnalysis 
            liveData={liveData}
            currentLap={currentLap}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveRaceTracker;
