import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug } = useParams<{
    mainCatSlug?: string;
    subCatSlug?: string;
    subSubCatSlug?: string;
    extraSubSubCatSlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    // First find the main category
    const foundMainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);
    if (!foundMainCategory) {
      setCurrentCategory(undefined);
      return;
    }

    let currentFound = foundMainCategory;
    let lastValidCategory = foundMainCategory;

    // Helper function to find child category
    const findChildCategory = (parentId: number, slug: string) => {
      return categories.find(cat => cat.slug === slug && cat.parentId === parentId);
    };

    // Find subcategory if it exists
    if (subCatSlug) {
      const subCategory = findChildCategory(currentFound.id, subCatSlug);
      if (!subCategory) {
        // Only set undefined if we're not trying to access a fourth level
        if (!extraSubSubCatSlug) {
          setCurrentCategory(undefined);
          return;
        }
        // For fourth level access, keep the last valid category
        setCurrentCategory(lastValidCategory);
        return;
      }
      currentFound = subCategory;
      lastValidCategory = currentFound;
    }

    // Find sub-subcategory if it exists
    if (subSubCatSlug) {
      const subSubCategory = findChildCategory(currentFound.id, subSubCatSlug);
      if (!subSubCategory) {
        // Only set undefined if we're not trying to access a fourth level
        if (!extraSubSubCatSlug) {
          setCurrentCategory(undefined);
          return;
        }
        // For fourth level access, keep the last valid category
        setCurrentCategory(lastValidCategory);
        return;
      }
      currentFound = subSubCategory;
      lastValidCategory = currentFound;
    }

    // Find extra sub-subcategory if it exists
    if (extraSubSubCatSlug) {
      const extraSubCategory = findChildCategory(currentFound.id, extraSubSubCatSlug);
      if (extraSubCategory) {
        currentFound = extraSubCategory;
      } else {
        // For fourth level, always use the last valid category
        currentFound = lastValidCategory;
      }
    }

    setCurrentCategory(currentFound);
  }, [mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug]);

  useEffect(() => {
    if (!currentCategory) return;

    // Get all category IDs in the hierarchy
    const getCategoryHierarchyIds = (category) => {
      const ids = new Set([category.id]);
      let current = category;
      
      while (current.parentId) {
        ids.add(current.parentId);
        const parent = categories.find(cat => cat.id === current.parentId);
        if (!parent) break;
        current = parent;
      }
      
      return Array.from(ids);
    };

    const hierarchyIds = getCategoryHierarchyIds(currentCategory);
    const productsToDisplay = products.filter(product => 
      product.categoryIds.some(id => hierarchyIds.includes(id))
    );

    setFilteredProducts(productsToDisplay);
  }, [currentCategory]);

  // Only show NotFound if we have no main category slug
  if (!mainCatSlug) {
    return <NotFound />;
  }

  const sortProducts = (products) => {
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
            return [...products].sort((a, b) => {
                const averageRatingA = a.ratingSum / Math.max(a.numReviews, 1);
                const averageRatingB = b.ratingSum / Math.max(b.numReviews, 1);
                return averageRatingB - averageRatingA;
            });
        case 'merchants_desc':
            return [...products].sort((a, b) => {
                const availableVendorsA = (a.prices || []).filter((price) => price.inStock).length;
                const availableVendorsB = (b.prices || []).filter((price) => price.inStock).length;
                return availableVendorsB - availableVendorsA;
            });
    }
  };

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);
  
    if (!mainCategory) return null;

    // Start with the main category
    breadcrumbs.push(
      <li key={mainCategory.slug}>
        <Link to={`/cat/${mainCategory.slug}`}>{mainCategory.name}</Link>
      </li>
    );

    // Create a Set to keep track of slugged categories
    const categoryTrail = [];

    // Build the breadcrumb trail from currentCategory up to the main category
    let category = currentCategory;
    
    while (category) {
      categoryTrail.unshift(category);  // Prepend to create the trail
      category = categories.find(cat => cat.id === category.parentId);  // Move up the category tree
    }

    // Add categories to breadcrumbs (excluding current category)
    categoryTrail.forEach((cat, index) => {
      if (index !== categoryTrail.length - 1) { // Exclude current category
        breadcrumbs.push(
          <li key={cat.slug}>
            <Link to={`/cat/${mainCategory.slug}/${cat.slug}`}>{cat.name}</Link>
          </li>
        );
      }
    });

    // Render Breadcrumbs
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
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb}
                {index < breadcrumbs.length - 1 && <span className="trail__breadcrumb-separator">›</span>}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    );
  };

  const renderMainCategories = () => (
    <>
      <div className="page-header">
        <div className="hgroup">
          <div className="page-header__title-wrapper">
            <Link className="trail__back pressable" title="BestPrice" to="/">
              <svg aria-hidden="true" className="icon" width={16} height={16}>
                <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
              </svg>
            </Link>
            <h1>{currentCategory?.name}</h1>
          </div>
        </div>
      </div>
      <div className="root-category__categories">
        {categories.filter(cat => cat.parentId === currentCategory?.id)
          .map((subCat) => (
            <div key={subCat.id} className="root-category__category">
              <Link to={`/cat/${mainCatSlug}/${subCat.slug}`} className="root-category__cover">
                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
              </Link>
              <h3 className="root-category__category-title">
                <Link to={`/cat/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
              </h3>
              <div className="root-category__footer">
                <div className="root-category__links">
                  {categories
                    .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                    .slice(0, 5)
                    .map((linkedSubCat, index, arr) => (
                      <React.Fragment key={linkedSubCat.id}>
                        <Link to={`/cat/${mainCatSlug}/${subCat.slug}/${linkedSubCat.slug}`}>
                          {linkedSubCat.name}
                        </Link>
                        {index < arr.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );

  const renderSubcategories = (currentCategory) => {
    const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);
    
    // Collect all parent categories leading up to the main category
    const categoryPath = [];
    let category = currentCategory;

    while (category) {
        categoryPath.unshift(category); // Prepend to maintain the order
        category = categories.find(cat => cat.id === category.parentId);
    }

    // Create an array of slugs and filter out any undefined slugs
    const slugs = categoryPath.map(cat => cat.slug).filter(Boolean);
    
    return (
        <>
            <div className="page-header">
                <div className="hgroup">
                    <div className="page-header__title-wrapper">
                        <Link className="trail__back pressable" title={mainCategory.name} to={`/cat/${mainCategory.slug}`}>
                            <svg aria-hidden="true" className="icon" width={16} height={16}>
                                <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
                            </svg>
                        </Link>
                        <h1>{currentCategory.name}</h1>
                    </div>
                </div>
            </div>
            <div className="root-category__categories">
                {categories.filter(cat => cat.parentId === currentCategory?.id).length > 0 ? (
                    categories.filter(cat => cat.parentId === currentCategory?.id).map((subCat) => {
                        // Construct the paths ensuring all parts of the slug are included
                        const subCatPath = `/cat/${mainCategory.slug}/${slugs.join('/')}/${subCat.slug}`.replace(/\/+/g, '/'); // Ensure all slugs are included in the path

                        return (
                            <div key={subCat.id} className="root-category__category">
                                <Link to={subCatPath} className="root-category__cover">
                                    <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                                </Link>
                                <h2 className="root-category__category-title">
                                    <Link to={subCatPath}>{subCat.name}</Link>
                                </h2>
                                <div className="root-category__footer">
                                    <div className="root-category__links">
                                        {categories
                                            .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                                            .slice(0, 5)
                                            .map((linkedSubCat, index, arr) => {
                                                const linkedSubCatPath = `/cat/${mainCategory.slug}/${slugs.join('/')}/${subCat.slug}/${linkedSubCat.slug}`.replace(/\/+/g, '/'); // Clean path
                                                return (
                                                    <React.Fragment key={linkedSubCat.id}>
                                                        <Link to={linkedSubCatPath}>
                                                            {linkedSubCat.name}
                                                        </Link>
                                                        {index < arr.length - 1 && ', '}
                                                    </React.Fragment>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    renderProducts()
                )}
            </div>
        </>
    );
};

  const renderProducts = () => (
    <div className="page-products">
      <aside className="page-products__filters"></aside>
      <main className="page-products__main">
        <header className="page-header">
          <div className="page-header__title-wrapper">
            <div className="products-wrapper">
              <div className="products-wrapper__header"><div className="products-wrapper__title">Επιλεγμένες Προσφορές</div></div>
              <ScrollableSlider></ScrollableSlider>
            </div>
          </div>
          <div className="page-header__sorting">
            <div className="tabs">
              <div className="tabs-wrapper">
                <nav>
                  <a data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}><div className="tabs__content">Δημοφιλέστερα</div></a>
                  <a data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}><div className="tabs__content">Φθηνότερα</div></a>
                  <a data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}><div className="tabs__content">Ακριβότερα</div></a>
                  <a data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={() => setSortType('merchants_desc')}><div className="tabs__content">Αριθμός καταστημάτων</div></a>
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

  // Modify renderContent to always show products for fourth level
  const renderContent = () => {
    // For fourth level URLs, show products if we have any valid category
    if (extraSubSubCatSlug && currentCategory) {
      return renderProducts();
    }

    // For all other cases, show NotFound if no category
    if (!currentCategory) {
      return <NotFound />;
    }

    // Check if we're showing a category that has child categories
    const hasChildCategories = categories.some(cat => cat.parentId === currentCategory.id);

    // If this category has no children, show products
    if (!hasChildCategories) {
      return renderProducts();
    }

    // For other levels, use the existing logic
    if (currentCategory.parentId) {
      return renderSubcategories(currentCategory);
    }

    return renderMainCategories();
  };

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {currentCategory && renderBreadcrumbs()}
        {renderContent()}
      </div>
    </div>
  );
};

export default CategoryPage;
