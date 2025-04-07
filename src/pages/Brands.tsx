import { Card, CardContent } from '@/components/ui/card';

const brands = [
  { id: 'b1', name: 'Apple', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/9.svg' },
  { id: 'b2', name: 'Samsung', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/26.svg' },
  { id: 'b3', name: 'Sony', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/5.svg' },
  { id: 'b4', name: 'LG', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/293.svg' },
  { id: 'b5', name: 'Canon', logo: 'https://placehold.co/200x100?text=Canon' },
  { id: 'b6', name: 'Nikon', logo: 'https://placehold.co/200x100?text=Nikon' },
  { id: 'b7', name: 'Lenovo', logo: 'https://placehold.co/200x100?text=Lenovo' },
  { id: 'b8', name: 'Dell', logo: 'https://placehold.co/200x100?text=Dell' },
  { id: 'b9', name: 'HP', logo: 'https://placehold.co/200x100?text=HP' },
  { id: 'b10', name: 'Asus', logo: 'https://placehold.co/200x100?text=Asus' },
  { id: 'b11', name: 'Acer', logo: 'https://placehold.co/200x100?text=Acer' },
  { id: 'b12', name: 'Microsoft', logo: 'https://placehold.co/200x100?text=Microsoft' }
];

const Brands = () => {
  return (
    <div className="root__wrapper" id="page-brands">
      <div className="root">
        
        <div id="trail">
          <nav className="breadcrumb">
            <ol>
              <li><a href="/" rel="home" data-no-info=""><span>BestPrice.gr</span></a><span className="trail__breadcrumb-separator">›</span></li>
              <li><a href="/brands" data-no-info="" className="trail__last"><span>Κατασκευαστές</span></a><span className="trail__breadcrumb-separator"></span></li>
            </ol>
          </nav>
        </div>

        <header className="page-header">
          <h1>37.353 κατασκευαστές</h1>
          <span className="autocomplete__wrapper" style={{display: "inline-block", position: "relative", verticalAlign: "top", zIndex: "500000000"}}>
            <input type="search" id="brand-search-q" placeholder="Γρήγορη εύρεση ..." autocomplete="off" autocorrect="off" spellcheck="false"/>
              <div className="autocomplete autocomplete--minimal" style={{display: "none"}}></div>
          </span>
        </header>


        <div className="brands-top-cats">
          <div className="scroll">
            <div className="scroll__clip">
              
            </div>
          <div>
        </div>
        
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-center h-32">
              <img src={brand.logo} alt={brand.name} className="max-h-16 max-w-full" />
            </CardContent>
          </Card>
        ))}
        </div>


        
      </div>
    </div>
  );
};

export default Brands;
