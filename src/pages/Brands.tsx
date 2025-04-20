import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { brands, groupedBrands } from '@/data/mockData';
import { useTranslation } from '@/hooks/useTranslation';

const Brands = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Function to group brands by their first character
  const groupBrands = (brandsArray) => {
    return brandsArray.reduce((acc, brand) => {
      const firstChar = brand.name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {  // Latin letters
        if (!acc.latin) acc.latin = {};
        acc.latin[firstChar] = acc.latin[firstChar] || [];
        acc.latin[firstChar].push(brand);
      } else if (/[0-9]/.test(firstChar)) {  // Numbers
        if (!acc.numbers) acc.numbers = [];
        acc.numbers.push(brand);
      } else if (/[\u0391-\u03A9]/.test(firstChar)) { // Greek letters (Α-Ω)
        if (!acc.greek) acc.greek = [];
        acc.greek.push(brand); // Add brand to a single Greek array
      }
      return acc;
    }, {});
  };

  const groupedBrands = groupBrands(brands);

  const getFilteredBrands = () => {
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredBrands = getFilteredBrands();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    setActiveSuggestionIndex(-1); // Reset active suggestion when input changes
  };

  const handleKeyDown = (e) => {
    const filtered = getFilteredBrands();
    switch (e.key) {
      case 'ArrowDown':
        setActiveSuggestionIndex(prevIndex => (prevIndex < filtered.length - 1 ? prevIndex + 1 : prevIndex));
        break;
      case 'ArrowUp':
        setActiveSuggestionIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        break;
      case 'Enter':
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filtered.length) {
          const selectedBrand = filtered[activeSuggestionIndex];
          navigate(`/b/${selectedBrand.id}/${selectedBrand.name.replace(/\s+/g, '-').toLowerCase()}.html`);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="root__wrapper" id="page-brands">
      <div className="root">
        <div id="trail">
          <nav className="breadcrumb">
            <ol>
              <li><a href="/" rel="home" data-no-info=""><span>BestPrice</span></a><span className="trail__breadcrumb-separator">›</span></li>
              <li><a href="/brands" data-no-info="" className="trail__last"><span>Κατασκευαστές</span></a><span className="trail__breadcrumb-separator"></span></li>
            </ol>
          </nav>
        </div>

        <header className="page-header">
          <h1 style={{ width: "50%" }}>{brands.length} κατασκευαστές</h1>
          <span className="autocomplete__wrapper" style={{ display: "inline-block", position: "relative", verticalAlign: "top", zIndex: "500000000" }}>
            <input type="search" id="brand-search-q" placeholder="Γρήγορη εύρεση ..." autoComplete="off" autoCorrect="off" spellCheck="false" value={searchTerm} onChange={handleInputChange} onKeyDown={handleKeyDown} />
            {showSuggestions && ( <div className="autocomplete autocomplete--minimal"><ol>{filteredBrands.map((brand, index) => ( <li key={brand.id} className={`autocomplete__item ${index === activeSuggestionIndex ? 'highlight' : ''}`} onMouseEnter={() => setActiveSuggestionIndex(index)} onClick={() => navigate(`/b/${brand.id}/${brand.name.replace(/\s+/g, '-').toLowerCase()}.html`)}><div className="autocomplete__content"><div className="autocomplete__padder">{brand.name}</div></div></li> ))}</ol></div> )}
          </span>
        </header>

        <div class="brands-top-cats">
          <div class="scroll">
            <div class="scroll__clip">
              <div class="scroll__scroller">
                <div class="brands-top__inner scroll__content">
                  <a class="brands__top-cat" href="/brands/1/technology.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M17 2H7C6.44772 2 6 2.44772 6 3V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V3C18 2.44772 17.5523 2 17 2ZM12.5 4H14M10 4H10.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 19.5C12.5 19.7761 12.2761 20 12 20 11.7239 20 11.5 19.7761 11.5 19.5 11.5 19.2239 11.7239 19 12 19 12.2761 19 12.5 19.2239 12.5 19.5ZM15.25 6.5 8.5 13.25M12.2605 6.5 8.5 10.2316" stroke-linecap="round" stroke-linejoin="round"/></svg>{t('technology')}</a>
                  <a class="brands__top-cat" href="/brands/2185/home-garden.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path fill-rule="evenodd" d="M6 2H18L20 12H4L6 2Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V19.2543M16 12V16M5 20.5C5 19.9477 5.44772 19.5 6 19.5H18C18.5523 19.5 19 19.9477 19 20.5V22H5V20.5Z" stroke-linecap="round" stroke-linejoin="round"/></svg>Σπίτι &amp; Κήπος</a>
                  <a class="brands__top-cat" href="/brands/2068/fashion.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M5.8777 7.5C5.93812 8.06394 5.97559 8.72578 5.97559 9.5V22H17.9756V9.5C17.9756 8.72578 18.0131 8.06394 18.0735 7.5M18.5 11.0626L22 10.0626L18.9756 4.5L14.9756 2H8.97559L4.97559 4.5L2 10.0626L5.5 11.0626" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.97559 2.25C8.97559 3.90685 10.3187 5.25 11.9756 5.25C13.6324 5.25 14.9756 3.90685 14.9756 2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>Μόδα</a>
                  <a class="brands__top-cat" href="/brands/583/health-beauty.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M6 4 8 18V21C8 21.5523 8.44772 22 9 22H15C15.5523 22 16 21.5523 16 21V18L18 4V2H6V4ZM8 18H15.75M6.5 4.5H11.5M14 4.5H15" stroke-linecap="round" stroke-linejoin="round"/></svg>Υγεία &amp; Ομορφιά</a>
                  <a class="brands__top-cat" href="/brands/2175/paidika-brefika.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M12.5 15.75C12.5 18.7876 10.0376 21.25 7 21.25 3.96243 21.25 1.5 18.7876 1.5 15.75 1.5 12.7124 3.96243 10.25 7 10.25 10.0376 10.25 12.5 12.7124 12.5 15.75ZM22.5 17.75C22.5 19.683 20.933 21.25 19 21.25 17.067 21.25 15.5 19.683 15.5 17.75 15.5 15.817 17.067 14.25 19 14.25 20.933 14.25 22.5 15.817 22.5 17.75Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 15.75L8.72147 5.4212C8.8822 4.45683 9.71658 3.75 10.6943 3.75H13.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 7.25C8.5 7.25 19.0288 8.87521 19.0288 17.7441" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.9683 10.75C15.9683 10.75 18.4683 10.3628 18.4683 8.25M16.7214 7.06104 19.4505 5.57244C19.9974 5.27412 20.681 5.54309 20.878 6.1341L21.0613 6.68376C21.2771 7.33129 20.7951 7.99998 20.1126 7.99998H16.9608C16.4428 7.99998 16.2666 7.30908 16.7214 7.06104Z" stroke-linecap="round" stroke-linejoin="round"/></svg>Παιδικά - Βρεφικά</a>
                  <a class="brands__top-cat" href="/brands/3058/sports-hobbies.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.015 20.9723C11.1004 16.0277 13.8957 12.3469 10.5431 9.51942C8.07443 7.43744 5.42553 8.4672 3.05798 12.1731" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4781 5.75014C17.2699 4.54196 13.4412 6.41178 9.92649 9.92649C6.41178 13.4412 4.54196 17.2699 5.75014 18.4781" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.3028 18.3816C20.3896 16.2947 19.2321 11.7537 15.7174 8.23899C12.2027 4.72427 7.66169 3.56676 5.57483 5.65363" stroke-linecap="round" stroke-linejoin="round"/></svg>Hobby, Αθλητισμός</a>
                  <a class="brands__top-cat" href="/brands/3204/auto-moto.html"><svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 12C16 14.2091 14.2091 16 12 16 9.79086 16 8 14.2091 8 12 8 9.79086 9.79086 8 12 8 14.2091 8 16 9.79086 16 12ZM6.49663 3.64925 7.84375 3.8125M6.49663 3.64925C7.92433 2.70646 9.60802 2.11998 11.421 2.01648M6.49663 3.64925C5.04056 4.61077 3.85076 5.94291 3.0616 7.51129M11.421 2.01648C11.6126 2.00554 11.8057 2 12 2 13.6147 2 15.1401 2.38271 16.4903 3.06238M11.421 2.01648 12.5 2.83594M16.4903 3.06238 17.0156 4.3125M16.4903 3.06238C18.0599 3.85252 19.3929 5.044 20.3543 6.50207M20.3543 6.50207 20.1875 7.84766M20.3543 6.50207C21.2953 7.92896 21.8804 9.61115 21.9836 11.4224M21.9836 11.4224C21.9945 11.6135 22 11.8061 22 12 22 13.6141 21.6176 15.1389 20.9384 16.4887M21.9836 11.4224 21.168 12.5M20.9384 16.4887 19.6953 17.0117M20.9384 16.4887C20.1484 18.0587 18.957 19.392 17.4989 20.3537M17.4989 20.3537 16.1562 20.1914M17.4989 20.3537C16.0739 21.2936 14.3942 21.8787 12.5856 21.9831M12.5856 21.9831C12.3919 21.9943 12.1966 22 12 22 10.3871 22 8.86346 21.6182 7.51442 20.94M12.5856 21.9831 11.5039 21.1641M7.51442 20.94 6.98828 19.6875M7.51442 20.94C5.94598 20.1515 4.61361 18.9624 3.65162 17.507M3.65162 17.507 3.81641 16.1484M3.65162 17.507C2.70796 16.0793 2.12071 14.3954 2.01665 12.582M2.01665 12.582C2.0056 12.3894 2 12.1953 2 12 2 10.3859 2.38242 8.8611 3.0616 7.51129M2.01665 12.582 2.83594 11.5039M3.0616 7.51129 4.3125 6.98828" stroke-linecap="round" stroke-linejoin="round"/></svg>Μηχανοκίνηση</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <section className="top-brands">
          <h3>Δημοφιλείς</h3>
          <div className="top-brands__brands">
            <div className="box-wrapper grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8" style={{paddingRight: "0"}}>
              {brands.slice(0, 12).map((brand) => ( <Link className="brand box" alt={brand.name} title={brand.name} key={brand.id} to={`/b/${brand.id}/${brand.name.toLowerCase()}.html`}><img itemProp="logo" alt={brand.name} title={brand.name} loading="lazy" src={brand.logo} /></Link> ))}
            </div>
          </div>
        </section>

        <section className="brand-directory">
          <div className="brand-directory__letters">
            <div className="brand-directory__letters-wrapper">
              <nav className="brand-directory__nav">
                <a href="/brands#letter-0-9">0-9</a>
                {Object.keys(groupedBrands.latin || {}).map(letter => (
                  <a key={letter} href={`/brands#letter-${letter}`}>{letter}</a>
                ))}
                <a href="/brands#letter-Greek">Α-Ω</a>
              </nav>
            </div>
            
            {/* Numbers Section */}
            <div className="brand-directory__letter" id="letter-0-9">
              <aside><h3>0-9</h3></aside>
              <div className="brand-directory__letter-main"><ol>{groupedBrands.numbers?.map((brand) => ( <li key={brand.id}><Link to={`/b/${brand.id}/${brand.name.replace(/\s+/g, '-').toLowerCase()}.html`} rel="nofollow">{brand.name}</Link></li> ))}</ol></div>
            </div>

            {/* Latin Characters Section */}
            {Object.keys(groupedBrands.latin || {}).map(letter => (
              <div className="brand-directory__letter" id={`letter-${letter}`} key={letter}>
                <aside><h3>{letter}</h3></aside>
                <div className="brand-directory__letter-main"><ol>{groupedBrands.latin[letter]?.map((brand) => ( <li key={brand.id}><Link to={`/b/${brand.id}/${brand.name.replace(/\s+/g, '-').toLowerCase()}.html`} rel="nofollow">{brand.name}</Link></li> ))}</ol></div>
              </div>
            ))}

            {/* Combined Greek Characters Section (Α-Ω) */}
            <div className="brand-directory__letter" id="letter-Greek">
              <aside><h3>Α-Ω</h3></aside>
              <div className="brand-directory__letter-main"><ol>{groupedBrands.greek?.map((brand) => ( <li key={brand.id}><Link to={`/b/${brand.id}/${brand.name.replace(/\s+/g, '-').toLowerCase()}.html`} rel="nofollow">{brand.name}</Link></li> ))}</ol></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Brands;
