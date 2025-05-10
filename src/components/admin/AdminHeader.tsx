import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
  backLink?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function AdminHeader({ title, backLink, actionButton }: AdminHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        {backLink ? (
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to={backLink}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {actionButton && (
        <Button onClick={actionButton.onClick}>
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
