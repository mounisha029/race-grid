
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Trophy, Users, Flag, Clock, MapPin } from "lucide-react";
import {
  useCurrentSeasonRaces,
  useSeasonRaces,
  useCurrentDriverStandings,
  useCurrentConstructorStandings,
  useRaceResults,
  useQualifyingResults
} from "@/hooks/useErgastData";

const ErgastDataDemo = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>("2024");
  const [selectedRound, setSelectedRound] = useState<string>("1");

  const { data: currentRaces, isLoading: racesLoading } = useCurrentSeasonRaces();
  const { data: seasonRaces, isLoading: seasonLoading } = useSeasonRaces(parseInt(selectedSeason));
  const { data: driverStandings, isLoading: driversLoading } = useCurrentDriverStandings();
  const { data: constructorStandings, isLoading: constructorsLoading } = useCurrentConstructorStandings();
  const { data: raceResults, isLoading: resultsLoading } = useRaceResults(parseInt(selectedSeason), parseInt(selectedRound));
  const { data: qualifyingResults, isLoading: qualifyingLoading } = useQualifyingResults(parseInt(selectedSeason), parseInt(selectedRound));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
          Ergast API Data Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Live Formula 1 data from the official Ergast Motor Racing API
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
        
        <Input
          type="number"
          placeholder="Round"
          value={selectedRound}
          onChange={(e) => setSelectedRound(e.target.value)}
          className="w-24"
          min="1"
          max="24"
        />
      </div>

      <Tabs defaultValue="races" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="races">Races</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="constructors">Teams</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="qualifying">Qualifying</TabsTrigger>
        </TabsList>

        <TabsContent value="races" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {selectedSeason} Season Calendar
              </CardTitle>
              <CardDescription>
                Race schedule for the selected season
              </CardDescription>
            </CardHeader>
            <CardContent>
              {seasonLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seasonRaces?.map((race, index) => (
                    <Card key={`${race.season}-${race.round}`} className="border-l-4 border-l-f1-red">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{race.raceName}</CardTitle>
                          <Badge variant="outline">Round {race.round}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{race.date} {race.time && `at ${race.time}`}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {race.Circuit.circuitName}
                        </div>
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
                Current Driver Standings
              </CardTitle>
              <CardDescription>
                Live championship standings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {driversLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {driverStandings?.[0]?.DriverStandings?.map((standing, index) => (
                    <div key={standing.Driver.driverId} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-f1-red text-white flex items-center justify-center font-bold">
                          {standing.position}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {standing.Driver.givenName} {standing.Driver.familyName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {standing.Driver.nationality} • #{standing.Driver.permanentNumber}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{standing.points} pts</div>
                        <div className="text-sm text-muted-foreground">{standing.wins} wins</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constructors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Constructor Standings
              </CardTitle>
              <CardDescription>
                Team championship standings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {constructorsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {constructorStandings?.[0]?.ConstructorStandings?.map((standing, index) => (
                    <div key={standing.Constructor.constructorId} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-f1-orange text-white flex items-center justify-center font-bold">
                          {standing.position}
                        </div>
                        <div>
                          <div className="font-semibold">{standing.Constructor.name}</div>
                          <div className="text-sm text-muted-foreground">{standing.Constructor.nationality}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{standing.points} pts</div>
                        <div className="text-sm text-muted-foreground">{standing.wins} wins</div>
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
                Race Results - Season {selectedSeason}, Round {selectedRound}
              </CardTitle>
              <CardDescription>
                Final race results and classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : raceResults && raceResults.length > 0 ? (
                <div className="space-y-2">
                  {raceResults.map((result, index) => (
                    <div key={result.Driver.driverId} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                          parseInt(result.position) <= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {result.position}
                        </div>
                        <div>
                          <div className="font-medium">
                            {result.Driver.givenName} {result.Driver.familyName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.Constructor.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{result.points} pts</div>
                        <div className="text-sm text-muted-foreground">
                          {result.Time?.time || result.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No race results found for Season {selectedSeason}, Round {selectedRound}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualifying" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Qualifying Results - Season {selectedSeason}, Round {selectedRound}
              </CardTitle>
              <CardDescription>
                Grid positions and qualifying times
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qualifyingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : qualifyingResults && qualifyingResults.length > 0 ? (
                <div className="space-y-2">
                  {qualifyingResults.map((result, index) => (
                    <div key={result.Driver.driverId} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                          parseInt(result.position) === 1 ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {result.position}
                        </div>
                        <div>
                          <div className="font-medium">
                            {result.Driver.givenName} {result.Driver.familyName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.Constructor.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">
                          {result.Time?.time || 'No time'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No qualifying results found for Season {selectedSeason}, Round {selectedRound}
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
