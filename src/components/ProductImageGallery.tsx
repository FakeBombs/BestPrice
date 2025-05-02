
import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  mainImage?: string;
  title: string;
  onImageChange?: (imageUrl: string) => void;
}

const ProductImageGallery = ({ 
  images, 
  mainImage, 
  title, 
  onImageChange 
}: ProductImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(mainImage || images[0] || '');
  
  // Handle image change
  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    if (onImageChange) {
      onImageChange(imageUrl);
    }
  };

  return (
    <div className="product-gallery">
      <div className="main-image-container mb-4 border rounded-lg overflow-hidden flex items-center justify-center bg-white">
        <img
          src={currentImage}
          alt={title}
          className="main-image object-contain max-h-[400px] w-full"
        />
      </div>
      
      {images.length > 1 && (
        <div className="thumbnails-container flex space-x-2 overflow-x-auto">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className={`thumbnail-item cursor-pointer border rounded p-1 min-w-[70px] h-[70px] flex items-center justify-center ${
                imageUrl === currentImage ? 'border-primary ring-2 ring-primary-light' : 'border-gray-200'
              }`}
              onClick={() => handleImageClick(imageUrl)}
            >
              <img
                src={imageUrl}
                alt={`${title} thumbnail ${index + 1}`}
                className="thumbnail-image object-contain max-h-full max-w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
