import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust import paths as necessary
import ProductCard from '@/components/ProductCard'; // Adjust the import path

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { slug } = useParams<{ slug: string }>(); // This is just to capture the slug

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);

  // Find the subcategory based on the ID from the URL
  const subCategoryId = parseInt(categoryId);
  const subCategory = categories.find(cat => cat.id === subCategoryId);

  useEffect(() => {
    if (subCategory) {
      setCurrentCategory(subCategory);
      // Filter products based on category ID
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
    }
  }, [subCategory, subCategoryId]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <header className="page-header">
            <h1>{currentCategory.name}</h1>
            <div>{filteredProducts.length} products</div>
          </header>
          <main>
            {renderAppliedFilters()}
            <div className="page-header__sorting">
              {/* Put sorting tabs logic here if necessary */}
            </div>
            {filteredProducts.length === 0 ? (
              <p>No products found matching your search.</p>
            ) : (
              <div className="page-products__main-wrapper">
                <div className="p__products" data-pagination="">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
