
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductHeader from "../components/product/ProductHeader";
import ProductEssentialInfo from "../components/product/ProductEssentialInfo";
import ProductVendors from "../components/ProductVendors";
import ProductTabsSection from "../components/product/ProductTabsSection";
import ProductRelatedSections from "../components/product/ProductRelatedSections";
import { getProductById, getRelatedProducts, Product } from "../services/productService";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export default function ProductDetail() {
  const { id } = useParams<{ id: string, slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [categoryDeals, setCategoryDeals] = useState<Product[]>([]);
  const { recentlyViewed, addProduct } = useRecentlyViewed();
  
  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        try {
          const foundProduct = await getProductById(id);
          if (foundProduct) {
            setProduct(foundProduct);
            addProduct(foundProduct);
            
            // Load related products
            const related = await getRelatedProducts(id, 5);
            setSimilarProducts(related);
            
            // For demo, set category deals to the same related products
            setCategoryDeals(related);
          }
        } catch (error) {
          console.error("Error loading product:", error);
        }
      }
    };
    
    loadProductData();
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
          <ProductEssentialInfo product={{
            ...product,
            description: product.description || '',
            specifications: product.specifications || {},
            highlights: product.highlights || []
          }} />
        </div>
        <div>
          <ProductVendors product={product} />
        </div>
      </div>
      
      <ProductTabsSection product={product} />
      
      <ProductRelatedSections 
        productId={product.id}
        similarProducts={similarProducts as any[]}
        categoryDeals={categoryDeals as any[]}
        recentlyViewed={recentlyViewed as any[]}
      />
    </div>
  );
}
