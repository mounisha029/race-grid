
import Header from "@/components/Header";
import RaceCard from "@/components/RaceCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Calendar } from "lucide-react";

const Races = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("round");

  const races = [
    {
      id: "1",
      name: "Bahrain Grand Prix",
      location: "Sakhir, Bahrain",
      date: "March 2, 2024",
      time: "15:00 UTC",
      round: 1,
      status: "completed" as const,
      circuit: "Bahrain International Circuit"
    },
    {
      id: "2",
      name: "Saudi Arabian Grand Prix",
      location: "Jeddah, Saudi Arabia",
      date: "March 9, 2024",
      time: "15:00 UTC",
      round: 2,
      status: "live" as const,
      circuit: "Jeddah Corniche Circuit"
    },
    {
      id: "3",
      name: "Australian Grand Prix",
      location: "Melbourne, Australia",
      date: "March 24, 2024",
      time: "05:00 UTC",
      round: 3,
      status: "upcoming" as const,
      circuit: "Albert Park Circuit"
    },
    {
      id: "4",
      name: "Japanese Grand Prix",
      location: "Suzuka, Japan",
      date: "April 7, 2024",
      time: "05:00 UTC",
      round: 4,
      status: "upcoming" as const,
      circuit: "Suzuka International Racing Course"
    },
    {
      id: "5",
      name: "Chinese Grand Prix",
      location: "Shanghai, China",
      date: "April 21, 2024",
      time: "07:00 UTC",
      round: 5,
      status: "upcoming" as const,
      circuit: "Shanghai International Circuit"
    },
    {
      id: "6",
      name: "Miami Grand Prix",
      location: "Miami, USA",
      date: "May 5, 2024",
      time: "19:30 UTC",
      round: 6,
      status: "upcoming" as const,
      circuit: "Miami International Autodrome"
    }
  ];

  const filterRacesByStatus = (status: string) => {
    if (status === "all") return races;
    return races.filter(race => race.status === status);
  };

  const filteredRaces = (races: typeof races) => 
    races
      .filter(race => 
        race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.circuit.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case "name":
            return a.name.localeCompare(b.name);
          case "location":
            return a.location.localeCompare(b.location);
          default:
            return a.round - b.round;
        }
      });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-f1-black via-slate-900 to-f1-black py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-f1-red/10 via-transparent to-f1-orange/10" />
        <div className="racing-track absolute top-1/2 left-0 w-full h-px" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <Calendar className="w-16 h-16 text-f1-yellow" />
            </div>
            <h1 className="racing-text text-4xl md:text-6xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              Race Calendar
            </h1>
            <p className="text-xl text-muted-foreground">
              2024 Formula 1 Season Schedule
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <Input
              placeholder="Search races, locations, or circuits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round">Round Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Race Name</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Race Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-8">
              <TabsTrigger value="all">All Races</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRaces(races).map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRaces(filterRacesByStatus("completed")).map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="live">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRaces(filterRacesByStatus("live")).map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRaces(filterRacesByStatus("upcoming")).map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Races;
