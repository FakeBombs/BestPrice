
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

// Define specific paths for auth callbacks
const getRedirectURL = () => {
  const baseURL = getSiteURL();
  // Return multiple redirect URLs to support both patterns
  return `${baseURL}/callback`;
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      detectSessionInUrl: true, // Enables detecting OAuth session info from the URL
      flowType: 'pkce', // Use PKCE flow for more secure authentication
      redirectTo: getRedirectURL(), // Use the specific redirect URL with /callback path
      cookieOptions: {
        // Ensure cookies work across different environments
        name: 'sb-auth-token',
        lifetime: 60 * 60 * 24 * 7, // 7 days
        domain: window?.location?.hostname || '',
        path: '/',
        sameSite: 'lax'
      },
      // Debug options
      debug: true // Enable debug in all environments for now to diagnose issues
    }
  }
);

// Export site URL and redirect URL for other components that may need it
export const siteURL = getSiteURL();
export const redirectURL = getRedirectURL();

// Log configuration in all modes for debugging
console.log('Supabase Auth Configuration:', {
  siteURL: siteURL,
  redirectURL: redirectURL,
  detectSessionInUrl: true,
  cookieDomain: window?.location?.hostname || ''
});

// Helper function to check if auth is working
export const checkAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("Auth check result:", { 
      session: data.session ? true : false,
      sessionExpiry: data.session?.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : null,
      error: error ? error.message : null
    });
    return { isAuthenticated: !!data.session, error };
  } catch (err) {
    console.error("Auth check failed:", err);
    return { isAuthenticated: false, error: err };
  }
};
