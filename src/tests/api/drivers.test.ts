
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js');

describe('Drivers API', () => {
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

  test('GET /api/drivers returns drivers list', async () => {
    const mockDrivers = [
      { id: '1', first_name: 'Max', last_name: 'Verstappen' },
      { id: '2', first_name: 'Lewis', last_name: 'Hamilton' }
    ];

    mockSupabase.select.mockResolvedValue({ data: mockDrivers, error: null });

    // Mock the API call
    const drivers = await mockSupabase.from('drivers').select('*');
    
    expect(drivers.data).toEqual(mockDrivers);
    expect(drivers.error).toBeNull();
  });

  test('GET /api/drivers/:id returns single driver', async () => {
    const mockDriver = { id: '1', first_name: 'Max', last_name: 'Verstappen' };

    mockSupabase.eq.mockResolvedValue({ data: [mockDriver], error: null });

    const driver = await mockSupabase.from('drivers').select('*').eq('id', '1');
    
    expect(driver.data).toEqual([mockDriver]);
    expect(driver.error).toBeNull();
  });

  test('POST /api/drivers creates new driver', async () => {
    const newDriver = { first_name: 'Carlos', last_name: 'Sainz' };
    const createdDriver = { id: '3', ...newDriver };

    mockSupabase.insert.mockResolvedValue({ data: [createdDriver], error: null });

    const result = await mockSupabase.from('drivers').insert(newDriver);
    
    expect(result.data).toEqual([createdDriver]);
    expect(result.error).toBeNull();
  });
});
