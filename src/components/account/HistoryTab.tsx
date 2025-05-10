import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HistoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
        <CardDescription>
          Products you've recently viewed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No recently viewed products.</p>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
