import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug } = useParams<{
    mainCatId?: string;
    mainCatSlug?: string;
    subCatId?: string;
    subCatSlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    const currentId = subCatId ? subCatId : mainCatId; // Get the current ID to find the category
    const currentSlug = subCatSlug ? subCatSlug : mainCatSlug;

    const foundId = parseInt(currentId || '0', 10); // Parse ID

    // Find the current category in mainCategories or categories
    const foundCategory = subCatId
      ? categories.find(cat => cat.id === foundId && cat.slug === currentSlug)
      : mainCategories.find(cat => cat.id === foundId && cat.slug === currentSlug);

    if (foundCategory) {
      setCurrentCategory(foundCategory);
    } else {
      setCurrentCategory(undefined);
    }
  }, [mainCatId, mainCatSlug, subCatId, subCatSlug]);

  useEffect(() => {
    if (!currentCategory) return;

    const isLeafCategory = categories.some(cat => cat.parentId === currentCategory.id); 

    if (!isLeafCategory) {
      setFilteredProducts([]); 
    } else {
      const productsToDisplay = products.filter(product => 
        product.categoryIds.includes(currentCategory.id)
      );
      setFilteredProducts(productsToDisplay);
    }
  }, [currentCategory, products]); 

  if (!currentCategory) {
    return <NotFound />;
  }

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    const breadcrumbs = [];

    let category = currentCategory;
    while (category) {
      breadcrumbs.unshift(
        <li key={category.id}><Link to={`/cat/${category.id}/${category.slug}`}>{category.name}</Link></li>
      );
      category = categories.find(cat => cat.id === category.parentId); // Move up the hierarchy
    }

    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li><Link to="/" rel="home" data-no-info=""><span>BestPrice</span></Link><span className="trail__breadcrumb-separator">›</span></li>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb}
                {index < breadcrumbs.length - 1 && <span> › </span>}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    );
  };

  const renderMainCategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];

    return (
      <div className="page-header">
        <div className="hgroup">
          <div className="page-header__title-wrapper">
            <a className="trail__back pressable" title="BestPrice.gr" href="/">
              <svg aria-hidden="true" className="icon" width={16} height={16}>
                <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
              </svg>
            </a>
            <h1>{currentCategory?.name}</h1>
          </div>
        </div>
        <div className="root-category__categories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h2 className="root-category__category-title">
                  <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h2>
              </div>
            ))
          ) : (
            <p>No subcategories available for this category.</p>
          )}
        </div>
      </div>
    );
  };

  const renderSubcategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
    return (
      <div className="root-category__categories">
        {subcategories.length > 0 ? (
          subcategories.map((subCat) => (
            <div key={subCat.id} className="root-category__category">
              <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
              </Link>
              <h2 className="root-category__category-title">
                <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
              </h2>
            </div>
          ))
        ) : (
          <p>No subcategories available for this category.</p>
        )}
      </div>
    );
  };

  const renderProducts = () => (
    <div>
      <h2>Products</h2>
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products in this category.</p>
      )}
    </div>
  );

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()} {/* Render breadcrumbs for category hierarchy */}
        {currentCategory?.parentId ? renderSubcategories() : renderMainCategories()} {/* Render either subcategories or main categories */}
        {renderProducts()} {/* Show products only if they're present */}
      </div>
    </div>
  );
};

export default CategoryPage;
