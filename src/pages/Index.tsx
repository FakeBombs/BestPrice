
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
          <div className="sections">
            <div className="h-categories">
              <div className="h-header">
                <div className="h-header__hgroup">
                  <div className="section__title">Δημοφιλείς κατηγορίες</div>
                </div>

                <div className="h-header__more-wrapper">
                  <div className="h-categories__verticals">
                    <a data-id="deals" href="/deals?bpref=home-verticals">
                      <svg aria-hidden="true" className="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-flame-16"></use></svg> 
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
                  <div className="h-header__more pressable">
                    <svg aria-hidden="true" className="icon" width="12" height="12"><use xlink:href="/public/dist/images/icons/icons.svg#icon-hamburger-12"></use></svg>
                    <span className="h-header__more-label">Όλες</span>
                    <svg aria-hidden="true" className="icon" width="20" height="20"><use xlink:href="/public/dist/images/icons/icons.svg#icon-right-20"></use></svg>
                  </div>
                </div>
                
              </div>

              <div className="h-categories__list">
                <a href="/deals?bpref=home-categories" className="h-categories__category h-categories__category--deals" title="Προσφορές">
                  <div className="h-categories__cover">
                    <div className="h-categories__badge drop drop--40">233 Νέες</div>
                      <img width="34" height="42" alt="Deals icon" className="h-categories__image" src="//bp.pstatic.gr/images/flame.svg"/>
                    </div><h2 className="h-categories__label">Προσφορές</h2>
                </a>
                <a href="/cat/806/mobile-phones.html?bpref=home-categories" className="h-categories__category" title="Κινητά">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Κινητά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/806-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/806-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Κινητά</h2>
                </a>
                <a href="/hub/25/iphone.html?bpref=home-categories" className="h-categories__category" title="iPhone">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="iPhone στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/misc/hub25-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/misc/hub25-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">iPhone</h2>
                </a>
                <a href="/cat/3048/thleoraseis.html?bpref=home-categories" className="h-categories__category" title="Τηλεοράσεις">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Τηλεοράσεις στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/3048-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/3048-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Τηλεοράσεις</h2>
                </a>
                <a href="/cat/2442/air-condition.html?bpref=home-categories" className="h-categories__category" title="Κλιματιστικά">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Κλιματιστικά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2442-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2442-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Κλιματιστικά</h2>
                </a>
                <a href="/cat/6280/smartwatches.html?bpref=home-categories" className="h-categories__category" title="Smartwatches">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Smartwatches στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6280-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6280-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Smartwatches</h2>
                </a>
                <a href="/cat/6385/gynaikeia-sneakers.html?bpref=home-categories" className="h-categories__category" title="Γυναικεία Sneakers">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Γυναικεία Sneakers στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6385-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6385-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Γυναικεία Sneakers</h2>
                </a>
                <a href="/cat/3056/gialia-iliou.html?bpref=home-categories" className="h-categories__category" title="Γυαλιά Ηλίου">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Γυαλιά Ηλίου στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/3056-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/3056-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Γυαλιά Ηλίου</h2>
                </a>
                <a href="/cat/2613/kartes-grafikwn.html?bpref=home-categories" className="h-categories__category" title="GPU">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="GPU στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2613-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2613-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">GPU</h2>
                </a>
                <a href="/cat/2591/laptops.html?bpref=home-categories" className="h-categories__category" title="Laptops">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Laptops στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2591-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2591-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Laptops</h2>
                </a>
                <a href="/cat/6025/kremes-prosopou.html?bpref=home-categories" className="h-categories__category" title="Κρέμες Προσώπου">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Κρέμες Προσώπου στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6025-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6025-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Κρέμες Προσώπου</h2>
                </a>
                <a href="/cat/2485/psigeia.html?bpref=home-categories" className="h-categories__category" title="Ψυγεία">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Ψυγεία στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2485-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2485-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Ψυγεία</h2>
                </a>
                <a href="/cat/2492/plyntiria-rouxwn.html?bpref=home-categories" className="h-categories__category" title="Πλυντήρια Ρούχων">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Πλυντήρια Ρούχων στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2492-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2492-1@2x.webp 2x" className="h-categories__image"/>
                  </div><h2 className="h-categories__label">Πλυντήρια Ρούχων</h2>
                </a>
                <a href="/cat/6846/skoupes-stick.html?bpref=home-categories" className="h-categories__category" title="Σκούπες Stick">
                  <div className="h-categories__cover">
                    <img width="125" height="125" alt="Σκούπες Stick στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6846-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6846-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Σκούπες Stick</h2></a><a href="/cat/3446/tablets.html?bpref=home-categories" className="h-categories__category" title="Tablets"><div className="h-categories__cover"><img width="125" height="125" alt="Tablets στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/3446-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/3446-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Tablets</h2></a><a href="/cat/7124/antiiliaka.html?bpref=home-categories" className="h-categories__category" title="Αντηλιακά"><div className="h-categories__cover"><img width="125" height="125" alt="Αντηλιακά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/7124-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/7124-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Αντηλιακά</h2></a><a href="/cat/6670/andrika-sneakers.html?bpref=home-categories" className="h-categories__category" title="Ανδρικά Sneakers"><div className="h-categories__cover"><img width="125" height="125" alt="Ανδρικά Sneakers στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6670-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6670-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Ανδρικά Sneakers</h2></a><a href="/cat/6843/skoupes-robot.html?bpref=home-categories" className="h-categories__category" title="Σκούπες Ρομπότ"><div className="h-categories__cover"><img width="125" height="125" alt="Σκούπες Ρομπότ στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/6843-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/6843-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Σκούπες Ρομπότ</h2></a><a href="/cat/2421/xortokoptika.html?bpref=home-categories" className="h-categories__category" title="Χορτοκοπτικά"><div className="h-categories__cover"><img width="125" height="125" alt="Χορτοκοπτικά στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/2421-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/2421-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Χορτοκοπτικά</h2></a><a href="/cat/848/andrika-rologia.html?bpref=home-categories" className="h-categories__category" title="Ανδρικά Ρολόγια"><div className="h-categories__cover"><img width="125" height="125" alt="Ανδρικά Ρολόγια στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/848-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/848-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Ανδρικά Ρολόγια</h2></a><a href="/cat/5925/pasxalines-lampades.html?bpref=home-categories" className="h-categories__category" title="Λαμπάδες"><div className="h-categories__cover"><img width="125" height="125" alt="Λαμπάδες στο BestPrice" src="//bp.pstatic.gr/pages/home/assets/cats/5925-1.webp" srcset="//bp.pstatic.gr/pages/home/assets/cats/5925-1@2x.webp 2x" className="h-categories__image"/></div><h2 className="h-categories__label">Λαμπάδες</h2></a>
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
                      <a href="/deals?bpref=home-deals-header">Προσφορές της ημέρας</a>
                    </h2>
                    <div className="section__subtitle">6.367 πραγματικές προσφορές</div>
                  </div>
                  <a title="Όλες οι προσφορές στο BestPrice" href="/deals?bpref=home-deals-more" className="h-header__more">
                    <span className="h-header__more-label">Όλες</span>
                    <svg aria-hidden="true" className="icon" width="20" height="20"><use xlink:href="/public/dist/images/icons/icons.svg#icon-right-20"></use></svg>
                  </a>
                </div>
                <a href="/deals?bpref=home-deals-all" className="button h-deals__button">Όλες οι προσφορές</a>
                <div className="h-deals__links">
                  <a href="/deals/c?bpref=home-deals-c" className="h-deals__button--c">Προσφορές ανά κατηγορία</a>
                  <a href="/deals/m?bpref=home-deals-s" className="h-deals__button--s">Προσφορές ανά κατάστημα</a>
                </div>
              </div>
              <div className="h-deals__main">
                <div className="scroll">
                  <div className="scroll__clip">
                    <div className="scroll__scroller">
                      <div className="p__products--scroll scroll__content">

                        <div data-id="2160149222" data-cid="806" data-price="10928" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2160149222/xiaomi-poco-c75-8gb-256gb.html?bpref=home-deals"><img width="160" height="160" alt="Xiaomi Poco C75 8GB 256GB" src="//bbpcdn.pstatic.gr/bpimg38/2mbLuu/1TdmP5_SX160Y160/1732017311/xiaomi-poco-c75-8gb-256gb.webp" srcset="//bbpcdn.pstatic.gr/bpimg38/2mbLuu/1TdmP5_SX320Y320/1732017311/xiaomi-poco-c75-8gb-256gb.webp 2x"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/806/mobile-phones.html?deals=11">Κινητά</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2160149222/xiaomi-poco-c75-8gb-256gb.html?bpref=home-deals" title="Xiaomi Poco C75 8GB 256GB">Xiaomi Poco C75 8GB 256GB</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--10">-11%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2160149222/xiaomi-poco-c75-8gb-256gb.html?bpref=home-deals"><div className="p__price--current">109,28€</div><del className="p__price--before">122,78€</del></a><div className="p__merchants">29 καταστήματα</div></div></div></div>
                        <div data-id="2160431705" data-cid="2591" data-price="108182" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2160431705/apple-macbook-air-13-2025.html?bpref=home-deals"><img width="160" height="160" alt="Apple MacBook Air 13&quot; 2025 (M4 chip-10 core/16GB/256GB SSD/8 Core GPU)" src="//bbpcdn.pstatic.gr/bpimg25/2mcWYF/1TPQrK_SX160Y160/1741187648/apple-macbook-air-13-2025.webp" srcset="//bbpcdn.pstatic.gr/bpimg25/2mcWYF/1TPQrK_SX320Y320/1741187648/apple-macbook-air-13-2025.webp 2x"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/2591/laptops.html?deals=11">Laptops</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2160431705/apple-macbook-air-13-2025.html?bpref=home-deals" title="Apple MacBook Air 13&quot; 2025 (M4 chip-10 core/16GB/256GB SSD/8 Core GPU)">Apple MacBook Air 13" 2025 (M4 chip-10 core/16GB/256GB SSD/8 Core GPU)</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--10">-13%</div></div><div className="p__badge p__badge--new">Νέο</div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2160431705/apple-macbook-air-13-2025.html?bpref=home-deals"><div className="p__price--current">1.081,82€</div><del className="p__price--before">1.243,47€</del></a><div className="p__merchants">15 καταστήματα</div></div></div></div>
                        <div data-id="2160074019" data-cid="806" data-price="10075" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2160074019/motorola-moto-g35-5g-4gb-128gb-dual.html?bpref=home-deals"><img width="160" height="160" alt="Motorola Moto G35 5G 4GB 128GB Dual" src="//bbpcdn.pstatic.gr/bpimg32/bmm7m/1TntP8_SX160Y160/1734427502/motorola-moto-g35-5g-4gb-128gb-dual.webp" srcset="//bbpcdn.pstatic.gr/bpimg32/bmm7m/1TntP8_SX320Y320/1734427502/motorola-moto-g35-5g-4gb-128gb-dual.webp 2x"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/806/mobile-phones.html?deals=11">Κινητά</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2160074019/motorola-moto-g35-5g-4gb-128gb-dual.html?bpref=home-deals" title="Motorola Moto G35 5G 4GB 128GB Dual">Motorola Moto G35 5G 4GB 128GB Dual</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--10">-15%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2160074019/motorola-moto-g35-5g-4gb-128gb-dual.html?bpref=home-deals"><div className="p__price--current">100,75€</div><del className="p__price--before">118,52€</del></a><div className="p__merchants">22 καταστήματα</div></div></div></div>
                        <div data-id="2158036894" data-cid="8274" data-price="1349" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2158036894/my-fantastic-ranch-xbox-series.html?bpref=home-deals"><img width="160" height="160" alt="My Fantastic Ranch Xbox Series" src="//bbpcdn.pstatic.gr/bpimg7/6XNnF/1TvjKe_SX160Y160/1736295382/my-fantastic-ranch-xbox-series.webp" srcset="//bbpcdn.pstatic.gr/bpimg7/6XNnF/1TvjKe_SX320Y320/1736295382/my-fantastic-ranch-xbox-series.webp 2x"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/8274/xbox-series-games.html?deals=11">Xbox Series Games</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2158036894/my-fantastic-ranch-xbox-series.html?bpref=home-deals" title="My Fantastic Ranch Xbox Series">My Fantastic Ranch Xbox Series</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--40">-66%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2158036894/my-fantastic-ranch-xbox-series.html?bpref=home-deals"><div className="p__price--current">13,49€</div><del className="p__price--before">39,67€</del></a><div className="p__merchants">3 καταστήματα</div></div></div></div>
                        <div data-id="2159813701" data-cid="6041" data-price="2510" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2159813701/tiebreak-ace-edition-ps4.html?bpref=home-deals"><img width="160" height="160" alt="Tiebreak Ace Edition PS4" src="//bbpcdn.pstatic.gr/bpimg5/2mamcR/1SyJg6_SX160Y160/1722332106/tiebreak-ace-edition-ps4.webp" srcset="//bbpcdn.pstatic.gr/bpimg5/2mamcR/1SyJg6_SX320Y320/1722332106/tiebreak-ace-edition-ps4.webp 2x"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/6041/playstation-4-games.html?deals=11">PS4 Games</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2159813701/tiebreak-ace-edition-ps4.html?bpref=home-deals" title="Tiebreak Ace Edition PS4">Tiebreak Ace Edition PS4</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--30">-36%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2159813701/tiebreak-ace-edition-ps4.html?bpref=home-deals"><div className="p__price--current">25,10€</div><del className="p__price--before">39,21€</del></a><div className="p__merchants">14 καταστήματα</div></div></div></div>
                        <div data-id="2160369573" data-cid="8273" data-price="4848" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2160369573/wwe-2k25-ps5.html?bpref=home-deals"><img width="160" height="160" alt="WWE 2K25 PS5" src="//bbpcdn.pstatic.gr/bpimg37/2mcGOx/1TIUNF_SX160Y160/1739536087/wwe-2k25-ps5.webp" srcset="//bbpcdn.pstatic.gr/bpimg37/2mcGOx/1TIUNF_SX320Y320/1739536087/wwe-2k25-ps5.webp 2x" loading="lazy"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/8273/ps5-games.html?deals=11">PS5 Games</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2160369573/wwe-2k25-ps5.html?bpref=home-deals" title="WWE 2K25 PS5">WWE 2K25 PS5</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--20">-21%</div></div><div className="p__badge p__badge--new">Νέο</div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2160369573/wwe-2k25-ps5.html?bpref=home-deals"><div className="p__price--current">48,48€</div><del className="p__price--before">61,36€</del></a><div className="p__merchants">19 καταστήματα</div></div></div></div>
                        <div data-id="2156787777" data-cid="889" data-price="2090" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2156787777/battlefield-2042-pc.html?bpref=home-deals"><img width="160" height="160" alt="Battlefield 2042 PC" src="//bbpcdn.pstatic.gr/bpimg1/2lXF1D/1QY6bE_SX160Y160/1698825770/battlefield-2042-pc.webp" srcset="//bbpcdn.pstatic.gr/bpimg1/2lXF1D/1QY6bE_SX320Y320/1698825770/battlefield-2042-pc.webp 2x" loading="lazy"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/889/pc-games.html?deals=11">PC Games</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2156787777/battlefield-2042-pc.html?bpref=home-deals" title="Battlefield 2042 PC">Battlefield 2042 PC</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--30">-30%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2156787777/battlefield-2042-pc.html?bpref=home-deals"><div className="p__price--current">20,90€</div><del className="p__price--before">29,85€</del></a><div className="p__merchants">3 καταστήματα</div></div></div></div>
                        <div data-id="2160423488" data-cid="813" data-price="16370" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2160423488/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.html?bpref=home-deals"><img width="160" height="160" alt="Xiaomi Buds 5 Pro Ακουστικά Bluetooth In Ear Ανθεκτικά στο Νερό Titan Grey" src="//bbpcdn.pstatic.gr/bpimg31/cckfd/1TU6Ai_SX160Y160/1742202994/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.webp" srcset="//bbpcdn.pstatic.gr/bpimg31/cckfd/1TU6Ai_SX320Y320/1742202994/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.webp 2x" loading="lazy"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/813/bluetooth.html?deals=11">Bluetooth Handsfree</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2160423488/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.html?bpref=home-deals" title="Xiaomi Buds 5 Pro Ακουστικά Bluetooth In Ear Ανθεκτικά στο Νερό Titan Grey">Xiaomi Buds 5 Pro Ακουστικά Bluetooth In Ear Ανθεκτικά στο Νερό Titan Grey</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--30">-33%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2160423488/xiaomi-buds-5-pro-akoystika-bluetooth-in-ear-anthektika-sto-nero-titan-grey.html?bpref=home-deals"><div className="p__price--current">163,70€</div><del className="p__price--before">244,32€</del></a><div className="p__merchants">6 καταστήματα</div></div></div></div>
                        <div data-id="2158677064" data-cid="6041" data-price="1440" className="p p--deal p--top-padding"><div className="p__actions" data-js=""><div className="p__action" role="button" aria-label="All product actions"><svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/actions.svg#icon-more-vertical"></use></svg></div></div><a className="p__cover" href="/item/2158677064/fahrenheit-ps4.html?bpref=home-deals"><img width="160" height="160" alt="Fahrenheit PS4" src="//bbpcdn.pstatic.gr/bpimg45/8CMaN/1TYrWh_SX160Y160/1743238393/fahrenheit-ps4.webp" srcset="//bbpcdn.pstatic.gr/bpimg45/8CMaN/1TYrWh_SX320Y320/1743238393/fahrenheit-ps4.webp 2x" loading="lazy"/></a><div className="p__main"><div className="p__meta"><div className="p__category"><a href="/cat/6041/playstation-4-games.html?deals=11">PS4 Games</a></div><h3 className="p__title p__title--lines p__title--lines-2"><a href="/item/2158677064/fahrenheit-ps4.html?bpref=home-deals" title="Fahrenheit PS4">Fahrenheit PS4</a></h3></div><div className="p__badges"> <div className="p__badges-drop"><div className="p__badge p__badge--drop drop drop--40">-46%</div></div></div></div><div className="p__footer"><div className="p__price-merchants"><a className="p__price" href="/item/2158677064/fahrenheit-ps4.html?bpref=home-deals"><div className="p__price--current">14,40€</div><del className="p__price--before">26,66€</del></a><div className="p__merchants">6 καταστήματα</div></div></div></div>
                        <a href="/deals" className="more-link"><div className="more-link__icon"><svg aria-hidden="true" className="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-forwards-16"></use></svg></div><div className="more-link__label">Όλες οι προσφορές</div></a>
                          
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-direct-deals__placeholder">
              <section class="section">
                <header class="section__header">
                  <hgroup class="section__hgroup">
                    <h2 class="section__title">Επιλεγμένες Hot προσφορές!</h2>
                    <p class="section__subtitle">Μοναδικές προσφορές από επιλεγμένα καταστήματα που δεν πρέπει να χάσεις</p>
                  </hgroup>
                </header>
                <div class="p__products">
                  <div class="p QkspaEQsTHQvpauTgiMf p--deal p--top-padding" data-js="true" data-id="166021870" data-adult="true"><a class="p__cover" rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" href="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal"><img width="220" height="220" loading="lazy" alt="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" srcset="//bbpcdn.pstatic.gr/bpimg43/2maCv1/1SHu88_SX440Y440/1724418904014/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.webp 2x" src="//bbpcdn.pstatic.gr/bpimg43/2maCv1/1SHu88_SX220Y220/1724418904014/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.webp"></a><div class="p__main"><div class="p__badges"><div class="p__badges-drop"><div class="p__badge p__badge--drop drop drop--10"><svg class="icon" aria-hidden="true" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-flame-16"></use></svg>-17%</div></div></div><div class="p__meta"><div class="p__category"><a href="/cat/2485/psygeia.html?deals=1">Ψυγεία</a></div><h3 class="p__title p__title--lines p__title--lines-3"><a rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" href="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal">Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox</a></h3></div></div><div class="p__footer"><div class="p__price-merchants"><a class="p__price" rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox" href="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal"><div class="p__price--current">699,00€</div><del class="p__price--before">842,17€</del></a></div></div><div class="p__children"><div class="otVkgH1Tus7h_aaccPIA"><div class="H5kO4t1qABiJBBYvNKE3"><a href="/to/166021870/candy-cfqq5t817ewps-psygeio-ntoylapa-463lt-full-no-frost-y181-5xp58-3xv65cm-inox.html?bpref=direct-deal" class="button" rel="nofollow" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox">Πρόλαβέ το!</a><a href="/item/2159876331" class="button button--outline" title="Candy CFQQ5T817EWPS Ψυγείο Ντουλάπα 463lt Full No Frost Υ181.5xΠ58.3xΒ65cm Inox">Τιμές (6)</a></div><div class="fza04vrCJj9rfeBY29b4"><img alt="Public logo" loading="lazy" width="90" height="30" src="//orig-bpcdn.pstatic.gr/bpmerchants/743.svg?1594713080"></div></div></div></div>
                </div>
                <div class="expand"><button class="button">Περισσότερες Hot προσφορές<svg class="icon" aria-hidden="true" width="8" height="8"><use xlink:href="/public/dist/images/icons/icons.svg#icon-down-8"></use></svg></button></div>
              </section>
            </div>
            
            <div class="h-collections">
              <div class="h-header">
                <div class="h-header__hgroup">
                  <div class="section__title">Συλλογές προϊόντων</div>
                </div>
              </div>
              <div class="h-collections__placeholder"></div>
            </div>
            
            <section className="section h-queries"><header className="section__header"><div className="section__hgroup"><div className="section__title">Δημοφιλείς αναζητήσεις</div></div></header><div className="h-queries__list"><a title="iPhone 16" href="/search?q=iphone%2016&amp;bpref=home-queries" className="h-queries__q">iPhone 16</a><a title="iPhone 16 Pro Max" href="/search?q=iphone%2016%20pro%20max&amp;bpref=home-queries" className="h-queries__q">iPhone 16 Pro Max</a><a title="Samsung Galaxy S25 Ultra" href="/search?q=samsung%20galaxy%20s25%20ultra&amp;bpref=home-queries" className="h-queries__q">Samsung Galaxy S25 Ultra</a><a title="Xiaomi 15 Ultra" href="/search?q=xiaomi%2015%20ultra&amp;bpref=home-queries" className="h-queries__q">Xiaomi 15 Ultra</a><a title="PS5" href="/search?q=ps5&amp;bpref=home-queries" className="h-queries__q">PS5</a><a title="RX 9070 XT" href="/search?q=rx%209070%20xt&amp;bpref=home-queries" className="h-queries__q">RX 9070 XT</a><a title="iPhone 15" href="/search?q=iphone%2015&amp;bpref=home-queries" className="h-queries__q">iPhone 15</a><a title="Jordan 4" href="/search?q=jordan%204&amp;bpref=home-queries" className="h-queries__q">Jordan 4</a><a title="iPhone 13" href="/search?q=iphone%2013&amp;bpref=home-queries" className="h-queries__q">iPhone 13</a><a title="Samsung Galaxy S25" href="/search?q=samsung%20galaxy%20s25&amp;bpref=home-queries" className="h-queries__q">Samsung Galaxy S25</a><a title="Samsung a56" href="/search?q=samsung%20a56&amp;bpref=home-queries" className="h-queries__q">Samsung a56</a><a title="iPhone 16 Pro" href="/search?q=iphone%2016%20pro&amp;bpref=home-queries" className="h-queries__q">iPhone 16 Pro</a><a title="New Balance 9060" href="/search?q=new%20balance%209060&amp;bpref=home-queries" className="h-queries__q">New Balance 9060</a><a title="Γυαλιά ηλίου" href="/search?q=%CE%B3%CF%85%CE%B1%CE%BB%CE%B9%CE%B1%20%CE%B7%CE%BB%CE%B9%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Γυαλιά ηλίου</a><a title="Nike TN" href="/search?q=nike%20tn&amp;bpref=home-queries" className="h-queries__q">Nike TN</a><a title="New Balance 530" href="/search?q=new%20balance%20530&amp;bpref=home-queries" className="h-queries__q">New Balance 530</a><a title="Poco X7 Pro" href="/search?q=poco%20x7%20pro&amp;bpref=home-queries" className="h-queries__q">Poco X7 Pro</a><a title="Nike Air Force" href="/search?q=nike%20air%20force&amp;bpref=home-queries" className="h-queries__q">Nike Air Force</a><a title="iPhone 14" href="/search?q=iphone%2014&amp;bpref=home-queries" className="h-queries__q">iPhone 14</a><a title="Samsung S24 Ultra" href="/search?q=samsung%20s24%20ultra&amp;bpref=home-queries" className="h-queries__q">Samsung S24 Ultra</a><a title="Κλιματιστικά" href="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά</a><a title="Nike Air Max" href="/search?q=nike%20air%20max&amp;bpref=home-queries" className="h-queries__q">Nike Air Max</a><a title="iPhone 15 Pro Max" href="/search?q=iphone%2015%20pro%20max&amp;bpref=home-queries" className="h-queries__q">iPhone 15 Pro Max</a><a title="Air fryer" href="/search?q=air%20fryer&amp;bpref=home-queries" className="h-queries__q">Air fryer</a><a title="iPhone" href="/search?q=iphone&amp;bpref=home-queries" className="h-queries__q">iPhone</a><a title="AirPods" href="/search?q=airpods&amp;bpref=home-queries" className="h-queries__q">AirPods</a><a title="Ψυγειοκαταψύκτες" href="/search?q=%CF%88%CF%85%CE%B3%CE%B5%CE%B9%CE%BF%CE%BA%CE%B1%CF%84%CE%B1%CF%88%CF%85%CE%BA%CF%84%CE%B5%CF%82&amp;bpref=home-queries" className="h-queries__q">Ψυγειοκαταψύκτες</a><a title="Smartwatch" href="/search?q=smartwatch&amp;bpref=home-queries" className="h-queries__q">Smartwatch</a><a title="Laptop" href="/search?q=laptop&amp;bpref=home-queries" className="h-queries__q">Laptop</a><a title="Apple Watch" href="/search?q=apple%20watch&amp;bpref=home-queries" className="h-queries__q">Apple Watch</a><a title="iPhone 14 Pro Max" href="/search?q=iphone%2014%20pro%20max&amp;bpref=home-queries" className="h-queries__q">iPhone 14 Pro Max</a><a title="Πλυντήριο ρούχων" href="/search?q=%CF%80%CE%BB%CF%85%CE%BD%CF%84%CE%B7%CF%81%CE%B9%CE%BF%20%CF%81%CE%BF%CF%85%CF%87%CF%89%CE%BD&amp;bpref=home-queries" className="h-queries__q">Πλυντήριο ρούχων</a><a title="iPad" href="/search?q=ipad&amp;bpref=home-queries" className="h-queries__q">iPad</a><a title="iPhone 15 Pro" href="/search?q=iphone%2015%20pro&amp;bpref=home-queries" className="h-queries__q">iPhone 15 Pro</a><a title="Xiaomi Redmi Note 14 Pro" href="/search?q=xiaomi%20redmi%20note%2014%20pro&amp;bpref=home-queries" className="h-queries__q">Xiaomi Redmi Note 14 Pro</a><a title="New Balance 530" href="/search?q=new%20balance%20530&amp;bpref=home-queries" className="h-queries__q">New Balance 530</a><a title="Αντλίες θερμότητας" href="/search?q=%CE%B1%CE%BD%CF%84%CE%BB%CE%B9%CE%B5%CF%82%20%CE%B8%CE%B5%CF%81%CE%BC%CE%BF%CF%84%CE%B7%CF%84%CE%B1%CF%82&amp;bpref=home-queries" className="h-queries__q">Αντλίες θερμότητας</a><a title="Χαλιά σαλονιού" href="/search?q=%CF%87%CE%B1%CE%BB%CE%B9%CE%B1%20%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%B9%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Χαλιά σαλονιού</a><a title="Xiaomi redmi note 13 pro" href="/search?q=xiaomi%20redmi%20note%2013%20pro&amp;bpref=home-queries" className="h-queries__q">Xiaomi redmi note 13 pro</a><a title="Air Condition" href="/search?q=air%20condition&amp;bpref=home-queries" className="h-queries__q">Air Condition</a><a title="Nike Air Force 1" href="/search?q=nike%20air%20force%201&amp;bpref=home-queries" className="h-queries__q">Nike Air Force 1</a><a title="iPhone 11" href="/search?q=iphone%2011&amp;bpref=home-queries" className="h-queries__q">iPhone 11</a><a title="Ποδοσφαιρικά παπούτσια" href="/search?q=%CF%80%CE%BF%CE%B4%CE%BF%CF%83%CF%86%CE%B1%CE%B9%CF%81%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Ποδοσφαιρικά παπούτσια</a><a title="Macbook" href="/search?q=macbook&amp;bpref=home-queries" className="h-queries__q">Macbook</a><a title="Κλιματιστικά 9000 BTU" href="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%209000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 9000 BTU</a><a title="Φορητά κλιματιστικά" href="/search?q=%CF%86%CE%BF%CF%81%CE%B7%CF%84%CE%B1%20%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1&amp;bpref=home-queries" className="h-queries__q">Φορητά κλιματιστικά</a><a title="Air cooler" href="/search?q=air%20cooler&amp;bpref=home-queries" className="h-queries__q">Air cooler</a><a title="Σκηνή κάμπινγκ	" href="/search?q=%CF%83%CE%BA%CE%B7%CE%BD%CE%B7%20%CE%BA%CE%B1%CE%BC%CF%80%CE%B9%CE%BD%CE%B3%CE%BA&amp;bpref=home-queries" className="h-queries__q">Σκηνή κάμπινγκ	</a><a title="Κλιματιστικά 12000 BTU" href="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%2012000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 12000 BTU</a><a title="Γυναικεία πέδιλα" href="/search?q=%CE%B3%CF%85%CE%BD%CE%B1%CE%B9%CE%BA%CE%B5%CE%B9%CE%B1%20%CF%80%CE%B5%CE%B4%CE%B9%CE%BB%CE%B1&amp;bpref=home-queries" className="h-queries__q">Γυναικεία πέδιλα</a><a title="Κλιματιστικά 18000 BTU" href="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%2018000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 18000 BTU</a><a title="Smartphone" href="/search?q=smartphone&amp;bpref=home-queries" className="h-queries__q">Smartphone</a><a title="Καρεκλάκια παραλίας" href="/search?q=%CE%BA%CE%B1%CF%81%CE%B5%CE%BA%CE%BB%CE%B1%CE%BA%CE%B9%CE%B1%20%CF%80%CE%B1%CF%81%CE%B1%CE%BB%CE%B9%CE%B1%CF%82&amp;bpref=home-queries" className="h-queries__q">Καρεκλάκια παραλίας</a><a title="Αντηλιακά" href="/search?q=%CE%B1%CE%BD%CF%84%CE%B7%CE%BB%CE%B9%CE%B1%CE%BA%CE%B1&amp;bpref=home-queries" className="h-queries__q">Αντηλιακά</a><a title="Sneakers" href="/search?q=sneakers&amp;bpref=home-queries" className="h-queries__q">Sneakers</a><a title="Nike Air Jordan 1" href="/search?q=nike%20air%20jordan%201&amp;bpref=home-queries" className="h-queries__q">Nike Air Jordan 1</a><a title="PS5 Slim" href="/search?q=ps5%20slim&amp;bpref=home-queries" className="h-queries__q">PS5 Slim</a><a title="Nike Air Max 97" href="/search?q=nike%20air%20max%2097&amp;bpref=home-queries" className="h-queries__q">Nike Air Max 97</a><a title="Smart TV" href="/search?q=smart%20tv&amp;bpref=home-queries" className="h-queries__q">Smart TV</a><a title="Ανεμιστήρες οροφής" href="/search?q=%CE%B1%CE%BD%CE%B5%CE%BC%CE%B9%CF%83%CF%84%CE%B7%CF%81%CE%B5%CF%82%20%CE%BF%CF%81%CE%BF%CF%86%CE%B7%CF%82&amp;bpref=home-queries" className="h-queries__q">Ανεμιστήρες οροφής</a><a title="Παιδικά παπούτσια" href="/search?q=%CF%80%CE%B1%CE%B9%CE%B4%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Παιδικά παπούτσια</a><a title="Samsung Galaxy A54" href="/search?q=samsung%20galaxy%20a54&amp;bpref=home-queries" className="h-queries__q">Samsung Galaxy A54</a><a title="Ανεμιστήρες δαπέδου" href="/search?q=%CE%B1%CE%BD%CE%B5%CE%BC%CE%B9%CF%83%CF%84%CE%B7%CF%81%CE%B5%CF%82%20%CE%B4%CE%B1%CF%80%CE%B5%CE%B4%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Ανεμιστήρες δαπέδου</a><a title="Κλιματιστικά 24000 BTU" href="/search?q=%CE%BA%CE%BB%CE%B9%CE%BC%CE%B1%CF%84%CE%B9%CF%83%CF%84%CE%B9%CE%BA%CE%B1%2024000%20btu&amp;bpref=home-queries" className="h-queries__q">Κλιματιστικά 24000 BTU</a><a title="Παιχνίδια" href="/search?q=%CF%80%CE%B1%CE%B9%CF%87%CE%BD%CE%B9%CE%B4%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Παιχνίδια</a><a title="Nintendo Switch" href="/search?q=nintendo%20switch&amp;bpref=home-queries" className="h-queries__q">Nintendo Switch</a><a title="Καφετιέρα espresso
" href="/search?q=%CE%BA%CE%B1%CF%86%CE%B5%CF%84%CE%B9%CE%B5%CF%81%CE%B1%20espresso&amp;bpref=home-queries" className="h-queries__q">Καφετιέρα espresso
</a><a title="Αθλητικά παπουτσια" href="/search?q=%CE%B1%CE%B8%CE%BB%CE%B7%CF%84%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Αθλητικά παπουτσια</a><a title="Ισιωτική μαλλιών" href="/search?q=%CE%B9%CF%83%CE%B9%CF%89%CF%84%CE%B9%CE%BA%CE%B7%20%CE%BC%CE%B1%CE%BB%CE%BB%CE%B9%CF%89%CE%BD&amp;bpref=home-queries" className="h-queries__q">Ισιωτική μαλλιών</a><a title="Παιδικά παπούτσια" href="/search?q=%CF%80%CE%B1%CE%B9%CE%B4%CE%B9%CE%BA%CE%B1%20%CF%80%CE%B1%CF%80%CE%BF%CF%85%CF%84%CF%83%CE%B9%CE%B1&amp;bpref=home-queries" className="h-queries__q">Παιδικά παπούτσια</a><a title="Αλυσοπρίονο μπαταρίας" href="/search?q=%CE%B1%CE%BB%CF%85%CF%83%CE%BF%CF%80%CF%81%CE%B9%CE%BF%CE%BD%CE%BF%20%CE%BC%CF%80%CE%B1%CF%84%CE%B1%CF%81%CE%B9%CE%B1%CF%82&amp;bpref=home-queries" className="h-queries__q">Αλυσοπρίονο μπαταρίας</a><a title="Καναπές κρεβάτι" href="/search?q=%CE%BA%CE%B1%CE%BD%CE%B1%CF%80%CE%B5%CF%82%20%CE%BA%CF%81%CE%B5%CE%B2%CE%B1%CF%84%CE%B9&amp;bpref=home-queries" className="h-queries__q">Καναπές κρεβάτι</a><a title="Airpods Pro" href="/search?q=airpods%20pro&amp;bpref=home-queries" className="h-queries__q">Airpods Pro</a><a title="Γωνιακός καναπές" href="/search?q=%CE%B3%CF%89%CE%BD%CE%B9%CE%B1%CE%BA%CE%BF%CF%82%20%CE%BA%CE%B1%CE%BD%CE%B1%CF%80%CE%B5%CF%82&amp;bpref=home-queries" className="h-queries__q">Γωνιακός καναπές</a><a title="PS5 controller" href="/search?q=ps5%20controller&amp;bpref=home-queries" className="h-queries__q">PS5 controller</a><a title="Πολυθρόνα κρεβάτι" href="/search?q=%CF%80%CE%BF%CE%BB%CF%85%CE%B8%CF%81%CE%BF%CE%BD%CE%B1%20%CE%BA%CF%81%CE%B5%CE%B2%CE%B1%CF%84%CE%B9&amp;bpref=home-queries" className="h-queries__q">Πολυθρόνα κρεβάτι</a><a title="Birkenstock" href="/search?q=birkenstock&amp;bpref=home-queries" className="h-queries__q">Birkenstock</a><a title="Αλυσίδες χιονιού" href="/search?q=%CE%B1%CE%BB%CF%85%CF%83%CE%B9%CE%B4%CE%B5%CF%82%20%CF%87%CE%B9%CE%BF%CE%BD%CE%B9%CE%BF%CF%85&amp;bpref=home-queries" className="h-queries__q">Αλυσίδες χιονιού</a></div></section>
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
