
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductSpecTableProps {
  specifications: Record<string, string>;
}

const ProductSpecTable = ({ specifications }: ProductSpecTableProps) => {
  // Group specifications by category (for demo purposes)
  const groupedSpecs: Record<string, Record<string, string>> = {
    'General': {},
    'Technical': {},
    'Features': {},
    'Other': {}
  };
  
  // Distribute specs into groups
  Object.entries(specifications).forEach(([key, value], index) => {
    const groupNames = Object.keys(groupedSpecs);
    const groupIndex = Math.min(Math.floor(index / 3), groupNames.length - 1);
    const groupName = groupNames[groupIndex];
    
    groupedSpecs[groupName][key] = value;
  });
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-8">
        {Object.entries(groupedSpecs).map(([groupName, specs]) => {
          if (Object.keys(specs).length === 0) return null;
          
          return (
            <div key={groupName}>
              <h3 className="text-xl font-medium mb-4">{groupName}</h3>
              <div className="space-y-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-12 gap-4 py-2 border-b last:border-0">
                    <div className="font-medium col-span-4">{key}</div>
                    <div className="col-span-8">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ProductSpecTable;
