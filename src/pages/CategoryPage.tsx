import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug, anotherSubSubCatSlug } = useParams<{
    mainCatSlug?: string;
    subCatSlug?: string;
    subSubCatSlug?: string;
    extraSubSubCatSlug?: string;
    anotherSubSubCatSlug?: string;
  }>(); 

  const { toast } = useToast();
  const { user } = useAuth();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const foundMainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);
    let foundCategory: Category | undefined = foundMainCategory;

    // Traverse through each level of categories to find the correct one based on slugs
    if (subCatSlug) {
      foundCategory = categories.find(cat => cat.slug === subCatSlug && cat.parentId === foundMainCategory?.id);
    }
    
    if (subSubCatSlug) {
      foundCategory = categories.find(cat => cat.slug === subSubCatSlug && cat.parentId === foundCategory?.id);
    }
    
    if (extraSubSubCatSlug) {
      foundCategory = categories.find(cat => cat.slug === extraSubSubCatSlug && cat.parentId === foundCategory?.id);
    }

    if (anotherSubSubCatSlug) {
      foundCategory = categories.find(cat => cat.slug === anotherSubSubCatSlug && cat.parentId === foundCategory?.id);
    }

    setCurrentCategory(foundCategory || foundMainCategory);
  }, [mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug, anotherSubSubCatSlug]);

  useEffect(() => {
    if (!currentCategory) return;

    // Filter products directly based on current category ID
    const productsToDisplay = products.filter(product => 
      product.categoryIds.includes(currentCategory.id)
    );

    setFilteredProducts(productsToDisplay);
  }, [currentCategory, products]);

  if (!currentCategory) {
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

  const handlePriceAlert = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to set a price alert",
      });
      return;
    }

    setIsPriceAlertModalOpen(true);
  };

  const renderBreadcrumbs = () => {
  const breadcrumbs = [];
  const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

  if (!mainCategory) return null;

  // Add the main category link if there's a current category with a parent
  if (!(currentCategory && !currentCategory.parentId)) {
    breadcrumbs.push(
      <li key={mainCategory.slug}>
        <Link to={`/cat/${mainCategory.slug}`}>{mainCategory.name}</Link>
      </li>
    );
  }

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
            {/* Only show the separator if there are additional breadcrumbs */}
            {breadcrumbs.length > 0 && <span className="trail__breadcrumb-separator">›</span>}
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

  const renderMainCategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
    return (
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
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
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
            ))
          ) : (
            renderProducts()
          )}
        </div>
        <div className="sections"></div>
        <div class="p__products-section">
          <div class="alerts">
            <button data-url={`/cat/${mainCatSlug}`} data-title={currentCategory?.name} data-max-price="0" class="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" class="icon" width="20" height="20" viewBox="0 0 20 20" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M2.16821 14.5654C2.16821 14.8698 2.27889 15.1133 2.50024 15.2959C2.7216 15.4785 3.02873 15.5698 3.42163 15.5698H6.92456C6.9467 16.1066 7.09058 16.6019 7.3562 17.0557C7.62736 17.5094 7.98983 17.8747 8.4436 18.1514C8.89738 18.4336 9.41479 18.5747 9.99585 18.5747C10.5824 18.5747 11.1026 18.4364 11.5564 18.1597C12.0102 17.883 12.3699 17.515 12.6355 17.0557C12.9067 16.6019 13.0533 16.1066 13.0754 15.5698H16.5784C16.9713 15.5698 17.2784 15.4785 17.4998 15.2959C17.7211 15.1133 17.8318 14.8698 17.8318 14.5654C17.8318 14.2887 17.7515 14.0203 17.5911 13.7603C17.4306 13.5002 17.2286 13.2456 16.9851 12.9966C16.7472 12.7476 16.5092 12.4985 16.2712 12.2495C16.0886 12.0614 15.9447 11.8151 15.8396 11.5107C15.74 11.2064 15.6653 10.8826 15.6155 10.5396C15.5657 10.1965 15.5297 9.86442 15.5076 9.54346C15.491 8.45329 15.3748 7.49593 15.1589 6.67139C14.9486 5.84131 14.6194 5.14958 14.1711 4.59619C13.7229 4.04281 13.1308 3.6333 12.3948 3.36768C12.2564 2.82536 11.9742 2.36605 11.5481 1.98975C11.1275 1.61344 10.6101 1.42529 9.99585 1.42529C9.38713 1.42529 8.86971 1.61344 8.4436 1.98975C8.02303 2.36605 7.74357 2.82536 7.60522 3.36768C6.86922 3.6333 6.27433 4.04281 5.82056 4.59619C5.37231 5.14958 5.04305 5.84131 4.83276 6.67139C4.62248 7.49593 4.50903 8.45329 4.49243 9.54346C4.4703 9.86442 4.43433 10.1965 4.38452 10.5396C4.33472 10.8826 4.25724 11.2064 4.1521 11.5107C4.05249 11.8151 3.91138 12.0614 3.72876 12.2495C3.4908 12.4985 3.25008 12.7476 3.00659 12.9966C2.76864 13.2456 2.56942 13.5002 2.40894 13.7603C2.24845 14.0203 2.16821 14.2887 2.16821 14.5654ZM3.77856 14.3164V14.2168C3.82837 14.1393 3.91138 14.0369 4.02759 13.9097C4.1438 13.7769 4.27384 13.633 4.41772 13.478C4.56714 13.3231 4.71379 13.1654 4.85767 13.0049C5.00708 12.8389 5.13713 12.6479 5.2478 12.4321C5.35848 12.2108 5.45256 11.9618 5.53003 11.6851C5.6075 11.4084 5.66838 11.1012 5.71265 10.7637C5.75692 10.4261 5.79012 10.0553 5.81226 9.65137C5.83439 8.44499 5.9589 7.48763 6.18579 6.7793C6.41268 6.07096 6.71427 5.54525 7.09058 5.20215C7.47241 4.85352 7.90129 4.61279 8.3772 4.47998C8.48234 4.45784 8.56258 4.41911 8.61792 4.36377C8.67326 4.3029 8.70369 4.21989 8.70923 4.11475C8.72583 3.68311 8.84757 3.33171 9.07446 3.06055C9.30688 2.78385 9.61401 2.64551 9.99585 2.64551C10.3832 2.64551 10.6903 2.78385 10.9172 3.06055C11.1497 3.33171 11.2742 3.68311 11.2908 4.11475C11.2908 4.21989 11.3184 4.3029 11.3738 4.36377C11.4347 4.41911 11.5149 4.45784 11.6145 4.47998C12.0904 4.61279 12.5165 4.85352 12.8928 5.20215C13.2747 5.54525 13.579 6.07096 13.8059 6.7793C14.0383 7.48763 14.1656 8.44499 14.1877 9.65137C14.2043 10.0553 14.2348 10.4261 14.2791 10.7637C14.3289 11.1012 14.3897 11.4084 14.4617 11.6851C14.5391 11.9618 14.6332 12.2108 14.7439 12.4321C14.8546 12.6479 14.9846 12.8389 15.134 13.0049C15.2834 13.1654 15.4301 13.3231 15.574 13.478C15.7234 13.633 15.8534 13.7769 15.9641 13.9097C16.0803 14.0369 16.1633 14.1393 16.2131 14.2168V14.3164H3.77856ZM8.21948 15.5698H11.7805C11.7473 16.1343 11.5675 16.5798 11.241 16.9062C10.9145 17.2383 10.4994 17.4043 9.99585 17.4043C9.4978 17.4043 9.08276 17.2383 8.75073 16.9062C8.42423 16.5798 8.24715 16.1343 8.21948 15.5698Z"/></svg>
              <span class="alerts__label">Ειδοποίηση</span>
            </button>
            <div class="alerts__prompt"> σε <span class="alerts__title">{currentCategory?.name}</span></div>
          </div>
        </div>
      </>
    );
  };

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
            <div className="sections"></div>
            <div class="p__products-section">
              {categories.filter(cat => cat.parentId === currentCategory?.id).slice(0, 1).map((subCat) => (
              <div class="alerts" key={subCat.id}>
                <button data-url={`/cat/${mainCategory.slug}/${slugs.join('/')}/${subCat.slug}`} data-title={currentCategory.name} data-max-price="0" class="alerts__button pressable" onClick={handlePriceAlert}>
                  <svg aria-hidden="true" class="icon" width="20" height="20" viewBox="0 0 20 20" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M2.16821 14.5654C2.16821 14.8698 2.27889 15.1133 2.50024 15.2959C2.7216 15.4785 3.02873 15.5698 3.42163 15.5698H6.92456C6.9467 16.1066 7.09058 16.6019 7.3562 17.0557C7.62736 17.5094 7.98983 17.8747 8.4436 18.1514C8.89738 18.4336 9.41479 18.5747 9.99585 18.5747C10.5824 18.5747 11.1026 18.4364 11.5564 18.1597C12.0102 17.883 12.3699 17.515 12.6355 17.0557C12.9067 16.6019 13.0533 16.1066 13.0754 15.5698H16.5784C16.9713 15.5698 17.2784 15.4785 17.4998 15.2959C17.7211 15.1133 17.8318 14.8698 17.8318 14.5654C17.8318 14.2887 17.7515 14.0203 17.5911 13.7603C17.4306 13.5002 17.2286 13.2456 16.9851 12.9966C16.7472 12.7476 16.5092 12.4985 16.2712 12.2495C16.0886 12.0614 15.9447 11.8151 15.8396 11.5107C15.74 11.2064 15.6653 10.8826 15.6155 10.5396C15.5657 10.1965 15.5297 9.86442 15.5076 9.54346C15.491 8.45329 15.3748 7.49593 15.1589 6.67139C14.9486 5.84131 14.6194 5.14958 14.1711 4.59619C13.7229 4.04281 13.1308 3.6333 12.3948 3.36768C12.2564 2.82536 11.9742 2.36605 11.5481 1.98975C11.1275 1.61344 10.6101 1.42529 9.99585 1.42529C9.38713 1.42529 8.86971 1.61344 8.4436 1.98975C8.02303 2.36605 7.74357 2.82536 7.60522 3.36768C6.86922 3.6333 6.27433 4.04281 5.82056 4.59619C5.37231 5.14958 5.04305 5.84131 4.83276 6.67139C4.62248 7.49593 4.50903 8.45329 4.49243 9.54346C4.4703 9.86442 4.43433 10.1965 4.38452 10.5396C4.33472 10.8826 4.25724 11.2064 4.1521 11.5107C4.05249 11.8151 3.91138 12.0614 3.72876 12.2495C3.4908 12.4985 3.25008 12.7476 3.00659 12.9966C2.76864 13.2456 2.56942 13.5002 2.40894 13.7603C2.24845 14.0203 2.16821 14.2887 2.16821 14.5654ZM3.77856 14.3164V14.2168C3.82837 14.1393 3.91138 14.0369 4.02759 13.9097C4.1438 13.7769 4.27384 13.633 4.41772 13.478C4.56714 13.3231 4.71379 13.1654 4.85767 13.0049C5.00708 12.8389 5.13713 12.6479 5.2478 12.4321C5.35848 12.2108 5.45256 11.9618 5.53003 11.6851C5.6075 11.4084 5.66838 11.1012 5.71265 10.7637C5.75692 10.4261 5.79012 10.0553 5.81226 9.65137C5.83439 8.44499 5.9589 7.48763 6.18579 6.7793C6.41268 6.07096 6.71427 5.54525 7.09058 5.20215C7.47241 4.85352 7.90129 4.61279 8.3772 4.47998C8.48234 4.45784 8.56258 4.41911 8.61792 4.36377C8.67326 4.3029 8.70369 4.21989 8.70923 4.11475C8.72583 3.68311 8.84757 3.33171 9.07446 3.06055C9.30688 2.78385 9.61401 2.64551 9.99585 2.64551C10.3832 2.64551 10.6903 2.78385 10.9172 3.06055C11.1497 3.33171 11.2742 3.68311 11.2908 4.11475C11.2908 4.21989 11.3184 4.3029 11.3738 4.36377C11.4347 4.41911 11.5149 4.45784 11.6145 4.47998C12.0904 4.61279 12.5165 4.85352 12.8928 5.20215C13.2747 5.54525 13.579 6.07096 13.8059 6.7793C14.0383 7.48763 14.1656 8.44499 14.1877 9.65137C14.2043 10.0553 14.2348 10.4261 14.2791 10.7637C14.3289 11.1012 14.3897 11.4084 14.4617 11.6851C14.5391 11.9618 14.6332 12.2108 14.7439 12.4321C14.8546 12.6479 14.9846 12.8389 15.134 13.0049C15.2834 13.1654 15.4301 13.3231 15.574 13.478C15.7234 13.633 15.8534 13.7769 15.9641 13.9097C16.0803 14.0369 16.1633 14.1393 16.2131 14.2168V14.3164H3.77856ZM8.21948 15.5698H11.7805C11.7473 16.1343 11.5675 16.5798 11.241 16.9062C10.9145 17.2383 10.4994 17.4043 9.99585 17.4043C9.4978 17.4043 9.08276 17.2383 8.75073 16.9062C8.42423 16.5798 8.24715 16.1343 8.21948 15.5698Z"/></svg>
                  <span class="alerts__label">Ειδοποίηση</span>
                </button>
                <div class="alerts__prompt"> σε <span class="alerts__title">{currentCategory.name}</span></div>
              </div>
              ))}
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

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}
        {currentCategory && currentCategory.parentId 
          ? renderSubcategories(currentCategory) 
          : (currentCategory 
              ? renderMainCategories() 
              : renderProducts()
            )
        }
      </div>
    </div>
  );
};

export default CategoryPage;
