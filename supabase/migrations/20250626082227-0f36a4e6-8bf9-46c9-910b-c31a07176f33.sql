
-- Let's first add some sample drivers and teams, then link them in championships
-- First, ensure we have some drivers
INSERT INTO public.drivers (id, first_name, last_name, driver_number, nationality, points, position, wins, podiums, pole_positions, fastest_laps) VALUES
(gen_random_uuid(), 'Lewis', 'Hamilton', 44, 'GBR', 150, 1, 3, 8, 2, 1),
(gen_random_uuid(), 'Max', 'Verstappen', 1, 'NLD', 120, 2, 2, 6, 1, 2),
(gen_random_uuid(), 'Charles', 'Leclerc', 16, 'MCO', 95, 3, 1, 4, 0, 1),
(gen_random_uuid(), 'Lando', 'Norris', 4, 'GBR', 80, 4, 0, 3, 1, 0),
(gen_random_uuid(), 'George', 'Russell', 63, 'GBR', 65, 5, 0, 2, 0, 1)
ON CONFLICT (driver_number) DO NOTHING;

-- Add some sample teams
INSERT INTO public.teams (id, name, full_name, primary_color, points, position, championship_titles, founded_year) VALUES
(gen_random_uuid(), 'Mercedes', 'Mercedes-AMG Petronas F1 Team', '#00D2BE', 270, 1, 8, 1970),
(gen_random_uuid(), 'Red Bull', 'Oracle Red Bull Racing', '#0600EF', 220, 2, 6, 2005),
(gen_random_uuid(), 'Ferrari', 'Scuderia Ferrari', '#DC143C', 180, 3, 16, 1950),
(gen_random_uuid(), 'McLaren', 'McLaren F1 Team', '#FF8700', 140, 4, 8, 1966),
(gen_random_uuid(), 'Alpine', 'BWT Alpine F1 Team', '#0090FF', 100, 5, 2, 1981)
ON CONFLICT (name) DO NOTHING;

-- Now insert championship data using the actual IDs from the tables
-- Driver championships for 2025
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'drivers', d.id, ROW_NUMBER() OVER (ORDER BY d.points DESC), d.points, d.wins, d.podiums, d.pole_positions, d.fastest_laps
FROM public.drivers d
WHERE d.driver_number IN (44, 1, 16, 4, 63)
ORDER BY d.points DESC;

-- Constructor championships for 2025  
INSERT INTO public.championships (season, type, entity_id, position, points, wins, podiums, poles, fastest_laps)
SELECT 2025, 'constructors', t.id, ROW_NUMBER() OVER (ORDER BY t.points DESC), t.points, 
       CASE t.name 
         WHEN 'Mercedes' THEN 5
         WHEN 'Red Bull' THEN 3
         WHEN 'Ferrari' THEN 1
         WHEN 'McLaren' THEN 0
         WHEN 'Alpine' THEN 0
       END as wins,
       CASE t.name 
         WHEN 'Mercedes' THEN 14
         WHEN 'Red Bull' THEN 10
         WHEN 'Ferrari' THEN 7
         WHEN 'McLaren' THEN 5
         WHEN 'Alpine' THEN 3
       END as podiums,
       CASE t.name 
         WHEN 'Mercedes' THEN 3
         WHEN 'Red Bull' THEN 2
         WHEN 'Ferrari' THEN 1
         WHEN 'McLaren' THEN 1
         WHEN 'Alpine' THEN 0
       END as poles,
       CASE t.name 
         WHEN 'Mercedes' THEN 3
         WHEN 'Red Bull' THEN 4
         WHEN 'Ferrari' THEN 2
         WHEN 'McLaren' THEN 1
         WHEN 'Alpine' THEN 2
       END as fastest_laps
FROM public.teams t
WHERE t.name IN ('Mercedes', 'Red Bull', 'Ferrari', 'McLaren', 'Alpine')
ORDER BY t.points DESC;
