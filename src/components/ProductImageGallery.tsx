
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductImageGalleryProps {
  mainImage?: string;
  images?: string[];
  title?: string;
  onImageChange?: (image: string) => void;
}

const ProductImageGallery = ({ 
  mainImage, 
  images = [],
  title = "Product Image",
  onImageChange = () => {}
}: ProductImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState<string>(mainImage || (images && images.length > 0 ? images[0] : ''));
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleImageChange = (image: string, index: number) => {
    setCurrentImage(image);
    setCurrentIndex(index);
    onImageChange(image);
  };

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    handleImageChange(images[newIndex], newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    handleImageChange(images[newIndex], newIndex);
  };

  // If no images are provided, return a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white aspect-square flex items-center justify-center">
        <div className="text-gray-400">No images available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg overflow-hidden bg-white aspect-square">
        <img 
          src={currentImage || images[0]} 
          alt={title} 
          className="w-full h-full object-contain"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        <button 
          className="absolute right-2 bottom-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>
      
      {images.length > 1 && (
        <ScrollArea className="w-full">
          <div className="flex space-x-2 py-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(image, index)}
                className={`relative w-16 h-16 border overflow-hidden rounded flex-shrink-0 
                  ${currentImage === image ? 'border-primary border-2' : 'border-muted'}`}
              >
                <img
                  src={image}
                  alt={`${title} - view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ProductImageGallery;
