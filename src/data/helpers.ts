// --- Helper Functions ---
export const fetchFeaturedProducts = () => { return products.filter(p => p.isFeatured).slice(0, 5); };
export const fetchDeals = () => { return products.filter(p => Array.isArray(p.prices) && p.prices.some(price => price.discountPrice)).slice(0, 5); };
export const fetchNewArrivals = () => { return [...products].sort((a, b) => new Date(b.releaseDate || b.dateAdded || 0).getTime() - new Date(a.releaseDate || a.dateAdded || 0).getTime()).slice(0, 5); };
export const searchProducts = (query: string): Product[] => { if (!query) return []; const searchText = query.toLowerCase(); return products.filter(product => product.title.toLowerCase().includes(searchText) || product.brand?.toLowerCase().includes(searchText) || product.model?.toLowerCase().includes(searchText) || (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(searchText))) ); };
export const getCategoryById = (id: number): Category | undefined => { const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c])); return allCatsMap.get(id); };
export const getProductById = (id: number): Product | undefined => { return products.find(product => product.id === id); };
export const getProductsByCategory = (categoryId: number): Product[] => { return products.filter(product => Array.isArray(product.categoryIds) && product.categoryIds.includes(categoryId)); };
export const getSimilarProducts = (productId: number): Product[] => { const product = getProductById(productId); if (!product || !Array.isArray(product.categoryIds) || product.categoryIds.length === 0) return []; const leafCategoryId = product.categoryIds[product.categoryIds.length - 1]; return products.filter(p => p.id !== productId && Array.isArray(p.categoryIds) && p.categoryIds.includes(leafCategoryId)).slice(0, 5); };
export const getVendorById = (vendorId: number): Vendor | undefined => { const vendorMap = new Map(vendors.map(v => [v.id, v])); return vendorMap.get(vendorId); };
export const getBestPrice = (product: Product): ProductPrice | null => { if (!product || !Array.isArray(product.prices) || product.prices.length === 0) return null; const inStockPrices = product.prices.filter(price => price.inStock); if (inStockPrices.length === 0) { return null; } return inStockPrices.reduce((best, current) => (current.price < best.price) ? current : best, inStockPrices[0]); };
export const getCategories = (): Category[] => { return categories; };
export const getBrands = (): Brand[] => { return brands; };
