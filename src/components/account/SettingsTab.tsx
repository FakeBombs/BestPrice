
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationSettings from "@/components/NotificationSettings";
import LanguageSelector from "../i18n/LanguageSelector";

const SettingsTab = () => {
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Language Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSelector />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSettings />
        </CardContent>
      </Card>
    </>
  );
};

export default SettingsTab;
