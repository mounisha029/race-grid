
import RaceCard from "@/components/RaceCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { useRaces, Race } from "@/hooks/useRaces";

const Races = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("round");
  const [selectedSeason, setSelectedSeason] = useState("2024");
  
  const { data: races = [], isLoading, error } = useRaces(parseInt(selectedSeason));

  const filterRacesByStatus = (status: string): Race[] => {
    if (status === "all") return races;
    return races.filter(race => race.status === status);
  };

  const filteredRaces = (raceList: Race[]): Race[] => 
    raceList
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Races</h2>
          <p className="text-muted-foreground">
            Unable to load race data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
              {selectedSeason} Formula 1 Season Schedule
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Loading State */}
      {isLoading && (
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading race calendar...</p>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && races.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Races Found</h3>
            <p className="text-muted-foreground">
              No races are scheduled for the {selectedSeason} season yet.
            </p>
          </div>
        </section>
      )}

      {/* Race Tabs */}
      {!isLoading && races.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-6 max-w-2xl mx-auto mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="race">Live</TabsTrigger>
                <TabsTrigger value="qualifying">Qualifying</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
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
              
              <TabsContent value="race">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRaces(filterRacesByStatus("race")).map((race) => (
                    <RaceCard key={race.id} race={race} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="qualifying">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRaces(filterRacesByStatus("qualifying")).map((race) => (
                    <RaceCard key={race.id} race={race} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="practice">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRaces(filterRacesByStatus("practice")).map((race) => (
                    <RaceCard key={race.id} race={race} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="scheduled">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRaces(filterRacesByStatus("scheduled")).map((race) => (
                    <RaceCard key={race.id} race={race} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}
    </div>
  );
};

export default Races;
