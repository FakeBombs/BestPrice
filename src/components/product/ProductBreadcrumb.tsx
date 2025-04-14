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
    <div className="flex items-center text-sm mb-6">
      <Link to="/" className="text-muted-foreground hover:text-primary">BestPrice</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link to={`/cat/${categoryId}/${categorySlug}`} className="text-muted-foreground hover:text-primary">{product.category}</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
    </div>

    <>
    <div className="comparison__placeholder">
      <div className="comparison__category">
        <div className="comparison__category-products">
          <div className="tooltip__anchor comparison__category-product">
            <div className="comparison__category-remove">
              <svg className="icon icon--no-margin" aria-hidden="true" width="20" height="20"><use xlink:href="/public/dist/images/icons/icons.svg#icon-round-x-20"></use></svg>
            </div>
            <a href="/item/2158420121/tcl-406-32gb.html?bpref=comparison-category">
              <img width="28" height="28" loading="lazy" alt="TCL 406 32GB" srcset="//bbpcdn.pstatic.gr/bpimg25/2m4vFL/1QXN8K_SX56Y56/1698752554/tcl-406-32gb.webp 2x" src="//bbpcdn.pstatic.gr/bpimg25/2m4vFL/1QXN8K_SX28Y28/1698752554/tcl-406-32gb.webp"/>
            </a>
          </div>
          <div className="tooltip__anchor comparison__category-product">
            <div className="comparison__category-remove">
              <svg className="icon icon--no-margin" aria-hidden="true" width="20" height="20"><use xlink:href="/public/dist/images/icons/icons.svg#icon-round-x-20"></use></svg>
            </div>
            <a href="/item/2159422084/realme-note-50-4gb-128gb.html?bpref=comparison-category">
              <img width="28" height="28" loading="lazy" alt="Realme Note 50 4GB 128GB" srcset="//bbpcdn.pstatic.gr/bpimg21/aeRAp/1SYzV1_SX56Y56/1728492731/realme-note-50-4gb-128gb.webp 2x" src="//bbpcdn.pstatic.gr/bpimg21/aeRAp/1SYzV1_SX28Y28/1728492731/realme-note-50-4gb-128gb.webp"/>
            </a>
          </div>
        </div>
        <a href="/compare/2158420121-2159422084" className="button button--outline comparison__category-link">Σύγκριση (2)</a>
      </div>
    </div>
    </>
  );
};

export default ProductBreadcrumb;
