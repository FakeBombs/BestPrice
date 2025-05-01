
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchFeaturedProducts, 
  fetchDeals, 
  fetchNewArrivals, 
  getCategories,
  formatSlug
} from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Tag, Star, TrendingUp } from 'lucide-react';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all data
    setIsLoading(true);
    Promise.all([
      fetchFeaturedProducts(),
      fetchDeals(),
      fetchNewArrivals()
    ]).then(([featured, dealsData, arrivals]) => {
      setFeaturedProducts(featured);
      setDeals(dealsData);
      setNewArrivals(arrivals);
      setIsLoading(false);
    });

    // Fetch categories
    const allCategories = getCategories();
    // Filter for main categories (top-level)
    const mainCats = allCategories.filter(cat => !cat.parentId);
    setCategories(mainCats);
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  const ProductSection = ({ 
    title, 
    icon, 
    products, 
    viewAllLink,
    isLoading 
  }: { 
    title: string; 
    icon: React.ReactNode;
    products: any[]; 
    viewAllLink: string;
    isLoading: boolean;
  }) => (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <Link to={viewAllLink} className="text-primary flex items-center">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-lg overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-primary to-purple-700 h-96 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-white mb-4">
                Find the Best Deals on Products You Love
              </h1>
              <p className="text-white/90 mb-6">
                Compare prices across multiple stores and find the best deals on electronics, home goods, and more.
              </p>
              <Button size="lg">Shop Now</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link to="/categories" className="text-primary flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map(category => {
            const categorySlug = category.slug || formatSlug(category.name);
            
            return (
              <Link 
                key={category.id} 
                to={`/cat/${category.id}/${categorySlug}`}
                className="block"
              >
                <CategoryCard category={category} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <ProductSection 
        title="Featured Products" 
        icon={<Star className="h-6 w-6 text-yellow-500" />}
        products={featuredProducts} 
        viewAllLink="/search?featured=true" 
        isLoading={isLoading}
      />

      {/* Deals */}
      <ProductSection 
        title="Top Deals" 
        icon={<Tag className="h-6 w-6 text-red-500" />}
        products={deals} 
        viewAllLink="/deals" 
        isLoading={isLoading}
      />

      {/* New Arrivals */}
      <ProductSection 
        title="New Arrivals" 
        icon={<TrendingUp className="h-6 w-6 text-green-500" />}
        products={newArrivals} 
        viewAllLink="/search?sort=newest" 
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;
