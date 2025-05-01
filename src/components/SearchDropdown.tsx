
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/mockData';
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface SearchDropdownProps {
  items: Product[];
  visible: boolean;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

const SearchDropdown = ({ items, visible, onSelect, onClose }: SearchDropdownProps) => {
  if (!visible || !items.length) return null;

  return (
    <div className="absolute mt-1 w-full rounded-md border bg-popover shadow-md z-50">
      <Command className="rounded-lg border shadow-md">
        <CommandEmpty>No recent searches</CommandEmpty>
        <CommandGroup heading="Recent Searches">
          {items.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => onSelect(item)}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent"
            >
              <div className="h-10 w-10 overflow-hidden rounded-md border">
                <img 
                  src={item.image || '/placeholder.svg'} 
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.title || item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item.category || "Product"} • €{item.price.toFixed(2)}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
};

export default SearchDropdown;
