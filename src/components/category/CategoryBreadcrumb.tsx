
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockData } from '@/data/mockData';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../../components/ui/breadcrumb';

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
        const parentCat = mockData.categories.find(c => c.id === currentCat.parentId) || 
                         mockData.mainCategories.find(c => c.id === currentCat.parentId);
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

  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <Breadcrumb className="mt-4 mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <span>{crumb.name}</span>
              ) : (
                <BreadcrumbLink as={Link} to={`/cat/${crumb.id}/${formatSlug(crumb.name)}`}>
                  {crumb.name}
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
