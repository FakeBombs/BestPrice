
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-bold mt-6 mb-4">Page Not Found</h2>
      <p className="text-xl text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
