
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xibjuwcqceubldzeypyy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmp1d2NxY2V1YmxkemV5cHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzA4OTQsImV4cCI6MjA1ODk0Njg5NH0.-GHKdPLKv1Kg2dA63O1lrWLThmeR1WgxPEoOVgwgGq4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
