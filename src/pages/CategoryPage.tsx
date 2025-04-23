import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { categories, mainCategories, products } from '@/data/mockData';

function CategoryPage({ mockData }) {
  if (!mockData) {
    return <div>Loading...</div>; // Handle the case where mockData is not yet loaded
  }

  const { catSlug } = useParams();
  const category = useMemo(() => {
    // Find the category matching the slug.  Crucially, filter by slug.
    return mockData.categories.find(cat => cat.slug === catSlug);
  }, [mockData, catSlug]);

  if (!category) {
    return <div>Category not found</div>; // Important for 404 handling
  }

  const isMainCategory = !category.parentId;

  const displayContent = useMemo(() => {
    if (isMainCategory) {
      // Filter products based on the category ID.
      const relevantProducts = mockData.products.filter(
        (product) => product.categoryId === category.id
      );
      return (
        <div>
          <h2>{category.name}</h2>
          {/* Display relevant products */}
          {relevantProducts.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p> {/* Or other product details */}
            </div>
          ))}
        </div>
      );
    } else {
      // This is a sub-category
      return (
        <div>
          <h2>{category.name} (Sub-Category of {mockData.categories.find(cat => cat.id === category.parentId)?.name || 'Unknown'})</h2>
          {/* Display appropriate content for subcategories */}
          <p>Sub-category content for {category.name}</p>
        </div>
      );
    }
  }, [category, mockData]); // Important!  Include mockData in the dependency array

  return <div>{displayContent}</div>;
}

export default CategoryPage;
