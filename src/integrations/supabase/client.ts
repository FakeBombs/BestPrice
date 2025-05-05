
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xibjuwcqceubldzeypyy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmp1d2NxY2V1YmxkemV5cHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzA4OTQsImV4cCI6MjA1ODk0Njg5NH0.-GHKdPLKv1Kg2dA63O1lrWLThmeR1WgxPEoOVgwgGq4";

// Get the site URL for redirects - works in both development and production
const getSiteURL = () => {
  let url = window?.location?.origin || '';
  // For development environments where we might use localhost
  if (url.includes('localhost')) {
    return url;
  }
  // For production or preview deployments
  return url;
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      flowType: 'pkce', // Recommended for web apps for better security
      detectSessionInUrl: true, // Enables detecting OAuth session info from the URL
      redirectTo: getSiteURL()
    }
  }
);

// Export site URL for other components that may need it
export const siteURL = getSiteURL();
