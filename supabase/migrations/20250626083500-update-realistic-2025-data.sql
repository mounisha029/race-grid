
-- Update championship data with more realistic 2025 F1 standings
-- Delete existing 2025 championship data first
DELETE FROM public.championships WHERE season = 2025;

-- Update drivers with more realistic 2025 season data (mid-season standings)
UPDATE public.drivers SET 
  points = CASE driver_number
    WHEN 1 THEN 393    -- Max Verstappen (dominant leader)
    WHEN 4 THEN 295    -- Lando Norris (strong season)
    WHEN 16 THEN 251   -- Charles Leclerc (Ferrari resurgence)
    WHEN 81 THEN 197   -- Oscar Piastri (McLaren's 2nd driver)
    WHEN 44 THEN 164   -- Lewis Hamilton (Mercedes struggles)
    ELSE points
  END,
  position = CASE driver_number
    WHEN 1 THEN 1
    WHEN 4 THEN 2
    WHEN 16 THEN 3
    WHEN 81 THEN 4
    WHEN 44 THEN 5
    ELSE position
  END,
  wins = CASE driver_number
    WHEN 1 THEN 9      -- Max with dominant wins
    WHEN 4 THEN 3      -- Lando breakthrough season
    WHEN 16 THEN 2     -- Charles with Ferrari improvements
    WHEN 81 THEN 1     -- Oscar first win
    WHEN 44 THEN 0     -- Lewis winless season
    ELSE wins
  END,
  podiums = CASE driver_number
    WHEN 1 THEN 15
    WHEN 4 THEN 12
    WHEN 16 THEN 10
    WHEN 81 THEN 7
    WHEN 44 THEN 3
    ELSE podiums
  END
WHERE driver_number IN (1, 4, 16, 81, 44);

-- Update teams with realistic 2025 constructor standings
UPDATE public.teams SET 
  points = CASE name
    WHEN 'Red Bull' THEN 589     -- Red Bull dominance continues
    WHEN 'McLaren' THEN 492      -- McLaren resurgence
    WHEN 'Ferrari' THEN 441      -- Ferrari improvements
    WHEN 'Mercedes' THEN 292     -- Mercedes struggles
    WHEN 'Alpine' THEN 127       -- Alpine midfield
    ELSE points
  END,
  position = CASE name
    WHEN 'Red Bull' THEN 1
    WHEN 'McLaren' THEN 2
    WHEN 'Ferrari' THEN 3
    WHEN 'Mercedes' THEN 4
    WHEN 'Alpine' THEN 5
    ELSE position
  END
WHERE name IN ('Red Bull', 'McLaren', 'Ferrari', 'Mercedes', 'Alpine');

-- Insert realistic 2025 driver championships
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'drivers', d.id, 
  CASE d.driver_number
    WHEN 1 THEN 1
    WHEN 4 THEN 2  
    WHEN 16 THEN 3
    WHEN 81 THEN 4
    WHEN 44 THEN 5
  END as position,
  d.points, d.wins, d.podiums, d.pole_positions, d.fastest_laps
FROM public.drivers d
WHERE d.driver_number IN (1, 4, 16, 81, 44);

-- Insert realistic 2025 constructor championships  
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'constructors', t.id,
  CASE t.name
    WHEN 'Red Bull' THEN 1
    WHEN 'McLaren' THEN 2
    WHEN 'Ferrari' THEN 3
    WHEN 'Mercedes' THEN 4
    WHEN 'Alpine' THEN 5
  END as position,
  t.points,
  CASE t.name 
    WHEN 'Red Bull' THEN 9
    WHEN 'McLaren' THEN 4
    WHEN 'Ferrari' THEN 2
    WHEN 'Mercedes' THEN 0
    WHEN 'Alpine' THEN 0
  END as wins,
  CASE t.name 
    WHEN 'Red Bull' THEN 22
    WHEN 'McLaren' THEN 19
    WHEN 'Ferrari' THEN 17
    WHEN 'Mercedes' THEN 8
    WHEN 'Alpine' THEN 4
  END as podiums,
  CASE t.name 
    WHEN 'Red Bull' THEN 8
    WHEN 'McLaren' THEN 5
    WHEN 'Ferrari' THEN 4
    WHEN 'Mercedes' THEN 1
    WHEN 'Alpine' THEN 0
  END as poles,
  CASE t.name 
    WHEN 'Red Bull' THEN 7
    WHEN 'McLaren' THEN 4
    WHEN 'Ferrari' THEN 3
    WHEN 'Mercedes' THEN 2  
    WHEN 'Alpine' THEN 1
  END as fastest_laps
FROM public.teams t
WHERE t.name IN ('Red Bull', 'McLaren', 'Ferrari', 'Mercedes', 'Alpine');

-- Add Oscar Piastri if he doesn't exist (McLaren's second driver)
INSERT INTO public.drivers (first_name, last_name, driver_number, nationality, points, position, wins, podiums, pole_positions, fastest_laps) VALUES
('Oscar', 'Piastri', 81, 'Australian', 197, 4, 1, 7, 0, 1)
ON CONFLICT (driver_number) DO UPDATE SET
  points = EXCLUDED.points,
  position = EXCLUDED.position,
  wins = EXCLUDED.wins,
  podiums = EXCLUDED.podiums;
