
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Zap,
  TrendingUp,
  Star
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { products, categories } from '@/data/mockData';

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const popularCategories = categories.slice(0, 8);

  return (
    <div className="flex-1">
      <div className="root__wrapper">
        <div className="root">
          <div class="sections">
            <div class="h-categories">
              <div class="h-header">
                <div class="h-header__hgroup">
                  <div class="section__title">Δημοφιλείς κατηγορίες</div>
                </div>

                <div class="h-header__more-wrapper">
                  <div class="h-categories__verticals">
                    <a data-id="deals" href="/deals?bpref=home-verticals">
                      <svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-flame-16"></use></svg> 
                      Προσφορές
                    </a>
                    <a href="/cat/6989/technology.html?bpref=home-verticals">Τεχνολογία</a>
                    <a href="/cat/2185/home-garden.html?bpref=home-verticals">Σπίτι &amp; Κήπος</a>
                    <a href="/cat/2068/fashion.html?bpref=home-verticals">Μόδα</a>
                    <a href="/cat/583/health-beauty.html?bpref=home-verticals">Υγεία &amp; Ομορφιά</a>
                    <a href="/cat/2175/paidika-brefika.html?bpref=home-verticals">Παιδικά - Βρεφικά</a>
                    <a href="/cat/3058/sports-hobbies.html?bpref=home-verticals">Hobby, Αθλητισμός</a>
                    <a href="/cat/3204/auto-moto.html?bpref=home-verticals">Μηχανοκίνηση</a>
                  </div>
                  <div class="h-header__more pressable">
                    <svg aria-hidden="true" class="icon" width="12" height="12"><use xlink:href="/public/dist/images/icons/icons.svg#icon-hamburger-12"></use></svg>
                    <span class="h-header__more-label">Όλες</span>
                    <svg aria-hidden="true" class="icon" width="20" height="20"><use xlink:href="/public/dist/images/icons/icons.svg#icon-right-20"></use></svg>
                  </div>
                </div>
                
              </div>

              <div class="h-categories__list">
                <a href="/deals?bpref=home-categories" class="h-categories__category h-categories__category--deals" title="Προσφορές">
                  <div class="h-categories__cover">
                    <div class="h-categories__badge drop drop--40">233 Νέες</div>
                      <img width="34" height="42" alt="Deals icon" class="h-categories__image" src="//bp.pstatic.gr/images/flame.svg"/>
                    </div><h2 class="h-categories__label">Προσφορές</h2>
                </a>
                <a href="/cat/806/mobile-phones.html?bpref=home-categories" class="h-categories__category" title="Κινητά">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Κινητά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/806-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/806-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Κινητά</h2>
                </a>
                <a href="/hub/25/iphone.html?bpref=home-categories" class="h-categories__category" title="iPhone">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="iPhone στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/misc/hub25-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/misc/hub25-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">iPhone</h2>
                </a>
                <a href="/cat/3048/thleoraseis.html?bpref=home-categories" class="h-categories__category" title="Τηλεοράσεις">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Τηλεοράσεις στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/3048-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/3048-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Τηλεοράσεις</h2>
                </a>
                <a href="/cat/2442/air-condition.html?bpref=home-categories" class="h-categories__category" title="Κλιματιστικά">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Κλιματιστικά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2442-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2442-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Κλιματιστικά</h2>
                </a>
                <a href="/cat/6280/smartwatches.html?bpref=home-categories" class="h-categories__category" title="Smartwatches">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Smartwatches στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6280-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6280-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Smartwatches</h2>
                </a>
                <a href="/cat/6385/gynaikeia-sneakers.html?bpref=home-categories" class="h-categories__category" title="Γυναικεία Sneakers">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Γυναικεία Sneakers στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6385-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6385-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Γυναικεία Sneakers</h2>
                </a>
                <a href="/cat/3056/gialia-iliou.html?bpref=home-categories" class="h-categories__category" title="Γυαλιά Ηλίου">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Γυαλιά Ηλίου στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/3056-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/3056-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Γυαλιά Ηλίου</h2>
                </a>
                <a href="/cat/2613/kartes-grafikwn.html?bpref=home-categories" class="h-categories__category" title="GPU">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="GPU στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2613-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2613-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">GPU</h2>
                </a>
                <a href="/cat/2591/laptops.html?bpref=home-categories" class="h-categories__category" title="Laptops">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Laptops στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2591-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2591-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Laptops</h2>
                </a>
                <a href="/cat/6025/kremes-prosopou.html?bpref=home-categories" class="h-categories__category" title="Κρέμες Προσώπου">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Κρέμες Προσώπου στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6025-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6025-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Κρέμες Προσώπου</h2>
                </a>
                <a href="/cat/2485/psigeia.html?bpref=home-categories" class="h-categories__category" title="Ψυγεία">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Ψυγεία στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2485-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2485-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Ψυγεία</h2>
                </a>
                <a href="/cat/2492/plyntiria-rouxwn.html?bpref=home-categories" class="h-categories__category" title="Πλυντήρια Ρούχων">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Πλυντήρια Ρούχων στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2492-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2492-1@2x.webp 2x" class="h-categories__image"/>
                  </div><h2 class="h-categories__label">Πλυντήρια Ρούχων</h2>
                </a>
                <a href="/cat/6846/skoupes-stick.html?bpref=home-categories" class="h-categories__category" title="Σκούπες Stick">
                  <div class="h-categories__cover">
                    <img width="125" height="125" alt="Σκούπες Stick στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6846-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6846-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Σκούπες Stick</h2></a><a href="/cat/3446/tablets.html?bpref=home-categories" class="h-categories__category" title="Tablets"><div class="h-categories__cover"><img width="125" height="125" alt="Tablets στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/3446-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/3446-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Tablets</h2></a><a href="/cat/7124/antiiliaka.html?bpref=home-categories" class="h-categories__category" title="Αντηλιακά"><div class="h-categories__cover"><img width="125" height="125" alt="Αντηλιακά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/7124-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/7124-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Αντηλιακά</h2></a><a href="/cat/6670/andrika-sneakers.html?bpref=home-categories" class="h-categories__category" title="Ανδρικά Sneakers"><div class="h-categories__cover"><img width="125" height="125" alt="Ανδρικά Sneakers στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6670-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6670-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Ανδρικά Sneakers</h2></a><a href="/cat/6843/skoupes-robot.html?bpref=home-categories" class="h-categories__category" title="Σκούπες Ρομπότ"><div class="h-categories__cover"><img width="125" height="125" alt="Σκούπες Ρομπότ στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6843-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6843-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Σκούπες Ρομπότ</h2></a><a href="/cat/2421/xortokoptika.html?bpref=home-categories" class="h-categories__category" title="Χορτοκοπτικά"><div class="h-categories__cover"><img width="125" height="125" alt="Χορτοκοπτικά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2421-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2421-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Χορτοκοπτικά</h2></a><a href="/cat/848/andrika-rologia.html?bpref=home-categories" class="h-categories__category" title="Ανδρικά Ρολόγια"><div class="h-categories__cover"><img width="125" height="125" alt="Ανδρικά Ρολόγια στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/848-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/848-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Ανδρικά Ρολόγια</h2></a><a href="/cat/5925/pasxalines-lampades.html?bpref=home-categories" class="h-categories__category" title="Λαμπάδες"><div class="h-categories__cover"><img width="125" height="125" alt="Λαμπάδες στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/5925-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/5925-1@2x.webp 2x" class="h-categories__image"/></div><h2 class="h-categories__label">Λαμπάδες</h2></a>
              </div>
            </div>
            
            <div class="giveaway__wrapper">
              <div class="giveaway-optOut-section february" id="giveawayPromo" role="button">
                <div class="information-section">
                  <img loading="lazy" src="//www.bestprice.gr/pages/home/plugins/giveaway/April/calendar.svg" alt="calendar"/>
                  <div class="information-optout">
                    <div class="information-title">Κλήρωση Απριλίου</div>
                    <div class="text">Αξιολόγησε και κέρδισε 500€!</div>
                    </div>
                  </div>
                <div class="actions">
                  <div class="hint">1 αξιολόγηση = 1 συμμετοχή</div>
                  <div class="cta" id="enterGiveaway">MΠΕΣ ΣΤΗΝ ΚΛΗΡΩΣΗ!</div>
                  </div>
                </div>
            </div>

            <div class="h-deals">
              <div class="h-deals__aside">
                <img width="34" height="42" alt="Deals icon" class="h-deals__icon" src="//bp.pstatic.gr/images/flame.svg"/>
                <div class="h-header">
                  <div class="h-header__hgroup">
                    <h2 class="section__title">
                      <a href="/deals?bpref=home-deals-header">Προσφορές της ημέρας</a>
                    </h2>
                    <div class="section__subtitle">6.367 πραγματικές προσφορές</div>
                  </div>
                  <a title="Όλες οι προσφορές στο BestPrice" href="/deals?bpref=home-deals-more" class="h-header__more">
                    <span class="h-header__more-label">Όλες</span>
                    <svg aria-hidden="true" class="icon" width="20" height="20"><use xlink:href="/public/dist/images/icons/icons.svg#icon-right-20"></use></svg>
                  </a>
                </div>
                <a href="/deals?bpref=home-deals-all" class="button h-deals__button">Όλες οι προσφορές</a>
                <div class="h-deals__links">
                  <a href="/deals/c?bpref=home-deals-c" class="h-deals__button--c">Προσφορές ανά κατηγορία</a>
                  <a href="/deals/m?bpref=home-deals-s" class="h-deals__button--s">Προσφορές ανά κατάστημα</a>
                </div>
              </div>
              <div class="h-deals__main">
                <div class="scroll">
                  <div class="scroll__clip">
                    <div class="scroll__scroller">
                      <div class="p__products--scroll scroll__content">
                        <div data-id="2160149222" data-cid="806" data-price="10928" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2160149222/xiaomi-poco-c75-8gb-256gb.html?bpref=home-deals">
                            <img width="160" height="160" alt="Xiaomi Poco C75 8GB 256GB" src="//bbpcdn.pstatic.gr/bpimg38/2mbLuu/1TdmP5_SX160Y160/1732017311/xiaomi-poco-c75-8gb-256gb.webp" srcset="//bbpcdn.pstatic.gr/bpimg38/2mbLuu/1TdmP5_SX320Y320/1732017311/xiaomi-poco-c75-8gb-256gb.webp 2x"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/806/mobile-phones.html?deals=11">Κινητά</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2160149222/xiaomi-poco-c75-8gb-256gb.html?bpref=home-deals" title="Xiaomi Poco C75 8GB 256GB">Xiaomi Poco C75 8GB 256GB</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--10">-11%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2160149222/xiaomi-poco-c75-8gb-256gb.html?bpref=home-deals">
                                <div class="p__price--current">109,28€</div>
                                <del class="p__price--before">122,78€</del>
                              </a>
                              <div class="p__merchants">29 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2159912975" data-cid="876" data-price="43970" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2159912975/sony-playstation-5-slim-astro-bot.html?bpref=home-deals">
                            <img width="160" height="160" alt="Sony PlayStation 5 Slim &amp; Astro Bot" src="//bbpcdn.pstatic.gr/bpimg35/ccaob/1TUs7T_SX160Y160/1742285801/sony-playstation-5-slim-astro-bot.webp" srcset="//bbpcdn.pstatic.gr/bpimg35/ccaob/1TUs7T_SX320Y320/1742285801/sony-playstation-5-slim-astro-bot.webp 2x"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/876/video-game-consoles.html?deals=11">Κονσόλες</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2159912975/sony-playstation-5-slim-astro-bot.html?bpref=home-deals" title="Sony PlayStation 5 Slim &amp; Astro Bot">Sony PlayStation 5 Slim &amp; Astro Bot</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--20">-26%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__rating" data-breakdown="">
                              <a href="/item/2159912975/sony-playstation-5-slim-astro-bot.html?bpref=home-deals" class="p__rating-link">
                                <div class="simple-rating"><div class="simple-rating__inner">
                                  <div class="simple-rating__stars">
                                    <svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                  </div>
                                  <div class="simple-rating__rated" style="width: 96.216216216216%;">
                                    <div class="simple-rating__stars">
                                      <svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                    </div>
                                  </div>
                                </div>
                                  <div class="simple-rating__total">(37)</div>
                                </div>
                                <svg aria-hidden="true" class="icon p__rating-arrow" width="10" height="10"><use xlink:href="/public/dist/images/icons/arrows.svg#icon-more-12"></use></svg>
                              </a>
                            </div>
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2159912975/sony-playstation-5-slim-astro-bot.html?bpref=home-deals">
                                <div class="p__price--current">439,70€</div>
                                <del class="p__price--before">594,18€</del>
                              </a>
                              <div class="p__merchants">18 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2160431705" data-cid="2591" data-price="108182" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2160431705/apple-macbook-air-13-2025.html?bpref=home-deals">
                            <img width="160" height="160" alt="Apple MacBook Air 13&quot; 2025 (M4 chip-10 core/16GB/256GB SSD/8 Core GPU)" src="//bbpcdn.pstatic.gr/bpimg25/2mcWYF/1TPQrK_SX160Y160/1741187648/apple-macbook-air-13-2025.webp" srcset="//bbpcdn.pstatic.gr/bpimg25/2mcWYF/1TPQrK_SX320Y320/1741187648/apple-macbook-air-13-2025.webp 2x"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/2591/laptops.html?deals=11">Laptops</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2160431705/apple-macbook-air-13-2025.html?bpref=home-deals" title="Apple MacBook Air 13&quot; 2025 (M4 chip-10 core/16GB/256GB SSD/8 Core GPU)">Apple MacBook Air 13" 2025 (M4 chip-10 core/16GB/256GB SSD/8 Core GPU)</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--10">-13%</div>
                              </div>
                              <div class="p__badge p__badge--new">Νέο</div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2160431705/apple-macbook-air-13-2025.html?bpref=home-deals">
                                <div class="p__price--current">1.081,82€</div>
                                <del class="p__price--before">1.243,47€</del>
                              </a>
                              <div class="p__merchants">15 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2160074019" data-cid="806" data-price="10075" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2160074019/motorola-moto-g35-5g-4gb-128gb-dual.html?bpref=home-deals">
                            <img width="160" height="160" alt="Motorola Moto G35 5G 4GB 128GB Dual" src="//bbpcdn.pstatic.gr/bpimg32/bmm7m/1TntP8_SX160Y160/1734427502/motorola-moto-g35-5g-4gb-128gb-dual.webp" srcset="//bbpcdn.pstatic.gr/bpimg32/bmm7m/1TntP8_SX320Y320/1734427502/motorola-moto-g35-5g-4gb-128gb-dual.webp 2x"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/806/mobile-phones.html?deals=11">Κινητά</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2160074019/motorola-moto-g35-5g-4gb-128gb-dual.html?bpref=home-deals" title="Motorola Moto G35 5G 4GB 128GB Dual">Motorola Moto G35 5G 4GB 128GB Dual</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--10">-15%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2160074019/motorola-moto-g35-5g-4gb-128gb-dual.html?bpref=home-deals">
                                <div class="p__price--current">100,75€</div>
                                <del class="p__price--before">118,52€</del>
                              </a>
                              <div class="p__merchants">22 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2158036894" data-cid="8274" data-price="1349" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2158036894/my-fantastic-ranch-xbox-series.html?bpref=home-deals">
                            <img width="160" height="160" alt="My Fantastic Ranch Xbox Series" src="//bbpcdn.pstatic.gr/bpimg7/6XNnF/1TvjKe_SX160Y160/1736295382/my-fantastic-ranch-xbox-series.webp" srcset="//bbpcdn.pstatic.gr/bpimg7/6XNnF/1TvjKe_SX320Y320/1736295382/my-fantastic-ranch-xbox-series.webp 2x"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/8274/xbox-series-games.html?deals=11">Xbox Series Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2158036894/my-fantastic-ranch-xbox-series.html?bpref=home-deals" title="My Fantastic Ranch Xbox Series">My Fantastic Ranch Xbox Series</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--40">-66%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2158036894/my-fantastic-ranch-xbox-series.html?bpref=home-deals">
                                <div class="p__price--current">13,49€</div>
                                <del class="p__price--before">39,67€</del>
                              </a>
                              <div class="p__merchants">3 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2159813701" data-cid="6041" data-price="2510" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2159813701/tiebreak-ace-edition-ps4.html?bpref=home-deals">
                            <img width="160" height="160" alt="Tiebreak Ace Edition PS4" src="//bbpcdn.pstatic.gr/bpimg5/2mamcR/1SyJg6_SX160Y160/1722332106/tiebreak-ace-edition-ps4.webp" srcset="//bbpcdn.pstatic.gr/bpimg5/2mamcR/1SyJg6_SX320Y320/1722332106/tiebreak-ace-edition-ps4.webp 2x"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/6041/playstation-4-games.html?deals=11">PS4 Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2159813701/tiebreak-ace-edition-ps4.html?bpref=home-deals" title="Tiebreak Ace Edition PS4">Tiebreak Ace Edition PS4</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--30">-36%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2159813701/tiebreak-ace-edition-ps4.html?bpref=home-deals">
                                <div class="p__price--current">25,10€</div>
                                <del class="p__price--before">39,21€</del>
                              </a>
                              <div class="p__merchants">14 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2159643999" data-cid="6280" data-price="39900" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2159643999/huawei-watch-4-pro-grey.html?bpref=home-deals">
                            <img width="160" height="160" alt="Huawei Watch 4 Pro Grey" src="//bbpcdn.pstatic.gr/bpimg31/2m9E3J/1Se5Ey_SX160Y160/1717413302/huawei-watch-4-pro-grey.webp" srcset="//bbpcdn.pstatic.gr/bpimg31/2m9E3J/1Se5Ey_SX320Y320/1717413302/huawei-watch-4-pro-grey.webp 2x" loading="lazy"//>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/6280/smartwatches.html?deals=11">Smartwatches</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2159643999/huawei-watch-4-pro-grey.html?bpref=home-deals" title="Huawei Watch 4 Pro Grey">Huawei Watch 4 Pro Grey</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--10">-12%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__rating" data-breakdown="">
                              <a href="/item/2159643999/huawei-watch-4-pro-grey.html?bpref=home-deals" class="p__rating-link">
                                <div class="simple-rating"><div class="simple-rating__inner">
                                  <div class="simple-rating__stars">
                                    <svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                  </div>
                                  <div class="simple-rating__rated" style="width: 93.333333333333%;">
                                    <div class="simple-rating__stars">
                                      <svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                    </div>
                                  </div>
                                </div>
                                  <div class="simple-rating__total">(9)</div>
                                </div>
                                <svg aria-hidden="true" class="icon p__rating-arrow" width="10" height="10"><use xlink:href="/public/dist/images/icons/arrows.svg#icon-more-12"></use></svg>
                              </a>
                            </div>
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2159643999/huawei-watch-4-pro-grey.html?bpref=home-deals">
                                <div class="p__price--current">399,00€</div>
                                <del class="p__price--before">453,40€</del>
                              </a>
                              <div class="p__merchants">19 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2157915297" data-cid="7070" data-price="4724" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2157915297/the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch.html?bpref=home-deals">
                            <img width="160" height="160" alt="The Legend Of Zelda Tears Of The Kingdom Nintendo Switch" src="//bbpcdn.pstatic.gr/bpimg8/7Quhy/1SYzV1_SX160Y160/1728492731/the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch.webp" srcset="//bbpcdn.pstatic.gr/bpimg8/7Quhy/1SYzV1_SX320Y320/1728492731/the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/7070/nintendo-switch-games.html?deals=11">Nintendo Switch Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2157915297/the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch.html?bpref=home-deals" title="The Legend Of Zelda Tears Of The Kingdom Nintendo Switch">The Legend Of Zelda Tears Of The Kingdom Nintendo Switch</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--10">-18%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__rating" data-breakdown="">
                              <a href="/item/2157915297/the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch.html?bpref=home-deals" class="p__rating-link">
                                <div class="simple-rating">
                                  <div class="simple-rating__inner">
                                    <div class="simple-rating__stars">
                                      <svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                    </div>
                                    <div class="simple-rating__rated" style="width: 97.777777777778%;">
                                      <div class="simple-rating__stars">
                                        <svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="simple-rating__total">(9)</div>
                                </div>
                                <svg aria-hidden="true" class="icon p__rating-arrow" width="10" height="10"><use xlink:href="/public/dist/images/icons/arrows.svg#icon-more-12"></use></svg>
                              </a>
                            </div>
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2157915297/the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch.html?bpref=home-deals">
                                <div class="p__price--current">47,24€</div>
                                <del class="p__price--before">57,60€</del>
                              </a>
                              <div class="p__merchants">30 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2160369573" data-cid="8273" data-price="4848" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2160369573/wwe-2k25-ps5.html?bpref=home-deals">
                            <img width="160" height="160" alt="WWE 2K25 PS5" src="//bbpcdn.pstatic.gr/bpimg37/2mcGOx/1TIUNF_SX160Y160/1739536087/wwe-2k25-ps5.webp" srcset="//bbpcdn.pstatic.gr/bpimg37/2mcGOx/1TIUNF_SX320Y320/1739536087/wwe-2k25-ps5.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/8273/ps5-games.html?deals=11">PS5 Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2160369573/wwe-2k25-ps5.html?bpref=home-deals" title="WWE 2K25 PS5">WWE 2K25 PS5</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--20">-21%</div>
                              </div>
                              <div class="p__badge p__badge--new">Νέο</div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2160369573/wwe-2k25-ps5.html?bpref=home-deals">
                                <div class="p__price--current">48,48€</div>
                                <del class="p__price--before">61,36€</del>
                              </a>
                              <div class="p__merchants">19 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2156787777" data-cid="889" data-price="2090" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2156787777/battlefield-2042-pc.html?bpref=home-deals">
                            <img width="160" height="160" alt="Battlefield 2042 PC" src="//bbpcdn.pstatic.gr/bpimg1/2lXF1D/1QY6bE_SX160Y160/1698825770/battlefield-2042-pc.webp" srcset="//bbpcdn.pstatic.gr/bpimg1/2lXF1D/1QY6bE_SX320Y320/1698825770/battlefield-2042-pc.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/889/pc-games.html?deals=11">PC Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2156787777/battlefield-2042-pc.html?bpref=home-deals" title="Battlefield 2042 PC">Battlefield 2042 PC</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--30">-30%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2156787777/battlefield-2042-pc.html?bpref=home-deals">
                                <div class="p__price--current">20,90€</div>
                                <del class="p__price--before">29,85€</del>
                              </a>
                              <div class="p__merchants">3 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2160423488" data-cid="813" data-price="16370" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2160423488/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.html?bpref=home-deals">
                            <img width="160" height="160" alt="Xiaomi Buds 5 Pro Ακουστικά Bluetooth In Ear Ανθεκτικά στο Νερό Titan Grey" src="//bbpcdn.pstatic.gr/bpimg31/cckfd/1TU6Ai_SX160Y160/1742202994/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.webp" srcset="//bbpcdn.pstatic.gr/bpimg31/cckfd/1TU6Ai_SX320Y320/1742202994/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/813/bluetooth.html?deals=11">Bluetooth Handsfree</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2160423488/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.html?bpref=home-deals" title="Xiaomi Buds 5 Pro Ακουστικά Bluetooth In Ear Ανθεκτικά στο Νερό Titan Grey">Xiaomi Buds 5 Pro Ακουστικά Bluetooth In Ear Ανθεκτικά στο Νερό Titan Grey</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--30">-33%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2160423488/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.html?bpref=home-deals">
                                <div class="p__price--current">163,70€</div>
                                <del class="p__price--before">244,32€</del>
                              </a>
                              <div class="p__merchants">6 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2158677064" data-cid="6041" data-price="1440" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2158677064/fahrenheit-ps4.html?bpref=home-deals">
                            <img width="160" height="160" alt="Fahrenheit PS4" src="//bbpcdn.pstatic.gr/bpimg45/8CMaN/1TYrWh_SX160Y160/1743238393/fahrenheit-ps4.webp" srcset="//bbpcdn.pstatic.gr/bpimg45/8CMaN/1TYrWh_SX320Y320/1743238393/fahrenheit-ps4.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/6041/playstation-4-games.html?deals=11">PS4 Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2158677064/fahrenheit-ps4.html?bpref=home-deals" title="Fahrenheit PS4">Fahrenheit PS4</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--40">-46%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2158677064/fahrenheit-ps4.html?bpref=home-deals">
                                <div class="p__price--current">14,40€</div>
                                <del class="p__price--before">26,66€</del>
                              </a>
                              <div class="p__merchants">6 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2155404368" data-cid="6143" data-price="754" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2155404368/crayola-scoot-xbox-one.html?bpref=home-deals">
                            <img width="160" height="160" alt="Crayola Scoot Xbox One" src="//bbpcdn.pstatic.gr/bpimg7/axxVt/1TXKj9_SX160Y160/1743070675/crayola-scoot-xbox-one.webp" srcset="//bbpcdn.pstatic.gr/bpimg7/axxVt/1TXKj9_SX320Y320/1743070675/crayola-scoot-xbox-one.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/6143/xbox-one-games.html?deals=11">Xbox One Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2155404368/crayola-scoot-xbox-one.html?bpref=home-deals" title="Crayola Scoot Xbox One">Crayola Scoot Xbox One</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--40">-44%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2155404368/crayola-scoot-xbox-one.html?bpref=home-deals">
                                <div class="p__price--current">7,54€</div>
                                <del class="p__price--before">13,46€</del>
                              </a>
                              <div class="p__merchants">3 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2159136473" data-cid="7070" data-price="1771" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2159136473/pui-pui-molcar-lets-molcar-party-nintendo-switch.html?bpref=home-deals">
                            <img width="160" height="160" alt="Pui Pui Molcar Let's Molcar Party Nintendo Switch" src="//bbpcdn.pstatic.gr/bpimg46/bkhEG/1TXWIk_SX160Y160/1743118364/pui-pui-molcar-lets-molcar-party-nintendo-switch.webp" srcset="//bbpcdn.pstatic.gr/bpimg46/bkhEG/1TXWIk_SX320Y320/1743118364/pui-pui-molcar-lets-molcar-party-nintendo-switch.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/7070/nintendo-switch-games.html?deals=11">Nintendo Switch Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2159136473/pui-pui-molcar-lets-molcar-party-nintendo-switch.html?bpref=home-deals" title="Pui Pui Molcar Let's Molcar Party Nintendo Switch">Pui Pui Molcar Let's Molcar Party Nintendo Switch</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--30">-34%</div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2159136473/pui-pui-molcar-lets-molcar-party-nintendo-switch.html?bpref=home-deals">
                                <div class="p__price--current">17,71€</div>
                                <del class="p__price--before">26,83€</del>
                              </a>
                              <div class="p__merchants">10 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2158934522" data-cid="8273" data-price="960" class="p p--deal p--top-padding">
                          <div class="p__actions" data-js="">
                            <div class="p__action" role="button" aria-label="All product actions">
                              <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg>
                            </div>
                          </div>
                          <a class="p__cover" href="/item/2158934522/noob-the-factionless-limited-edition-ps5.html?bpref=home-deals">
                            <img width="160" height="160" alt="NOOB The Factionless Limited Edition PS5" src="//bbpcdn.pstatic.gr/bpimg50/8cUOm/1TXJW0_SX160Y160/1743069240/noob-the-factionless-limited-edition-ps5.webp" srcset="//bbpcdn.pstatic.gr/bpimg50/8cUOm/1TXJW0_SX320Y320/1743069240/noob-the-factionless-limited-edition-ps5.webp 2x" loading="lazy"/>
                          </a>
                          <div class="p__main">
                            <div class="p__meta">
                              <div class="p__category">
                                <a href="/cat/8273/ps5-games.html?deals=11">PS5 Games</a>
                              </div>
                              <h3 class="p__title p__title--lines p__title--lines-2">
                                <a href="/item/2158934522/noob-the-factionless-limited-edition-ps5.html?bpref=home-deals" title="NOOB The Factionless Limited Edition PS5">NOOB The Factionless Limited Edition PS5</a>
                              </h3>
                            </div>
                            <div class="p__badges">
                              <div class="p__badges-drop">
                                <div class="p__badge p__badge--drop drop drop--40">-51%</div>
                                <div class="p__badge--deal-black-wrapper" data-js="">
                                  <div class="p__badge p__badge--deal-black">
                                    <svg aria-hidden="true" class="icon" width="18" height="18"><use xlink:href="/public/dist/images/icons/static.svg#icon-thunder-18"></use></svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="p__footer">
                            <div class="p__price-merchants">
                              <a class="p__price" href="/item/2158934522/noob-the-factionless-limited-edition-ps5.html?bpref=home-deals">
                                <div class="p__price--current">9,60€</div>
                                <del class="p__price--before">19,59€</del>
                              </a>
                              <div class="p__merchants">4 καταστήματα</div>
                            </div>
                          </div>
                        </div>
                        <div data-id="2154984675" data-cid="3440" data-price="7991" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2154984675/sony-dualshock-4-v2-camouflage-wireless-controller-ps4-green.html?bpref=home-deals"><img width="160" height="160" alt="Sony DualShock 4 V2 Camouflage Wireless Controller PS4 Green" src="//bbpcdn.pstatic.gr/bpimg35/2lQ5Xl/1QXN8K_SX160Y160/1698752554/sony-dualshock-4-v2-camouflage-wireless-controller-ps4-green.webp" srcset="//bbpcdn.pstatic.gr/bpimg35/2lQ5Xl/1QXN8K_SX320Y320/1698752554/sony-dualshock-4-v2-camouflage-wireless-controller-ps4-green.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/3440/xeiristiria-gamepads.html?deals=11">Gaming Controllers</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2154984675/sony-dualshock-4-v2-camouflage-wireless-controller-ps4-green.html?bpref=home-deals" title="Sony DualShock 4 V2 Camouflage Wireless Controller PS4 Green">Sony DualShock 4 V2 Camouflage Wireless Controller PS4 Green</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--10">-19%</div></div></div></div><div class="p__footer"><div class="p__rating" data-breakdown=""><a href="/item/2154984675/sony-dualshock-4-v2-camouflage-wireless-controller-ps4-green.html?bpref=home-deals" class="p__rating-link"><div class="simple-rating"><div class="simple-rating__inner"><div class="simple-rating__stars"><svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div><div class="simple-rating__rated" style="width: 95.072463768116%;"><div class="simple-rating__stars"><svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div></div></div><div class="simple-rating__total">(69)</div></div><svg aria-hidden="true" class="icon p__rating-arrow" width="10" height="10"><use xlink:href="/public/dist/images/icons/arrows.svg#icon-more-12"></use></svg></a></div><div class="p__price-merchants"><a class="p__price" href="/item/2154984675/sony-dualshock-4-v2-camouflage-wireless-controller-ps4-green.html?bpref=home-deals"><div class="p__price--current">79,91€</div><del class="p__price--before">98,65€</del></a><div class="p__merchants">3 καταστήματα</div></div></div></div><div data-id="2160431706" data-cid="2591" data-price="129775" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2160431706/apple-macbook-air-13-2025.html?bpref=home-deals"><img width="160" height="160" alt="Apple MacBook Air 13&quot; 2025 (M4 chip-10 core/16GB/512GB SSD/10 Core GPU)" src="//bbpcdn.pstatic.gr/bpimg26/2mcWYG/1TPQrK_SX160Y160/1741187648/apple-macbook-air-13-2025.webp" srcset="//bbpcdn.pstatic.gr/bpimg26/2mcWYG/1TPQrK_SX320Y320/1741187648/apple-macbook-air-13-2025.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/2591/laptops.html?deals=11">Laptops</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2160431706/apple-macbook-air-13-2025.html?bpref=home-deals" title="Apple MacBook Air 13&quot; 2025 (M4 chip-10 core/16GB/512GB SSD/10 Core GPU)">Apple MacBook Air 13" 2025 (M4 chip-10 core/16GB/512GB SSD/10 Core GPU)</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--10">-13%</div></div><div class="p__badge p__badge--new">Νέο</div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2160431706/apple-macbook-air-13-2025.html?bpref=home-deals"><div class="p__price--current">1.297,75€</div><del class="p__price--before">1.491,66€</del></a><div class="p__merchants">10 καταστήματα</div></div></div></div><div data-id="2159885334" data-cid="6280" data-price="59899" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2159885334/garmin-fenix-e-47mm-silver-black.html?bpref=home-deals"><img width="160" height="160" alt="Garmin Fenix E 47mm Silver / Black" src="//bbpcdn.pstatic.gr/bpimg22/2maEQe/1SJcTu_SX160Y160/1724829304/garmin-fenix-e-47mm-silver-black.webp" srcset="//bbpcdn.pstatic.gr/bpimg22/2maEQe/1SJcTu_SX320Y320/1724829304/garmin-fenix-e-47mm-silver-black.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/6280/smartwatches.html?deals=11">Smartwatches</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2159885334/garmin-fenix-e-47mm-silver-black.html?bpref=home-deals" title="Garmin Fenix E 47mm Silver / Black">Garmin Fenix E 47mm Silver / Black</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--20">-25%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2159885334/garmin-fenix-e-47mm-silver-black.html?bpref=home-deals"><div class="p__price--current">598,99€</div><del class="p__price--before">798,65€</del></a><div class="p__merchants">7 καταστήματα</div></div></div></div><div data-id="2158754811" data-cid="8274" data-price="1375" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2158754811/days-of-doom-xbox-series.html?bpref=home-deals"><img width="160" height="160" alt="Days Of Doom Xbox Series" src="//bbpcdn.pstatic.gr/bpimg48/91rB6/1TNclk_SX160Y160/1740556834/days-of-doom-xbox-series.webp" srcset="//bbpcdn.pstatic.gr/bpimg48/91rB6/1TNclk_SX320Y320/1740556834/days-of-doom-xbox-series.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/8274/xbox-series-games.html?deals=11">Xbox Series Games</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2158754811/days-of-doom-xbox-series.html?bpref=home-deals" title="Days Of Doom Xbox Series">Days Of Doom Xbox Series</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--40">-47%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2158754811/days-of-doom-xbox-series.html?bpref=home-deals"><div class="p__price--current">13,75€</div><del class="p__price--before">25,94€</del></a><div class="p__merchants">3 καταστήματα</div></div></div></div><div data-id="2159069567" data-cid="806" data-price="15609" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2159069567/ulefone-armor-22-8gb-128gb.html?bpref=home-deals"><img width="160" height="160" alt="Ulefone Armor 22 8GB 128GB" src="//bbpcdn.pstatic.gr/bpimg42/93Bsm/1TY5QK_SX160Y160/1743153482/ulefone-armor-22-8gb-128gb.webp" srcset="//bbpcdn.pstatic.gr/bpimg42/93Bsm/1TY5QK_SX320Y320/1743153482/ulefone-armor-22-8gb-128gb.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/806/mobile-phones.html?deals=11">Κινητά</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2159069567/ulefone-armor-22-8gb-128gb.html?bpref=home-deals" title="Ulefone Armor 22 8GB 128GB">Ulefone Armor 22 8GB 128GB</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--10">-15%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2159069567/ulefone-armor-22-8gb-128gb.html?bpref=home-deals"><div class="p__price--current">156,09€</div><del class="p__price--before">183,63€</del></a><div class="p__merchants">40 καταστήματα</div></div></div></div><div data-id="2159416375" data-cid="2611" data-price="14691" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2159416375/asus-tuf-gaming-b650-e-wifi-motherboard-atx-me-amd-am5-socket.html?bpref=home-deals"><img width="160" height="160" alt="Asus TUF Gaming B650-E WiFi Motherboard ATX με AMD AM5 Socket" src="//bbpcdn.pstatic.gr/bpimg55/2m8GQn/1RJD9s_SX160Y160/1710153902/asus-tuf-gaming-b650-e-wifi-motherboard-atx-me-amd-am5-socket.webp" srcset="//bbpcdn.pstatic.gr/bpimg55/2m8GQn/1RJD9s_SX320Y320/1710153902/asus-tuf-gaming-b650-e-wifi-motherboard-atx-me-amd-am5-socket.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/2611/motherboards.html?deals=11">Μητρικές Κάρτες</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2159416375/asus-tuf-gaming-b650-e-wifi-motherboard-atx-me-amd-am5-socket.html?bpref=home-deals" title="Asus TUF Gaming B650-E WiFi Motherboard ATX με AMD AM5 Socket">Asus TUF Gaming B650-E WiFi Motherboard ATX με AMD AM5 Socket</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--10">-14%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2159416375/asus-tuf-gaming-b650-e-wifi-motherboard-atx-me-amd-am5-socket.html?bpref=home-deals"><div class="p__price--current">146,91€</div><del class="p__price--before">170,82€</del></a><div class="p__merchants">24 καταστήματα</div></div></div></div><div data-id="2159110042" data-cid="813" data-price="5219" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2159110042/samsung-galaxy-buds-fe-akoystika-bluetooth-in-ear-graphite.html?bpref=home-deals"><img width="160" height="160" alt="Samsung Galaxy Buds FE Ακουστικά Bluetooth In Ear Graphite" src="//bbpcdn.pstatic.gr/bpimg46/9dFBI/1SYzV1_SX160Y160/1728492731/samsung-galaxy-buds-fe-akoystika-bluetooth-in-ear-graphite.webp" srcset="//bbpcdn.pstatic.gr/bpimg46/9dFBI/1SYzV1_SX320Y320/1728492731/samsung-galaxy-buds-fe-akoystika-bluetooth-in-ear-graphite.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/813/bluetooth.html?deals=11">Bluetooth Handsfree</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2159110042/samsung-galaxy-buds-fe-akoystika-bluetooth-in-ear-graphite.html?bpref=home-deals" title="Samsung Galaxy Buds FE Ακουστικά Bluetooth In Ear Graphite">Samsung Galaxy Buds FE Ακουστικά Bluetooth In Ear Graphite</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--10">-19%</div></div></div></div><div class="p__footer"><div class="p__rating" data-breakdown=""><a href="/item/2159110042/samsung-galaxy-buds-fe-akoystika-bluetooth-in-ear-graphite.html?bpref=home-deals" class="p__rating-link"><div class="simple-rating"><div class="simple-rating__inner"><div class="simple-rating__stars"><svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div><div class="simple-rating__rated" style="width: 74.285714285714%;"><div class="simple-rating__stars"><svg aria-hidden="true" class="icon" width="80" height="16"><use xlink:href="/public/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div></div></div><div class="simple-rating__total">(7)</div></div><svg aria-hidden="true" class="icon p__rating-arrow" width="10" height="10"><use xlink:href="/public/dist/images/icons/arrows.svg#icon-more-12"></use></svg></a></div><div class="p__price-merchants"><a class="p__price" href="/item/2159110042/samsung-galaxy-buds-fe-akoystika-bluetooth-in-ear-graphite.html?bpref=home-deals"><div class="p__price--current">52,19€</div><del class="p__price--before">64,43€</del></a><div class="p__merchants">47 καταστήματα</div></div></div></div><div data-id="2157654839" data-cid="876" data-price="44900" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2157654839/nintendo-switch-oled-pokemon-legends-arceus.html?bpref=home-deals"><img width="160" height="160" alt="Nintendo Switch OLED &amp; Pokemon Legends Arceus" src="//bbpcdn.pstatic.gr/bpimg29/728m9/1TURYL_SX160Y160/1742385179/nintendo-switch-oled-pokemon-legends-arceus.webp" srcset="//bbpcdn.pstatic.gr/bpimg29/728m9/1TURYL_SX320Y320/1742385179/nintendo-switch-oled-pokemon-legends-arceus.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/876/video-game-consoles.html?deals=11">Κονσόλες</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2157654839/nintendo-switch-oled-pokemon-legends-arceus.html?bpref=home-deals" title="Nintendo Switch OLED &amp; Pokemon Legends Arceus">Nintendo Switch OLED &amp; Pokemon Legends Arceus</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--20">-20%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2157654839/nintendo-switch-oled-pokemon-legends-arceus.html?bpref=home-deals"><div class="p__price--current">449,00€</div><del class="p__price--before">561,25€</del></a><div class="p__merchants">3 καταστήματα</div></div></div></div><div data-id="2156090288" data-cid="3440" data-price="1700" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2156090288/oem-mocute-050-wireless-controller-kinhtoy-android-ios-black-red.html?bpref=home-deals"><img width="160" height="160" alt="Mocute 050 Wireless Controller Κινητού Android &amp; iOS Black Red" src="//bbpcdn.pstatic.gr/bpimg57/2lH9D/1SYzV1_SX160Y160/1728492731/oem-mocute-050-wireless-controller-kinhtoy-android-ios-black-red.webp" srcset="//bbpcdn.pstatic.gr/bpimg57/2lH9D/1SYzV1_SX320Y320/1728492731/oem-mocute-050-wireless-controller-kinhtoy-android-ios-black-red.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/3440/xeiristiria-gamepads.html?deals=11">Gaming Controllers</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2156090288/oem-mocute-050-wireless-controller-kinhtoy-android-ios-black-red.html?bpref=home-deals" title="Mocute 050 Wireless Controller Κινητού Android &amp; iOS Black Red">Mocute 050 Wireless Controller Κινητού Android &amp; iOS Black Red</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--20">-29%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2156090288/oem-mocute-050-wireless-controller-kinhtoy-android-ios-black-red.html?bpref=home-deals"><div class="p__price--current">17,00€</div><del class="p__price--before">23,94€</del></a><div class="p__merchants">3 καταστήματα</div></div></div></div><div data-id="2157944147" data-cid="812" data-price="2790" class="p p--deal p--top-padding"><div class="p__actions" data-js=""><div class="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a class="p__cover" href="/item/2157944147/native-union-snap-magsafe-fortisths-15w-black.html?bpref=home-deals"><img width="160" height="160" alt="Native Union Snap Magsafe Φορτιστής 15W Black" src="//bbpcdn.pstatic.gr/bpimg31/c7oyX/1TPqfX_SX160Y160/1741086973/native-union-snap-magsafe-fortisths-15w-black.webp" srcset="//bbpcdn.pstatic.gr/bpimg31/c7oyX/1TPqfX_SX320Y320/1741086973/native-union-snap-magsafe-fortisths-15w-black.webp 2x" loading="lazy"/></a><div class="p__main"><div class="p__meta"><div class="p__category"><a href="/cat/812/fortistes-kiniton.html?deals=11">Φορτιστές Κινητών</a></div><h3 class="p__title p__title--lines p__title--lines-2"><a href="/item/2157944147/native-union-snap-magsafe-fortisths-15w-black.html?bpref=home-deals" title="Native Union Snap Magsafe Φορτιστής 15W Black">Native Union Snap Magsafe Φορτιστής 15W Black</a></h3></div><div class="p__badges"> <div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--40">-44%</div></div></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" href="/item/2157944147/native-union-snap-magsafe-fortisths-15w-black.html?bpref=home-deals"><div class="p__price--current">27,90€</div><del class="p__price--before">49,82€</del></a><div class="p__merchants">4 καταστήματα</div></div></div></div><a href="/deals" class="more-link"><div class="more-link__icon"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-forwards-16"></use></svg></div><div class="more-link__label">Όλες οι προσφορές</div></a></div></div></div><div><button aria-label="Scroll arrow previous" disabled="" class="scroll__arrow scroll__arrow--previous scroll__arrow--disabled" style="left: 0px;"><svg class="icon" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-backwards-16"></use></svg></button><button aria-label="Scroll arrow next" class="scroll__arrow scroll__arrow--next" style="right: -18.4px;"><svg class="icon" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-forwards-16"></use></svg></button></div></div><a href="/deals?bpref=home-deals-all" class="button h-button--more-mobile">Πρόλαβε τις προσφορές! <svg aria-hidden="true" class="icon" width="8" height="8"><use xlink:href="/public/dist/images/icons/icons.svg#icon-right-8"></use></svg></a></div></div>
            


            
          </div>
        </div>
      </div>

      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Find the Best Prices Across Multiple Stores</h1>
            <p className="text-xl mb-6">Compare prices from trusted retailers and find the best deals</p>
            <Link to="/categories"><Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">Start Shopping</Button></Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Δημοφιλείς κατηγορίες</h2>
            <Link to="/categories" className="text-primary flex items-center">Όλες οι κατηγορίες<ArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary flex items-center">View All<ArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-10">Why Shop With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Compare Prices Instantly</h3>
              <p className="text-muted-foreground">Find the best deals across multiple retailers in seconds</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Price History Tracking</h3>
              <p className="text-muted-foreground">Monitor price changes to buy at the perfect time</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Verified User Reviews</h3>
              <p className="text-muted-foreground">Make informed decisions with authentic product reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
            <p className="text-xl text-muted-foreground mb-6">Join thousands of smart shoppers who save money every day</p>
            <Link to="/categories"><Button size="lg" variant="default">Explore Products</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
