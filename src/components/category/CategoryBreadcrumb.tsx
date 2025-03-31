
import { Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { RootCategory, Category } from '@/data/mockData';

interface CategoryBreadcrumbProps {
  category?: Category;
  rootCategory?: RootCategory;
}

const CategoryBreadcrumb = ({ category, rootCategory }: CategoryBreadcrumbProps) => {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/categories">Categories</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {rootCategory && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {!category ? (
                <span className="font-medium">{rootCategory.name}</span>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={`/categories/root/${rootCategory.slug}`}>
                    {rootCategory.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}
        
        {category && (
          <>
            {!rootCategory && <BreadcrumbSeparator />}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">{category.name}</span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CategoryBreadcrumb;
