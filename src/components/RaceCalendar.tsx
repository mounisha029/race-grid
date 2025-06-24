import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Thermometer, 
  Wind, 
  Timer,
  Trophy,
  Flag,
  Zap
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { useRaces, Race } from "@/hooks/useRaces";

interface RaceSession {
  type: 'practice1' | 'practice2' | 'practice3' | 'qualifying' | 'sprint' | 'race';
  date: string;
  time: string;
  name: string;
}

const RaceCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [userTimezone, setUserTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [selectedSeason, setSelectedSeason] = useState(() => new Date().getFullYear().toString());
  
  const { data: races = [], isLoading } = useRaces(parseInt(selectedSeason));

  // Get race sessions for a specific race
  const getRaceSessions = (race: Race): RaceSession[] => {
    const sessions: RaceSession[] = [];
    const raceDate = race.date;
    
    // Add practice sessions (Friday/Saturday)
    if (!race.is_sprint_weekend) {
      sessions.push(
        {
          type: 'practice1',
          date: format(addDays(parseISO(raceDate), -2), 'yyyy-MM-dd'),
          time: '13:30:00',
          name: 'Practice 1'
        },
        {
          type: 'practice2',
          date: format(addDays(parseISO(raceDate), -2), 'yyyy-MM-dd'),
          time: '17:00:00',
          name: 'Practice 2'
        },
        {
          type: 'practice3',
          date: format(addDays(parseISO(raceDate), -1), 'yyyy-MM-dd'),
          time: '12:30:00',
          name: 'Practice 3'
        },
        {
          type: 'qualifying',
          date: format(addDays(parseISO(raceDate), -1), 'yyyy-MM-dd'),
          time: '16:00:00',
          name: 'Qualifying'
        }
      );
    } else {
      // Sprint weekend format
      sessions.push(
        {
          type: 'practice1',
          date: format(addDays(parseISO(raceDate), -2), 'yyyy-MM-dd'),
          time: '13:30:00',
          name: 'Practice 1'
        },
        {
          type: 'qualifying',
          date: format(addDays(parseISO(raceDate), -2), 'yyyy-MM-dd'),
          time: '17:00:00',
          name: 'Qualifying'
        },
        {
          type: 'sprint',
          date: format(addDays(parseISO(raceDate), -1), 'yyyy-MM-dd'),
          time: '16:30:00',
          name: 'Sprint'
        }
      );
    }
    
    // Add main race
    sessions.push({
      type: 'race',
      date: raceDate,
      time: race.time || '15:00:00',
      name: 'Race'
    });
    
    return sessions;
  };

  // Get races for selected date
  const racesForDate = useMemo(() => {
    return races.filter(race => {
      const sessions = getRaceSessions(race);
      return sessions.some(session => isSameDay(parseISO(session.date), selectedDate));
    });
  }, [races, selectedDate]);

  // Get all race dates for calendar highlighting
  const raceDates = useMemo(() => {
    const dates: Date[] = [];
    races.forEach(race => {
      const sessions = getRaceSessions(race);
      sessions.forEach(session => {
        dates.push(parseISO(session.date));
      });
    });
    return dates;
  }, [races]);

  // Format time in user's timezone
  const formatTimeInTimezone = (date: string, time: string, timezone: string) => {
    try {
      const dateTime = `${date}T${time}`;
      return formatInTimeZone(parseISO(dateTime), timezone, 'HH:mm');
    } catch {
      return time.slice(0, 5);
    }
  };

  // Get countdown for upcoming session
  const getCountdown = (date: string, time: string) => {
    const sessionDateTime = parseISO(`${date}T${time}`);
    const now = new Date();
    const diff = sessionDateTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Get session status
  const getSessionStatus = (date: string, time: string, raceStatus: Race['status']) => {
    const sessionDateTime = parseISO(`${date}T${time}`);
    const now = new Date();
    
    if (raceStatus === 'completed') return 'completed';
    if (raceStatus === 'race' && sessionDateTime <= now) return 'live';
    if (sessionDateTime < now) return 'completed';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-f1-red text-white animate-pulse';
      case 'completed': return 'bg-f1-green text-white';
      default: return 'bg-f1-orange text-white';
    }
  };

  const getSessionIcon = (type: RaceSession['type']) => {
    switch (type) {
      case 'race': return <Flag className="w-4 h-4" />;
      case 'qualifying': return <Trophy className="w-4 h-4" />;
      case 'sprint': return <Zap className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-f1-red border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading race calendar...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={userTimezone} onValueChange={setUserTimezone}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="Europe/London">London</SelectItem>
              <SelectItem value="Europe/Paris">Paris</SelectItem>
              <SelectItem value="America/New_York">New York</SelectItem>
              <SelectItem value="America/Los_Angeles">Los Angeles</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              <SelectItem value="Australia/Sydney">Sydney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={calendarView === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarView('month')}
          >
            Month
          </Button>
          <Button
            variant={calendarView === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarView('week')}
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5" />
              <span>Race Calendar {selectedSeason}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                raceDay: raceDates
              }}
              modifiersStyles={{
                raceDay: { 
                  backgroundColor: 'hsl(var(--f1-red))', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Race Details for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </span>
              <Badge variant="outline">
                {formatInTimeZone(selectedDate, userTimezone, 'zzz')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {racesForDate.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No race events on this date
              </p>
            ) : (
              racesForDate.map(race => {
                const sessions = getRaceSessions(race);
                const sessionsForDate = sessions.filter(session => 
                  isSameDay(parseISO(session.date), selectedDate)
                );

                return (
                  <div key={race.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{race.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{race.location}, {race.country}</span>
                        </div>
                      </div>
                      {race.is_sprint_weekend && (
                        <Badge variant="outline" className="text-f1-yellow border-f1-yellow">
                          <Zap className="w-3 h-3 mr-1" />
                          SPRINT
                        </Badge>
                      )}
                    </div>

                    {/* Sessions for this date */}
                    <div className="space-y-2">
                      {sessionsForDate.map((session, idx) => {
                        const status = getSessionStatus(session.date, session.time, race.status);
                        const countdown = getCountdown(session.date, session.time);
                        
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              {getSessionIcon(session.type)}
                              <div>
                                <p className="font-medium">{session.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatTimeInTimezone(session.date, session.time, userTimezone)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {countdown && (
                                <div className="flex items-center space-x-1 text-sm">
                                  <Timer className="w-3 h-3" />
                                  <span>{countdown}</span>
                                </div>
                              )}
                              <Badge className={getStatusColor(status)}>
                                {status === 'live' && '🔴'} {status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Circuit Information */}
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Circuit Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{race.circuit}</span>
                        </div>
                        {race.weather_condition && (
                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-4 h-4 text-muted-foreground" />
                            <span className="capitalize">{race.weather_condition}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Race Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Race Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {races
              .slice(0, 6)
              .map(race => {
                const sessions = getRaceSessions(race);
                const nextSession = sessions.find(session => {
                  const sessionDateTime = parseISO(`${session.date}T${session.time}`);
                  return sessionDateTime > new Date();
                });

                if (!nextSession) return null;

                const countdown = getCountdown(nextSession.date, nextSession.time);
                const status = getSessionStatus(nextSession.date, nextSession.time, race.status);

                return (
                  <div key={race.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{race.name}</h3>
                        <p className="text-xs text-muted-foreground">{nextSession.name}</p>
                      </div>
                      <Badge className={`${getStatusColor(status)} text-xs`}>
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTimeInTimezone(nextSession.date, nextSession.time, userTimezone)}
                        </span>
                      </div>
                      {countdown && (
                        <div className="flex items-center space-x-1 text-f1-orange">
                          <Timer className="w-3 h-3" />
                          <span>{countdown}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
              .filter(Boolean)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaceCalendar;
