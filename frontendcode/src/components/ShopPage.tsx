import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import { useProducts } from '../context/ProductsContext';
import { Container } from './ui';


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
    <Container className="py-4 pb-24">
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
          {/* Filters Bar - simplified, Talabat-like chips and quick sort */}
          <div className="space-y-3 mb-4">
            {/* Categories chips */}
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 rounded-full border text-sm ${selectedCategory==='all' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white'}`}
                  onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                >All</button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`px-3 py-2 rounded-full border text-sm ${selectedCategory===cat.name ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white'}`}
                    onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory('all'); }}
                  >{cat.icon} {cat.name}</button>
                ))}
              </div>
            </div>
            {/* Sort and rating */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-full text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <select
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="px-3 py-2 border rounded-full text-sm"
              >
                <option value={0}>All ratings</option>
                <option value={4}>4+ stars</option>
                <option value={4.5}>4.5+ stars</option>
                <option value={5}>5 stars</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
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
    </Container>
  );
};

export default ShopPage;
