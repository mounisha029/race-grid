
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Filter, X, CalendarIcon, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface FilterOptions {
  drivers: string[];
  teams: string[];
  seasons: number[];
  circuits: string[];
  weatherConditions: string[];
}

interface ActiveFilters {
  driver?: string;
  team?: string;
  season?: number;
  circuit?: string;
  weather?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

interface AnalyticsFiltersProps {
  options: FilterOptions;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onReset: () => void;
}

const AnalyticsFilters = ({ options, activeFilters, onFiltersChange, onReset }: AnalyticsFiltersProps) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(activeFilters.dateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(activeFilters.dateTo);

  const updateFilter = (key: keyof ActiveFilters, value: any) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value
    });
  };

  const removeFilter = (key: keyof ActiveFilters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key as keyof ActiveFilters] !== undefined && 
      activeFilters[key as keyof ActiveFilters] !== ""
    ).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Data Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">{getActiveFilterCount()} active</Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Driver Filter */}
          <div className="space-y-2">
            <Label>Driver</Label>
            <Select 
              value={activeFilters.driver || ""} 
              onValueChange={(value) => updateFilter('driver', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Drivers</SelectItem>
                {options.drivers.map(driver => (
                  <SelectItem key={driver} value={driver}>{driver}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Filter */}
          <div className="space-y-2">
            <Label>Team</Label>
            <Select 
              value={activeFilters.team || ""} 
              onValueChange={(value) => updateFilter('team', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Teams</SelectItem>
                {options.teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Season Filter */}
          <div className="space-y-2">
            <Label>Season</Label>
            <Select 
              value={activeFilters.season?.toString() || ""} 
              onValueChange={(value) => updateFilter('season', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Seasons</SelectItem>
                {options.seasons.map(season => (
                  <SelectItem key={season} value={season.toString()}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Circuit Filter */}
          <div className="space-y-2">
            <Label>Circuit</Label>
            <Select 
              value={activeFilters.circuit || ""} 
              onValueChange={(value) => updateFilter('circuit', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select circuit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Circuits</SelectItem>
                {options.circuits.map(circuit => (
                  <SelectItem key={circuit} value={circuit}>{circuit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weather Filter */}
          <div className="space-y-2">
            <Label>Weather</Label>
            <Select 
              value={activeFilters.weather || ""} 
              onValueChange={(value) => updateFilter('weather', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Conditions</SelectItem>
                {options.weatherConditions.map(weather => (
                  <SelectItem key={weather} value={weather} className="capitalize">
                    {weather}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label>Date From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    setDateFrom(date);
                    updateFilter('dateFrom', date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label>Date To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    setDateTo(date);
                    updateFilter('dateTo', date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers, teams, circuits..."
              value={activeFilters.searchTerm || ""}
              onChange={(e) => updateFilter('searchTerm', e.target.value || undefined)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {value instanceof Date ? format(value, "MMM dd, yyyy") : value.toString()}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeFilter(key as keyof ActiveFilters)}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilters;
