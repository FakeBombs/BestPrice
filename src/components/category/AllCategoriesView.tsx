
import { mockData, formatSlug } from "../../data/mockData";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// No props required for AllCategoriesView
const AllCategoriesView = () => {
  const [organizedCategories, setOrganizedCategories] = useState<any[]>([]);

  useEffect(() => {
    // Organize the categories
    const result = mockData.mainCategories.map(mainCat => {
      const subCategories = mockData.categories.filter(cat => 
        String(cat.parentId) === String(mainCat.id)
      );
      return {
        ...mainCat,
        subCategories
      };
    });

    setOrganizedCategories(result);
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">All Categories</h1>
      
      {organizedCategories.map(mainCat => {
        const mainSlug = mainCat.slug || formatSlug(mainCat.name);
        
        return (
          <div key={mainCat.id} className="mb-8">
            <Link 
              to={`/cat/${mainCat.id}/${mainSlug}`} 
              className="text-xl font-semibold hover:text-primary transition mb-3 block"
            >
              {mainCat.name}
            </Link>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mainCat.subCategories.map((subCat: any) => {
                const subSlug = subCat.slug || formatSlug(subCat.name);
                
                return (
                  <Link
                    key={subCat.id}
                    to={`/cat/${subCat.id}/${subSlug}`}
                    className="p-2 border rounded hover:bg-gray-50 hover:border-primary transition text-center"
                  >
                    {subCat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllCategoriesView;
