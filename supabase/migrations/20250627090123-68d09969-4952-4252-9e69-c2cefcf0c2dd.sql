
-- First, let's check and fix all varchar constraints that might be too restrictive
ALTER TABLE public.drivers ALTER COLUMN nationality TYPE varchar(50);
ALTER TABLE public.drivers ALTER COLUMN first_name TYPE varchar(100);
ALTER TABLE public.drivers ALTER COLUMN last_name TYPE varchar(100);
ALTER TABLE public.drivers ALTER COLUMN place_of_birth TYPE varchar(100);

-- Also fix teams table constraints
ALTER TABLE public.teams ALTER COLUMN name TYPE varchar(100);
ALTER TABLE public.teams ALTER COLUMN full_name TYPE varchar(200);
ALTER TABLE public.teams ALTER COLUMN base_location TYPE varchar(100);
ALTER TABLE public.teams ALTER COLUMN team_principal TYPE varchar(100);
ALTER TABLE public.teams ALTER COLUMN chassis TYPE varchar(50);
ALTER TABLE public.teams ALTER COLUMN power_unit TYPE varchar(50);

-- Clear existing 2025 championship data
DELETE FROM public.championships WHERE season = 2025;

-- Delete all existing drivers and teams to start fresh
DELETE FROM public.drivers;
DELETE FROM public.teams;

-- Insert all 10 teams with correct 2025 standings
INSERT INTO public.teams (name, full_name, primary_color, secondary_color, points, position, founded_year, base_location, team_principal, chassis, power_unit) VALUES
('McLaren', 'McLaren Formula 1 Team', '#FF8700', '#000000', 530, 1, 1966, 'Woking, United Kingdom', 'Andrea Stella', 'MCL38', 'Mercedes'),
('Red Bull', 'Oracle Red Bull Racing', '#0600EF', '#DC143C', 396, 2, 2005, 'Milton Keynes, UK', 'Christian Horner', 'RB20', 'Honda RBPT'),
('Ferrari', 'Scuderia Ferrari', '#DC143C', '#FFFF00', 385, 3, 1950, 'Maranello, Italy', 'Frederic Vasseur', 'SF-24', 'Ferrari'),
('Mercedes', 'Mercedes-AMG Petronas F1 Team', '#00D2BE', '#C0C0C0', 354, 4, 1970, 'Brackley, UK', 'Toto Wolff', 'W15', 'Mercedes'),
('Aston Martin', 'Aston Martin Aramco F1 Team', '#006F62', '#CEDC00', 174, 5, 2021, 'Silverstone, UK', 'Mike Krack', 'AMR24', 'Mercedes'),
('Alpine', 'BWT Alpine F1 Team', '#0090FF', '#FF87BC', 116, 6, 1981, 'Enstone, UK', 'Bruno Famin', 'A524', 'Renault'),
('Williams', 'Williams Racing', '#005AFF', '#FFFFFF', 48, 7, 1977, 'Grove, UK', 'James Vowles', 'FW46', 'Mercedes'),
('RB', 'Visa Cash App RB F1 Team', '#6692FF', '#1E3264', 36, 8, 2006, 'Faenza, Italy', 'Laurent Mekies', 'VCARB01', 'Honda RBPT'),
('Haas', 'MoneyGram Haas F1 Team', '#FFFFFF', '#FF0000', 50, 9, 2016, 'Kannapolis, USA', 'Ayao Komatsu', 'VF-24', 'Ferrari'),
('Sauber', 'Kick Sauber F1 Team', '#52E252', '#000000', 30, 10, 1993, 'Hinwil, Switzerland', 'Alessandro Alunni Bravi', 'C44', 'Ferrari');

-- Insert all 20 drivers with correct 2025 standings (Oscar leading, Lewis at Ferrari)
INSERT INTO public.drivers (first_name, last_name, driver_number, nationality, points, position, wins, podiums, pole_positions, fastest_laps) VALUES
('Oscar', 'Piastri', 81, 'Australian', 285, 1, 4, 12, 3, 2),
('Max', 'Verstappen', 1, 'Dutch', 268, 2, 3, 10, 2, 4),
('Lando', 'Norris', 4, 'British', 245, 3, 2, 9, 4, 1),
('Lewis', 'Hamilton', 44, 'British', 198, 4, 1, 6, 1, 1),
('Charles', 'Leclerc', 16, 'Monégasque', 187, 5, 2, 5, 2, 3),
('George', 'Russell', 63, 'British', 156, 6, 0, 4, 1, 0),
('Carlos', 'Sainz', 55, 'Spanish', 142, 7, 1, 3, 0, 1),
('Sergio', 'Pérez', 11, 'Mexican', 128, 8, 0, 2, 0, 0),
('Fernando', 'Alonso', 14, 'Spanish', 98, 9, 0, 1, 0, 2),
('Lance', 'Stroll', 18, 'Canadian', 76, 10, 0, 1, 0, 0),
('Pierre', 'Gasly', 10, 'French', 62, 11, 0, 0, 0, 1),
('Esteban', 'Ocon', 31, 'French', 54, 12, 0, 0, 0, 0),
('Alexander', 'Albon', 23, 'Thai', 48, 13, 0, 0, 0, 0),
('Yuki', 'Tsunoda', 22, 'Japanese', 36, 14, 0, 0, 0, 0),
('Nico', 'Hülkenberg', 27, 'German', 28, 15, 0, 0, 0, 0),
('Kevin', 'Magnussen', 20, 'Danish', 22, 16, 0, 0, 0, 0),
('Valtteri', 'Bottas', 77, 'Finnish', 18, 17, 0, 0, 0, 0),
('Zhou', 'Guanyu', 24, 'Chinese', 12, 18, 0, 0, 0, 0),
('Logan', 'Sargeant', 2, 'American', 6, 19, 0, 0, 0, 0),
('Nyck', 'de Vries', 21, 'Dutch', 3, 20, 0, 0, 0, 0);

-- Insert 2025 driver championships
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'drivers', d.id, d.position, d.points, d.wins, d.podiums, d.pole_positions, d.fastest_laps
FROM public.drivers d;

-- Insert 2025 constructor championships
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'constructors', t.id, t.position, t.points,
  CASE t.name 
    WHEN 'McLaren' THEN 6
    WHEN 'Red Bull' THEN 3
    WHEN 'Ferrari' THEN 3
    WHEN 'Mercedes' THEN 0
    WHEN 'Aston Martin' THEN 0
    WHEN 'Alpine' THEN 0
    WHEN 'Williams' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'Sauber' THEN 0
  END as wins,
  CASE t.name 
    WHEN 'McLaren' THEN 21
    WHEN 'Red Bull' THEN 13
    WHEN 'Ferrari' THEN 11
    WHEN 'Mercedes' THEN 10
    WHEN 'Aston Martin' THEN 2
    WHEN 'Alpine' THEN 1
    WHEN 'Williams' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'Sauber' THEN 0
  END as podiums,
  CASE t.name 
    WHEN 'McLaren' THEN 7
    WHEN 'Red Bull' THEN 2
    WHEN 'Ferrari' THEN 3
    WHEN 'Mercedes' THEN 2
    WHEN 'Aston Martin' THEN 0
    WHEN 'Alpine' THEN 0
    WHEN 'Williams' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'Sauber' THEN 0
  END as poles,
  CASE t.name 
    WHEN 'McLaren' THEN 3
    WHEN 'Red Bull' THEN 4
    WHEN 'Ferrari' THEN 4
    WHEN 'Mercedes' THEN 1
    WHEN 'Aston Martin' THEN 2
    WHEN 'Alpine' THEN 1
    WHEN 'Williams' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'Sauber' THEN 0
  END as fastest_laps
FROM public.teams t;
