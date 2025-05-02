import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products, Category } from '@/data/mockData'; // Assuming Category type is exported from mockData or defined elsewhere
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const { toast } = useToast();
  const { user } = useAuth();

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Use a more specific Product type if available
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  // Combines main and subcategories for easier lookup
  const allCategories = [...mainCategories, ...categories];

  const findCategory = (identifier: string): Category | undefined => {
    return allCategories.find(
      (cat) => cat.id.toString() === identifier || cat.slug === identifier
    );
  };

  // Determine the default category ID (first main category)
  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  useEffect(() => {
    // If we are not on a category path (e.g., homepage or other page)
    if (pathSegments.length < 2 || pathSegments[0] !== 'cat') {
      if (defaultCategoryId !== null) {
        // Find the default MAIN category
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
        setFilteredProducts([]); // Clear products if showing default main category overview
      } else {
        setCurrentCategory(undefined);
        setFilteredProducts([]);
      }
      return; // Exit early
    }

    // We are on a category path /cat/...
    const segments = pathSegments.slice(1);
    const lastSegment = segments[segments.length - 1];
    let matchedCategory = findCategory(lastSegment); // findCategory checks both arrays

    if (matchedCategory) {
      // We found a category (either main or sub)
      setCurrentCategory(matchedCategory);

      // Filter products ONLY if it's NOT a main category
      // (assuming main categories show subcats, not products directly)
      if (matchedCategory.parentId !== null || !matchedCategory.isMain) {
          const productsToDisplay = products.filter(p =>
            p.categoryId?.toString() === matchedCategory.id.toString()
          );
          setFilteredProducts(productsToDisplay);
      } else {
          setFilteredProducts([]); // Clear products for main category view
      }
    } else {
      // No category matched the path segment, fall back to default MAIN category
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
      } else {
         // If no match and no default, potentially show NotFound or redirect
         // Setting to undefined might trigger the NotFound check later
        setCurrentCategory(undefined);
      }
      setFilteredProducts([]); // Clear products on fallback
    }
    // Dependency on location.pathname ensures this runs when the URL changes
  }, [location.pathname, defaultCategoryId]); // Added location.pathname

  // Show NotFound if path indicates a category but none was found (and no default fallback happened)
  if (
    pathSegments.length >= 2 &&
    pathSegments[0] === 'cat' &&
    currentCategory === undefined
  ) {
    return <NotFound />;
  }

  const sortProducts = (productsList: any[]) => {
    // Added checks for potentially undefined a.prices or b.prices
    switch (sortType) {
      case 'price-asc':
        return [...productsList].sort((a, b) => {
          const minPriceA = Math.min(...(a.prices || []).filter(p => p.inStock).map(p => p.price), Infinity);
          const minPriceB = Math.min(...(b.prices || []).filter(p => p.inStock).map(p => p.price), Infinity);
          return minPriceA - minPriceB;
        });
      case 'price-desc':
        return [...productsList].sort((a, b) => {
          const maxPriceA = Math.max(...(a.prices || []).filter(p => p.inStock).map(p => p.price), 0);
          const maxPriceB = Math.max(...(b.prices || []).filter(p => p.inStock).map(p => p.price), 0);
          return maxPriceB - maxPriceA;
        });
      case 'rating-desc':
      default:
        return [...productsList].sort((a, b) => {
          const avgA = (a.ratingSum || 0) / Math.max(a.numReviews || 1, 1);
          const avgB = (b.ratingSum || 0) / Math.max(b.numReviews || 1, 1);
          return avgB - avgA;
        });
      case 'merchants_desc':
        return [...productsList].sort((a, b) => {
          const vendorsA = (a.prices || []).filter(p => p.inStock).length;
          const vendorsB = (b.prices || []).filter(p => p.inStock).length;
          return vendorsB - vendorsA;
        });
    }
  };

  const handlePriceAlert = () => {
    if (!user) {
      toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' });
      return;
    }
    // Ensure currentCategory exists before trying to open modal
    if (currentCategory) {
        setIsPriceAlertModalOpen(true);
    } else {
        toast({ title: 'Error', description: 'Cannot set alert, category not selected.', variant: 'destructive' });
    }
  };

  // --- FINAL UPDATED renderBreadcrumbs function ---
  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = [];
    // Always add Home link
    trailItems.push(
      <li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>
    );

    // Only add more items if the current category exists AND it's a subcategory
    if (currentCategory && currentCategory.parentId !== null && !currentCategory.isMain) {
        // --- Case: Current category IS a Subcategory ---
        const ancestors: Category[] = [];
        let category: Category | undefined = currentCategory;

        // Traverse up the parent chain to build the path *excluding* the current category
        while (category && category.parentId !== null) {
             // Find the parent in the combined list
            const parent = allCategories.find((cat) => cat.id === category?.parentId);
            if (parent) {
                 ancestors.unshift(parent); // Add parent to the beginning of the list
                 category = parent; // Move up to the parent
            } else {
                 category = undefined; // Stop if parent not found
            }
        }

        // Add links for each ancestor found (Main Category first, then sub-parents)
        ancestors.forEach((cat) => {
            trailItems.push(
                <li key={cat.id}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>
            );
        });
        // DO NOT add the currentCategory itself
    }
    // If it's a main category (or no category), the trailItems array only contains "Home"

    // Render the assembled trail
    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            {trailItems.reduce((acc, item, index) => (
              <React.Fragment key={index}>
                {acc}
                {/* Add separator only if there are more than one items AND it's not the first item */}
                {trailItems.length > 1 && index > 0 && <span className="trail__breadcrumb-separator">›</span>}
                {item}
              </React.Fragment>
            ), null)}
          </ol>
        </nav>
      </div>
    );
  };
  // --- End of FINAL UPDATED renderBreadcrumbs function ---


  // This function renders the view for a MAIN category page
  // It displays the subcategories belonging to it.
  const renderMainCategories = () => {
    // Condition: Only render if the currentCategory IS a main category
    if (!currentCategory || currentCategory.parentId !== null || !currentCategory.isMain) {
      return null; // Don't render if not on a main category page
    }

    // If we are here, currentCategory IS the main category being viewed.
    const mainCat = currentCategory;

    // Find the direct children (subcategories) of this main category
    const subcategories = categories.filter(cat => cat.parentId === mainCat.id);

    return (
      <>
        {/* Header section for the Main Category Page */}
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              {/* No back button needed here as we are at a main category */}
              <h1>{mainCat.name}</h1>
            </div>
          </div>
        </div>

        {/* Grid of Subcategories belonging to this Main Category */}
        <div className="root-category__categories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  {/* Provide a fallback image if subCat.image is null */}
                  <img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {/* Displaying grandchildren links */}
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                      .slice(0, 5) // Limit to 5 links
                      .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                          {/* Add comma only if it's not the last item */}
                          {index < arr.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Message if a Main Category has NO subcategories
             <p>Δεν υπάρχουν υποκατηγορίες για αυτήν την κατηγορία.</p>
          )}
        </div>

        {/* Sections specific to the main category page */}
        <div className="sections"></div>
        <div className="p__products-section">
           {/* Price Alert Button for the Main Category */}
          <div className="alerts">
            <button data-url={`/cat/${mainCat.id}/${mainCat.slug}`} data-title={mainCat.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg>
              <span className="alerts__label">Ειδοποίηση</span>
            </button>
            <div className="alerts__prompt">σε <span className="alerts__title">{mainCat.name}</span></div>
          </div>
        </div>
        {/* PriceAlertModal is rendered globally at the bottom based on state */}
      </>
    );
  };

  // This function renders the view for a SUBcategory page.
  // It might display deeper subcategories or products.
  const renderSubcategories = (category: Category) => {
     // Condition: Only render if the passed category is a SUBcategory
    if (!category || category.parentId === null || category.isMain) {
        return null; // Don't render if it's a main category or null
    }

    // Find the direct children (sub-subcategories) of this subcategory
    const childCategories = categories.filter(cat => cat.parentId === category.id);
    const parentCategory = allCategories.find(cat => cat.id === category.parentId); // For back button link

    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              {/* Back button to the parent category */}
              {parentCategory && (
                 <Link className="trail__back pressable" title={`Επιστροφή σε ${parentCategory.name}`} to={`/cat/${parentCategory.id}/${parentCategory.slug}`}>
                    <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16" /></svg>
                 </Link>
              )}
              <h1>{category.name}</h1>
            </div>
          </div>
        </div>

        {/* Check if this subcategory has further subcategories */}
        {childCategories.length > 0 ? (
            // Display grid of child categories (sub-subcategories)
            <div className="root-category__categories">
            {childCategories.map((subCat) => (
                <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                    <img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} />
                </Link>
                {/* Use h3 or adjust heading level as appropriate */}
                <h3 className="root-category__category-title">
                    <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
                <div className="root-category__footer">
                    <div className="root-category__links">
                    {/* Links to grandchildren (sub-sub-subcategories) */}
                    {categories
                        .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                        .slice(0, 5)
                        .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                            <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                            {index < arr.length - 1 && ', '}
                        </React.Fragment>
                        ))}
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            // If no further subcategories, render the products for this category
            renderProducts()
        )}

        {/* Sections specific to the subcategory page */}
        <div className="sections"></div>
        <div className="p__products-section">
           {/* Price Alert Button for the Subcategory */}
          <div className="alerts">
            <button data-url={`/cat/${category.id}/${category.slug}`} data-title={category.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg>
              <span className="alerts__label">Ειδοποίηση</span>
            </button>
            <div className="alerts__prompt">σε <span className="alerts__title">{category.name}</span></div>
          </div>
        </div>
         {/* PriceAlertModal is rendered globally at the bottom based on state */}
      </>
    );
  };

  // This function renders the product list for the current category (usually a leaf subcategory)
  const renderProducts = () => {
    const sortedProducts = sortProducts(filteredProducts); // Sort the already filtered products

    // Determine if we should show the header/sorting (only if there are products or it's a product-leaf category)
    const showProductHeader = filteredProducts.length > 0; // Or add more complex logic if needed

    return (
        <div className="page-products">
        {/* Optional: Filters sidebar <aside className="page-products__filters"></aside> */}
        <main className="page-products__main">
            {showProductHeader && (
                <header className="page-header">
                    {/* Optional: Featured offers slider */}
                    {/* <div className="page-header__title-wrapper"> ... </div> */}

                    {/* Sorting Tabs */}
                    <div className="page-header__sorting">
                    <div className="tabs">
                        <div className="tabs-wrapper">
                        <nav>
                            <a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('rating-desc'); }}><div className="tabs__content">Δημοφιλέστερα</div></a>
                            <a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-asc'); }}><div className="tabs__content">Φθηνότερα</div></a>
                            <a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-desc'); }}><div className="tabs__content">Ακριβότερα</div></a>
                            <a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('merchants_desc'); }}><div className="tabs__content">Αριθμός καταστημάτων</div></a>
                        </nav>
                        </div>
                    </div>
                    </div>
                </header>
            )}
            {/* Product Grid */}
            <div className="page-products__main-wrapper">
            <div className="p__products" data-pagination="">
                {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
                ) : (
                // Check if we are in a category context before showing "no products"
                currentCategory && !currentCategory.isMain && <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p>
                // Avoid showing this message on main category pages that correctly show subcategories
                )}
            </div>
            </div>
        </main>
        </div>
    );
   };

  // Main component render structure
  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}

        {/* Render the main category view (shows its subcategories) IF currentCategory is a main one */}
        {renderMainCategories()}

        {/* Render the subcategory view (shows its children or products) IF currentCategory is a subcategory */}
        {currentCategory && (currentCategory.parentId !== null && !currentCategory.isMain) && renderSubcategories(currentCategory)}

        {/* Conditionally render the Price Alert Modal */}
        {isPriceAlertModalOpen && currentCategory && (
          <PriceAlertModal
            isOpen={isPriceAlertModalOpen}
            onClose={() => setIsPriceAlertModalOpen(false)}
            categoryName={currentCategory.name}
            categoryId={currentCategory.id}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
