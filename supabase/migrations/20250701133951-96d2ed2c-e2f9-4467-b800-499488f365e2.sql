
-- Update teams with correct 2025 constructor standings
UPDATE public.teams SET 
  points = CASE name
    WHEN 'McLaren' THEN 658    -- McLaren dominating constructors
    WHEN 'Red Bull' THEN 589   -- Red Bull second
    WHEN 'Mercedes' THEN 468   -- Mercedes third
    WHEN 'Ferrari' THEN 345    -- Ferrari struggling, fourth
    WHEN 'Williams' THEN 142   -- Williams improved with Sainz
    WHEN 'Aston Martin' THEN 86 -- Aston Martin sixth
    WHEN 'Alpine' THEN 65      -- Alpine seventh
    WHEN 'Haas' THEN 48        -- Haas eighth
    WHEN 'RB' THEN 36          -- RB ninth
    WHEN 'Sauber' THEN 12      -- Sauber tenth
    ELSE points
  END,
  position = CASE name
    WHEN 'McLaren' THEN 1
    WHEN 'Red Bull' THEN 2
    WHEN 'Mercedes' THEN 3
    WHEN 'Ferrari' THEN 4
    WHEN 'Williams' THEN 5
    WHEN 'Aston Martin' THEN 6
    WHEN 'Alpine' THEN 7
    WHEN 'Haas' THEN 8
    WHEN 'RB' THEN 9
    WHEN 'Sauber' THEN 10
    ELSE position
  END
WHERE name IN ('McLaren', 'Red Bull', 'Mercedes', 'Ferrari', 'Williams', 'Aston Martin', 'Alpine', 'Haas', 'RB', 'Sauber');

-- Update drivers with correct 2025 season data - Oscar leading, Sainz at Williams
UPDATE public.drivers SET 
  points = CASE driver_number
    WHEN 81 THEN 347   -- Oscar Piastri (McLaren) - Championship leader
    WHEN 4 THEN 312    -- Lando Norris (McLaren) - Second
    WHEN 1 THEN 298    -- Max Verstappen (Red Bull) - Third
    WHEN 63 THEN 246   -- George Russell (Mercedes) - Fourth
    WHEN 44 THEN 198   -- Lewis Hamilton (Mercedes) - Fifth
    WHEN 11 THEN 183   -- Sergio Pérez (Red Bull) - Sixth
    WHEN 55 THEN 156   -- Carlos Sainz Jr (Williams) - moved to Williams, seventh
    WHEN 16 THEN 147   -- Charles Leclerc (Ferrari) - Ferrari struggling
    WHEN 23 THEN 89    -- Alexander Albon (Williams) - Improved with Sainz
    WHEN 14 THEN 65    -- Fernando Alonso (Aston Martin)
    WHEN 2 THEN 53     -- Logan Sargeant (Ferrari) - moved to Ferrari
    WHEN 18 THEN 32    -- Lance Stroll (Aston Martin)
    WHEN 10 THEN 28    -- Pierre Gasly (Alpine)
    WHEN 31 THEN 24    -- Esteban Ocon (Alpine)
    WHEN 27 THEN 19    -- Nico Hülkenberg (Haas)
    WHEN 20 THEN 14    -- Kevin Magnussen (Haas)
    WHEN 22 THEN 18    -- Yuki Tsunoda (RB)
    WHEN 21 THEN 9     -- Liam Lawson (RB)
    WHEN 77 THEN 8     -- Valtteri Bottas (Sauber)
    WHEN 24 THEN 4     -- Zhou Guanyu (Sauber)
    ELSE points
  END,
  position = CASE driver_number
    WHEN 81 THEN 1     -- Oscar Piastri leading
    WHEN 4 THEN 2      -- Lando Norris second
    WHEN 1 THEN 3      -- Max Verstappen third
    WHEN 63 THEN 4     -- George Russell fourth
    WHEN 44 THEN 5     -- Lewis Hamilton fifth
    WHEN 11 THEN 6     -- Sergio Pérez sixth
    WHEN 55 THEN 7     -- Carlos Sainz Jr seventh
    WHEN 16 THEN 8     -- Charles Leclerc eighth
    WHEN 23 THEN 9     -- Alexander Albon ninth
    WHEN 14 THEN 10    -- Fernando Alonso tenth
    WHEN 2 THEN 11     -- Logan Sargeant
    WHEN 18 THEN 12    -- Lance Stroll
    WHEN 10 THEN 13    -- Pierre Gasly
    WHEN 31 THEN 14    -- Esteban Ocon
    WHEN 27 THEN 15    -- Nico Hülkenberg
    WHEN 20 THEN 16    -- Kevin Magnussen
    WHEN 22 THEN 17    -- Yuki Tsunoda
    WHEN 21 THEN 18    -- Liam Lawson
    WHEN 77 THEN 19    -- Valtteri Bottas
    WHEN 24 THEN 20    -- Zhou Guanyu
    ELSE position
  END,
  wins = CASE driver_number
    WHEN 81 THEN 8     -- Oscar with 8 wins
    WHEN 4 THEN 6      -- Lando with 6 wins
    WHEN 1 THEN 5      -- Max with 5 wins
    WHEN 63 THEN 3     -- George with 3 wins
    WHEN 44 THEN 2     -- Lewis with 2 wins
    WHEN 55 THEN 1     -- Sainz with 1 win at Williams
    ELSE 0
  END,
  podiums = CASE driver_number
    WHEN 81 THEN 16    -- Oscar with most podiums
    WHEN 4 THEN 14     -- Lando consistent
    WHEN 1 THEN 12     -- Max strong but not dominant
    WHEN 63 THEN 9     -- George solid at Mercedes
    WHEN 44 THEN 7     -- Lewis decent season
    WHEN 11 THEN 6     -- Pérez decent
    WHEN 55 THEN 5     -- Sainz strong at Williams
    WHEN 16 THEN 4     -- Leclerc struggling with Ferrari
    WHEN 23 THEN 2     -- Albon improved
    WHEN 14 THEN 1     -- Alonso with 1 podium
    ELSE 0
  END,
  team_id = (
    SELECT t.id FROM teams t WHERE 
    (driver_number = 4 AND t.name = 'McLaren') OR
    (driver_number = 81 AND t.name = 'McLaren') OR
    (driver_number = 16 AND t.name = 'Ferrari') OR
    (driver_number = 2 AND t.name = 'Ferrari') OR  -- Sargeant moved to Ferrari
    (driver_number = 1 AND t.name = 'Red Bull') OR
    (driver_number = 11 AND t.name = 'Red Bull') OR
    (driver_number = 63 AND t.name = 'Mercedes') OR
    (driver_number = 44 AND t.name = 'Mercedes') OR  -- Hamilton at Mercedes
    (driver_number = 55 AND t.name = 'Williams') OR  -- Sainz at Williams
    (driver_number = 23 AND t.name = 'Williams') OR
    (driver_number = 14 AND t.name = 'Aston Martin') OR
    (driver_number = 18 AND t.name = 'Aston Martin') OR
    (driver_number = 10 AND t.name = 'Alpine') OR
    (driver_number = 31 AND t.name = 'Alpine') OR
    (driver_number = 27 AND t.name = 'Haas') OR
    (driver_number = 20 AND t.name = 'Haas') OR
    (driver_number = 22 AND t.name = 'RB') OR
    (driver_number = 21 AND t.name = 'RB') OR
    (driver_number = 77 AND t.name = 'Sauber') OR
    (driver_number = 24 AND t.name = 'Sauber')
  )
WHERE driver_number IN (1, 4, 16, 81, 55, 63, 44, 11, 14, 18, 10, 31, 27, 20, 22, 21, 23, 2, 77, 24);

-- Clear and update 2025 championship standings with correct data
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
    WHEN 'McLaren' THEN 14     -- McLaren dominant
    WHEN 'Red Bull' THEN 5     -- Red Bull fewer wins
    WHEN 'Mercedes' THEN 5     -- Mercedes competitive
    WHEN 'Williams' THEN 1     -- Williams with Sainz win
    WHEN 'Ferrari' THEN 0      -- Ferrari struggling
    WHEN 'Aston Martin' THEN 0
    WHEN 'Alpine' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Sauber' THEN 0
  END as wins,
  CASE t.name 
    WHEN 'McLaren' THEN 30     -- McLaren most podiums
    WHEN 'Red Bull' THEN 18    -- Red Bull good but not dominant
    WHEN 'Mercedes' THEN 16    -- Mercedes solid
    WHEN 'Williams' THEN 7     -- Williams improved
    WHEN 'Ferrari' THEN 4      -- Ferrari struggling
    WHEN 'Aston Martin' THEN 1
    WHEN 'Alpine' THEN 0
    WHEN 'Haas' THEN 0
    WHEN 'RB' THEN 0
    WHEN 'Sauber' THEN 0
  END as podiums,
  0 as poles,  -- We'll set these generically
  0 as fastest_laps
FROM public.teams t
WHERE t.position IS NOT NULL AND t.position <= 10
ORDER BY t.position;
