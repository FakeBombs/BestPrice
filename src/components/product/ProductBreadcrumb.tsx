
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockData, formatSlug } from '../../data/mockData';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';

interface ProductBreadcrumbProps {
  product: any;
}

interface CategoryWithParentId {
  id: string;
  parentId?: string;
  name: string;
  description: string;
  imageUrl?: string;
  image?: string;
  slug?: string;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<CategoryWithParentId[]>([]);

  useEffect(() => {
    if (product && product.categoryId) {
      const crumbs: CategoryWithParentId[] = [];
      
      // Find the product's category
      const category = mockData.categories.find(c => c.id === product.categoryId);
      if (category) {
        crumbs.push(category as CategoryWithParentId);
        
        // If it's a subcategory, find its parent(s)
        let currentCat = category;
        while (currentCat.parentId) {
          const parentCat = mockData.categories.find(c => c.id === currentCat.parentId) || 
                           mockData.mainCategories.find(c => c.id === currentCat.parentId);
          if (parentCat) {
            crumbs.unshift(parentCat as CategoryWithParentId);
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
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/cat/${crumb.id}/${formatSlug(crumb.name)}`}>
                  {crumb.name}
                </Link>
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
