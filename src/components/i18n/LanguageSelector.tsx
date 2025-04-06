
import { Check } from "lucide-react";
import { useLanguageContext } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageContext();
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{t('selectLanguage')}</label>
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('systemLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">
            <div className="flex items-center justify-between w-full">
              <span>{t('english')}</span>
              {language === 'en' && <Check className="h-4 w-4 ml-2" />}
            </div>
          </SelectItem>
          <SelectItem value="el">
            <div className="flex items-center justify-between w-full">
              <span>{t('greek')}</span>
              {language === 'el' && <Check className="h-4 w-4 ml-2" />}
            </div>
          </SelectItem>
          <SelectItem value="es">
            <div className="flex items-center justify-between w-full">
              <span>{t('spanish')}</span>
              {language === 'es' && <Check className="h-4 w-4 ml-2" />}
            </div>
          </SelectItem>
          <SelectItem value="fr">
            <div className="flex items-center justify-between w-full">
              <span>{t('french')}</span>
              {language === 'fr' && <Check className="h-4 w-4 ml-2" />}
            </div>
          </SelectItem>
          <SelectItem value="de">
            <div className="flex items-center justify-between w-full">
              <span>{t('german')}</span>
              {language === 'de' && <Check className="h-4 w-4 ml-2" />}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
