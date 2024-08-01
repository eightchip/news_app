// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/database.types';

let supabase: ReturnType<typeof createClientComponentClient<Database>>;

if (typeof window !== 'undefined') {
  supabase = createClientComponentClient<Database>();
} else {
  supabase = {} as ReturnType<typeof createClientComponentClient<Database>>;
}

export default supabase;