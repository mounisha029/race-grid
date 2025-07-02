
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

describe('Database Integration Tests', () => {
  let supabase: ReturnType<typeof createClient<Database>>;

  beforeAll(() => {
    supabase = createClient<Database>(
      process.env.VITE_SUPABASE_URL || 'http://localhost:54321',
      process.env.VITE_SUPABASE_ANON_KEY || 'test-key'
    );
  });

  describe('Drivers Table', () => {
    test('should insert and retrieve driver', async () => {
      const newDriver = {
        first_name: 'Test',
        last_name: 'Driver',
        nationality: 'Test',
        driver_number: 99
      };

      const { data: insertData, error: insertError } = await supabase
        .from('drivers')
        .insert(newDriver)
        .select()
        .single();

      expect(insertError).toBeNull();
      expect(insertData).toMatchObject(newDriver);

      // Clean up
      if (insertData) {
        await supabase.from('drivers').delete().eq('id', insertData.id);
      }
    });

    test('should handle foreign key constraints', async () => {
      const invalidDriver = {
        first_name: 'Test',
        last_name: 'Driver',
        team_id: 'non-existent-team-id'
      };

      const { error } = await supabase
        .from('drivers')
        .insert(invalidDriver);

      expect(error).not.toBeNull();
    });
  });

  describe('Race Comments', () => {
    test('should create and retrieve comments', async () => {
      const comment = {
        content: 'Great race!',
        race_id: 'test-race-id',
        user_id: 'test-user-id'
      };

      const { data, error } = await supabase
        .from('race_comments')
        .insert(comment)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject(comment);

      // Clean up
      if (data) {
        await supabase.from('race_comments').delete().eq('id', data.id);
      }
    });
  });
});
