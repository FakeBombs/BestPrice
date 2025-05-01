
import { Link } from "react-router-dom";

interface RootCategoryCardProps {
  category: {
    id: number;
    name: string;
    image: string;
    subCategories: number;
  };
}

const RootCategoryCard = ({ category }: RootCategoryCardProps) => {
  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <Link
      to={`/cat/${category.id}/${formatSlug(category.name)}`}
      className="block rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition"
    >
      <div className="p-4 flex flex-col items-center">
        <div className="h-32 w-32 flex items-center justify-center mb-4">
          <img
            src={category.image}
            alt={category.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="text-center font-medium">{category.name}</h3>
        <p className="text-sm text-muted-foreground">{category.subCategories} subcategories</p>
      </div>
    </Link>
  );
};

export default RootCategoryCard;
