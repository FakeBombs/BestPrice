import { Product } from '@/services/productService';

type ProductWithExtras = Product & {
  reviews?: number;
  specifications?: Record<string, string>;
};

export const normalizeProducts = (products: ProductWithExtras[]): Product[] => {
  return products.map(product => {
    // Ensure id is a string
    const id = String(product.id);
    
    // Ensure all required fields have values
    return {
      ...product,
      id,
      // Normalize category data
      categoryId: product.categoryId || (product.categoryIds && product.categoryIds.length > 0 ? product.categoryIds[0] : undefined),
      categoryIds: product.categoryIds || (product.categoryId ? [product.categoryId] : []),
      category: product.category || '',
      
      // Normalize image data
      image: product.image || '',
      imageUrl: product.imageUrl || product.image || '',
      image_url: product.imageUrl || product.image || '', // For backward compatibility
      images: product.images || [],
      
      // Ensure product details
      name: product.name,
      title: product.title || product.name,
      description: product.description || '',
      brand: product.brand || '',
      model: product.model || '',
      sku: product.sku || '',
      
      // Normalize price and rating
      price: product.price || 0,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || product.reviews || 0,
      
      // Ensure specifications
      specifications: product.specifications || {},
      specs: product.specs || product.specifications || {},
      
      // Other fields
      slug: product.slug || `product-${id}`,
      highlights: product.highlights || [],
      categories: product.categoryIds ? 
        product.categoryIds.map(id => `Category ${id}`) : 
        (product.categoryId ? [`Category ${product.categoryId}`] : []),
      
      // Normalize prices
      prices: (product.prices || []).map(price => ({
        ...price,
        id: String(price.id || Math.random().toString(36).substr(2, 9)),
        product_id: String(product.id),
        vendorId: price.vendorId || '',
        vendor_id: price.vendorId || '', // For backward compatibility
        inStock: price.inStock || false,
        in_stock: price.inStock || false, // For backward compatibility
        shippingCost: price.shippingCost || 0,
        shipping_cost: price.shippingCost || 0 // For backward compatibility
      })),
    };
  });
};

export default normalizeProducts;
