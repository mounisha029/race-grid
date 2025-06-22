
-- Create enum types for better data integrity
CREATE TYPE driver_status AS ENUM ('active', 'retired', 'reserve');
CREATE TYPE race_status AS ENUM ('scheduled', 'practice', 'qualifying', 'race', 'completed', 'cancelled');
CREATE TYPE session_type AS ENUM ('practice1', 'practice2', 'practice3', 'sprint_qualifying', 'qualifying', 'sprint', 'race');
CREATE TYPE weather_condition AS ENUM ('dry', 'wet', 'intermediate', 'mixed');
CREATE TYPE result_status AS ENUM ('finished', 'dnf', 'dns', 'dsq');

-- Teams/Constructors table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(200),
    primary_color VARCHAR(7), -- hex color code
    secondary_color VARCHAR(7), -- hex color code
    logo_url TEXT,
    base_location VARCHAR(100),
    team_principal VARCHAR(100),
    chassis VARCHAR(50),
    power_unit VARCHAR(50),
    founded_year INTEGER,
    championship_titles INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    position INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_number INTEGER UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(3), -- ISO country code
    date_of_birth DATE,
    place_of_birth VARCHAR(100),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    profile_image_url TEXT,
    helmet_image_url TEXT,
    biography TEXT,
    height_cm INTEGER,
    weight_kg INTEGER,
    status driver_status DEFAULT 'active',
    points INTEGER DEFAULT 0,
    position INTEGER,
    wins INTEGER DEFAULT 0,
    podiums INTEGER DEFAULT 0,
    pole_positions INTEGER DEFAULT 0,
    fastest_laps INTEGER DEFAULT 0,
    dnfs INTEGER DEFAULT 0,
    championships INTEGER DEFAULT 0,
    debut_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circuits table
CREATE TABLE circuits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    country VARCHAR(3) NOT NULL, -- ISO country code
    track_length_km DECIMAL(5,3),
    number_of_turns INTEGER,
    lap_record_time VARCHAR(10), -- format: MM:SS.sss
    lap_record_holder_id UUID REFERENCES drivers(id),
    lap_record_year INTEGER,
    drs_zones INTEGER DEFAULT 0,
    track_layout_url TEXT,
    timezone VARCHAR(50),
    elevation_m INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Races table
CREATE TABLE races (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season INTEGER NOT NULL,
    round INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    circuit_id UUID REFERENCES circuits(id) NOT NULL,
    race_date DATE NOT NULL,
    race_time TIME,
    qualifying_date DATE,
    qualifying_time TIME,
    sprint_date DATE,
    sprint_time TIME,
    status race_status DEFAULT 'scheduled',
    weather_condition weather_condition,
    air_temperature_c INTEGER,
    track_temperature_c INTEGER,
    humidity_percent INTEGER,
    wind_speed_kmh INTEGER,
    wind_direction VARCHAR(3),
    is_sprint_weekend BOOLEAN DEFAULT false,
    total_laps INTEGER,
    race_distance_km DECIMAL(6,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season, round)
);

-- Session results table (qualifying, sprint, race results)
CREATE TABLE session_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES drivers(id) NOT NULL,
    team_id UUID REFERENCES teams(id) NOT NULL,
    session_type session_type NOT NULL,
    position INTEGER,
    grid_position INTEGER, -- for race sessions
    final_time VARCHAR(15), -- format: H:MM:SS.sss or +SS.sss
    gap_to_leader VARCHAR(15),
    gap_to_ahead VARCHAR(15),
    best_lap_time VARCHAR(10), -- format: MM:SS.sss
    best_lap_number INTEGER,
    laps_completed INTEGER,
    points_awarded INTEGER DEFAULT 0,
    status result_status DEFAULT 'finished',
    dnf_reason VARCHAR(200),
    fastest_lap BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(race_id, driver_id, session_type)
);

-- Lap times table for detailed timing data
CREATE TABLE lap_times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES drivers(id) NOT NULL,
    session_type session_type NOT NULL,
    lap_number INTEGER NOT NULL,
    lap_time VARCHAR(10), -- format: MM:SS.sss
    sector_1_time VARCHAR(8), -- format: SS.sss
    sector_2_time VARCHAR(8),
    sector_3_time VARCHAR(8),
    pit_stop BOOLEAN DEFAULT false,
    tyre_compound VARCHAR(20),
    tyre_age INTEGER,
    position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(race_id, driver_id, session_type, lap_number)
);

-- Pit stops table
CREATE TABLE pit_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES drivers(id) NOT NULL,
    stop_number INTEGER NOT NULL,
    lap_number INTEGER NOT NULL,
    pit_time VARCHAR(8), -- format: SS.sss
    tyre_compound_old VARCHAR(20),
    tyre_compound_new VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(race_id, driver_id, stop_number)
);

-- Championships/Standings table
CREATE TABLE championships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'drivers' or 'constructors'
    entity_id UUID NOT NULL, -- references either drivers.id or teams.id
    position INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    podiums INTEGER DEFAULT 0,
    poles INTEGER DEFAULT 0,
    fastest_laps INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season, type, entity_id)
);

-- User preferences table (for authenticated users)
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    favorite_driver_id UUID REFERENCES drivers(id),
    favorite_team_id UUID REFERENCES teams(id),
    timezone VARCHAR(50) DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT true,
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Real-time session data table
CREATE TABLE live_session_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES drivers(id) NOT NULL,
    session_type session_type NOT NULL,
    current_lap INTEGER,
    current_position INTEGER,
    last_lap_time VARCHAR(10),
    sector_1_time VARCHAR(8),
    sector_2_time VARCHAR(8),
    sector_3_time VARCHAR(8),
    speed_trap_kmh INTEGER,
    tyre_compound VARCHAR(20),
    tyre_age INTEGER,
    gap_to_leader VARCHAR(15),
    gap_to_ahead VARCHAR(15),
    drs_enabled BOOLEAN DEFAULT false,
    in_pit BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(race_id, driver_id, session_type)
);

-- Create indexes for better query performance
CREATE INDEX idx_drivers_team ON drivers(team_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_nationality ON drivers(nationality);
CREATE INDEX idx_races_season ON races(season);
CREATE INDEX idx_races_date ON races(race_date);
CREATE INDEX idx_races_circuit ON races(circuit_id);
CREATE INDEX idx_session_results_race ON session_results(race_id);
CREATE INDEX idx_session_results_driver ON session_results(driver_id);
CREATE INDEX idx_session_results_session ON session_results(session_type);
CREATE INDEX idx_lap_times_race_driver ON lap_times(race_id, driver_id);
CREATE INDEX idx_lap_times_session ON lap_times(session_type);
CREATE INDEX idx_championships_season ON championships(season, type);
CREATE INDEX idx_live_data_race_session ON live_session_data(race_id, session_type);
CREATE INDEX idx_live_data_timestamp ON live_session_data(timestamp);

-- Enable Row Level Security on user-specific tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for user preferences
CREATE POLICY "Users can manage their own preferences" 
ON user_preferences 
FOR ALL 
USING (auth.uid() = user_id);
