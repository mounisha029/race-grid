
import { useState, useEffect } from "react";
import RaceCard from "@/components/RaceCard";
import DriverCard from "@/components/DriverCard";
import TeamCard from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Trophy, Clock, TrendingUp } from "lucide-react";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - updated to match Race interface
  const nextRace = {
    id: "1",
    name: "Saudi Arabian Grand Prix",
    location: "Jeddah",
    country: "Saudi Arabia",
    date: "2024-03-09",
    time: "15:00:00",
    round: 2,
    status: "scheduled" as const,
    circuit: "Jeddah Corniche Circuit",
    season: 2024,
    weather_condition: "dry" as const,
    is_sprint_weekend: false
  };

  const topDrivers = [
    {
      id: "1",
      name: "Max Verstappen",
      team: "Red Bull Racing",
      position: 1,
      points: 575,
      nationality: "Netherlands",
      number: 1,
      teamColor: "#001F5B",
      lastRacePosition: 1,
      trend: "stable" as const
    },
    {
      id: "2", 
      name: "Lewis Hamilton",
      team: "Mercedes",
      position: 2,
      points: 234,
      nationality: "United Kingdom",
      number: 44,
      teamColor: "#C0C0C0",
      lastRacePosition: 3,
      trend: "up" as const
    },
    {
      id: "3",
      name: "Charles Leclerc", 
      team: "Ferrari",
      position: 3,
      points: 206,
      nationality: "Monaco",
      number: 16,
      teamColor: "#DC143C",
      lastRacePosition: 2,
      trend: "down" as const
    }
  ];

  const topTeams = [
    {
      id: "1",
      name: "Red Bull Racing",
      position: 1,
      points: 860,
      color: "#001F5B",
      drivers: ["Max Verstappen", "Sergio Pérez"],
      wins: 21,
      podiums: 35
    },
    {
      id: "2",
      name: "Mercedes",
      position: 2,
      points: 409,
      color: "#C0C0C0", 
      drivers: ["Lewis Hamilton", "George Russell"],
      wins: 1,
      podiums: 8
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-f1-black via-slate-900 to-f1-black">
        <div className="absolute inset-0 bg-gradient-to-r from-f1-red/10 via-transparent to-f1-orange/10" />
        <div className="racing-track absolute top-1/2 left-0 w-full h-px" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-racing-gradient rounded-full flex items-center justify-center shadow-2xl animate-pulse-fast">
                <Flag className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="racing-text text-5xl md:text-7xl bg-gradient-to-r from-f1-red via-f1-orange to-f1-yellow bg-clip-text text-transparent">
              F1 Box Box
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your ultimate Formula 1 race tracking experience. Live timing, driver standings, and race analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="speed-button text-lg px-8 py-4">
                🏁 Watch Live Race
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Time</p>
                <p className="racing-text text-lg text-f1-yellow">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center border-l-4 border-l-f1-red">
              <CardContent className="pt-6">
                <Flag className="w-8 h-8 mx-auto mb-2 text-f1-red" />
                <p className="text-2xl font-bold">22</p>
                <p className="text-sm text-muted-foreground">Races This Season</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-l-f1-orange">
              <CardContent className="pt-6">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-f1-orange" />
                <p className="text-2xl font-bold">10</p>
                <p className="text-sm text-muted-foreground">Teams</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-l-f1-yellow">
              <CardContent className="pt-6">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-f1-yellow" />
                <p className="text-2xl font-bold">20</p>
                <p className="text-sm text-muted-foreground">Drivers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-l-f1-green">
              <CardContent className="pt-6">
                <Clock className="w-8 h-8 mx-auto mb-2 text-f1-green" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Days to Next Race</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Next Race */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="racing-text text-4xl mb-4 bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              Next Race 🏁
            </h2>
            <p className="text-muted-foreground">Don't miss the action</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <RaceCard race={nextRace} />
          </div>
        </div>
      </section>

      {/* Championship Leaders */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Driver Championship */}
            <div>
              <h2 className="racing-text text-3xl mb-8 text-center">
                🏆 Driver Championship
              </h2>
              <div className="space-y-6">
                {topDrivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            </div>

            {/* Constructor Championship */}
            <div>
              <h2 className="racing-text text-3xl mb-8 text-center">
                🏗️ Constructor Championship
              </h2>
              <div className="space-y-6">
                {topTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-f1-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-racing-gradient rounded-full flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="racing-text text-2xl mb-2 bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
            F1 Box Box
          </h3>
          <p className="text-gray-400 mb-4">
            Formula 1 race tracking and analytics platform
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 F1 Box Box. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
