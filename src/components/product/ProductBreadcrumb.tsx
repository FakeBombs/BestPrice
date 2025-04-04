
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  return (
    <div className="flex items-center text-sm mb-6">
      <Link to="/" className="text-muted-foreground hover:text-primary">BestPrice</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link to="{`/categories/${product.category}`} " className="text-muted-foreground hover:text-primary">{product.categorySlug}</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link 
        to={`/categories/${product.id}`} 
        className="text-muted-foreground hover:text-primary"
      >
        {product.categoryName}
      </Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
    </div>
  );
};

export default ProductBreadcrumb;
