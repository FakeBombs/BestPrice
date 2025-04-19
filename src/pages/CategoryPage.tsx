import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust import paths as necessary
import ProductCard from '@/components/ProductCard'; // Adjust the import path

const CategoryPage: React.FC = () => {
  const { categoryId, slug } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    const subCategoryId = parseInt(categoryId);
    const subCategory = categories.find(cat => cat.id === subCategoryId);

    if (subCategory) {
      setCurrentCategory(subCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
    }
  }, [categoryId, slug]); // Make sure slug is part of the dependency array

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
            <div className="page-header__sorting">
              {/* Put sorting tabs logic here if necessary */}
            </div>
      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
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
};

export default CategoryPage;
