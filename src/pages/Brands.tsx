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
        
        
        <section className="top-brands">
          <h3>Δημοφιλείς</h3>
          <div className="top-brands__brands">
            <div className="box-wrapper grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
              {brands.map((brand) => (
                <a className="brand box" alt={brand.name} title={brand.name} key={brand.id} href="/b/9/apple.html">
                  <img itemprop="logo" alt={brand.name} title={brand.name} loading="lazy" src={brand.logo} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-directory">
          <div className="brand-directory__letters">
            <div className="brand-directory__letters-wrapper">
              <nav className="sticky" data-sticky-viewport="MD">
                <a href="/brands#letter-0-9">0-9</a>
                <a href="/brands#letter-A">A</a>
                <a href="/brands#letter-B">B</a>
                <a href="/brands#letter-C">C</a>
                <a href="/brands#letter-D">D</a>
                <a href="/brands#letter-E">E</a>
                <a href="/brands#letter-F">F</a>
                <a href="/brands#letter-G">G</a>
                <a href="/brands#letter-H">H</a>
                <a href="/brands#letter-I">I</a>
                <a href="/brands#letter-J">J</a>
                <a href="/brands#letter-K">K</a>
                <a href="/brands#letter-L">L</a>
                <a href="/brands#letter-M">M</a>
                <a href="/brands#letter-N">N</a>
                <a href="/brands#letter-O">O</a>
                <a href="/brands#letter-P">P</a>
                <a href="/brands#letter-Q">Q</a>
                <a href="/brands#letter-R">R</a>
                <a href="/brands#letter-S">S</a>
                <a href="/brands#letter-T">T</a>
                <a href="/brands#letter-U">U</a>
                <a href="/brands#letter-V">V</a>
                <a href="/brands#letter-W">W</a>
                <a href="/brands#letter-X">X</a>
                <a href="/brands#letter-Y">Y</a>
                <a href="/brands#letter-Z">Z</a>
                <a href="/brands#letter-Greek">Α-Ω</a>
              </nav>
            </div>
          
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default Brands;
