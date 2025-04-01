
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

      <div className=""h-promos__wrapper root__wrapper">
  <div className=""h-promos__slides" data-count="2">

    <div className=""h-promos__slide-wrapper" data-id="bp-credits-club"><div className=""h-promos__slide"><style data-scope="promosHome" data-bundle="bp-credits-club" data-promoshome-js-empty="" data-promoshome-css="bp-credits-club">.promo-credits-club{display:-webkit-flex;display:-ms-flexbox;display:flex;background:#ec1639;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:1.05rem 1.05rem 0;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;cursor:pointer}@media only screen and (min-width:35.5em){.promo-credits-club{-webkit-flex-direction:row-reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;padding:0 2rem 0 0;gap:1.5rem}}@media only screen and (min-width:48em){.promo-credits-club{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:1.05rem 1.05rem 0}}@media only screen and (min-width:64em){.promo-credits-club{-webkit-flex-direction:row-reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;padding:0 2rem 0 0;gap:1.5rem}}.promo-credits-club__info{display:grid;grid-template-columns:1fr 1fr;grid-template-columns:auto-columns;gap:.5rem;-webkit-align-items:center;-ms-flex-align:center;align-items:center}@media only screen and (min-width:35.5em){.promo-credits-club__info{gap:1.5rem;grid-template-columns:1fr;-webkit-align-items:center;-ms-flex-align:center;align-items:center;align-self:center}.promo-credits-club__info img{width:150px;height:auto}}@media only screen and (min-width:48em){.promo-credits-club__info{grid-template-columns:1fr 1fr;grid-template-columns:auto-columns;gap:.5rem;-webkit-align-items:center;-ms-flex-align:center;align-items:center}}@media only screen and (min-width:64em){.promo-credits-club__info{gap:1.5rem;grid-template-columns:1fr;-webkit-align-items:center;-ms-flex-align:center;align-items:center;align-self:center}.promo-credits-club__info img{width:150px;height:auto}}.promo-credits-club__illustration{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}@media only screen and (min-width:35.5em){.promo-credits-club__illustration{height:auto;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;position:relative;top:1px}.promo-credits-club__illustration img{width:459px;height:243px}}@media only screen and (min-width:48em){.promo-credits-club__illustration{height:auto;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.promo-credits-club__illustration img{width:300px;height:158px}}@media only screen and (min-width:64em){.promo-credits-club__illustration{height:auto;-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;top:1px}.promo-credits-club__illustration img{width:459px;height:243px}}@media only screen and (min-width:80em){.promo-credits-club__illustration img{width:510px;height:270px}}.promo-credits-club__cta{color:#d41433;background:#fff;padding:.8rem 1rem;font-size:.8rem;font-weight:700;text-align:center;border-radius:24px;transition:box-shadow .2s ease-in-out}.promo-credits-club__cta:hover{box-shadow:0 4px 4px 0 rgba(0,0,0,.25)}@media only screen and (min-width:48em){.promo-credits-club__cta{font-size:.9rem}}@media only screen and (min-width:64em){.promo-credits-club__cta{padding:1rem 1.2rem;font-size:1.1rem}}</style><div className=""promo promo-credits-club" data-listener-added="true">
  <div className=""promo-credits-club__info">
    <img src="//bp.pstatic.gr/promosHome/bp-credits-club/./bpcc-logo-bw.svg" width="125" height="55" alt="BP Credits Club" loading="eager">
    <div className=""promo-credits-club__cta">
      Γίνε μέλος ›
    </div>
  </div>
  <div className=""promo-credits-club__illustration">
    <img src="//bp.pstatic.gr/promosHome/bp-credits-club/./illustration.svg" width="300" height="158" alt="BP Credits Club illustration" loading="eager">
  </div>
</div></div></div><div className=""h-promos__slide-wrapper" data-id="easter-gifts-2025"><div className=""h-promos__slide"><style data-scope="promosHome" data-bundle="easter-gifts-2025" data-promoshome-js-empty="" data-promoshome-css="easter-gifts-2025">.easter-gifts-promo{display:grid;background:#f0b0bc;gap:.7rem;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;justify-items:center;-webkit-align-content:baseline;-ms-flex-line-pack:baseline;align-content:baseline;position:relative}@media only screen and (min-width:80em){.easter-gifts-promo{overflow:visible;padding:1.8rem 2.2rem}}.easter-gifts-promo:before{content:'';background:url(https://bp.pstatic.gr/public/dist/f4fffba664f88c104032.png);background-position:center;background-repeat:no-repeat;background-size:contain;position:absolute;width:170px;height:130px;bottom:-10px;left:-50px}@media only screen and (min-width:64em){.easter-gifts-promo:before{width:230px;height:180px}}@media only screen and (min-width:80em){.easter-gifts-promo:before{left:-20px}}.easter-gifts-promo:after{content:'';background:url(https://bp.pstatic.gr/public/dist/1ed371b4bc4d7d08931c.png);background-position:center;background-repeat:no-repeat;background-size:contain;position:absolute;width:120px;height:240px;bottom:-10px;right:-30px}@media only screen and (min-width:64em){.easter-gifts-promo:after{width:160px;height:330px;bottom:-25px;right:-48px}}@media only screen and (min-width:80em){.easter-gifts-promo:after{right:-25px}}.easter-gifts-promo__title{font-size:1.375rem;font-weight:700;color:#ec1639}@media only screen and (min-width:64em){.easter-gifts-promo__title{font-size:2rem}}.easter-gifts-promo__content{display:grid;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;grid-template-rows:repeat(4,1fr);gap:.2rem;z-index:1;grid-auto-flow:column}@media only screen and (min-width:25.8em){.easter-gifts-promo__content{gap:.2rem 4.0625rem}}@media only screen and (min-width:48em){.easter-gifts-promo__content{gap:.2rem .9375rem}}@media only screen and (min-width:64em){.easter-gifts-promo__content{gap:.3rem .9375rem}}.easter-gifts-promo__cta,.easter-gifts-promo__subtitle{color:#fff!important;padding:10px 0;border-radius:25px;font-weight:500;text-align:center;font-size:1rem;text-wrap:nowrap;text-decoration:none!important;transition:background .3s ease-in-out}.easter-gifts-promo__cta{padding:9px 20px}@media only screen and (min-width:35.5em){.easter-gifts-promo__cta{padding:10px 35px}}@media only screen and (min-width:48em){.easter-gifts-promo__cta{padding:10px 20px}}@media only screen and (min-width:64em){.easter-gifts-promo__cta{padding:10px 25px}}@media only screen and (min-width:80em){.easter-gifts-promo__cta{padding:11px 25px}}.easter-gifts-promo__cta--boy{background:#056ecb}.easter-gifts-promo__cta--boy:hover{background:#0a5ea9}.easter-gifts-promo__cta--girl{background:#ff847d}.easter-gifts-promo__cta--girl:hover{background:#fa6e66}</style>
<section className=""promo easter-gifts-promo">
  <span className=""easter-gifts-promo__title">Δώρα για το βαφτιστήρι</span>
  <div className=""easter-gifts-promo__content">
                  <span className=""easter-gifts-promo__subtitle">
          Για αγόρι        </span>
                        <a title="Ρούχα Αγοριών" href="/cat/2141/rouxa-agorion.html?bpref=home-promo" className=""easter-gifts-promo__cta easter-gifts-promo__cta--boy">
          Ρούχα        </a>
                        <a title="Παπούτσια Αγοριών" href="/cat/6430/papoutsia-gia-agoria.html?bpref=home-promo" className=""easter-gifts-promo__cta easter-gifts-promo__cta--boy">
          Παπούτσια        </a>
                        <a title="Λαμπάδες Αγοριών" href="/cat/5925/pasxalines-lampades/f/2858_2/agori.html?bpref=home-promo" className=""easter-gifts-promo__cta easter-gifts-promo__cta--boy">
          Λαμπάδες        </a>
                        <span className=""easter-gifts-promo__subtitle">
          Για κορίτσι        </span>
                        <a title="Ρούχα Κοριτσιών" href="/cat/2157/rouxa-koritsion.html?bpref=home-promo" className=""easter-gifts-promo__cta easter-gifts-promo__cta--girl">
          Ρούχα        </a>
                        <a title="Παπούτσια Κοριτσιών" href="/cat/6441/papoutsia-gia-koritsia.html?bpref=home-promo" className=""easter-gifts-promo__cta easter-gifts-promo__cta--girl">
          Παπούτσια        </a>
                        <a title="Λαμπάδες Κοριτσιών" href="/cat/5925/pasxalines-lampades/f/2858_3/koritsi.html?bpref=home-promo" className=""easter-gifts-promo__cta easter-gifts-promo__cta--girl">
          Λαμπάδες        </a>
            </div>
</section></div></div>
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
