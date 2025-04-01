
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
                    <img width="34" height="42" alt="Deals icon" class="h-categories__image" src="//bp.pstatic.gr/images/flame.svg">
                    </div>
                    <h2 class="h-categories__label">Προσφορές</h2>
                  </a>
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
