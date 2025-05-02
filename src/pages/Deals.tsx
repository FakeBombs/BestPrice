
import { useState, useEffect } from 'react';
import { Category, getAllCategories } from '@/services/categoryService'; 
import { Product } from '@/services/productService';
import ProductCard from '@/components/ProductCard';

const Deals = () => {
  const [featuredDeals, setFeaturedDeals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you'd fetch deals from the API
    const fetchDeals = async () => {
      try {
        // Get categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        
        // Mock empty featured deals for now
        setFeaturedDeals([]);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeals();
  }, []);
  
  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Today's Deals</h1>
      
      {/* Featured deals section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Featured Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredDeals.map(deal => (
            <ProductCard key={deal.id} product={deal} />
          ))}
        </div>
      </section>
      
      {/* Deals by category */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Deals by Category</h2>
        {categories.slice(0, 4).map(category => (
          <div key={category.id} className="mb-8">
            <h3 className="text-lg font-medium mb-3">{category.name} Deals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* We would fetch category-specific deals here in a real app */}
              {/* For now, just displaying empty state */}
              <div className="col-span-full text-center text-gray-500">
                No current deals for {category.name}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Deals;
