import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

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

  useEffect(() => {
    const foundMainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

    if (subCatSlug) {
      const foundCategory = categories.find(cat => cat.slug === subCatSlug && cat.parentId === foundMainCategory?.id);
      setCurrentCategory(foundCategory);
    } else {
      setCurrentCategory(foundMainCategory);
    }
  }, [mainCatSlug, subCatSlug]);

  useEffect(() => {
    if (!currentCategory) return;

    console.log('Current Category:', currentCategory);
    console.log('All Products:', products);

    // Instead of checking for leaf categories, you can directly filter products
    const productsToDisplay = products.filter(product => 
        product.categoryIds.includes(currentCategory.id) // Match against categoryIds
    );

    console.log('Filtered Products:', productsToDisplay); 
    setFilteredProducts(productsToDisplay);
}, [currentCategory, products]);

  if (!currentCategory) {
    return <NotFound />;
  }

 // Render breadcrumbs
const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

    if (!mainCategory) return null; // Early return if no main category

    // Add the main category breadcrumb if it hasn't been added already
    breadcrumbs.push(
        <li key={mainCategory.slug}>
            <Link to={`/cat/${mainCategory.slug}`}>{mainCategory.name}</Link>
        </li>
    );

    // Collect current category and its parents, ensuring singular appearance of main categories
    let category = currentCategory;
    const categoryPathSet = new Set(); // To track unique categories by slug

    while (category) {
        if (!categoryPathSet.has(category.slug) && category.slug !== mainCategory.slug) {
            categoryPathSet.add(category.slug);
            breadcrumbs.push(
                <li key={category.slug}>
                    <Link to={`/cat/${mainCategory.slug}/${category.slug}`}>{category.name}</Link>
                </li>
            );
        }
        // Move to the parent category
        category = categories.find(cat => cat.id === category.parentId);
    }

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
                <Link to={`/cat/${mainCatSlug}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id) // Filter linked subcategories for the current subCat
                      .slice(0, 5) // Limit to 5 linked subcategories
                      .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link to={`/cat/${mainCatSlug}/${subCat.slug}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                          {index < arr.length - 1 && ', '} {/* Add comma if there are more */}
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

  const renderSubcategories = (parentCategory) => {
    const subcategories = categories.filter(cat => cat.parentId === parentCategory?.id) || [];
    const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

    const basePath = parentCategory?.slug 
        ? `/cat/${mainCategory.slug}/${parentCategory.slug}`
        : `/cat/${mainCategory.slug}`;

    return (
        <div className="root-category__categories">
            {subcategories.length > 0 ? (
                subcategories.map((subCat) => (
                    <div key={subCat.id} className="root-category__category">
                        <Link to={`${basePath}/${subCat.slug}`} className="root-category__cover">
                            <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                        </Link>
                        <h2 className="root-category__category-title">
                            <Link to={`${basePath}/${subCat.slug}`}>{subCat.name}</Link>
                        </h2>
                        <div className="root-category__footer">
                            <div className="root-category__links">
                                {categories
                                    .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                                    .slice(0, 5)
                                    .map((linkedSubCat, index, arr) => (
                                        <React.Fragment key={linkedSubCat.id}>
                                            <Link to={`${basePath}/${subCat.slug}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                                            {index < arr.length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                renderProducts() // Ensure this does not lead to infinite recursion
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
            <p>No products available.</p> // Use a message for no products instead of recursion
        )}
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
