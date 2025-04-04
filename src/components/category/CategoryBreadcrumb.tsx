
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

const formatCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const CategoryBreadcrumb = ({ category, rootCategory }: CategoryBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">BestPrice</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {rootCategory && (
          <>
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
