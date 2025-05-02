
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Category, getCategoryById, getSubcategoriesByParentId } from '@/services/categoryService';
import { Product, getProductsByCategory } from '@/services/productService';
import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryBreadcrumb from '@/components/category/CategoryBreadcrumb';
import RootCategoryView from '@/components/category/RootCategoryView';
import ProductGrid from '@/components/ProductGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryFilters from '@/components/category/CategoryFilters';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSubcategories, setHasSubcategories] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;

      setIsLoading(true);
      
      try {
        // Fetch the category
        const categoryData = await getCategoryById(categoryId);
        if (categoryData) {
          setCategory(categoryData);
        }

        // Fetch subcategories
        const subcategoriesData = await getSubcategoriesByParentId(categoryId);
        setSubcategories(subcategoriesData);
        setHasSubcategories(subcategoriesData.length > 0);

        // Fetch products for this category
        const productsData = await getProductsByCategory(categoryId);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  const handleSortChange = (sortValue: string) => {
    let sortedProducts = [...products];

    switch (sortValue) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real app, you would sort by date
        sortedProducts.sort(() => Math.random() - 0.5);
        break;
      default:
        // Default sort (relevance)
        break;
    }

    setProducts(sortedProducts);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  const renderCategoryContent = () => {
    if (hasSubcategories) {
      return (
        <div>
          <CategoryHeader category={category} productCount={products.length} />
          <RootCategoryView categoryId={String(categoryId)} name={category.name} />
        </div>
      );
    } else {
      return (
        <div>
          <CategoryHeader category={category} productCount={products.length} />
          <div className="mt-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <select
                  className="border rounded px-2 py-1"
                  onChange={(e) => handleSortChange(e.target.value)}
                  defaultValue="relevance"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              
              <TabsContent value="grid">
                <ProductGrid products={products} />
              </TabsContent>
              
              <TabsContent value="list">
                <ProductGrid products={products} view="list" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CategoryBreadcrumb category={category} />
      
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <CategoryFilters currentCategoryId={String(categoryId)} />
        </aside>
        
        <main className="flex-1">
          {renderCategoryContent()}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
