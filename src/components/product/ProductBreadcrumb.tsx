import { Link } from 'react-router-dom';
import { Product, categories, rootCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  // Find the category object that matches the product's category name
  const categoryObj = categories.find(cat => cat.name === product.category);
  
  // Extract category ID and slug
  const categoryId = categoryObj ? categoryObj.id : '';
  const categorySlug = categoryObj ? categoryObj.slug : '';

  // Find the root category object using the rootCategoryId
  const rootCategoryId = categoryObj ? categoryObj.rootCategoryId : '';
  const rootCategoryObj = rootCategories.find(rootCat => rootCat.id === rootCategoryId);
  const rootCategorySlug = rootCategoryObj ? rootCategoryObj.slug : '';
  
  return (
    <ol>
      <li>
        <Link to="/" rel="home" data-no-info="">
          <span>BestPrice</span>
        </Link>
        <span className="trail__breadcrumb-separator">›</span>
      </li>
      {rootCategoryObj && (
        <li>
          <Link to={`/categories/root/${rootCategorySlug}`} title={`Όλα τα προϊόντα της κατηγορίας ${rootCategoryObj.name}`} data-no-info="">
            <span>{rootCategoryObj.name}</span>
          </Link>
          <span className="trail__breadcrumb-separator">›</span>
        </li>
      )}
      <li>
        <Link to={`/cat/${categoryId}/${categorySlug}`} title={`Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας ${product.category}`} data-no-info="">
          <span>{product.category}</span>
        </Link>
        <span className="trail__breadcrumb-separator">›</span>
      </li>
      <li>
        <span className="trail__last truncate max-w-[200px]">{product.title}</span>
        <span className="trail__breadcrumb-separator"></span>
      </li>
    </ol>
  );
};

export default ProductBreadcrumb;
