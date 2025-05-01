
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockData, formatSlug } from '../../data/mockData';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';

interface ProductBreadcrumbProps {
  product: any;
}

// Updated interface to ensure parentId exists
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
      const categoryFromMain = mockData.mainCategories.find(c => String(c.id) === String(product.categoryId));
      const categoryFromCategories = mockData.categories.find(c => String(c.id) === String(product.categoryId));
      const category = categoryFromMain || categoryFromCategories;
      
      if (category) {
        // Create a copy with explicitly added properties
        const categoryWithStringId: CategoryWithParentId = {
          ...category,
          id: String(category.id),
          name: category.name,
          description: category.description,
          slug: formatSlug(category.name),
          image: category.imageUrl
        };
        
        // Add parentId only if it exists in the original category
        if ('parentId' in category) {
          categoryWithStringId.parentId = String(category.parentId);
        }
        
        crumbs.push(categoryWithStringId);
        
        // If it's a subcategory, find its parent(s)
        let currentCat = categoryWithStringId;
        while (currentCat.parentId) {
          const parentFromMain = mockData.mainCategories.find(c => String(c.id) === String(currentCat.parentId));
          const parentFromCategories = mockData.categories.find(c => String(c.id) === String(currentCat.parentId));
          const parentCat = parentFromMain || parentFromCategories;
          
          if (parentCat) {
            const parentWithStringId: CategoryWithParentId = {
              ...parentCat,
              id: String(parentCat.id),
              name: parentCat.name,
              description: parentCat.description,
              slug: formatSlug(parentCat.name),
              image: parentCat.imageUrl
            };
            
            // Add parentId only if it exists in the original category
            if ('parentId' in parentCat) {
              parentWithStringId.parentId = String(parentCat.parentId);
            }
            
            crumbs.unshift(parentWithStringId);
            currentCat = parentWithStringId;
          } else {
            break;
          }
        }
      }
      
      setBreadcrumbs(crumbs);
    }
  }, [product]);

  const getSlug = (name: string) => {
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
                <Link to={`/cat/${crumb.id}/${getSlug(crumb.name)}`}>
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
