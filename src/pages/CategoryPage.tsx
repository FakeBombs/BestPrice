import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

// Assuming your categories data is fetched from an API
const mockCategories = [
  { id: 1, name: 'Τεχνολογία', slug: 'technology', image: '//placehold.co/200x150?text=Technology', parentId: null },
  { id: 2, name: 'Σπίτι & Κήπος', slug: 'home-garden', image: '//placehold.co/200x150?text=Home+Garden', parentId: null },
  { id: 3, name: 'Μόδα', slug: 'fashion', image: '//placehold.co/200x150?text=Fashion', parentId: null },
  { id: 4, name: 'Laptop', slug: 'laptop', image: '//placehold.co/200x150?text=Laptop', parentId: 1 },
  { id: 5, name: 'Phones', slug: 'phones', image: '//placehold.co/200x150?text=Phones', parentId: 1 },
  { id: 6, name: 'Gardening Tools', slug: 'gardening-tools', image: '//placehold.co/200x150?text=Gardening+Tools', parentId: 2 },
  // ... more categories
];

function CategoryPage() {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState(mockCategories);
  const [currentCategory, setCurrentCategory] = useState<any>(null); // Use any for better flexibility
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      // Fetch data from API or equivalent
      // ...API call here...
      setLoading(false);
      if (categoryId) {
        const foundCategory = categories.find((cat) => cat.id === parseInt(categoryId));
        setCurrentCategory(foundCategory || null);
      }
  }, [categoryId, categories]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderMainCategories = () => {
      if (!currentCategory) return null;
      const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id);
      return (
          <>
              {/* ... your main category display logic here ... */}
              {subcategories.map(subcat => (
                  <div key={subcat.id}>
                      <h2>{subcat.name}</h2>
                      {/* ...display subcategories here... */}
                  </div>
              ))}
          </>
      );
  };



  return (
      <div>
          {/* ... your main category display logic here, maybe a title or something ... */}
          <h2>{currentCategory?.name}</h2>
          {/* ...rest of your rendering logic... */}
          {renderMainCategories()}
      </div>
  );
}

export default CategoryPage;
