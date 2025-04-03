import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';

const Index = () => {
  return (
    <div className="homepage">
      <div className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Find the best prices online</h1>
          <p className="hero__subtitle">Compare prices from hundreds of stores</p>
          <div className="hero__search">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="h-queries">
        <div className="h-queries__content">
          <div className="h-queries__list">
            <Link 
              to="/search?q=smartphones" 
              className="h-queries__item"
              title="Smartphones"
            >
              Smartphones
            </Link>
            <Link 
              to="/search?q=laptops" 
              className="h-queries__item"
              title="Laptops"
            >
              Laptops
            </Link>
            <Link 
              to="/search?q=tablets" 
              className="h-queries__item"
              title="Tablets"
            >
              Tablets
            </Link>
            <Link 
              to="/search?q=headphones" 
              className="h-queries__item"
              title="Headphones"
            >
              Headphones
            </Link>
            <Link 
              to="/search?q=smartwatches" 
              className="h-queries__item"
              title="Smartwatches"
            >
              Smartwatches
            </Link>
          </div>
        </div>
      </div>

      <div className="featured-categories">
        <h2 className="featured-categories__title">Popular Categories</h2>
        <div className="featured-categories__grid">
          <Link to="/category/electronics" className="category-card">
            <div className="category-card__icon">📱</div>
            <h3 className="category-card__title">Electronics</h3>
          </Link>
          <Link to="/category/computers" className="category-card">
            <div className="category-card__icon">💻</div>
            <h3 className="category-card__title">Computers</h3>
          </Link>
          <Link to="/category/home-appliances" className="category-card">
            <div className="category-card__icon">🏠</div>
            <h3 className="category-card__title">Home Appliances</h3>
          </Link>
          <Link to="/category/gaming" className="category-card">
            <div className="category-card__icon">🎮</div>
            <h3 className="category-card__title">Gaming</h3>
          </Link>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-section__content">
          <h2 className="cta-section__title">Never miss a deal</h2>
          <p className="cta-section__text">Sign up for price alerts and notifications</p>
          <Button size="lg" className="cta-section__button">
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
