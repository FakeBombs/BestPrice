import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  image?: string;
}

interface Price {
  price: number;
  inStock: boolean;
  merchant: string;
}

interface Product {
  id: string;
  name: string;
  prices: Price[];
  ratingSum: number;
  numReviews: number;
  description: string;
  image: string;
}

// Updated props to match actual URL pattern
interface CategoryParams {
  categoryId: string;
  slug: string;
}

// Main component
const CategoryPage: React.FC = () => {
  const { categoryId, slug } = useParams<CategoryParams>();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const findCategory = () => {
      if (!categoryId) return undefined;
      
      // First try to find by ID since it's unique
      const categoryById = categories.find(cat => cat.id === parseInt(categoryId));
      
      // Verify that the found category matches the slug for SEO purposes
      if (categoryById && categoryById.slug === slug) {
        return categoryById;
      }
      
      return undefined;
    };

    const category = findCategory();
    setCurrentCategory(category);

    if (category) {
      const children = categories.filter(cat => cat.parentId === category.id);
      setChildCategories(children);

      const categoryProducts = products.filter(product => 
        product.categoryIds.includes(category.id)
      );
      setFilteredProducts(categoryProducts);
    } else {
      setChildCategories([]);
      setFilteredProducts([]);
    }
  }, [categoryId, slug]);

  const getBreadcrumbPath = (category: Category | undefined): Category[] => {
    if (!category) return [];
    const path: Category[] = [category];
    let currentCategory = category;
    
    while (currentCategory.parentId) {
      const parentCategory = categories.find(cat => cat.id === currentCategory.parentId);
      if (parentCategory) {
        path.unshift(parentCategory);
        currentCategory = parentCategory;
      } else {
        break;
      }
    }
    
    return path;
  };

  const renderBreadcrumbs = (category: Category | undefined) => {
    const breadcrumbPath = getBreadcrumbPath(category);
    
    return (
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        {breadcrumbPath.map((cat, index) => (
          <React.Fragment key={cat.id}>
            <span> / </span>
            <Link to={`/category/${cat.id}`}>{cat.name}</Link>
          </React.Fragment>
        ))}
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
              <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
              </Link>
              <h3 className="root-category__category-title">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
              </h3>
              <div className="root-category__footer">
                <div className="root-category__links">
                  {categories
                    .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                    .slice(0, 5)
                    .map((linkedSubCat, index, arr) => (
                      <React.Fragment key={linkedSubCat.id}>
                        <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>
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
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    
    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <Link 
                className="trail__back pressable" 
                title={currentCategory.name} 
                to={`/cat/${currentCategory.parentId}/${currentCategory.slug}`}
              >
                <svg aria-hidden="true" className="icon" width={16} height={16}>
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
                </svg>
              </Link>
              <h1>{currentCategory.name}</h1>
            </div>
          </div>
        </div>
        <div className="root-category__categories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h2 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h2>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                      .slice(0, 5)
                      .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>
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
              sortProducts(filteredProducts, sortType).map(product => (
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

  const sortProducts = (products: Product[], sortType: string): Product[] => {
    const sortedProducts = [...products];
    
    switch (sortType) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => {
          const minPriceA = Math.min(...a.prices.filter(p => p.inStock).map(p => p.price), Infinity);
          const minPriceB = Math.min(...b.prices.filter(p => p.inStock).map(p => p.price), Infinity);
          return minPriceA - minPriceB;
        });
      case 'price-desc':
        return sortedProducts.sort((a, b) => {
          const maxPriceA = Math.max(...a.prices.filter(p => p.inStock).map(p => p.price), 0);
          const maxPriceB = Math.max(...b.prices.filter(p => p.inStock).map(p => p.price), 0);
          return maxPriceB - maxPriceA;
        });
      case 'rating-desc':
        return sortedProducts.sort((a, b) => {
          const averageRatingA = a.ratingSum / Math.max(a.numReviews, 1);
          const averageRatingB = b.ratingSum / Math.max(b.numReviews, 1);
          return averageRatingB - averageRatingA;
        });
      case 'rating-asc':
        return sortedProducts.sort((a, b) => {
          const averageRatingA = a.ratingSum / Math.max(a.numReviews, 1);
          const averageRatingB = b.ratingSum / Math.max(b.numReviews, 1);
          return averageRatingA - averageRatingB;
        });
      case 'merchants_desc':
        return sortedProducts.sort((a, b) => {
          const availableVendorsA = a.prices.filter(price => price.inStock).length;
          const availableVendorsB = b.prices.filter(price => price.inStock).length;
          return availableVendorsB - availableVendorsA;
        });
      default:
        return sortedProducts;
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
  };

  // Determine what to render based on the category
  const renderContent = () => {
    if (!currentCategory) {
      return <NotFound />;
    }

    // Check if we're showing a category that has child categories
    const hasChildCategories = categories.some(cat => cat.parentId === currentCategory.id);

    // If this category has no children, show products
    if (!hasChildCategories) {
      return renderProducts();
    }

    // For categories with children, use the existing logic
    if (currentCategory.parentId) {
      return renderSubcategories(currentCategory);
    }

    return renderMainCategories();
  };

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {currentCategory && renderBreadcrumbs(currentCategory)}
        {renderContent()}
      </div>
    </div>
  );
};

export default CategoryPage;
