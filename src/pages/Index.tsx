import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import ProductCarousel from '@/components/ProductCarousel';
import RootCategoryCard from '@/components/RootCategoryCard';
import ScrollableSlider from '@/components/ScrollableSlider';
import { fetchFeaturedProducts, fetchDeals, fetchNewArrivals, getCategories, getRootCategories } from '@/data/mockData';
import { useTranslation } from '@/hooks/useTranslation';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const Index = () => {

  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = '';

  // Check for ad blockers
  const checkAdBlockers = () => {
    const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];
    return adElementsToCheck.some(selector => {
      const adElement = document.createElement('div');
      adElement.className = selector.slice(1);
      document.body.appendChild(adElement);
      const isBlocked = adElement.offsetHeight === 0 || getComputedStyle(adElement).display === 'none';
      document.body.removeChild(adElement);
      return isBlocked;
    });
  };

  const isAdBlocked = checkAdBlockers();

  // Determine device type
  if (userAgent.includes('windows')) {
      classNamesForHtml = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
      classNamesForBody = 'local-cat-images';
  } else if (userAgent.includes('mobile')) {
      classNamesForHtml = 'is-mobile';
      classNamesForBody = 'mobile';
  } else if (userAgent.includes('tablet')) {
      classNamesForHtml = 'is-tablet';
      classNamesForBody = 'tablet';
  } else {
      classNamesForHtml = 'unknown-device';
  }

  // Handle ad blockers
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  // Set JavaScript enabled state
  useEffect(() => {
    const handleLoad = () => {
      setJsEnabled(true);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Add JS enabled/disabled class
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  // Set attributes
  const newIdForBody = ''; // Keeping body ID empty
  const newIdForHtml = 'page-home';

  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dailyDeals, setDailyDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const rootCategories = getRootCategories();
  const categories = getCategories();
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch data on component mount
    setFeaturedProducts(fetchFeaturedProducts());
    setDailyDeals(fetchDeals());
    setNewArrivals(fetchNewArrivals());
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get('email') as string;
    
    if (email) {
      toast({
        title: "Newsletter Subscription",
        description: "Thank you for subscribing to our newsletter!",
      });
      form.reset();
    }
  };

  return (
    <div className="root__wrapper">
        <div className="root">
          <div className="sections">
            <div className="h-categories">
              <div className="h-header">
                <div className="h-header__hgroup">
                  <div className="section__title">Δημοφιλείς κατηγορίες</div>
                </div>

                <div className="h-header__more-wrapper">
                  <div className="h-categories__verticals">
                    <Link data-id="deals" to="/deals?bpref=home-verticals">
                      <svg aria-hidden="true" className="icon" width="16" height="16"><path d="M5.31495 0C6.35344 0.642754 7.33417 1.41701 8.04328 2.42354C9.05473 3.81105 9.54018 5.55252 9.43203 7.26325C10.0305 6.84171 10.4484 6.16085 10.4324 5.41365C11.3922 6.8749 12.0227 8.59668 12.1173 10.3529C12.2268 11.9777 11.5791 13.6343 10.382 14.7404C9.8081 15.3069 9.08669 15.6977 8.33947 15.989C8.86915 15.5404 9.37795 15.0292 9.60285 14.3556C9.97892 13.3184 9.80686 12.1164 9.20713 11.1972C8.70447 10.4082 8.02731 9.7298 7.64386 8.86584C7.36735 8.27715 7.26535 7.6258 7.24937 6.98058C6.31166 7.72412 5.66153 8.80807 5.44031 9.9842C5.26457 10.7744 5.29038 11.5905 5.37149 12.3906C4.52349 11.9936 4.14866 10.9981 4.30105 10.1108C3.5649 11.2402 3.12123 12.6338 3.38915 13.982C3.56612 14.8165 4.13268 15.4864 4.78773 16C3.27978 15.4347 1.97829 14.2733 1.39575 12.753C0.759141 11.1603 0.906619 9.2886 1.72266 7.7868C2.4797 6.38453 3.68534 5.2846 4.43378 3.87619C5.08759 2.69884 5.342 1.33713 5.31495 0V0Z"/></svg> 
                      {t('deals')}
                    </Link>
                    {categories.map(category => (
                      <Link key={category.id} to={`/cat/${category.id}/${category.slug}.html?bpref=home-verticals`}>{t(category.name)}</Link>
                    ))}
                  </div>
                  <div className="h-header__more pressable">
                    <svg aria-hidden="true" className="icon" width="12" height="12"><use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-hamburger-12"></use></svg>
                    <span className="h-header__more-label">Όλες</span>
                    <svg aria-hidden="true" className="icon" width="20" height="20"><use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-right-20"></use></svg>
                  </div>
                </div>
                
              </div>

              <div className="h-categories__list">
                <Link to="/deals?bpref=home-categories" className="h-categories__category h-categories__category--deals" title="Προσφορές">
                  <div className="h-categories__cover">
                    <div className="h-categories__badge drop drop--40">233 Νέες</div>
                      <img alt="Deals icon" className="h-categories__image" src="//bp.pstatic.gr/images/flame.svg"/>
                    </div>
                    <h2 className="h-categories__label">{t('deals')}</h2>
                </Link>
                {rootCategories.map(rootCategory => (
                  <Link key={rootCategory.id} to={`/cat/${rootCategory.id}/${rootCategory.slug}.html?bpref=home-categories`} className="h-categories__category" title={rootCategory.name}>
                    <div className="h-categories__cover">
                      <img width="125" height="125" alt={`${rootCategory.name} στο BestPrice`} src={rootCategory.image} />
                    </div>
                    <h2 className="h-categories__label">{rootCategory.name}</h2>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="giveaway__wrapper">
              <div className="giveaway-optOut-section february" id="giveawayPromo" role="button">
                <div className="information-section">
                  <img loading="lazy" src="//www.bestprice.gr/pages/home/plugins/giveaway/April/calendar.svg" alt="calendar"/>
                  <div className="information-optout">
                    <div className="information-title">Κλήρωση Απριλίου</div>
                    <div className="text">Αξιολόγησε και κέρδισε 500€!</div>
                    </div>
                  </div>
                <div className="actions">
                  <div className="hint">1 αξιολόγηση = 1 συμμετοχή</div>
                  <div className="cta" id="enterGiveaway">MΠΕΣ ΣΤΗΝ ΚΛΗΡΩΣΗ!</div>
                  </div>
                </div>
            </div>

            <div className="h-deals">
              <div className="h-deals__aside">
                <img width="34" height="42" alt="Deals icon" className="h-deals__icon" src="//bp.pstatic.gr/images/flame.svg"/>
                <div className="h-header">
                  <div className="h-header__hgroup">
                    <h2 className="section__title">
                      <Link to="/deals?bpref=home-deals-header">Προσφορές της ημέρας</Link>
                    </h2>
                    <div className="section__subtitle">6.367 πραγματικές προσφορές</div>
                  </div>
                  <Link title="Όλες οι προσφορές στο BestPrice" to="/deals?bpref=home-deals-more" className="h-header__more">
                    <span className="h-header__more-label">Όλες</span>
                    <svg aria-hidden="true" className="icon" width="20" height="20"><use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-right-20"></use></svg>
                  </Link>
                </div>
                <Link to="/deals?bpref=home-deals-all" className="button h-deals__button">Όλες οι προσφορές</Link>
                <div className="h-deals__links">
                  <Link to="/deals/c?bpref=home-deals-c" className="h-deals__button--c">Προσφορές ανά κατηγορία</Link>
                  <Link to="/deals/m?bpref=home-deals-s" className="h-deals__button--s">Προσφορές ανά κατάστημα</Link>
                </div>
              </div>
              <div className="h-deals__main">
                <ScrollableSlider>
                  <div className="p__products--scroll scroll__content">
                    {dailyDeals.map(deal => (
                      <div key={deal.id} data-id={deal.id} data-cid={deal.cid} data-price={deal.price} className="p p--deal p--top-padding">
                        <div className="p__actions" data-js="">
                          <div className="p__action" role="button" aria-label="All product actions">
                            <svg aria-hidden="true" className="icon" width="100%" height="100%">
                              <path xmlns="http://www.w3.org/2000/svg" d="M2 4C3.10457 4 4 3.10457 4 2 4 .89543 3.10457 0 2 0 .89543 0 0 .89543 0 2 0 3.10457.89543 4 2 4ZM2 11C3.10457 11 4 10.1046 4 9 4 7.89543 3.10457 7 2 7 .89543 7 0 7.89543 0 9 0 10.1046.89543 11 2 11ZM2 18C3.10457 18 4 17.1046 4 16 4 14.8954 3.10457 14 2 14 .89543 14 0 14.8954 0 16 0 17.1046.89543 18 2 18Z"/>
                            </svg>
                          </div>
                        </div>
                        <Link className="p__cover" to={`/item/${deal.id}/${deal.slug}`} rel="nofollow">
                          <img width="160" height="160" alt={deal.title} src={deal.image} />
                        </Link>
                        <div className="p__main">
                          <div className="p__meta">
                            <div className="p__category">
                              <Link to={`/cat/${deal.cid}`}>{deal.category}</Link>
                            </div>
                            <h3 className="p__title p__title--lines p__title--lines-2">
                              <Link to={`/item/${deal.id}`} title={deal.title}>{deal.title}</Link>
                            </h3>
                          </div>
                          <div className="p__badges">
                            <div className="p__badges-drop">
                              <div className="p__badge p__badge--drop drop drop--10">{deal.discount}</div>
                            </div>
                          </div>
                        </div>
                        <div className="p__footer">
                          <div className="p__price-merchants">
                            <Link className="p__price" to={`/item/${deal.id}`}>
                              <div className="p__price--current">{deal.price}€</div>
                              <del className="p__price--before">{deal.originalPrice}€</del>
                            </Link>
                            <div className="p__merchants">{deal.merchantsCount} καταστήματα</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollableSlider>
              </div>
            </div>

            <div className="h-content">
              <div className="h-header" style={{display: "grid"}}>
                <div className="h-header__hgroup">
                  <div className="section__title">Άρθρα & Οδηγοί αγοράς</div>
                </div>
                <Link to="/blog?bpref=home-content-more" className="h-header__more">
                  <span className="h-header__more-label">Περισσότερα άρθρα</span>
                  <svg aria-hidden="true" className="icon" width="20" height="20"><path xmlns="http://www.w3.org/2000/svg" d="M16.25 10C16.2503 10.2726 16.1925 10.5421 16.0804 10.7906C15.9684 11.039 15.8046 11.2607 15.6 11.4409L6.30667 19.6167C5.99871 19.8751 5.60187 20.0028 5.20101 19.9724C4.80015 19.942 4.42708 19.756 4.16158 19.4541C3.89607 19.1523 3.75921 18.7585 3.78025 18.3571C3.80129 17.9556 3.97856 17.5783 4.27417 17.3059L12.4008 10.1567C12.4231 10.1371 12.441 10.113 12.4533 10.086C12.4655 10.059 12.4718 10.0297 12.4718 10C12.4718 9.97036 12.4655 9.94104 12.4533 9.91402C12.441 9.887 12.4231 9.86291 12.4008 9.84336L4.27417 2.69419C3.97856 2.42174 3.80129 2.04444 3.78025 1.64298C3.75921 1.24152 3.89607 0.847761 4.16158 0.545899C4.42708 0.244037 4.80015 0.0580321 5.20101 0.0276573C5.60187 -0.0027174 5.99871 0.124949 6.30667 0.383358L15.5967 8.55669C15.8017 8.73714 15.9661 8.95917 16.0787 9.20803C16.1913 9.45688 16.2497 9.72686 16.25 10Z"/></svg>
                </Link>
              </div>
              {/* Placeholder for articles */}
              <div className="h-content__placeholder" data-intersected="">
                <div className="scroll scroll--no-scrolling">
                  <div className="scroll__clip" style={{overflow: "hidden"}}>
                    <div className="scroll__scroller">
                      <div className="scroll__content">
                        {/* Populate dynamically with articles */}
                        <div className="h-content__posts scroll__child">
                          {/* Example article links */}
                          <Link target="_blank" className="h-content__post" to="/blog/292/protaseis-pasxalines-lampades-paidikes?bpref=home-content">
                            <div className="h-content__badge">Νέο</div>
                            <div className="h-content__cover">
                              <img src="//bbpcdn.pstatic.gr/bpimg130/blog2902_SX640/1709715959/image.webp" />
                            </div>
                            <div className="h-content__meta">
                              <h4 className="h-content__title">Πάσχα 2025: Προτάσεις για αγορά λαμπάδας</h4>
                            </div>
                          </Link>
                          {/* Add more articles here following the format */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link className="h-button--more-mobile button button--outline" to="/blog?bpref=home-content-more">Περισσότερα άρθρα <svg aria-hidden="true" className="icon" width="8" height="8"><use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-right-8"></use></svg></Link>
            </div>

            <div className="h-direct-deals__placeholder" data-intersected style={{display: "contents"}}>
              <section className="section kuy1g9IZ7hrtBd1FQ_Xz">
                <header className="section__header">
                  <hgroup className="section__hgroup">
                    <h2 className="section__title">Επιλεγμένες Hot προσφορές!</h2>
                    <p className="section__subtitle">Μοναδικές προσφορές από επιλεγμένα καταστήματα που δεν πρέπει να χάσεις</p>
                  </hgroup>
                </header>
                <div className="p__products">
                  <div className="p p--deal p--top-padding">
                    <Link className="p__cover" rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" to="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal">
                      <img width="220" height="220" loading="lazy" alt="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" srcSet="//bbpcdn.pstatic.gr/bpimg43/2maCv1/1SHu88_SX440Y440/1724418904014/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.webp 2x" src="//bbpcdn.pstatic.gr/bpimg43/2maCv1/1SHu88_SX220Y220/1724418904014/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.webp"/>
                    </Link>
                    <div className="p__main">
                      <div className="p__badges">
                        <div className="p__badges-drop">
                          <div className="p__badge p__badge--drop drop drop--10">-17%</div>
                        </div>
                      </div>
                      <div className="p__meta">
                        <div className="p__category">
                          <Link to="/cat/2485/psygeia.html?deals=1">Ψυγεία</Link>
                        </div>
                        <h3 className="p__title p__title--lines p__title--lines-3">
                          <Link rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" to="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal">Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox</Link>
                        </h3>
                      </div>
                    </div>
                    <div className="p__footer">
                      <div className="p__price-merchants">
                        <Link className="p__price" rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" to="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal">
                          <div className="p__price--current">699,00€</div>
                          <del className="p__price--before">842,17€</del>
                        </Link>
                      </div>
                    </div>
                    <div className="p p--deal p--top-padding">
                      <Link className="p__cover" rel="nofollow" title="Nike Air Max Pre-Day Γυναικεία Sneakers Πολύχρωμα DH5111-100" to="/to/97700177/nike-air-max-pre-day-gynaikeia-sneakers-polyxrwma-dh5111-100.html?bpref=direct-deal">
                        <img width="220" height="220" loading="lazy" alt="Nike Air Max Pre-Day Γυναικεία Sneakers Πολύχρωμα DH5111-100" srcSet="//bbpcdn.pstatic.gr/bpimg59/7qi5t/1Twbne_SX440Y440/1736501532879/nike-air-max-pre-day-gynaikeia-sneakers-polyxrwma-dh5111-100.webp 2x" src="//bbpcdn.pstatic.gr/bpimg59/7qi5t/1Twbne_SX220Y220/1736501532879/nike-air-max-pre-day-gynaikeia-sneakers-polyxrwma-dh5111-100.webp"/>
                      </Link>
                      <div className="p__main">
                        <div className="p__badges">
                          <div className="p__badges-drop">
                            <div className="p__badge p__badge--drop drop drop--10">-17%</div>
                          </div>
                        </div>
                        <div className="p__meta">
                          <div className="p__category">
                            <Link to="/cat/6385/gynaikeia-sneakers.html?deals=1">Γυναικεία Sneakers</Link>
                          </div>
                          <h3 className="p__title p__title--lines p__title--lines-3">
                            <Link rel="nofollow" title="Nike Air Max Pre-Day Γυναικεία Sneakers Πολύχρωμα DH5111-100" to="/to/97700177/nike-air-max-pre-day-gynaikeia-sneakers-polyxrwma-dh5111-100.html?bpref=direct-deal">Nike Air Max Pre-Day Γυναικεία Sneakers Πολύχρωμα DH5111-100</Link>
                          </h3>
                        </div>
                      </div>
                      <div className="p__footer">
                        <div className="p__price-merchants">
                          <Link className="p__price" rel="nofollow" title="Nike Air Max Pre-Day Γυναικεία Sneakers Πολύχρωμα DH5111-100" to="/to/97700177/nike-air-max-pre-day-gynaikeia-sneakers-polyxrwma-dh5111-100.html?bpref=direct-deal">
                            <div className="p__price--current">71,99€</div>
                            <del className="p__price--before">86,73€</del>
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Continue adding other products and structure here */}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-collections">
              <div className="h-header" style={{display: "grid"}}>
                <div className="h-header__hgroup">
                  <div className="section__title">Συλλογές προϊόντων</div>
                </div>
              </div>
              <div className="h-collections__placeholder" data-intersected="">
                <div className="DoZFzTt6KaqcW2C3gw2t">
                  {/* Example Collections */}
                  <Link className="Y4NLSAY5tJd6NM7ZZnoK" to="/c/1803778568/aneta-monterna-sneakers?bpref=home-collections">
                    <div className="eJJfcJGMERkC8cUwtBAQ">
                      <img src="//bbpcdn.pstatic.gr/bpnr/col-cover-1803778568_SX1500/1742568970000/image.webp" />
                    </div>
                    <div className="vY_GAVOV_4RJVMS2Jnwa">
                      <div className="KPsLBbDojFvSNOuoGGgZ">
                        <div className="mu8Mka6gDRf3IQi7hjZl">Άνετα & μοντέρνα sneakers</div>
                        <div className="_fFxn4UZX01WynYoh8dR">Για βαφτιστήρια 3-6 ετών.</div>
                      </div>
                      <div className="p9jwLTCU71n4bBVTVAMW">Δες την</div>
                    </div>
                  </Link>
                  {/* Repeat for other collections */}
                </div>
              </div>
            </div>
            
            <section className="section h-queries">
              <header className="section__header"><div className="section__hgroup"><div className="section__title">Δημοφιλείς αναζητήσεις</div></div></header>
              <div className="h-queries__list">
                <Link to="/search?q=iphone%2016&amp;bpref=home-queries" className="h-queries__q" title="iPhone 16">iPhone 16</Link>
                <Link title="iPhone 16 Pro Max" to="/search?q=iphone%2016%20pro%20max&amp;bpref=home-queries" className="h-queries__q">iPhone 16 Pro Max</Link><Link title="Samsung Galaxy S25 Ultra" to="/search?q=samsung%20galaxy%20s25%20ultra&amp;bpref=home-queries" className="h-queries__q">Samsung Galaxy S25 Ultra</Link><Link title="Xiaomi 15 Ultra" to="/search?q=xiaomi%2015%20ultra&amp;bpref=home-queries" className="h-queries__q">Xiaomi 15 Ultra</Link><Link title="PS5" to="/search?q=ps5&amp;bpref=home-queries" className="h-queries__q">PS5</Link><Link title="RX 9070 XT" to="/search?q=rx%209070%20xt&amp;bpref=home-queries" className="h-queries__q">RX 9070 XT</Link><Link title="iPhone 15" to="/search?q=iphone%2015&amp;bpref=home-queries" className="h-queries__q">iPhone 15</Link><Link title="Jordan 4" to="/search?q=jordan%204&amp;bpref=home-queries" className="h-queries__q">Jordan 4</Link><Link title="iPhone 13" to="/search?q=iphone%2013&amp;bpref=home-queries" className="h-queries__q">iPhone 13</Link><Link title="Samsung Galaxy S25" to="/search?q=samsung%20galaxy%20s25&amp;bpref=home-queries" className="h-queries__q">Samsung Galaxy S25</Link><Link title="Samsung a56" to="/search?q=samsung%20a56&amp;bpref=home-queries" className="h-queries__q">Samsung a56</Link><Link title="iPhone 16 Pro" to="/search?q=iphone%2016%20pro&amp;bpref=home-queries" className="h-queries__q">iPhone 16 Pro</Link><Link title="New Balance 9060" to="/search?q=new%20balance%209060&amp;bpref=home-queries" className="h-queries__q">New Balance 9060</Link><Link title="Γυαλιά ηλίου" to="/search?q=%CE%B3%CF%85%CE%B1%CE%BB%CE%B9%CE%B1%20%CE%B7%CE%BB%CE%B9%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Γυαλιά ηλίου</Link><Link title="Nike TN" to="/search?q=nike%20tn&amp;bpref=home-queries" className="h-queries__q">Nike TN</Link><Link title="New Balance 530" to="/search?q=new%20balance%20530&amp;bpref=home-queries" className="h-queries__q">New Balance 530</Link><Link title="Poco X7 Pro" to="/search?q=poco%20x7%20pro&amp;bpref=home-queries" className="h-queries__q">Poco X7 Pro</Link><Link title="Nike Air Force" to="/search?q=nike%20air%20force&amp;bpref=home-queries" className="h-queries__q">Nike Air Force</Link><Link title="iPhone 14" to="/search?q=iphone%2014&amp;bpref=home-queries" className="h-queries__q">iPhone 14</Link><Link title="Samsung S24 Ultra" to="/search?q=samsung%20s24%20ultra&amp;bpref=home-queries" className="h-queries__q">Samsung S24 Ultra</Link><Link title="Κλιματιστικά" to="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά</Link><Link title="Nike Air Max" to="/search?q=nike%20air%20max&amp;bpref=home-queries" className="h-queries__q">Nike Air Max</Link><Link title="iPhone 15 Pro Max" to="/search?q=iphone%2015%20pro%20max&amp;bpref=home-queries" className="h-queries__q">iPhone 15 Pro Max</Link><Link title="Air fryer" to="/search?q=air%20fryer&amp;bpref=home-queries" className="h-queries__q">Air fryer</Link><Link title="iPhone" to="/search?q=iphone&amp;bpref=home-queries" className="h-queries__q">iPhone</Link><Link title="AirPods" to="/search?q=airpods&amp;bpref=home-queries" className="h-queries__q">AirPods</Link><Link title="Ψυγειοκαταψύκτες" to="/search?q=%CF%88%CF%85%CE%B3%CE%B5%CE%B9%CE%BF%CE%BA%CE%B1%CF%84%CE%B1%CF%88%CF%85%CE%BA%CF%84%CE%B5%CF%82&amp;bpref=home-queries" className="h-queries__q">Ψυγειοκαταψύκτες</Link><Link title="Smartwatch" to="/search?q=smartwatch&amp;bpref=home-queries" className="h-queries__q">Smartwatch</Link><Link title="Laptop" to="/search?q=laptop&amp;bpref=home-queries" className="h-queries__q">Laptop</Link><Link title="Apple Watch" to="/search?q=apple%20watch&amp;bpref=home-queries" className="h-queries__q">Apple Watch</Link><Link title="iPhone 14 Pro Max" to="/search?q=iphone%2014%20pro%20max&amp;bpref=home-queries" className="h-queries__q">iPhone 14 Pro Max</Link><Link title="Πλυντήριο ρούχων" to="/search?q=%CF%80%CE%BB%CF%85%CE%BD%CF%84%CE%B7%CF%81%CE%B9%CE%BF%20%CF%81%CE%BF%CF%85%CF%87%CF%89%CE%BD&amp;bpref=home-queries" className="h-queries__q">Πλυντήριο ρούχων</Link><Link title="iPad" to="/search?q=ipad&amp;bpref=home-queries" className="h-queries__q">iPad</Link><Link title="iPhone 15 Pro" to="/search?q=iphone%2015%20pro&amp;bpref=home-queries" className="h-queries__q">iPhone 15 Pro</Link><Link title="Xiaomi Redmi Note 14 Pro" to="/search?q=xiaomi%20redmi%20note%2014%20pro&amp;bpref=home-queries" className="h-queries__q">Xiaomi Redmi Note 14 Pro</Link><Link title="New Balance 530" to="/search?q=new%20balance%20530&amp;bpref=home-queries" className="h-queries__q">New Balance 530</Link><Link title="Αντλίες θερμότητας" to="/search?q=%CE%B1%CE%BD%CF%84%CE%BB%CE%B9%CE%B5%CF%82%20%CE%B8%CE%B5%CF%81%CE%BC%CE%BF%CF%84%CE%B7%CF%84%CE%B1%CF%82&amp;bpref=home-queries" className="h-queries__q">Αντλίες θερμότητας</Link><Link title="Χαλιά σαλονιού" to="/search?q=%CF%87%CE%B1%CE%BB%CE%B9%CE%B1%20%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%B9%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Χαλιά σαλονιού</Link><Link title="Xiaomi redmi note 13 pro" to="/search?q=xiaomi%20redmi%20note%2013%20pro&amp;bpref=home-queries" className="h-queries__q">Xiaomi redmi note 13 pro</Link><Link title="Air Condition" to="/search?q=air%20condition&amp;bpref=home-queries" className="h-queries__q">Air Condition</Link><Link title="Nike Air Force 1" to="/search?q=nike%20air%20force%201&amp;bpref=home-queries" className="h-queries__q">Nike Air Force 1</Link><Link title="iPhone 11" to="/search?q=iphone%2011&amp;bpref=home-queries" className="h-queries__q">iPhone 11</Link><Link title="Ποδοσφαιρικά παπούτσια" to="/search?q=%CF%80%CE%BF%CE%B4%CE%BF%CF%83%CF%86%CE%B1%CE%B9%CF%81%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Ποδοσφαιρικά παπούτσια</Link><Link title="Macbook" to="/search?q=macbook&amp;bpref=home-queries" className="h-queries__q">Macbook</Link><Link title="Κλιματιστικά 9000 BTU" to="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%209000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 9000 BTU</Link><Link title="Φορητά κλιματιστικά" to="/search?q=%CF%86%CE%BF%CF%81%CE%B7%CF%84%CE%B1%20%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1&amp;bpref=home-queries" className="h-queries__q">Φορητά κλιματιστικά</Link><Link title="Air cooler" to="/search?q=air%20cooler&amp;bpref=home-queries" className="h-queries__q">Air cooler</Link><Link title="Σκηνή κάμπινγκ	" to="/search?q=%CF%83%CE%BA%CE%B7%CE%BD%CE%B7%20%CE%BA%CE%B1%CE%BC%CF%80%CE%B9%CE%BD%CE%B3%CE%BA&amp;bpref=home-queries" className="h-queries__q">Σκηνή κάμπινγκ	</Link><Link title="Κλιματιστικά 12000 BTU" to="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%2012000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 12000 BTU</Link><Link title="Γυναικεία πέδιλα" to="/search?q=%CE%B3%CF%85%CE%BD%CE%B1%CE%B9%CE%BA%CE%B5%CE%B9%CE%B1%20%CF%80%CE%B5%CE%B4%CE%B9%CE%BB%CE%B1&amp;bpref=home-queries" className="h-queries__q">Γυναικεία πέδιλα</Link><Link title="Κλιματιστικά 18000 BTU" to="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%2018000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 18000 BTU</Link><Link title="Smartphone" to="/search?q=smartphone&amp;bpref=home-queries" className="h-queries__q">Smartphone</Link><Link title="Καρεκλάκια παραλίας" to="/search?q=%CE%BA%CE%B1%CF%81%CE%B5%CE%BA%CE%BB%CE%B1%CE%BA%CE%B9%CE%B1%20%CF%80%CE%B1%CF%81%CE%B1%CE%BB%CE%B9%CE%B1%CF%82&amp;bpref=home-queries" className="h-queries__q">Καρεκλάκια παραλίας</Link><Link title="Αντηλιακά" to="/search?q=%CE%B1%CE%BD%CF%84%CE%B7%CE%BB%CE%B9%CE%B1%CE%BA%CE%B1&amp;bpref=home-queries" className="h-queries__q">Αντηλιακά</Link><Link title="Sneakers" to="/search?q=sneakers&amp;bpref=home-queries" className="h-queries__q">Sneakers</Link><Link title="Nike Air Jordan 1" to="/search?q=nike%20air%20jordan%201&amp;bpref=home-queries" className="h-queries__q">Nike Air Jordan 1</Link><Link title="PS5 Slim" to="/search?q=ps5%20slim&amp;bpref=home-queries" className="h-queries__q">PS5 Slim</Link><Link title="Nike Air Max 97" to="/search?q=nike%20air%20max%2097&amp;bpref=home-queries" className="h-queries__q">Nike Air Max 97</Link><Link title="Smart TV" to="/search?q=smart%20tv&amp;bpref=home-queries" className="h-queries__q">Smart TV</Link><Link title="Ανεμιστήρες οροφής" to="/search?q=%CE%B1%CE%BD%CE%B5%CE%BC%CE%B9%CF%83%CF%84%CE%B7%CF%81%CE%B5%CF%82%20%CE%BF%CF%81%CE%BF%CF%86%CE%B7%CF%82&amp;bpref=home-queries" className="h-queries__q">Ανεμιστήρες οροφής</Link><Link title="Παιδικά παπούτσια" to="/search?q=%CF%80%CE%B1%CE%B9%CE%B4%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Παιδικά παπούτσια</Link><Link title="Samsung Galaxy A54" to="/search?q=samsung%20galaxy%20a54&amp;bpref=home-queries" className="h-queries__q">Samsung Galaxy A54</Link><Link title="Ανεμιστήρες δαπέδου" to="/search?q=%CE%B1%CE%BD%CE%B5%CE%BC%CE%B9%CF%83%CF%84%CE%B7%CF%81%CE%B5%CF%82%20%CE%B4%CE%B1%CF%80%CE%B5%CE%B4%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Ανεμιστήρες δαπέδου</Link><Link title="Κλιματιστικά 24000 BTU" to="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%2024000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 24000 BTU</Link><Link title="Παιχνίδια" to="/search?q=%CF%80%CE%B1%CE%B9%CF%87%CE%BD%CE%B9%CE%B4%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Παιχνίδια</Link><Link title="Nintendo Switch" to="/search?q=nintendo%20switch&amp;bpref=home-queries" className="h-queries__q">Nintendo Switch</Link><Link title="Καφετιέρα espresso
" to="/search?q=%CE%BA%CE%B1%CF%86%CE%B5%CF%84%CE%B9%CE%B5%CF%81%CE%B1%20espresso&amp;bpref=home-queries" className="h-queries__q">Καφετιέρα espresso
</Link><Link title="Αθλητικά παπουτσια" to="/search?q=%CE%B1%CE%B8%CE%BB%CE%B7%CF%84%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Αθλητικά παπουτσια</Link><Link title="Ισιωτική μαλλιών" to="/search?q=%CE%B9%CF%83%CE%B9%CF%89%CF%84%CE%B9%CE%BA%CE%B7%20%CE%BC%CE%B1%CE%BB%CE%BB%CE%B9%CF%89%CE%BD&amp;bpref=home-queries" className="h-queries__q">Ισιωτική μαλλιών</Link><Link title="Παιδικά παπούτσια" to="/search?q=%CF%80%CE%B1%CE%B9%CE%B4%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Παιδικά παπούτσια</Link><Link title="Αλυσοπρίονο μπαταρίας" to="/search?q=%CE%B1%CE%BB%CF%85%CF%83%CE%BF%CF%80%CF%81%CE%B9%CE%BF%CE%BD%CE%BF%20%CE%BC%CF%80%CE%B1%CF%84%CE%B1%CF%81%CE%B9%CE%B1%CF%82&amp;bpref=home-queries" className="h-queries__q">Αλυσοπρίονο μπαταρίας</Link><Link title="Καναπές κρεβάτι" to="/search?q=%CE%BA%CE%B1%CE%BD%CE%B1%CF%80%CE%B5%CF%82%20%CE%BA%CF%81%CE%B5%CE%B2%CE%B1%CF%84%CE%B9&amp;bpref=home-queries" className="h-queries__q">Καναπές κρεβάτι</Link><Link title="Airpods Pro" to="/search?q=airpods%20pro&amp;bpref=home-queries" className="h-queries__q">Airpods Pro</Link><Link title="Γωνιακός καναπές" to="/search?q=%CE%B3%CF%89%CE%BD%CE%B9%CE%B1%CE%BA%CE%BF%CF%82%20%CE%BA%CE%B1%CE%BD%CE%B1%CF%80%CE%B5%CF%82&amp;bpref=home-queries" className="h-queries__q">Γωνιακός καναπές</Link><Link title="PS5 controller" to="/search?q=ps5%20controller&amp;bpref=home-queries" className="h-queries__q">PS5 controller</Link><Link title="Πολυθρόνα κρεβάτι" to="/search?q=%CF%80%CE%BF%CE%BB%CF%85%CE%B8%CF%81%CE%BF%CE%BD%CE%B1%20%CE%BA%CF%81%CE%B5%CE%B2%CE%B1%CF%84%CE%B9&amp;bpref=home-queries" className="h-queries__q">Πολυθρόνα κρεβάτι</Link><Link title="Birkenstock" to="/search?q=birkenstock&amp;bpref=home-queries" className="h-queries__q">Birkenstock</Link><Link title="Αλυσίδες χιονιού" to="/search?q=%CE%B1%CE%BB%CF%85%CF%83%CE%B9%CE%B4%CE%B5%CF%82%20%CF%87%CE%B9%CE%BF%CE%BD%CE%B9%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Αλυσίδες χιονιού</Link></div></section>
          </div>
        </div>
      </div>
  );
};

export default Index;
