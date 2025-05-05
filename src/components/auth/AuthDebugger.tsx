
import { useState, useEffect } from 'react';
import { supabase, redirectURL, siteURL } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function AuthDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [authConfig, setAuthConfig] = useState({
    siteUrl: window.location.origin,
    currentPath: window.location.pathname,
    redirectUrl: redirectURL,
  });
  
  useEffect(() => {
    // Get current session data
    const getSessionData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session retrieval error:", error);
        setSessionData({ error: error.message });
      } else {
        setSessionData(data);
      }
    };
    
    getSessionData();
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
  
  return (
    <div className="mt-8 p-4 border rounded-md bg-muted">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Authentication Debug Info</h3>
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
        </div>
        
        <CollapsibleContent>
          <div className="space-y-3 mt-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Supabase Configuration Check</h4>
              <p className="text-xs">
                Make sure your Supabase project has these values configured in Authentication &gt; URL Configuration:
              </p>
              <ul className="text-xs list-disc pl-5 mt-1">
                <li>Site URL: {authConfig.siteUrl}</li>
                <li>Redirect URLs: {authConfig.siteUrl}</li>
                <li>Additional Redirect URL: {authConfig.redirectUrl}</li>
              </ul>
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
                onClick={() => window.open('https://supabase.com/dashboard/project/xibjuwcqceubldzeypyy/auth/url-configuration', '_blank')}
              >
                Open Supabase Auth Settings
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
