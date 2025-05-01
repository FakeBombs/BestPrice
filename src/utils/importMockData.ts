
import { mockData, vendors as mockVendors, brands as mockBrands } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { formatSlug } from '@/utils/formatters';

export const importMockData = async () => {
  try {
    console.log('Starting import of mock data...');
    
    // Import main categories
    console.log('Importing main categories...');
    const mainCategoriesData = mockData.mainCategories.map(cat => ({
      name: cat.name,
      description: cat.description,
      slug: cat.slug || formatSlug(cat.name),
      category_type: 'main',
      image_url: cat.imageUrl || cat.image
    }));
    
    const { data: mainCats, error: mainCatError } = await supabase
      .from('categories')
      .insert(mainCategoriesData)
      .select();
      
    if (mainCatError) {
      console.error('Error importing main categories:', mainCatError);
      throw mainCatError;
    }
    
    // Map the old IDs to the new UUIDs
    const mainCategoryMap = new Map();
    mainCats.forEach((newCat, index) => {
      mainCategoryMap.set(String(mockData.mainCategories[index].id), newCat.id);
    });
    
    // Import sub-categories
    console.log('Importing sub-categories...');
    const subCategoriesData = mockData.categories.map(cat => ({
      name: cat.name,
      description: cat.description,
      slug: cat.slug || formatSlug(cat.name),
      category_type: 'sub',
      image_url: cat.imageUrl || cat.image,
      parent_id: cat.parentId ? mainCategoryMap.get(String(cat.parentId)) : null
    }));
    
    const { data: subCats, error: subCatError } = await supabase
      .from('categories')
      .insert(subCategoriesData)
      .select();
      
    if (subCatError) {
      console.error('Error importing sub-categories:', subCatError);
      throw subCatError;
    }
    
    // Map subcategory IDs
    const subCategoryMap = new Map();
    subCats.forEach((newCat, index) => {
      subCategoryMap.set(String(mockData.categories[index].id), newCat.id);
    });
    
    // Import brands
    console.log('Importing brands...');
    const brandsData = mockBrands.map(brand => ({
      name: brand.name,
      logo: brand.logo
    }));
    
    const { data: brandsResult, error: brandsError } = await supabase
      .from('brands')
      .insert(brandsData)
      .select();
      
    if (brandsError) {
      console.error('Error importing brands:', brandsError);
      throw brandsError;
    }
    
    // Import vendors
    console.log('Importing vendors...');
    const vendorsData = mockVendors.map(vendor => ({
      name: vendor.name,
      certification: vendor.certification,
      address: vendor.address,
      telephone: vendor.telephone,
      product_count: vendor.productCount,
      category_count: vendor.categoryCount,
      payment_methods: vendor.paymentMethods,
      url: vendor.url,
      logo: vendor.logo,
      rating: vendor.rating
    }));
    
    const { data: vendorResults, error: vendorError } = await supabase
      .from('vendors')
      .insert(vendorsData)
      .select();
      
    if (vendorError) {
      console.error('Error importing vendors:', vendorError);
      throw vendorError;
    }
    
    // Map vendor IDs
    const vendorMap = new Map();
    vendorResults.forEach((newVendor, index) => {
      vendorMap.set(String(mockVendors[index].id), newVendor.id);
    });
    
    // Import products
    console.log('Importing products...');
    const productsData = mockData.products.map(product => ({
      name: product.name,
      title: product.title || product.name,
      description: product.description,
      price: product.price,
      image_url: product.imageUrl || product.image,
      images: product.images || [],
      brand: product.brand,
      sku: product.sku,
      model: product.model || '',
      slug: product.slug || formatSlug(product.name),
      highlights: product.highlights || [],
      specifications: product.specifications || {},
      rating: product.rating,
      review_count: product.reviewCount || product.reviews || 0
    }));
    
    const { data: productsResult, error: productsError } = await supabase
      .from('products')
      .insert(productsData)
      .select();
      
    if (productsError) {
      console.error('Error importing products:', productsError);
      throw productsError;
    }
    
    // Map product IDs
    const productMap = new Map();
    productsResult.forEach((newProduct, index) => {
      productMap.set(String(mockData.products[index].id), newProduct.id);
    });
    
    // Import product categories
    console.log('Importing product categories...');
    const productCategoriesData = [];
    
    mockData.products.forEach(product => {
      const newProductId = productMap.get(String(product.id));
      
      if (product.categoryId) {
        const mainCatId = mainCategoryMap.get(String(product.categoryId));
        const subCatId = subCategoryMap.get(String(product.categoryId));
        const categoryId = mainCatId || subCatId;
        
        if (categoryId) {
          productCategoriesData.push({
            product_id: newProductId,
            category_id: categoryId,
            primary_category: true
          });
        }
      }
      
      if (product.categoryIds && Array.isArray(product.categoryIds)) {
        product.categoryIds.forEach((catId: string | number) => {
          const mainCatId = mainCategoryMap.get(String(catId));
          const subCatId = subCategoryMap.get(String(catId));
          const categoryId = mainCatId || subCatId;
          
          if (categoryId && String(catId) !== String(product.categoryId)) {
            productCategoriesData.push({
              product_id: newProductId,
              category_id: categoryId,
              primary_category: false
            });
          }
        });
      }
    });
    
    if (productCategoriesData.length > 0) {
      const { error: prodCatError } = await supabase
        .from('product_categories')
        .insert(productCategoriesData);
        
      if (prodCatError) {
        console.error('Error importing product categories:', prodCatError);
        throw prodCatError;
      }
    }
    
    // Import product prices
    console.log('Importing product prices...');
    const productPricesData = [];
    
    mockData.products.forEach(product => {
      const newProductId = productMap.get(String(product.id));
      
      if (product.prices && Array.isArray(product.prices)) {
        product.prices.forEach((price: any) => {
          const vendorId = vendorMap.get(price.vendorId);
          
          if (vendorId) {
            productPricesData.push({
              product_id: newProductId,
              vendor_id: vendorId,
              price: price.price,
              in_stock: price.inStock !== undefined ? price.inStock : true,
              shipping_cost: price.shippingCost
            });
          }
        });
      }
    });
    
    if (productPricesData.length > 0) {
      const { error: priceError } = await supabase
        .from('product_prices')
        .insert(productPricesData);
        
      if (priceError) {
        console.error('Error importing product prices:', priceError);
        throw priceError;
      }
    }
    
    console.log('Mock data import completed successfully!');
    return true;
  } catch (error) {
    console.error('Error importing mock data:', error);
    return false;
  }
};
