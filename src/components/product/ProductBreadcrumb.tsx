import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product, categories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const formatProductSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const formatCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const productSlug = formatProductSlug(product.title);
  const categorySlug = formatCategorySlug(product.category);
  
  // Find the category object that matches the product's category name
  const categoryObj = categories.find(cat => cat.name === product.category);
  const categoryId = categoryObj ? categoryObj.id : '';
  
  return (
  <>
    <ol>
      <li><Link to="/" rel="home" data-no-info=""><span>BestPrice</span></Link><span class="trail__breadcrumb-separator">›</span></li>
      <li><Link to="{`/cat/${categoryId}/${categorySlug}`}" title="Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας Τεχνολογία" data-no-info=""><span>{product.category}</span></Link><span class="trail__breadcrumb-separator">›</span></li>
      <li><span class="trail__last">{product.title}</span><span class="trail__breadcrumb-separator"></span></li>
    </ol>
  </>
  );
};

export default ProductBreadcrumb;
