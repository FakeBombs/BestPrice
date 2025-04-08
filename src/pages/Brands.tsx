import { Card, CardContent } from '@/components/ui/card';

const brands = [
  { id: 'b1', name: 'Apple', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/9.svg' },
  { id: 'b2', name: 'Samsung', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/26.svg' },
  { id: 'b3', name: 'Sony', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/5.svg' },
  { id: 'b4', name: 'LG', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/293.svg' },
  { id: 'b5', name: 'Canon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/10.svg' },
  { id: 'b6', name: 'Nikon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/281.svg' },
  { id: 'b7', name: 'Lenovo', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/728.svg' },
  { id: 'b8', name: 'Dell', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/292.svg' },
  { id: 'b9', name: 'HP', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/1.svg' },
  { id: 'b10', name: 'Asus', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/161.svg' },
  { id: 'b11', name: 'Acer', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/7.svg' },
  { id: 'b12', name: 'Microsoft', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/100.svg' }
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
          <h1 style={{width: "50%"}}>37.353 κατασκευαστές</h1>
          <span className="autocomplete__wrapper" style={{display: "inline-block", position: "relative", verticalAlign: "top", zIndex: "500000000"}}>
            <input type="search" id="brand-search-q" placeholder="Γρήγορη εύρεση ..." autocomplete="off" autocorrect="off" spellcheck="false"/>
              <div className="autocomplete autocomplete--minimal" style={{display: "none"}}></div>
          </span>
        </header>
        
        
        <section className="top-brands">
          <h3>Δημοφιλείς</h3>
          <div className="top-brands__brands">
            <div className="box-wrapper grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8" style={{paddingRight: "0"}}>
              {brands.map((brand) => (
                <a className="brand box" alt={brand.name} title={brand.name} key={brand.id} href="/b/${brandId}/${brandName}.html">
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

            

            <div class="brand-directory__letter" id="letter-0-9">
              <aside><h3>0-9</h3></aside>
              <div class="brand-directory__letter-main">
                <ol>
                  <li><a href="/b/30193/1more.html" rel="nofollow">1MORE</a></li>
                  <li><a href="/b/43037/1stplayer.html" rel="nofollow">1stPlayer</a></li>
                  <li><a href="/b/38369/24colours.html" rel="nofollow">24colours</a></li>
                  <li><a href="/b/3320/2k.html" rel="nofollow">2K</a></li>
                  <li><a href="/b/18388/2k-games.html" rel="nofollow">2K Games</a></li>
                  <li><a href="/b/1912/3dconnexion.html" rel="nofollow">3Dconnexion</a></li>
                  <li><a href="/b/41580/3ellen.html" rel="nofollow">3ellen</a></li>
                  <li><a href="/b/4917/3go.html" rel="nofollow">3GO</a></li>
                  <li><a href="/b/16764/3guys.html" rel="nofollow">3Guys</a></li>
                  <li><a href="/b/206/3m.html" rel="nofollow">3M</a></li>
                  <li><a href="/b/39177/3mk.html" rel="nofollow">3mk</a></li>
                  <li><a href="/b/18136/4711.html" rel="nofollow">4711</a></li>
                  <li><a href="/b/28227/4f.html" rel="nofollow">4F</a></li>
                  <li><a href="/b/7228/4m.html" rel="nofollow">4M</a></li>
                  <li><a href="/b/21425/4moms.html" rel="nofollow">4Moms</a></li>
                  <li><a href="/b/38779/4teen4ty.html" rel="nofollow">4teen4ty</a></li>
                  <li><a href="/b/25257/511-tactical.html" rel="nofollow">5.11 Tactical</a></li>
                  <li><a href="/b/34087/500cosmetics.html" rel="nofollow">500Cosmetics</a></li>
                  <li><a href="/b/5005/505-games.html" rel="nofollow">505 Games</a></li>
                  <li><a href="/b/33983/5050-games.html" rel="nofollow">5050 Games</a></li>
                  <li><a href="/b/42765/5five.html" rel="nofollow">5Five</a></li>
                  <li><a href="/b/36409/70mai.html" rel="nofollow">70mai</a></li>
                  <li><a href="/b/39065/7days.html" rel="nofollow">7Days</a></li>
                  <li><a href="/b/30311/7elements.html" rel="nofollow">7elements</a></li>
                  <li><a href="/b/30214/7nutrition.html" rel="nofollow">7Nutrition</a></li>
                  <li><a href="/b/30267/8bitdo.html" rel="nofollow">8bitdo</a></li>
                </ol>
              </div>
            </div>


            
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default Brands;
