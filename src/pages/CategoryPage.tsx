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

    setCurrentCategory(foundCategory || foundMainCategory);
  }, [mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug]);

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
  const categoryPathSet = new Set();

  // Use currentCategory to add to breadcrumbs
  let category = currentCategory;

  // Build the breadcrumb trail from currentCategory up to the main category
  const categoryTrail = [];
  
  while (category) {
    categoryTrail.push(category);  // Push the category to create the trail
    category = categories.find(cat => cat.id === category.parentId);  // Move up the category tree
  }

  // Reverse the order so we can start from mainCategory and go to currentCategory
  categoryTrail.reverse();

  // Add categories to breadcrumbs
  categoryTrail.forEach(cat => {
    if (!categoryPathSet.has(cat.slug) && cat.slug !== mainCategory.slug) {
      categoryPathSet.add(cat.slug);
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

  const renderMainCategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <a className="trail__back pressable" title="BestPrice" href="/">
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
      </>
    );
  };

  const renderSubcategories = (parentCategory) => {
    const subcategories = categories.filter(cat => cat.parentId === parentCategory?.id) || [];
    const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

    // Constructing the base path for subcategories
    const basePath = parentCategory?.slug 
      ? `/cat/${mainCategory.slug}/${parentCategory.slug}`
      : `/cat/${mainCategory.slug}`;

    // Finding the parent category name for the back link
    const parentCat = categories.find(cat => cat.id === parentCategory.parentId);
    const parentCategoryHref = parentCat 
      ? `/cat/${mainCategory.slug}/${parentCat.slug}` 
      : `/cat/${mainCategory.slug}`;

    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <a className="trail__back pressable" title={parentCat ? parentCat.name : mainCategory.name} href={parentCategoryHref}>
                <svg aria-hidden="true" className="icon" width={16} height={16}>
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
                </svg>
              </a>
              <h1>{parentCategory.name || currentCategory?.name}</h1> {/* Show parentCategory name or fallback */} 
            </div>
          </div>
        </div>
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
                          <Link to={`${basePath}/${subCat.slug}/${linkedSubCat.slug}`}>
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
            renderProducts() // Consider displaying products if no subcategories exist
          )}
        </div>
      </>
    );
};

  const renderProducts = () => (
    <div className="page-products">
      <aside className="page-products__filters"></aside>
      <main className="page-products__main">
        <div className="page-products__main-wrapper">
          <div className="p__products" data-pagination="">
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products available.</p>
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
