import { vendors } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Stores = () => {
  const { t } = useTranslation();
  return (
    <div className="root__wrapper">
      <div className="root">

        <div id="trail">
          <nav className="breadcrumb">
            <ol>
              <li><a href="/" rel="home" data-no-info=""><span>BestPrice</span></a><span className="trail__breadcrumb-separator">›</span></li>
              <li><a href="/stores" data-no-info="" className="trail__last"><span>Καταστήματα</span></a><span className="trail__breadcrumb-separator"></span></li>
            </ol>
          </nav>
        </div>

        <header className="page-header">
          <div className="page-header__thead"><h1>3.758 καταστήματα</h1></div>
          <div className="page-header__sorting">
            <span className="right" id="merchant-search">
              <span className="autocomplete__wrapper" style={{position: 'relative', display: 'inline-block', verticalAlign: 'top', zIndex: 500000000}}>
                <input type="search" id="merchant-search-q" placeholder="Γρήγορη εύρεση καταστήματος" autofocus="" autocomplete="off" autocorrect="off" spellcheck="false"/>
                <div className="autocomplete autocomplete--minimal" style={{display: 'none'}}></div>
              </span>
            </span>
            <div className="tabs">
              <div className="tabs-wrapper">
                <nav>
                  <a data-type="" href="/stores" rel="nofollow" className="current">Δημοφιλία</a>
                  <a data-type="title:asc" href="/stores?o=title%3Aasc" rel="nofollow" className="">Αλφαβητικά</a>
                  <a data-type="level:desc" href="/stores?o=level%3Adesc" rel="nofollow" className="">Πιστοποίηση</a>
                  <a data-type="orders" href="/stores?o=orders" rel="nofollow" className="">
                    <svg aria-hidden="true" className="icon" width="16" height="16"><path xmlns="http://www.w3.org/2000/svg" d="M14.0001 4.69998L8.0171 7.99698C8.01193 7.99997 8.00607 8.00154 8.0001 8.00154C7.99413 8.00154 7.98827 7.99997 7.9831 7.99698L2.0001 4.70098M8.0001 7.99998V14.666M8.0001 14.666C8.00289 14.666 8.00564 14.6653 8.0081 14.664L13.9901 11.338V11.34C13.9933 11.338 13.996 11.3352 13.9977 11.3319C13.9995 11.3285 14.0003 11.3248 14.0001 11.321V4.70898C14.0001 4.70098 13.9961 4.69398 13.9901 4.68998L8.0081 1.33598C8.00564 1.33467 8.00289 1.33398 8.0001 1.33398C7.99731 1.33398 7.99456 1.33467 7.9921 1.33598L2.0101 4.68898C2.0041 4.69298 2.0001 4.69998 2.0001 4.70798V11.32C1.99971 11.3239 2.00045 11.3279 2.00222 11.3314C2.00399 11.335 2.00672 11.3379 2.0101 11.34L7.9921 14.664C7.99456 14.6653 7.99731 14.666 8.0001 14.666Z"/></svg>
                    Αποθήκευση παραγγελίας
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>

      
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
    </div>
  );
};

export default Stores;
