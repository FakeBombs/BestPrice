import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { subCatId, subCatSlug } = useParams<{ subCatId: string; subCatSlug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentSubCategory, setCurrentSubCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const subCategoryId = subCatId ? parseInt(subCatId) : undefined;
    const mainCategory = categories.find(cat => cat.id === subCategoryId);

    if (mainCategory) {
      setCurrentSubCategory(mainCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
    }
  }, [subCatId]);

  if (!currentSubCategory) {
    return <h1>Category Not Found</h1>;
  }

  const sortProducts = (products: Product[]) => {
    const sortedProducts = [...products];
    switch (sortType) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => (a.prices[0]?.price || 0) - (b.prices[0]?.price || 0));
      case 'price-desc':
        return sortedProducts.sort((a, b) => (b.prices[0]?.price || 0) - (a.prices[0]?.price || 0));
      case 'rating-desc':
      default:
        return sortedProducts.sort((a, b) => b.rating - a.rating);
    }
  };

  const hasSubcategories = categories.some(cat => cat.parentId === currentSubCategory.id);

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <main className="page-products__main">
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{currentSubCategory.name}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="page-header__sorting">
              <div className="tabs">
                <div className="tabs-wrapper">
                  <nav>
                    <a data-type="rating-desc" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}>
                      <div className="tabs__content">Δημοφιλέστερα</div>
                    </a>
                    <a data-type="price-asc" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}>
                      <div className="tabs__content">Φθηνότερα</div>
                    </a>
                    <a data-type="price-desc" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}>
                      <div className="tabs__content">Ακριβότερα</div>
                    </a>
                  </nav>
                </div>
              </div>
            </div>

            {hasSubcategories && !subCatId ? (
              <div className="subcategories-list">
                <h2>Subcategories:</h2>
                <ul>
                  {categories.filter(cat => cat.parentId === currentSubCategory.id).map(subCat => (
                    <li key={subCat.id}>
                      <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="page-products__main-wrapper">
                {filteredProducts.length === 0 ? (
                  <p>No products found in this category.</p>
                ) : (
                  <div className="p__products" data-pagination="">
                    {sortProducts(filteredProducts).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
