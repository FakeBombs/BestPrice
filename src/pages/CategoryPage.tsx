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
  const breadcrumbs: JSX.Element[] = [];
  const mainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

  if (!mainCategory) return null;

  // Start by adding the main category
  breadcrumbs.push(
    <li key={mainCategory.slug}>
      <Link to={`/cat/${mainCategory.slug}`}>{mainCategory.name}</Link>
    </li>
  );

  // Store the full path slugs for accurate URL creation
  let category = currentCategory;
  const categoryTrail: string[] = [];

  // Build the breadcrumb trail from the currentCategory to the main category
  while (category) {
    categoryTrail.push(category.slug); // Store slug for URL creation
    category = categories.find(cat => cat.id === category.parentId); // Move up the category tree
  }

  // Reverse the order of the trail to start from the main category and move down
  categoryTrail.reverse();

  // Build breadcrumbs with correct URLs
  let basePath = `/cat/${mainCategory.slug}`;
  for (let i = 1; i < categoryTrail.length; i++) {
    const catSlug = categoryTrail[i];
    basePath += `/${catSlug}`;

    breadcrumbs.push(
      <li key={catSlug}>
        <Link to={basePath}>{catSlug}</Link>
      </li>
    );
  }

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
          renderProducts()
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
        <p>No products available.</p>
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
