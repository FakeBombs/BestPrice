
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, mainCategories } from '@/data/mockData';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface CategoryBreadcrumbProps {
  category: any;
}

const CategoryBreadcrumb = ({ category }: CategoryBreadcrumbProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    if (category) {
      const crumbs = [];
      crumbs.push(category);

      // If it's a subcategory, find its parent(s)
      let currentCat = category;
      while (currentCat.parentId) {
        const parentCat = categories.find(c => c.id === currentCat.parentId) || 
                         mainCategories.find(c => c.id === currentCat.parentId);
        if (parentCat) {
          crumbs.unshift(parentCat);
          currentCat = parentCat;
        } else {
          break;
        }
      }

      setBreadcrumbs(crumbs);
    }
  }, [category]);
  
  const buildCategoryPath = (breadcrumbs: any[], index: number) => {
    // Start with the main category
    if (index === 0) {
      return `/cat/${breadcrumbs[0].id}/${breadcrumbs[0].slug}`;
    }
    
    let path = `/cat/${breadcrumbs[0].id}`;
    // Add subsequent slugs up to the current index
    for (let i = 1; i <= index; i++) {
      path += `/${breadcrumbs[i].slug}`;
    }
    
    return path;
  };

  return (
    <Breadcrumb className="mt-4 mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <span>{crumb.name}</span>
              ) : (
                <BreadcrumbLink>
                  <Link to={buildCategoryPath(breadcrumbs, index)}>
                    {crumb.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CategoryBreadcrumb;
