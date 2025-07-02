
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock F1 API endpoints
  http.get('/api/drivers', () => {
    return HttpResponse.json([
      {
        id: '1',
        first_name: 'Max',
        last_name: 'Verstappen',
        nationality: 'Dutch',
        team_id: '1',
        driver_number: 1,
        points: 575,
        position: 1
      },
      {
        id: '2',
        first_name: 'Lewis',
        last_name: 'Hamilton',
        nationality: 'British',
        team_id: '2',
        driver_number: 44,
        points: 234,
        position: 2
      }
    ]);
  }),

  http.get('/api/teams', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Red Bull Racing',
        full_name: 'Oracle Red Bull Racing',
        points: 860,
        position: 1
      },
      {
        id: '2',
        name: 'Mercedes',
        full_name: 'Mercedes-AMG Petronas F1 Team',
        points: 409,
        position: 2
      }
    ]);
  }),

  http.get('/api/races', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Bahrain Grand Prix',
        race_date: '2025-03-02',
        round: 1,
        season: 2025,
        status: 'completed'
      }
    ]);
  }),

  // Mock Supabase auth endpoints
  http.post('/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      user: {
        id: 'mock-user-id',
        email: 'test@example.com'
      }
    });
  }),
];
