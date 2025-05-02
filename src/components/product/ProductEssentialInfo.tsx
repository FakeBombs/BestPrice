
import React from "react";
import ProductImageGallery from "../ProductImageGallery";
import ProductHighlights from "./ProductHighlights";

interface ProductEssentialInfoProps {
  product: any;
}

const ProductEssentialInfo = ({ product }: ProductEssentialInfoProps) => {
  return (
    <div className="product-essential">
      {/* Product Image Gallery */}
      {product.images && (
        <ProductImageGallery 
          images={product.images} 
          mainImage={product.image || product.images[0]} 
          title={product.title || product.name} 
          onImageChange={() => {}} 
        />
      )}
      
      {/* Product Specifications */}
      {product.specifications && (
        <ProductHighlights 
          specifications={product.specifications} 
          product={product} 
        />
      )}
    </div>
  );
};

export default ProductEssentialInfo;
