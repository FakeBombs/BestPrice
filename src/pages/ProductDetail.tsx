
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductHeader from "../components/product/ProductHeader";
import ProductEssentialInfo from "../components/product/ProductEssentialInfo";
import ProductVendors from "../components/ProductVendors";
import ProductTabsSection from "../components/product/ProductTabsSection";
import ProductRelatedSections from "../components/product/ProductRelatedSections";
import { mockData } from "../data/mockData";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export default function ProductDetail() {
  const { id } = useParams<{ id: string, slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (id) {
      const foundProduct = mockData.products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        addProduct(foundProduct);
      }
    }
  }, [id, addProduct]);

  if (!product) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <ProductBreadcrumb product={product} />
      
      <ProductHeader product={product} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProductEssentialInfo product={product} />
        </div>
        <div>
          <ProductVendors product={product} />
        </div>
      </div>
      
      <ProductTabsSection product={product} />
      
      <ProductRelatedSections productId={product.id} />
    </div>
  );
}
