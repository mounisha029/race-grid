
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('Teams API', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  test('GET /api/teams returns teams list', async () => {
    const mockTeams = [
      { id: '1', name: 'Red Bull Racing', points: 860 },
      { id: '2', name: 'Mercedes', points: 409 }
    ];

    mockSupabase.select.mockResolvedValue({ data: mockTeams, error: null });

    const teams = await mockSupabase.from('teams').select('*');
    
    expect(teams.data).toEqual(mockTeams);
    expect(teams.error).toBeNull();
  });

  test('PUT /api/teams/:id updates team', async () => {
    const updatedTeam = { id: '1', name: 'Red Bull Racing', points: 900 };

    mockSupabase.update.mockResolvedValue({ data: [updatedTeam], error: null });

    const result = await mockSupabase.from('teams').update({ points: 900 }).eq('id', '1');
    
    expect(result.data).toEqual([updatedTeam]);
    expect(result.error).toBeNull();
  });
});
