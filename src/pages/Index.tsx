
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
                        



                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            


            
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
