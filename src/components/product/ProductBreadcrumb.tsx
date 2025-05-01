
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockData } from '../../data/mockData';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';

interface ProductBreadcrumbProps {
  product: any;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  useEffect(() => {
    if (product && product.categoryId) {
      const crumbs = [];
      
      // Find the product's category
      const category = mockData.categories.find(c => c.id === product.categoryId);
      if (category) {
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
      }
      
      setBreadcrumbs(crumbs);
    }
  }, [product]);

  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/cat/${crumb.id}/${formatSlug(crumb.name)}`}>
                {crumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        
        <BreadcrumbItem>
          <span>{product.name}</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProductBreadcrumb;
