import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AlertsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
        <CardDescription>
          Get notified when prices drop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">You don't have any price alerts set up yet.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Set Up a Price Alert</Button>
      </CardFooter>
    </Card>
  );
};

export default AlertsTab;
