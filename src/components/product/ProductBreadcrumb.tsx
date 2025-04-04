
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/data/mockData';

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
  
  return (
    <div className="flex items-center text-sm mb-6">
      <Link to="/" className="text-muted-foreground hover:text-primary">BestPrice</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link to={`/cat/${product.categoryId}/${categorySlug}`} className="text-muted-foreground hover:text-primary">{product.category}</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link to={`/cat/${product.categoryId}/${categorySlug}`} className="text-muted-foreground hover:text-primary">
        {product.category}
      </Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
    </div>
  );
};

export default ProductBreadcrumb;
