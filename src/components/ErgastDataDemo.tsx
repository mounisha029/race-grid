
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Trophy, Users, Flag, Clock, MapPin } from "lucide-react";
import { useRaces } from "@/hooks/useRaces";
import { useDrivers } from "@/hooks/useDrivers";
import { useTeams } from "@/hooks/useTeams";
import { useRaceResults } from "@/hooks/useRaceResults";

const ErgastDataDemo = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>("2025");
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");

  const { data: races, isLoading: racesLoading } = useRaces(parseInt(selectedSeason));
  const { data: drivers, isLoading: driversLoading } = useDrivers();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: raceResults, isLoading: resultsLoading } = useRaceResults(selectedRaceId);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Get the selected race for results display
  const selectedRace = races?.find(race => race.id === selectedRaceId);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
          F1 2025 Data Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Live Formula 1 2025 season data from hyprace API
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedRaceId} onValueChange={setSelectedRaceId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Race" />
          </SelectTrigger>
          <SelectContent>
            {races?.map((race) => (
              <SelectItem key={race.id} value={race.id}>
                Round {race.round}: {race.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="races" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="races">Races</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="races" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {selectedSeason} Season Calendar
              </CardTitle>
              <CardDescription>
                Race schedule for the {selectedSeason} season
              </CardDescription>
            </CardHeader>
            <CardContent>
              {racesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {races?.map((race) => (
                    <Card key={race.id} className="border-l-4 border-l-f1-red">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{race.name}</CardTitle>
                          <Badge variant="outline">Round {race.round}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{race.location}, {race.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{race.date} {race.time && `at ${race.time}`}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {race.circuit}
                        </div>
                        <Badge variant={race.status === 'completed' ? 'default' : 'secondary'}>
                          {race.status}
                        </Badge>
                        {race.is_sprint_weekend && (
                          <Badge variant="outline">Sprint Weekend</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {selectedSeason} Season Drivers
              </CardTitle>
              <CardDescription>
                All drivers competing in the {selectedSeason} season
              </CardDescription>
            </CardHeader>
            <CardContent>
              {driversLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {drivers?.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-f1-red text-white flex items-center justify-center font-bold">
                          {driver.driver_number}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {driver.first_name} {driver.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {driver.nationality}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{driver.points || 0} pts</div>
                        <div className="text-sm text-muted-foreground">
                          Position: {driver.position || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedSeason} Season Teams
              </CardTitle>
              <CardDescription>
                All constructor teams competing in {selectedSeason}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {teams?.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: team.primary_color || '#ef4444' }}
                        >
                          {team.position || '?'}
                        </div>
                        <div>
                          <div className="font-semibold">{team.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {team.full_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{team.points || 0} pts</div>
                        <div className="text-sm text-muted-foreground">
                          {team.championship_titles || 0} titles
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Race Results
                {selectedRace && (
                  <span className="text-base font-normal">
                    - {selectedRace.name}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {selectedRace 
                  ? `Results for ${selectedRace.name} (Round ${selectedRace.round})`
                  : 'Select a race to view results'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedRaceId ? (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a race from the dropdown above to view results
                </div>
              ) : resultsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : raceResults && raceResults.length > 0 ? (
                <div className="space-y-2">
                  {raceResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                          result.position <= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {result.position}
                        </div>
                        <div>
                          <div className="font-medium">
                            {result.drivers.first_name} {result.drivers.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.teams.name} • #{result.drivers.driver_number}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{result.points_awarded} pts</div>
                        <div className="text-sm text-muted-foreground">
                          {result.final_time || result.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No race results found for the selected race
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErgastDataDemo;
