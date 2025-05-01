
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchDeals, 
  getCategories, 
  formatSlug 
} from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Deals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch deals
    setIsLoading(true);
    fetchDeals().then(data => {
      setDeals(data);
      setIsLoading(false);
    });

    // Fetch categories
    setCategories(getCategories());
  }, []);

  // Filter deals by selected category
  const filteredDeals = selectedCategory
    ? deals.filter(deal => String(deal.categoryId) === selectedCategory)
    : deals;

  // Get main categories (no parent)
  const mainCategories = categories.filter(category => !category.parentId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Today's Best Deals</h1>

      {/* Category filter */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Deals
          </Button>
          
          {mainCategories.map(category => {
            const categorySlug = category.slug || formatSlug(category.name);
            
            return (
              <Button
                key={category.id}
                variant={selectedCategory === String(category.id) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(String(category.id))}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Deals grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
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
      ) : filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map(deal => (
            <ProductCard key={deal.id} product={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg">
          <p className="text-gray-500 mb-4">No deals available in this category at the moment.</p>
          <Button onClick={() => setSelectedCategory(null)}>View All Deals</Button>
        </div>
      )}
      
      {/* Browse all categories */}
      <div className="mt-12">
        <h2 className="text-xl font-medium mb-4">Browse All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mainCategories.slice(0, 6).map(category => {
            const categorySlug = category.slug || formatSlug(category.name);
            
            return (
              <Link
                key={category.id}
                to={`/cat/${category.id}/${categorySlug}`}
                className="border rounded-lg p-4 text-center hover:bg-gray-50 hover:border-primary transition"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  {/* Placeholder for category icon */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Deals;
