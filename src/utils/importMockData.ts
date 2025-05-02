import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

export const importMockData = async () => {
  try {
    console.log('Starting import of mock data...');
    
    // Import main categories
    console.log('Importing main categories...');
    for (const mainCategory of mockData.mainCategories) {
      await supabase.from('categories').insert([{
        name: mainCategory.name,
        description: mainCategory.description || '',
        slug: mainCategory.slug || mainCategory.name.toLowerCase().replace(/\s+/g, '-'),
        category_type: 'main',
        image_url: mainCategory.imageUrl
      }]);
    }
    
    // Import subcategories
    console.log('Importing subcategories...');
    for (const subCategory of mockData.categories) {
      await supabase.from('categories').insert([{
        name: subCategory.name,
        description: subCategory.description || '',
        slug: subCategory.slug || subCategory.name.toLowerCase().replace(/\s+/g, '-'),
        category_type: 'sub',
        parent_id: subCategory.parentId ? String(subCategory.parentId) : null,
        image_url: subCategory.imageUrl
      }]);
    }
    
    // Import products
    console.log('Importing products...');
    for (const product of mockData.products) {
      const { data, error } = await supabase.from('products').insert([{
        name: product.name,
        title: product.title || product.name,
        description: product.description || '',
        price: product.price,
        image_url: product.imageUrl || product.image,
        images: product.images || [],
        brand: product.brand || '',
        sku: product.sku || '',
        model: product.model || '',
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
        highlights: product.highlights || [],
        specifications: product.specs || {},
        rating: product.rating || 0,
        review_count: product.reviewCount || 0
      }]).select('id').single();
      
      if (error) {
        console.error('Error importing product:', error);
        continue;
      }
      
      if (data) {
        // Add category relationship
        await supabase.from('product_categories').insert([{
          product_id: data.id,
          category_id: String(product.categoryId),
          primary_category: true
        }]);
        
        // Add additional categories if present
        if (product.categoryIds && product.categoryIds.length > 0) {
          for (const catId of product.categoryIds) {
            if (String(catId) !== String(product.categoryId)) {
              await supabase.from('product_categories').insert([{
                product_id: data.id,
                category_id: String(catId),
                primary_category: false
              }]);
            }
          }
        }
      }
    }
    
    console.log('Mock data import completed successfully!');
    return true;
  } catch (error) {
    console.error('Error importing mock data:', error);
    return false;
  }
};

export default importMockData;
