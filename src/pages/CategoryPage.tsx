import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { Category, mainCategories } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

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
    // Find the category based on the slug
    const category = mainCategories.find((c) => c.slug === slug);

    if (!category) {
      navigate('/404'); // Or use a more specific error handling
      return; // Crucial: Stop further execution
    }

    //  Crucial:  Only set products if the category is valid.
    setCategories([category]);  // set the single category
    setProducts(category.products); // Correctly set products


  }, [slug, navigate]);


  if (!categories) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!products) {
    return <div>No products found in this category.</div>;
  }

  return (
    <div>
      <h1>{categories[0]?.name}</h1>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
