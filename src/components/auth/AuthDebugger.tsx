
import { useState, useEffect } from 'react';
import { supabase, redirectURL, siteURL } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Bug, RefreshCw, Trash } from 'lucide-react';

export default function AuthDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [authConfig, setAuthConfig] = useState({
    siteUrl: window.location.origin,
    currentPath: window.location.pathname,
    redirectUrl: redirectURL,
  });
  const [refreshing, setRefreshing] = useState(false);
  const SUPABASE_PROJECT_ID = 'xibjuwcqceubldzeypyy';
  
  const fetchSessionData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session retrieval error:", error);
        setSessionData({ error: error.message });
      } else {
        setSessionData(data);
      }
    } catch (err) {
      console.error("Error getting session:", err);
      setSessionData({ error: String(err) });
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    // Get current session data
    fetchSessionData();
  }, []);
  
  const handleTestAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth test error:", error);
        alert(`Auth test failed: ${error.message}`);
      } else {
        alert(`Auth test successful. User ID: ${data.user?.id || 'Not logged in'}`);
      }
    } catch (err: any) {
      alert(`Auth test exception: ${err.message}`);
    }
  };
  
  const handleClearSession = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        alert(`Failed to clear session: ${error.message}`);
      } else {
        alert("Session cleared successfully. Page will reload.");
        window.location.reload();
      }
    } catch (err: any) {
      alert(`Error clearing session: ${err.message}`);
    }
  };

  // Check for auth tokens in localStorage
  const hasLocalStorageToken = Boolean(
    localStorage.getItem('supabase.auth.token') || 
    localStorage.getItem(`sb-${SUPABASE_PROJECT_ID}-auth-token`)
  );
  
  return (
    <div className="mt-8 p-4 border rounded-md bg-muted">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium">Authentication Debug Info</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <div className="text-sm mt-2">
          <p className="mb-1">Site URL: {authConfig.siteUrl}</p>
          <p className="mb-1">Redirect URL: {authConfig.redirectUrl}</p>
          <p className="mb-2">Current Path: {authConfig.currentPath}</p>
          {sessionData?.session && (
            <p className="text-green-500 font-semibold">✓ Active session detected</p>
          )}
          {!sessionData?.session && (
            <p className="text-red-500 font-semibold">✗ No active session</p>
          )}
        </div>
        
        <CollapsibleContent>
          <div className="space-y-3 mt-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Supabase Configuration Check</h4>
              <p className="text-xs">
                Ensure your Supabase project has these values configured in Authentication &gt; URL Configuration:
              </p>
              <ul className="text-xs list-disc pl-5 mt-1">
                <li>Site URL: {authConfig.siteUrl}</li>
                <li>Redirect URLs: {authConfig.siteUrl}</li>
                <li>Additional Redirect URL: {authConfig.redirectUrl}</li>
                <li>Additional Redirect URL: {authConfig.siteUrl}/auth/callback</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Auth Storage</h4>
              <div className="flex gap-2 flex-wrap">
                {localStorage.getItem('supabase.auth.token') ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    localStorage: auth.token ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    localStorage: auth.token ✗
                  </span>
                )}
                
                {localStorage.getItem(`sb-${SUPABASE_PROJECT_ID}-auth-token`) ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    localStorage: project token ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    localStorage: project token ✗
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Session Data</h4>
              {sessionData ? (
                <pre className="text-xs bg-muted-foreground/10 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              ) : (
                <p className="text-xs italic">Loading session data...</p>
              )}
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" onClick={handleTestAuth}>
                Test Authentication
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={fetchSessionData}
                disabled={refreshing}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.open('https://supabase.com/dashboard/project/xibjuwcqceubldzeypyy/auth/url-configuration', '_blank')}
              >
                Supabase Auth Settings
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleClearSession}
              >
                <Trash className="h-3 w-3 mr-1" />
                Clear Session
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
