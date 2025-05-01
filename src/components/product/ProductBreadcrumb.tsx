
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
      
      // Find the product's category with string IDs
      const category = mockData.categories.find(c => String(c.id) === String(product.categoryId)) ||
                        mockData.mainCategories.find(c => String(c.id) === String(product.categoryId));
      
      if (category) {
        // Convert to CategoryWithParentId type with string IDs
        const categoryWithStringId: CategoryWithParentId = {
          ...category,
          id: String(category.id),
          parentId: category.parentId ? String(category.parentId) : undefined,
          slug: formatSlug(category.name),
          image: category.imageUrl
        };
        crumbs.push(categoryWithStringId);
        
        // If it's a subcategory, find its parent(s)
        let currentCat = category;
        while (currentCat.parentId) {
          const parentCat = mockData.categories.find(c => String(c.id) === String(currentCat.parentId)) || 
                          mockData.mainCategories.find(c => String(c.id) === String(currentCat.parentId));
          if (parentCat) {
            // Make sure to add parentId property to mainCategories items which might not have it
            const parentWithStringId: CategoryWithParentId = {
              ...parentCat,
              id: String(parentCat.id),
              parentId: parentCat.parentId ? String(parentCat.parentId) : undefined,
              slug: formatSlug(parentCat.name),
              image: parentCat.imageUrl
            };
            crumbs.unshift(parentWithStringId);
            currentCat = parentCat;
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
