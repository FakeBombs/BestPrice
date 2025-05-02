import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts, fetchDeals, fetchNewArrivals, Product } from '@/services/productService';
import ProductGrid from '@/components/ProductGrid';
import HeroSection from '@/components/HeroSection';
import RootCategoryCard from '@/components/RootCategoryCard';
import { mainCategories } from '@/data/mockData';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fix these lines to properly await promises
        const featuredData = await fetchFeaturedProducts();
        const dealsData = await fetchDeals();
        const newArrivalsData = await fetchNewArrivals();
      
        setFeaturedProducts(featuredData);
        setDeals(dealsData);
        setNewArrivals(newArrivalsData);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroSection />
      
      <section className="section__home">
        <div className="container">
          <h2 className="section__title">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      <section className="section__home">
        <div className="container">
          <h2 className="section__title">Deals of the Week</h2>
          <ProductGrid products={deals} />
        </div>
      </section>
      
      <section className="section__home">
        <div className="container">
          <h2 className="section__title">New Arrivals</h2>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      <section className="section__home">
        <div className="container">
          <h2 className="section__title">Root Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mainCategories.map((category) => (
              <RootCategoryCard
                key={category.id}
                category={{
                  id: Number(category.id),
                  name: category.name,
                  image: category.imageUrl || '/dist/images/placeholder.svg',
                  subCategories: 10,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
