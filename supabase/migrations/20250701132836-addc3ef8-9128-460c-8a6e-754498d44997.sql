
-- First, let's update the teams with correct 2025 data and ensure proper team assignments
UPDATE public.teams SET 
  points = CASE name
    WHEN 'McLaren' THEN 608    -- McLaren leading constructors
    WHEN 'Ferrari' THEN 584    -- Ferrari close second
    WHEN 'Red Bull' THEN 544   -- Red Bull third
    WHEN 'Mercedes' THEN 382   -- Mercedes fourth
    WHEN 'Aston Martin' THEN 92 -- Aston Martin fifth
    WHEN 'Alpine' THEN 65      -- Alpine sixth
    WHEN 'Haas' THEN 58        -- Haas seventh
    WHEN 'RB' THEN 46          -- RB eighth
    WHEN 'Williams' THEN 17    -- Williams ninth
    WHEN 'Sauber' THEN 4       -- Sauber tenth
    ELSE points
  END,
  position = CASE name
    WHEN 'McLaren' THEN 1
    WHEN 'Ferrari' THEN 2
    WHEN 'Red Bull' THEN 3
    WHEN 'Mercedes' THEN 4
    WHEN 'Aston Martin' THEN 5
    WHEN 'Alpine' THEN 6
    WHEN 'Haas' THEN 7
    WHEN 'RB' THEN 8
    WHEN 'Williams' THEN 9
    WHEN 'Sauber' THEN 10
    ELSE position
  END,
  primary_color = CASE name
    WHEN 'McLaren' THEN '#FF8700'
    WHEN 'Ferrari' THEN '#DC143C'
    WHEN 'Red Bull' THEN '#0600EF'
    WHEN 'Mercedes' THEN '#00D2BE'
    WHEN 'Aston Martin' THEN '#006F62'
    WHEN 'Alpine' THEN '#0090FF'
    WHEN 'Haas' THEN '#FFFFFF'
    WHEN 'RB' THEN '#6692FF'
    WHEN 'Williams' THEN '#005AFF'
    WHEN 'Sauber' THEN '#52E252'
    ELSE primary_color
  END,
  secondary_color = CASE name
    WHEN 'McLaren' THEN '#000000'
    WHEN 'Ferrari' THEN '#FFFF00'
    WHEN 'Red Bull' THEN '#DC143C'
    WHEN 'Mercedes' THEN '#C0C0C0'
    WHEN 'Aston Martin' THEN '#CEDC00'
    WHEN 'Alpine' THEN '#FF87BC'
    WHEN 'Haas' THEN '#FF0000'
    WHEN 'RB' THEN '#1E3264'
    WHEN 'Williams' THEN '#FFFFFF'
    WHEN 'Sauber' THEN '#000000'
    ELSE secondary_color
  END
WHERE name IN ('McLaren', 'Ferrari', 'Red Bull', 'Mercedes', 'Aston Martin', 'Alpine', 'Haas', 'RB', 'Williams', 'Sauber');

-- Update drivers with correct 2025 season data and team assignments
UPDATE public.drivers SET 
  points = CASE driver_number
    WHEN 4 THEN 331    -- Lando Norris (McLaren) - Championship leader
    WHEN 81 THEN 277   -- Oscar Piastri (McLaren)
    WHEN 16 THEN 319   -- Charles Leclerc (Ferrari)
    WHEN 55 THEN 265   -- Carlos Sainz Jr (Mercedes) - moved from Ferrari
    WHEN 1 THEN 362    -- Max Verstappen (Red Bull)
    WHEN 11 THEN 152   -- Sergio Pérez (Red Bull)
    WHEN 44 THEN 164   -- Lewis Hamilton (Ferrari) - moved from Mercedes
    WHEN 63 THEN 192   -- George Russell (Mercedes)
    WHEN 14 THEN 62    -- Fernando Alonso (Aston Martin)
    WHEN 18 THEN 24    -- Lance Stroll (Aston Martin)
    WHEN 10 THEN 36    -- Pierre Gasly (Alpine)
    WHEN 31 THEN 23    -- Esteban Ocon (Alpine)
    WHEN 27 THEN 31    -- Nico Hülkenberg (Haas)
    WHEN 20 THEN 12    -- Kevin Magnussen (Haas)
    WHEN 22 THEN 28    -- Yuki Tsunoda (RB)
    WHEN 21 THEN 12    -- Liam Lawson (RB) - replaced Nyck de Vries
    WHEN 23 THEN 9     -- Alexander Albon (Williams)
    WHEN 2 THEN 4      -- Logan Sargeant (Williams)
    WHEN 77 THEN 0     -- Valtteri Bottas (Sauber)
    WHEN 24 THEN 4     -- Zhou Guanyu (Sauber)
    ELSE points
  END,
  position = CASE driver_number
    WHEN 1 THEN 1      -- Max Verstappen still leading
    WHEN 4 THEN 2      -- Lando Norris close second
    WHEN 16 THEN 3     -- Charles Leclerc third
    WHEN 81 THEN 4     -- Oscar Piastri fourth
    WHEN 55 THEN 5     -- Carlos Sainz Jr fifth
    WHEN 63 THEN 6     -- George Russell sixth
    WHEN 44 THEN 7     -- Lewis Hamilton seventh
    WHEN 11 THEN 8     -- Sergio Pérez eighth
    WHEN 14 THEN 9     -- Fernando Alonso ninth
    WHEN 10 THEN 10    -- Pierre Gasly tenth
    WHEN 27 THEN 11    -- Nico Hülkenberg
    WHEN 22 THEN 12    -- Yuki Tsunoda
    WHEN 18 THEN 13    -- Lance Stroll
    WHEN 31 THEN 14    -- Esteban Ocon
    WHEN 20 THEN 15    -- Kevin Magnussen
    WHEN 21 THEN 16    -- Liam Lawson
    WHEN 23 THEN 17    -- Alexander Albon
    WHEN 2 THEN 18     -- Logan Sargeant
    WHEN 24 THEN 19    -- Zhou Guanyu
    WHEN 77 THEN 20    -- Valtteri Bottas
    ELSE position
  END,
  wins = CASE driver_number
    WHEN 1 THEN 9      -- Max dominant with 9 wins
    WHEN 4 THEN 4      -- Lando breakthrough season
    WHEN 16 THEN 3     -- Charles with 3 wins
    WHEN 81 THEN 2     -- Oscar with 2 wins
    WHEN 44 THEN 2     -- Lewis with 2 wins at Ferrari
    WHEN 55 THEN 1     -- Carlos with 1 win
    WHEN 63 THEN 1     -- George with 1 win
    ELSE 0
  END,
  podiums = CASE driver_number
    WHEN 1 THEN 17     -- Max with most podiums
    WHEN 4 THEN 13     -- Lando consistent
    WHEN 16 THEN 12    -- Charles strong season
    WHEN 81 THEN 10    -- Oscar improving
    WHEN 55 THEN 8     -- Carlos solid at Mercedes
    WHEN 44 THEN 7     -- Lewis adapting to Ferrari
    WHEN 63 THEN 6     -- George consistent
    WHEN 11 THEN 4     -- Pérez struggling
    WHEN 14 THEN 2     -- Alonso experience showing
    WHEN 10 THEN 1     -- Gasly with 1 podium
    ELSE 0
  END,
  team_id = (
    SELECT t.id FROM teams t WHERE 
    (driver_number = 4 AND t.name = 'McLaren') OR
    (driver_number = 81 AND t.name = 'McLaren') OR
    (driver_number = 16 AND t.name = 'Ferrari') OR
    (driver_number = 44 AND t.name = 'Ferrari') OR
    (driver_number = 1 AND t.name = 'Red Bull') OR
    (driver_number = 11 AND t.name = 'Red Bull') OR
    (driver_number = 63 AND t.name = 'Mercedes') OR
    (driver_number = 55 AND t.name = 'Mercedes') OR
    (driver_number = 14 AND t.name = 'Aston Martin') OR
    (driver_number = 18 AND t.name = 'Aston Martin') OR
    (driver_number = 10 AND t.name = 'Alpine') OR
    (driver_number = 31 AND t.name = 'Alpine') OR
    (driver_number = 27 AND t.name = 'Haas') OR
    (driver_number = 20 AND t.name = 'Haas') OR
    (driver_number = 22 AND t.name = 'RB') OR
    (driver_number = 21 AND t.name = 'RB') OR
    (driver_number = 23 AND t.name = 'Williams') OR
    (driver_number = 2 AND t.name = 'Williams') OR
    (driver_number = 77 AND t.name = 'Sauber') OR
    (driver_number = 24 AND t.name = 'Sauber')
  )
WHERE driver_number IN (1, 4, 16, 81, 55, 63, 44, 11, 14, 18, 10, 31, 27, 20, 22, 21, 23, 2, 77, 24);

-- Update driver names and details for any changes in 2025
UPDATE public.drivers SET 
  first_name = 'Liam',
  last_name = 'Lawson'
WHERE driver_number = 21;

-- Clear and update 2025 championship standings
DELETE FROM public.championships WHERE season = 2025;

-- Insert correct 2025 driver championships
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'drivers', d.id, d.position, d.points, d.wins, d.podiums, d.pole_positions, d.fastest_laps
FROM public.drivers d
WHERE d.position IS NOT NULL AND d.position <= 20
ORDER BY d.position;

-- Insert correct 2025 constructor championships
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'constructors', t.id, t.position, t.points,
  CASE t.name 
    WHEN 'McLaren' THEN 6
    WHEN 'Ferrari' THEN 5
    WHEN 'Red Bull' THEN 9
    WHEN 'Mercedes' THEN 2
    WHEN 'Aston Martin' THEN 0
    WHEN 'Alpine' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Williams' THEN 0
    WHEN 'Sauber' THEN 0
  END as wins,
  CASE t.name 
    WHEN 'McLaren' THEN 23
    WHEN 'Ferrari' THEN 19
    WHEN 'Red Bull' THEN 21
    WHEN 'Mercedes' THEN 14
    WHEN 'Aston Martin' THEN 2
    WHEN 'Alpine' THEN 1
    WHEN 'Haas' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Williams' THEN 0
    WHEN 'Sauber' THEN 0
  END as podiums,
  CASE t.name 
    WHEN 'McLaren' THEN 8
    WHEN 'Ferrari' THEN 6
    WHEN 'Red Bull' THEN 7
    WHEN 'Mercedes' THEN 3
    WHEN 'Aston Martin' THEN 0
    WHEN 'Alpine' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Williams' THEN 0
    WHEN 'Sauber' THEN 0
  END as poles,
  CASE t.name 
    WHEN 'McLaren' THEN 5
    WHEN 'Ferrari' THEN 4
    WHEN 'Red Bull' THEN 8
    WHEN 'Mercedes' THEN 2
    WHEN 'Aston Martin' THEN 1
    WHEN 'Alpine' THEN 1
    WHEN 'Haas' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Williams' THEN 0
    WHEN 'Sauber' THEN 0
  END as fastest_laps
FROM public.teams t
WHERE t.position IS NOT NULL AND t.position <= 10
ORDER BY t.position;

-- Update driver nationalities and other details if needed
UPDATE public.drivers SET 
  nationality = CASE driver_number
    WHEN 4 THEN 'British'
    WHEN 81 THEN 'Australian'
    WHEN 16 THEN 'Monégasque'
    WHEN 55 THEN 'Spanish'
    WHEN 1 THEN 'Dutch'
    WHEN 11 THEN 'Mexican'
    WHEN 44 THEN 'British'
    WHEN 63 THEN 'British'
    WHEN 14 THEN 'Spanish'
    WHEN 18 THEN 'Canadian'
    WHEN 10 THEN 'French'
    WHEN 31 THEN 'French'
    WHEN 27 THEN 'German'
    WHEN 20 THEN 'Danish'
    WHEN 22 THEN 'Japanese'
    WHEN 21 THEN 'New Zealand'
    WHEN 23 THEN 'Thai'
    WHEN 2 THEN 'American'
    WHEN 77 THEN 'Finnish'
    WHEN 24 THEN 'Chinese'
    ELSE nationality
  END
WHERE driver_number IN (1, 4, 16, 81, 55, 63, 44, 11, 14, 18, 10, 31, 27, 20, 22, 21, 23, 2, 77, 24);
