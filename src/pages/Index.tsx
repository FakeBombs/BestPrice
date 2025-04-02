
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  // Function to handle search term clicks
  const handleSearchTermClick = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <main className="home">
      <section className="home-search">
        <div className="home-search__welcome-box">
          <img src="//www.bestprice.gr/public/dist/images/bestprice-logo-homepage-2x.png" 
               width="168" 
               height="35" 
               alt="bestprice.gr Logo" 
               className="home-search__logo" />
          <h1 className="home-search__welcome">
            Αναζήτησε και σύγκρινε τιμές σε <strong className="home-search__welcome--highlight">χιλιάδες προϊόντα</strong>
          </h1>
          <div className="home-search__search-wrapper">
            <SearchBar className="home-search__input" />
          </div>
        </div>
      </section>

      <div className="home-queries">
        <div className="home-queries__box" style={{ display: "grid" }}>
          <div className="home-queries__topics">
            <div className="home-queries__title">Δημοφιλή</div>
          </div>

          <Link to="/" className="home-queries__more">
            <span className="home-queries__more-content">Περισσότερα</span>
            <svg aria-hidden="true" className="icon" width="7" height="12">
              <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-chevron-right"></use>
            </svg>
          </Link>
          
          <div className="home-queries__popular" data-intersected="true">
            <div className="home-queries__wrapper">
              <h5 className="home-queries__section-title">Αναζητήσεις</h5>
              <div className="home-queries__list">
                <div className="home-queries__item">
                  <div className="home-queries__icon" aria-hidden="true" width="13" height="13">
                    <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-search-13"></use>
                  </div>
                </div>
                <div className="home-queries__item">
                  <div className="home-queries__content" style={{ overflow: "hidden" }}>
                    <div className="home-queries__flex">
                      <div className="h-queries__list">
                        <div className="h-queries__item" onClick={() => handleSearchTermClick('iphone 15')}>
                          <div className="h-queries__link">Iphone 15</div>
                          <div className="h-queries__icon">
                            <svg aria-hidden="true" className="icon" width="13" height="13">
                              <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-search-13"></use>
                            </svg>
                          </div>
                        </div>
                        <div className="h-queries__item" onClick={() => handleSearchTermClick('ps5')}>
                          <div className="h-queries__link">PS5</div>
                          <div className="h-queries__icon">
                            <svg aria-hidden="true" className="icon" width="13" height="13">
                              <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-search-13"></use>
                            </svg>
                          </div>
                        </div>
                        <div className="h-queries__item" onClick={() => handleSearchTermClick('samsung s24')}>
                          <div className="h-queries__link">Samsung S24</div>
                          <div className="h-queries__icon">
                            <h5 className="h-queries__text">Samsung S24</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-queries">
        <div className="home-queries__box" style={{ display: "grid" }}>
          <div className="home-queries__topics">
            <div className="home-queries__title">Κατηγορίες</div>
          </div>

          <Link to="/categories" className="home-queries__more">
            <span className="home-queries__more-content">Περισσότερες</span>
            <svg aria-hidden="true" className="icon" width="7" height="12">
              <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-chevron-right"></use>
            </svg>
          </Link>
          
          <div className="home-queries__popular" data-intersected="true">
            <div className="home-queries__wrapper">
              <div className="home-queries__list">
                <div className="home-queries__item">
                  <div className="home-queries__content">
                    <div className="home-queries__flex">
                      <a target="_blank" className="category-card" href="/c/1/kinita-smartphones.html">
                        <div className="category-card__image">
                          <div className="category-card__image-wrapper">
                            <h5 className="category-card__heading">Κινητά Τηλέφωνα</h5>
                          </div>
                        </div>
                        <div className="category-card__content">
                          <div className="category-card__content-inner">
                            <Link className="category-card__content-link" rel="nofollow" title="Δες όλα τα Κινητά Τηλέφωνα" to="/c/1/kinita-smartphones.html">
                              <div className="category-card__price">Από 59,90 €</div>
                              <div className="category-card__quantity">3.103 προϊόντα</div>
                            </Link>
                            <div className="category-card__footer">
                              <div className="category-card__footer-inner">
                                <div className="category-card__footer-links">
                                  <Link href="/c/1324/kinita-apple-iphone.html" className="category-card__footer-link" rel="nofollow" title="iPhone">iPhone</Link>
                                  <Link href="/c/34/kinita-samsung.html" className="category-card__footer-link" title="Samsung">Samsung</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-queries__more">
        <Button className="button" data-filters-close="">
          <svg aria-hidden="true" className="icon" width="18" height="18">
            <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-filters-18"></use>
          </svg>
          Περισσότερα
        </Button>
      </div>
    </main>
  );
};

export default Index;
