import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, subCatId } = useParams<{ mainCatId?: string; subCatId?: string }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  // Use effect to find the correct category
  useEffect(() => {
    if (!mainCatId) return;

    const foundMainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId);
    let foundCategory: Category | undefined;

    if (foundMainCategory) {
      if (subCatId) {
        foundCategory = categories.find(cat => (cat.id.toString() === subCatId && cat.parentId === foundMainCategory.id));
      } else {
        foundCategory = foundMainCategory; // If there is no subCatId, use main category
      }
    }

    setCurrentCategory(foundCategory);
  }, [mainCatId, subCatId]);

  // Fetch filtered products based on the current category
  useEffect(() => {
    if (!currentCategory) return;

    const productsToDisplay = products.filter(product =>
      product.categoryIds.includes(currentCategory.id)
    );

    const sortedProducts = sortProducts(productsToDisplay);
    setFilteredProducts(sortedProducts);
  }, [currentCategory, products, sortType]);

  const sortProducts = (products: Product[]) => {
    switch (sortType) {
      case 'price-asc':
        return [...products].sort((a, b) => 
          Math.min(...(a.prices || []).map(price => price.inStock ? price.price : Infinity))
          - 
          Math.min(...(b.prices || []).map(price => price.inStock ? price.price : Infinity))
        );
      case 'price-desc':
        return [...products].sort((a, b) => 
          Math.max(...(b.prices || []).map(price => price.inStock ? price.price : -Infinity))
          - 
          Math.max(...(a.prices || []).map(price => price.inStock ? price.price : -Infinity))
        );
      case 'rating-desc':
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  };

  if (!currentCategory) {
    return <NotFound />;
  }

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId);
    
    if (!mainCategory) return null;

    breadcrumbs.push(
      <li key={mainCategory.id}>
        <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>{mainCategory.name}</Link>
      </li>
    );

    const categoryTrail = [];
    let category = currentCategory;
    while (category) {
      categoryTrail.unshift(category);
      category = categories.find(cat => cat.id === category.parentId);
    }

    categoryTrail.forEach((cat, index) => {
      breadcrumbs.push(
        <li key={cat.id}>
          <Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link>
        </li>
      );
      if (index < categoryTrail.length - 1) {
        breadcrumbs.push(<span className="trail__breadcrumb-separator">›</span>);
      }
    });

    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/" rel="home">
                <span>BestPrice</span>
              </Link>
              <span className="trail__breadcrumb-separator">›</span>
            </li>
            {breadcrumbs}
          </ol>
        </nav>
      </div>
    );
  };

  const renderMainCategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    return (
      <>
        <h1>{currentCategory.name}</h1>
        {subcategories.length > 0 ? (
          subcategories.map(subCat => (
            <Link key={subCat.id} to={`/cat/${subCat.id}/${subCat.slug}`}>
              <img src={subCat.image} alt={subCat.name} />
              <h3>{subCat.name}</h3>
            </Link>
          ))
        ) : (
          renderProducts()
        )}
      </>
    );
  };

  const renderProducts = () => (
    <div className="page-products">
      <main>
        <header>
          <div>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available for this category</p>
            )}
          </div>
        </header>
      </main>
    </div>
  );

  return (
    <div>
      {renderBreadcrumbs()}
      {currentCategory.parentId ? renderMainCategories() : renderMainCategories()}
    </div>
  );
};

export default CategoryPage;
