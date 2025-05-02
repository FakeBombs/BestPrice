
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { getCategoryById } from "@/services/categoryService";
import { useEffect, useState } from "react";

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const [categoryName, setCategoryName] = useState<string>("Category");
  const [categorySlug, setCategorySlug] = useState<string>("category");
  const [categoryId, setCategoryId] = useState<string>("");
  
  useEffect(() => {
    // Get category name if product has categories
    const fetchCategory = async () => {
      if (product.categories && product.categories.length > 0) {
        const categoryId = product.categories[0].id;
        setCategoryId(categoryId);
        const category = await getCategoryById(categoryId);
        if (category) {
          setCategoryName(category.name);
          setCategorySlug(category.slug || category.name.toLowerCase().replace(/\s+/g, '-'));
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
        
        {product.categories && product.categories.length > 0 && categoryId && (
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link 
              to={`/cat/${categorySlug}`}
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
