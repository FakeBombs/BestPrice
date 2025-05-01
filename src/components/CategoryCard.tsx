
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: {
    id: string | number;
    name: string;
    image?: string;
    imageUrl?: string;
    productCount?: number;
    slug?: string;
  };
  size?: "small" | "medium" | "large";
}

const CategoryCard = ({ category, size = "medium" }: CategoryCardProps) => {
  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  
  const sizeClasses = {
    small: "h-20 w-20",
    medium: "h-28 w-28",
    large: "h-36 w-36",
  };

  // Use slug if available, otherwise format the name
  const slug = category.slug || formatSlug(category.name);
  
  // Use image if available, otherwise fall back to imageUrl
  const imageSource = category.image || category.imageUrl;

  return (
    <Link
      to={`/cat/${category.id}/${slug}`}
      className="block rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition"
    >
      <div className="p-3 flex flex-col items-center">
        <div className={`${sizeClasses[size]} flex items-center justify-center mb-2`}>
          {imageSource && (
            <img
              src={imageSource}
              alt={category.name}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
        <h3 className="text-center text-sm font-medium">{category.name}</h3>
        {category.productCount !== undefined && (
          <p className="text-xs text-muted-foreground">{category.productCount} products</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
