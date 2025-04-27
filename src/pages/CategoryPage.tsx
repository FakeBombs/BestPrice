import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData'; // Make sure your mockData aligns with this structure
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug } = useParams<{
    mainCatId: string;
    mainCatSlug: string;
    subCatId?: string;
    subCatSlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const mainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId);
    let category: Category | undefined = mainCategory;

    if (subCatId) {
      category = categories.find(cat => cat.id.toString() === subCatId && cat.parentId === Number(mainCatId));
    }

    setCurrentCategory(category || mainCategory);
  }, [mainCatId, subCatId]);

  useEffect(() => {
    if (!currentCategory) return;

    const productsToDisplay = products.filter(product => 
      product.categoryIds.includes(currentCategory.id)
    );

    setFilteredProducts(productsToDisplay);
  }, [currentCategory]);

  if (!currentCategory) {
    return <NotFound />;
  }

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId);

    if (mainCategory) {
      breadcrumbs.push(
        <li key={mainCategory.id}>
          <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>{mainCategory.name}</Link>
        </li>
      );

      if (subCatId) {
        const subCategory = categories.find(cat => cat.id.toString() === subCatId);
        if (subCategory) {
          breadcrumbs.push(
            <li key={subCategory.id}>
              <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}/${subCategory.id}/${subCategory.slug}`}>{subCategory.name}</Link>
            </li>
          );
        }
      }
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

  const renderCategories = (parentId: number | undefined) => {
    const subcategories = categories.filter(cat => cat.parentId === parentId);
    return (
      <div className="root-category__categories">
        {subcategories.map((subCat) => (
          <div key={subCat.id} className="root-category__category">
            <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`} className="root-category__cover">
              <img src={subCat.image} alt={subCat.name} title={subCat.name} />
            </Link>
            <h3 className="root-category__category-title">
              <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
            </h3>
          </div>
        ))}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="page-products">
      <main className="page-products__main">
        <header className="page-header">
          <div className="products-wrapper">
            <div className="products-wrapper__header"><div className="products-wrapper__title">Selected Offers</div></div>
            <ScrollableSlider />
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
      {renderBreadcrumbs()}
      {currentCategory && currentCategory.parentId ? renderCategories(currentCategory.id) : renderCategories(Number(mainCatId))}
      {renderProducts()}
    </div>
  );
};

export default CategoryPage;
