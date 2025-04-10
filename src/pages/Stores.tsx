
import { vendors } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Stores = () => {
  const { t } = useTranslation();
  return (
    <div>


      
      <h1 className="text-3xl font-bold mb-2">Καταστήματα</h1>
      <p className="text-muted-foreground mb-6">
        Ανακάλυψε τα συνεργαζόμενα καταστήματα του BestPrice
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 mr-4">
                  <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{vendor.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-sm">{vendor.rating.toFixed(1)}/5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in ullamcorper ex.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>



      
    </div>
  );
};

export default Stores;
