
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
    <div class="h-promos__wrapper root__wrapper">
      <div class="h-promos__slides" data-count="2">
        <div class="h-promos__slide-wrapper" data-id="bp-credits-club">
          <div class="h-promos__slide">
            <style data-scope="promosHome" data-bundle="bp-credits-club" data-promoshome-js-empty="" data-promoshome-css="bp-credits-club">{`.promo-credits-club{display:-webkit-flex;display:-ms-flexbox;display:flex;background:#ec1639;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:1.05rem 1.05rem 0;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;cursor:pointer}@media only screen and (min-width:35.5em){.promo-credits-club{-webkit-flex-direction:row-reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;padding:0 2rem 0 0;gap:1.5rem}}@media only screen and (min-width:48em){.promo-credits-club{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:1.05rem 1.05rem 0}}@media only screen and (min-width:64em){.promo-credits-club{-webkit-flex-direction:row-reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;padding:0 2rem 0 0;gap:1.5rem}}.promo-credits-club__info{display:grid;grid-template-columns:1fr 1fr;grid-template-columns:auto-columns;gap:.5rem;-webkit-align-items:center;-ms-flex-align:center;align-items:center}@media only screen and (min-width:35.5em){.promo-credits-club__info{gap:1.5rem;grid-template-columns:1fr;-webkit-align-items:center;-ms-flex-align:center;align-items:center;align-self:center}.promo-credits-club__info img{width:150px;height:auto}}@media only screen and (min-width:48em){.promo-credits-club__info{grid-template-columns:1fr 1fr;grid-template-columns:auto-columns;gap:.5rem;-webkit-align-items:center;-ms-flex-align:center;align-items:center}}@media only screen and (min-width:64em){.promo-credits-club__info{gap:1.5rem;grid-template-columns:1fr;-webkit-align-items:center;-ms-flex-align:center;align-items:center;align-self:center}.promo-credits-club__info img{width:150px;height:auto}}.promo-credits-club__illustration{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}@media only screen and (min-width:35.5em){.promo-credits-club__illustration{height:auto;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;position:relative;top:1px}.promo-credits-club__illustration img{width:459px;height:243px}}@media only screen and (min-width:48em){.promo-credits-club__illustration{height:auto;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.promo-credits-club__illustration img{width:300px;height:158px}}@media only screen and (min-width:64em){.promo-credits-club__illustration{height:auto;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;top:1px}.promo-credits-club__illustration img{width:459px;height:243px}}@media only screen and (min-width:80em){.promo-credits-club__illustration img{width:510px;height:270px}}.promo-credits-club__cta{color:#d41433;background:#fff;padding:.8rem 1rem;font-size:.8rem;font-weight:700;text-align:center;border-radius:24px;transition:box-shadow .2s ease-in-out}.promo-credits-club__cta:hover{box-shadow:0 4px 4px 0 rgba(0,0,0,.25)}@media only screen and (min-width:48em){.promo-credits-club__cta{font-size:.9rem}}@media only screen and (min-width:64em){.promo-credits-club__cta{padding:1rem 1.2rem;font-size:1.1rem}}`}</style>
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
  );
};

export default Index;
