
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, Product } from '@/services/productService';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductVendors from '@/components/ProductVendors';
import ProductTabsSection from '@/components/product/ProductTabsSection';
import ProductRelatedSections from '@/components/product/ProductRelatedSections';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

const ProductDetail = () => {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [categoryDeals, setCategoryDeals] = useState<Product[]>([]);
  const { recentlyViewed, addProduct } = useRecentlyViewed();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        if (productData) {
          // Set initial selected image
          if (productData.images && productData.images.length > 0) {
            setSelectedImage(productData.images[0]);
          } else if (productData.image_url) {
            setSelectedImage(productData.image_url);
          }
          
          // Add to recently viewed
          addProduct(productData);
          
          // Fetch similar products - this is just a mock for now
          // In a real app, you'd fetch from an API based on product's category, tags, etc.
          const mockSimilar = await getProductById(id);
          setSimilarProducts(mockSimilar ? [mockSimilar] : []);
          
          // Fetch category deals - this is just a mock for now
          const mockDeals = await getProductById(id);
          setCategoryDeals(mockDeals ? [mockDeals] : []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, addProduct]);
  
  const handleImageChange = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  if (!product) {
    return <div className="container mx-auto p-4">Product not found.</div>;
  }
  
  // Ensure product has required fields for the components
  const enhancedProduct = {
    ...product,
    description: product.description || '',
    specifications: product.specifications || {},
    highlights: product.highlights || []
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductHeader product={enhancedProduct} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <ProductImageGallery 
            images={product.images || []}
            mainImage={selectedImage || product.image_url}
            title={product.name}
            onImageChange={handleImageChange}
          />
          
          <ProductTabsSection product={enhancedProduct} />
        </div>
        
        <div className="lg:col-span-1">
          <ProductVendors product={product} />
        </div>
      </div>
      
      <ProductRelatedSections 
        productId={product.id}
        similarProducts={similarProducts} 
        categoryDeals={categoryDeals}
        recentlyViewed={recentlyViewed as Product[]}
      />
    </div>
  );
};

export default ProductDetail;
