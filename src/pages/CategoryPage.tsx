import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, subCatId } = useParams<{
    mainCatId?: string;
    subCatId?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  // Use effect to find the correct category
  useEffect(() => {
    let foundCategory: Category | undefined;

    // Locate main category
    if (mainCatId) {
      const foundMainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId);
      if (foundMainCategory) {
        foundCategory = foundMainCategory; // Set as current category
      }

      // Locate subcategory if present
      if (subCatId) {
        foundCategory = categories.find(cat => (cat.id.toString() === subCatId) && cat.parentId === foundMainCategory?.id);
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
        return [...products].sort((a, b) => {
          const minPriceA = Math.min(...(a.prices || []).filter((p) => p.inStock).map((p) => p.price), Infinity);
          const minPriceB = Math.min(...(b.prices || []).filter((p) => p.inStock).map((p) => p.price), Infinity);
          return minPriceA - minPriceB;
        });
      case 'price-desc':
        return [...products].sort((a, b) => {
          const maxPriceA = Math.max(...(a.prices || []).filter((p) => p.inStock).map((p) => p.price), 0);
          const maxPriceB = Math.max(...(b.prices || []).filter((p) => p.inStock).map((p) => p.price), 0);
          return maxPriceB - maxPriceA;
        });
      case 'rating-desc':
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  };

  // Render Not Found page if category is missing
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
          {index < categoryTrail.length - 1 && <span className="trail__breadcrumb-separator">›</span>}
        </li>
      );
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
    if (currentCategory?.parentId === undefined) {
      return (
        <div>
          <h1>{currentCategory.name}</h1>
          const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
              </div>
            ))
          ) : (
            renderProducts()
          )}
        </div>
      );
    }
    
    return renderSubcategories(currentCategory);
  };

  const renderSubcategories = (category: Category) => {
    const categorySubcategories = categories.filter(cat => cat.parentId === category.id);
    
    return (
      <div>
        <h1>{category.name}</h1>
        {categorySubcategories.map(subCat => (
          <div key={subCat.id} className="root-category__category">
            <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
              <img src={subCat.image} alt={subCat.name} title={subCat.name} />
            </Link>
            <h3 className="root-category__category-title">
              <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
            </h3>
          </div>
        ))}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="page-products">
      <aside className="page-products__filters"></aside>
      <main className="page-products__main">
        <header className="page-header">
          <div className="page-header__title-wrapper">
            <div className="products-wrapper">
              <div className="products-wrapper__header">
                <div className="products-wrapper__title">Επιλεγμένες Προσφορές</div>
              </div>
              <ScrollableSlider />
            </div>
          </div>
          <div className="page-header__sorting">
            <div className="tabs">
              <div className="tabs-wrapper">
                <nav>
                  <a data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}>
                    <div className="tabs__content">Δημοφιλέστερα</div>
                  </a>
                  <a data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}>
                    <div className="tabs__content">Φθηνότερα</div>
                  </a>
                  <a data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}>
                    <div className="tabs__content">Ακριβότερα</div>
                  </a>
                  <a data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={() => setSortType('merchants_desc')}>
                    <div className="tabs__content">Αριθμός καταστημάτων</div>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <div className="page-products__main-wrapper">
          <div className="p__products" data-pagination="">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available for this category</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}
        {renderMainCategories()}
      </div>
    </div>
  );
};

export default CategoryPage;
