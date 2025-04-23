import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

function CategoryPage({ mockData }) {
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
          const relevantProducts = mockData.products.filter(product => product.categoryId === category.id);
          return (
              <div>
                  <h2>{category.name}</h2>
                  <ul>
                      {relevantProducts.map(product => (
                          <li key={product.id}>{product.name}</li>
                      ))}
                  </ul>
              </div>
          );
      } else {
          // Handle subcategories
          const relevantProducts = mockData.products.filter(product => product.categoryId === category.id);
          return (
              <div>
                  <h2>{category.name} (Subcategory of {mockData.categories.find(parent => parent.id === category.parentId)?.name})</h2>
                  <ul>
                      {relevantProducts.map(product => (
                          <li key={product.id}>{product.name}</li>
                      ))}
                  </ul>
              </div>
          );

      }
  }, [category, mockData]);

  return (
    <div>
      {displayContent}
    </div>
  );
}


export default CategoryPage;
