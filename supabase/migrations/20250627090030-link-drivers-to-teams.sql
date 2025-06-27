
-- Link drivers to their correct teams for 2025 season
-- McLaren drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'McLaren') 
WHERE driver_number IN (81, 4); -- Oscar Piastri, Lando Norris

-- Red Bull drivers  
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Red Bull') 
WHERE driver_number IN (1, 11); -- Max Verstappen, Sergio Pérez

-- Ferrari drivers (Lewis moved to Ferrari)
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Ferrari') 
WHERE driver_number IN (44, 16); -- Lewis Hamilton, Charles Leclerc

-- Mercedes drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Mercedes') 
WHERE driver_number IN (63, 55); -- George Russell, Carlos Sainz

-- Aston Martin drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Aston Martin') 
WHERE driver_number IN (14, 18); -- Fernando Alonso, Lance Stroll

-- Alpine drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Alpine') 
WHERE driver_number IN (10, 31); -- Pierre Gasly, Esteban Ocon

-- Williams drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Williams') 
WHERE driver_number IN (23, 2); -- Alexander Albon, Logan Sargeant

-- RB drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'RB') 
WHERE driver_number IN (22, 21); -- Yuki Tsunoda, Nyck de Vries

-- Haas drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Haas') 
WHERE driver_number IN (27, 20); -- Nico Hülkenberg, Kevin Magnussen

-- Sauber drivers
UPDATE public.drivers SET team_id = (SELECT id FROM public.teams WHERE name = 'Sauber') 
WHERE driver_number IN (77, 24); -- Valtteri Bottas, Zhou Guanyu
