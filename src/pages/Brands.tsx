
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { brands, groupedBrands } from '@/data/mockData';
import { useDocumentAttributes } from '@/hooks/useDocumentAttributes';

const Brands = () => {
  const [groupedBrandsData, setGroupedBrandsData] = useState<Record<string, any[]>>({});
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  
  useEffect(() => {
    // Group brands by first letter
    setGroupedBrandsData(groupedBrands());
    
    // Set first letter with brands as active
    const letters = Object.keys(groupedBrands()).sort();
    if (letters.length > 0) {
      setActiveLetter(letters[0]);
    }
  }, []);
  
  // Set page metadata
  useDocumentAttributes({
    title: 'All Brands - Shop by Brand',
    description: 'Browse all brands available on our site. Find your favorite products by brand.',
  });
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const element = document.getElementById(`brands-${letter}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">All Brands</h1>
      
      {/* Alphabetical navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {alphabet.map((letter) => {
            const hasItems = !!groupedBrandsData[letter]?.length;
            return (
              <button
                key={letter}
                onClick={() => hasItems && scrollToLetter(letter)}
                disabled={!hasItems}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  activeLetter === letter
                    ? 'bg-primary text-primary-foreground'
                    : hasItems
                    ? 'hover:bg-muted'
                    : 'text-muted-foreground cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Brands list */}
      <div className="space-y-8">
        {Object.entries(groupedBrandsData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, brandsList]) => (
            <div key={letter} id={`brands-${letter}`} className="space-y-4">
              <div className="sticky top-0 bg-background z-10 py-2">
                <h2 className="text-2xl font-bold">{letter}</h2>
                <Separator className="mt-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {brandsList.map((brand) => (
                  <a
                    key={brand.id}
                    href={`/brand/${brand.id}/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    {brand.logo && (
                      <div className="w-12 h-12 mr-4 flex-shrink-0">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <span className="font-medium">{brand.name}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Brands;
