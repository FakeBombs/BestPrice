import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { Category, mainCategories } from './your-data'; // Replace with your actual import

interface Product {
  id: number;
  name: string;
  // Add other product properties as needed
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    const foundCategory = mainCategories.find((cat) => cat.slug === slug);

    if (!foundCategory) {
      navigate('/404'); // Or however you handle a 404
      return;
    }

    setCategories([foundCategory]); // Corrected: Initial state

    if (foundCategory.parentId) {
      // Case: Subcategory
      const parentCategory = mainCategories.find((cat) => cat.id === foundCategory.parentId);
      if (!parentCategory) {
        navigate('/404'); // Handle case where parent doesn't exist
        return;
      }
      setCategories([parentCategory, foundCategory]); // Correct rendering of parent
    } else {
        // Case: Main Category (no parent) or product list
      const matchingProducts = // Replace with your data fetching logic
      products.filter((product) => product.categoryId === foundCategory.id);
      setProducts(matchingProducts);
    }

  }, [slug]);



  return (
    <div>
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id}>
            <h2>{category.name}</h2>
            {/* Check for subcategories */}
            {category.children && category.children.length > 0 ? (
              <ul>
                {category.children.map((subCategory) => (
                  <li key={subCategory.id}>
                    <Link to={`/cat/${subCategory.slug}`}>{subCategory.name}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
              {/*Show products if no subcategories exists*/}
                {products?.map((product) => (
                  <div key={product.id}>
                    <h3>{product.name}</h3>
                    {/* Add other product details here */}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default CategoryPage;
