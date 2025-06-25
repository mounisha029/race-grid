
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Race {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  time: string;
  round: number;
  status: "scheduled" | "practice" | "qualifying" | "race" | "completed" | "cancelled";
  circuit: string;
  season: number;
  weather_condition?: string;
  is_sprint_weekend: boolean;
}

// 2025 F1 Race Calendar Data
const races2025: Omit<Race, 'id'>[] = [
  {
    name: "Bahrain Grand Prix",
    location: "Sakhir",
    country: "Bahrain",
    date: "2025-03-02",
    time: "15:00:00",
    round: 1,
    status: "scheduled",
    circuit: "Bahrain International Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Saudi Arabian Grand Prix",
    location: "Jeddah",
    country: "Saudi Arabia",
    date: "2025-03-09",
    time: "20:00:00",
    round: 2,
    status: "scheduled",
    circuit: "Jeddah Corniche Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Australian Grand Prix",
    location: "Melbourne",
    country: "Australia",
    date: "2025-03-16",
    time: "05:00:00",
    round: 3,
    status: "scheduled",
    circuit: "Albert Park Grand Prix Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Chinese Grand Prix",
    location: "Shanghai",
    country: "China",
    date: "2025-03-23",
    time: "07:00:00",
    round: 4,
    status: "scheduled",
    circuit: "Shanghai International Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: true
  },
  {
    name: "Japanese Grand Prix",
    location: "Suzuka",
    country: "Japan",
    date: "2025-04-13",
    time: "05:00:00",
    round: 5,
    status: "scheduled",
    circuit: "Suzuka Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Miami Grand Prix",
    location: "Miami",
    country: "United States",
    date: "2025-05-04",
    time: "20:00:00",
    round: 6,
    status: "scheduled",
    circuit: "Miami International Autodrome",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: true
  },
  {
    name: "Emilia Romagna Grand Prix",
    location: "Imola",
    country: "Italy",
    date: "2025-05-18",
    time: "13:00:00",
    round: 7,
    status: "scheduled",
    circuit: "Autodromo Enzo e Dino Ferrari",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Monaco Grand Prix",
    location: "Monte Carlo",
    country: "Monaco",
    date: "2025-05-25",
    time: "13:00:00",
    round: 8,
    status: "scheduled",
    circuit: "Circuit de Monaco",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Spanish Grand Prix",
    location: "Madrid",
    country: "Spain",
    date: "2025-06-01",
    time: "13:00:00",
    round: 9,
    status: "scheduled",
    circuit: "Madrid Street Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Canadian Grand Prix",
    location: "Montreal",
    country: "Canada",
    date: "2025-06-15",
    time: "18:00:00",
    round: 10,
    status: "scheduled",
    circuit: "Circuit Gilles Villeneuve",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Austrian Grand Prix",
    location: "Spielberg",
    country: "Austria",
    date: "2025-06-29",
    time: "13:00:00",
    round: 11,
    status: "scheduled",
    circuit: "Red Bull Ring",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: true
  },
  {
    name: "British Grand Prix",
    location: "Silverstone",
    country: "United Kingdom",
    date: "2025-07-06",
    time: "14:00:00",
    round: 12,
    status: "scheduled",
    circuit: "Silverstone Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Hungarian Grand Prix",
    location: "Budapest",
    country: "Hungary",
    date: "2025-07-20",
    time: "13:00:00",
    round: 13,
    status: "scheduled",
    circuit: "Hungaroring",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Belgian Grand Prix",
    location: "Spa-Francorchamps",
    country: "Belgium",
    date: "2025-07-27",
    time: "13:00:00",
    round: 14,
    status: "scheduled",
    circuit: "Circuit de Spa-Francorchamps",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Dutch Grand Prix",
    location: "Zandvoort",
    country: "Netherlands",
    date: "2025-08-31",
    time: "13:00:00",
    round: 15,
    status: "scheduled",
    circuit: "Circuit Zandvoort",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Italian Grand Prix",
    location: "Monza",
    country: "Italy",
    date: "2025-09-07",
    time: "13:00:00",
    round: 16,
    status: "scheduled",
    circuit: "Autodromo Nazionale di Monza",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Azerbaijan Grand Prix",
    location: "Baku",
    country: "Azerbaijan",
    date: "2025-09-21",
    time: "11:00:00",
    round: 17,
    status: "scheduled",
    circuit: "Baku City Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Singapore Grand Prix",
    location: "Singapore",
    country: "Singapore",
    date: "2025-10-05",
    time: "12:00:00",
    round: 18,
    status: "scheduled",
    circuit: "Marina Bay Street Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "United States Grand Prix",
    location: "Austin",
    country: "United States",
    date: "2025-10-19",
    time: "19:00:00",
    round: 19,
    status: "scheduled",
    circuit: "Circuit of the Americas",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: true
  },
  {
    name: "Mexican Grand Prix",
    location: "Mexico City",
    country: "Mexico",
    date: "2025-10-26",
    time: "20:00:00",
    round: 20,
    status: "scheduled",
    circuit: "Autódromo Hermanos Rodríguez",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "São Paulo Grand Prix",
    location: "São Paulo",
    country: "Brazil",
    date: "2025-11-02",
    time: "17:00:00",
    round: 21,
    status: "scheduled",
    circuit: "Interlagos",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: true
  },
  {
    name: "Las Vegas Grand Prix",
    location: "Las Vegas",
    country: "United States",
    date: "2025-11-22",
    time: "06:00:00",
    round: 22,
    status: "scheduled",
    circuit: "Las Vegas Street Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  },
  {
    name: "Qatar Grand Prix",
    location: "Lusail",
    country: "Qatar",
    date: "2025-11-30",
    time: "16:00:00",
    round: 23,
    status: "scheduled",
    circuit: "Lusail International Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: true
  },
  {
    name: "Abu Dhabi Grand Prix",
    location: "Abu Dhabi",
    country: "United Arab Emirates",
    date: "2025-12-07",
    time: "13:00:00",
    round: 24,
    status: "scheduled",
    circuit: "Yas Marina Circuit",
    season: 2025,
    weather_condition: "dry",
    is_sprint_weekend: false
  }
];

export const useRaces = (season?: number) => {
  const currentYear = new Date().getFullYear();
  const targetSeason = season || currentYear;

  return useQuery({
    queryKey: ['races', targetSeason],
    queryFn: async () => {
      console.log(`Fetching races for season: ${targetSeason}`);
      
      // For 2025, return our predefined race calendar
      if (targetSeason === 2025) {
        console.log('Returning 2025 race calendar data');
        return races2025.map((race, index) => ({
          ...race,
          id: `2025-race-${index + 1}`
        }));
      }
      
      // For other years, fetch from database
      const { data, error } = await supabase
        .from('races')
        .select(`
          id,
          season,
          round,
          name,
          race_date,
          race_time,
          status,
          weather_condition,
          is_sprint_weekend,
          circuits (
            name,
            location,
            country
          )
        `)
        .eq('season', targetSeason)
        .order('round');

      if (error) throw error;

      return data?.map(race => ({
        id: race.id,
        name: race.name,
        location: race.circuits?.location || '',
        country: race.circuits?.country || '',
        date: race.race_date,
        time: race.race_time || '',
        round: race.round,
        status: race.status as Race['status'],
        circuit: race.circuits?.name || '',
        season: race.season,
        weather_condition: race.weather_condition,
        is_sprint_weekend: race.is_sprint_weekend
      })) || [];
    }
  });
};
