
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Find the Best Prices on Everything</h1>
        <p>Compare prices across thousands of products and vendors</p>
        <div className="hero-cta">
          <Link to="/categories" className="button button-primary">Browse Categories</Link>
          <Link to="/deals" className="button button-secondary">View Deals</Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
