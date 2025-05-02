
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/services/productService";
import { getCategoryById } from "@/services/categoryService";
import { useEffect, useState } from "react";

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const [categoryName, setCategoryName] = useState<string>("Category");
  
  useEffect(() => {
    // Get category name if product has categoryId
    const fetchCategory = async () => {
      if (product.categoryId) {
        const category = await getCategoryById(String(product.categoryId));
        if (category) {
          setCategoryName(category.name);
        }
      }
    };
    
    fetchCategory();
  }, [product]);
  
  return (
    <nav className="flex py-4 text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            Αρχική
          </Link>
        </li>
        
        <li className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/categories" className="hover:text-gray-900 dark:hover:text-gray-100">
            Κατηγορίες
          </Link>
        </li>
        
        {product.categoryId && (
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link 
              to={`/cat/${product.categoryId}/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              {categoryName}
            </Link>
          </li>
        )}
        
        <li className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {product.title || product.name}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
