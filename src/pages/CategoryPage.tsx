import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatSlug } = useParams<{
    mainCatId?: string;
    mainCatSlug?: string;
    subCatSlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    const currentId = subCatSlug ? subCatSlug : mainCatId;

    const foundCategory = subCatSlug
      ? categories.find(cat => cat.slug === currentId && cat.parentId === parseInt(mainCatId!))
      : mainCategories.find(cat => cat.id === parseInt(mainCatId!));

    if (foundCategory) {
      setCurrentCategory(foundCategory);
    } else {
      setCurrentCategory(undefined);
    }
  }, [mainCatId, mainCatSlug, subCatSlug]);

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
        <li key={category.id}>
          <Link to={`/cat/${mainCatId}/${mainCatSlug}`}>{category.name}</Link>
        </li>
      );
      category = categories.find(cat => cat.id === category.parentId);
    }

    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/" rel="home" data-no-info="">
                <span>BestPrice</span>
              </Link>
              <span className="trail__breadcrumb-separator">›</span>
            </li>
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
        <>
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
            </div>
            <div className="root-category__categories">
                {subcategories.length > 0 ? (
                    subcategories.map((subCat) => (
                        <div key={subCat.id} className="root-category__category">
                            <Link to={`/cat/${subCat.parentId}/${mainCatSlug}/${subCat.slug}`} className="root-category__cover">
                                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                            </Link>
                            <h3 className="root-category__category-title">
                                <Link to={`/cat/${subCat.parentId}/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
                            </h3>
                            <div className="root-category__footer">
                                <div className="root-category__links">
                                    {categories
                                        .filter(linkedSubCat => linkedSubCat.parentId === subCat.id) // Filter linked subcategories for the current subCat
                                        .slice(0, 5) // Limit to 5 linked subcategories
                                        .map((linkedSubCat, index, arr) => (
                                            <React.Fragment key={linkedSubCat.id}>
                                                <Link to={`/cat/${subCat.parentId}/${mainCatSlug}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                                                {index < arr.length - 1 && ', '} {/* Add comma if there are more */}
                                            </React.Fragment>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No subcategories available.</div> // Optional: Message if there are no subcategories
                )}
            </div>
        </>
    );
};

  const renderSubcategories = () => {
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
                            <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.slug}`} className="root-category__cover">
                                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                            </Link>
                            <h2 className="root-category__category-title">
                                <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
                            </h2>
                            <div className="root-category__footer">
                                <div className="root-category__links">
                                    {categories
                                        .filter(linkedSubCat => linkedSubCat.parentId === subCat.id) // Filter sub-subcategories
                                        .slice(0, 5) // Limit to 5 sub-subcategories
                                        .map((linkedSubCat, index, arr) => (
                                            <React.Fragment key={linkedSubCat.id}>
                                                <Link to={`/cat/${mainCatId}/${mainCatSlug}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                                                {index < arr.length - 1 && ', '} {/* Add comma if there are more */}
                                            </React.Fragment>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No subcategories available for this category.</p>
                )}
            </div>
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
      {renderBreadcrumbs()}
      {currentCategory && currentCategory.parentId 
        ? renderSubcategories() 
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
