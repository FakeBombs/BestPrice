
import React from 'react';
import { Link } from 'react-router-dom';

export interface CategoryCardProps {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  itemCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, image, slug, itemCount }) => {
  return (
    <Link to={`/cat/${id}/${slug}`} className="category-card block p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="relative pb-[75%] mb-3 bg-gray-100 rounded overflow-hidden">
        <img 
          src={image || '/placeholder.svg'}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain p-2"
        />
      </div>
      <h3 className="font-medium text-center truncate">{name}</h3>
      {itemCount !== undefined && (
        <p className="text-sm text-center text-muted-foreground">{itemCount} items</p>
      )}
    </Link>
  );
};

export default CategoryCard;
