import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug, categoryId: urlCategoryId, categorySlug } = useParams<{
    mainCatId?: string;
    mainCatSlug?: string;
    subCatId?: string;
    subCatSlug?: string;
    categoryId?: string; 
    categorySlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    let foundCategoryId: number | undefined = undefined;

    if (mainCatId) {
      foundCategoryId = parseInt(mainCatId, 10);
      const foundCategory = mainCategories.find(cat => 
        cat.id === foundCategoryId && cat.slug === mainCatSlug
      );
      if (foundCategory) {
        setCurrentCategory(foundCategory);
        return; 
      }
    }

    if (subCatId) {
      foundCategoryId = parseInt(subCatId, 10);
      const foundSubCategory = categories.find(cat => 
        cat.id === foundCategoryId && cat.slug === subCatSlug
      );
      if (foundSubCategory) {
        setCurrentCategory(foundSubCategory);
        return; 
      }
    }

    if (urlCategoryId) {
      foundCategoryId = parseInt(urlCategoryId, 10);
      const foundLeafCategory = categories.find(cat => 
        cat.id === foundCategoryId && cat.slug === categorySlug
      );

      if (foundLeafCategory) {
        setCurrentCategory(foundLeafCategory);
        return; 
      }
    }

    setCurrentCategory(undefined); 
  }, [mainCatId, mainCatSlug, subCatId, subCatSlug, urlCategoryId, categorySlug]);

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

  const renderMainCategories = () => (
    <div class="page-header">
      <div class="hgroup">
        <div class="page-header__title-wrapper">
          <a class="trail__back pressable" title="BestPrice.gr" href="/"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use></svg></a>
          {mainCategories.map((cat) => ( <h1 key={cat.id}>{cat.name}</h1> ))}
        </div>
      </div>
      <div className="root-category__categories">
        {subcategories.length > 0 ? (
         subcategories.map((subCat) => (
          <div key={subCat.id} className="root-category__category">
            <Link to={`/cat/${subCat.id}/${subCat.slug}`} class="root-category__cover">
              <img src={subCat.image} alt={subCat.name} title={subCat.name} />
            </Link>
            <h2 class="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>Κινητή Τηλεφωνία</Link></h2>
            <div class="root-category__footer">
              <div class="root-category__links">
                <a href="/cat/813/bluetooth.html?bpref=root-category-subcat">Bluetooth Handsfree</a>
              </div>
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );

  const renderSubcategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    return (
      <div>
        <h2>Subcategories</h2>
        <div className="subcategories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id}>
                <Link to={`/cat/${subCat.id}/${subCat.slug}`}>
                  <h3>{subCat.name}</h3>
                </Link>
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
    <div class="root__wrapper root-category__root">
      <div class="root">
        {renderBreadcrumbs()} {/* Render breadcrumbs for category hierarchy */}
        {renderMainCategories()}
        {renderSubcategories()}
        {currentCategory && currentCategory.parentId && renderProducts()} {/* Only show products if it's not a main category */}
      </div>
    </div>
  );
};

export default CategoryPage;
