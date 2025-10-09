import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import { useProducts } from '../context/ProductsContext';


const categories = [
  { id: 'fruits', name: 'Fruits & Vegetables', icon: '🥕', subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Organic'] },
  { id: 'meat', name: 'Meat & Seafood', icon: '🥩', subcategories: ['Beef', 'Chicken', 'Fish', 'Seafood'] },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', subcategories: ['Milk', 'Cheese', 'Eggs', 'Yogurt'] },
  { id: 'bakery', name: 'Bakery', icon: '🍞', subcategories: ['Bread', 'Pastries', 'Cakes'] },
  { id: 'beverages', name: 'Beverages', icon: '🥤', subcategories: ['Soft Drinks', 'Juices', 'Water'] },
  { id: 'snacks', name: 'Snacks', icon: '🍿', subcategories: ['Chips', 'Cookies', 'Candy'] }
];

const getAllSubcategories = (catName: string) => {
  const cat = categories.find(c => c.name === catName);
  return cat?.subcategories || [];
};


const ShopPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { products } = useProducts();
  const subcategories = selectedCategory !== 'all' ? getAllSubcategories(selectedCategory) : [];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filteredProducts = products
    .filter(p => {
      if (selectedCategory === 'all') return true;
      return p.category === selectedCategory;
    })
    .filter(p => {
      if (selectedSubcategory === 'all' || selectedCategory === 'all') return true;
      // Try to match subcategory in product name
      return p.name.toLowerCase().includes(selectedSubcategory.toLowerCase());
    })
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => p.rating >= minRating)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
  {/* Sidebar Drawer Button for Mobile is hidden as requested */}

        {/* Sidebar as Drawer on Mobile, static on Desktop */}
        {/* Overlay and Drawer only rendered if open on mobile, always visible on desktop */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-[99] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="fixed top-0 left-0 h-full w-80 bg-white/90 z-[100] shadow-lg transform transition-transform duration-300 lg:hidden"
              style={{ maxWidth: 320 }}
            >
              <div className="flex justify-end p-2">
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500 text-2xl">&times;</button>
              </div>
              <Sidebar onCategorySelect={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubcategory('all');
                setSidebarOpen(false);
              }} />
            </div>
          </>
        )}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar onCategorySelect={(cat) => {
            setSelectedCategory(cat);
            setSelectedSubcategory('all');
          }} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={20} />
                <span className="font-semibold">Filters</span>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4 flex-1 w-full">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('all');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                {/* Subcategory Filter */}
                {subcategories.length > 0 && (
                  <select
                    value={selectedSubcategory}
                    onChange={e => setSelectedSubcategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                  >
                    <option value="all">All Subcategories</option>
                    {subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                )}

                {/* Search Filter */}
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                  style={{ minWidth: 160 }}
                />

                {/* Rating Filter */}
                <select
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                >
                  <option value={0}>All Ratings</option>
                  <option value={5}>5 Stars</option>
                  <option value={4.5}>4.5 Stars & up</option>
                  <option value={4}>4 Stars & up</option>
                  <option value={3}>3 Stars & up</option>
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>

                {/* Price Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-sm">Price Filter:</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cb342]"
                    min="0"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {filteredProducts.length} products found
              </div>
            </div>
            {/* Applied filter chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="px-2 py-1 text-xs bg-gray-100 rounded">Category: {selectedCategory} ×</button>
              )}
              {selectedSubcategory !== 'all' && (
                <button onClick={() => setSelectedSubcategory('all')} className="px-2 py-1 text-xs bg-gray-100 rounded">Sub: {selectedSubcategory} ×</button>
              )}
              {search && (
                <button onClick={() => setSearch('')} className="px-2 py-1 text-xs bg-gray-100 rounded">Search: {search} ×</button>
              )}
              {minRating > 0 && (
                <button onClick={() => setMinRating(0)} className="px-2 py-1 text-xs bg-gray-100 rounded">Rating ≥ {minRating} ×</button>
              )}
              {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <button onClick={() => setPriceRange([0, 10000])} className="px-2 py-1 text-xs bg-gray-100 rounded">Price: {priceRange[0]}-{priceRange[1]} ×</button>
              )}
              {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || search || minRating > 0 || priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); setSearch(''); setMinRating(0); setPriceRange([0, 10000]); }} className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded">Clear all</button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      <div className="h-3 w-1/3 bg-gray-200 rounded" />
                      <div className="h-6 w-1/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              : filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
