import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Package, Clock, Shield, Truck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
const features = [
  { icon: '🚚', title: 'Fast Delivery', description: 'Same-day delivery available' },
  { icon: '💰', title: 'Best Price', description: 'Guaranteed lowest prices' },
  { icon: '🛡️', title: 'Secure', description: 'Safe & secure payment' },
  { icon: '⭐', title: 'Quality', description: 'Verified quality products' }
];
import { useProducts } from '../context/ProductsContext';
import BrandGallery from './BrandGallery';
import { useQuickView } from '../context/QuickViewContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface HomePageProps {
  onShopClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onShopClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, loading } = useProducts();
  const { open } = useQuickView();
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestseller'>('featured');

  const featuredProducts = (
    products.filter(p => (p.rating ?? 0) >= 4.5).slice(0, 8).length > 0
      ? products.filter(p => (p.rating ?? 0) >= 4.5).slice(0, 8)
      : products.slice(0, 8)
  );
  const newProducts = products.slice(0, 8);
  const bestsellerProducts = [...products]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8);

  const displayedProducts = {
    featured: featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8),
    new: newProducts,
    bestseller: bestsellerProducts.length > 0 ? bestsellerProducts : products.slice(8, 16)
  }[activeTab];

  const heroSlides = [
    {
      title: 'FRESH FOOD FOR',
      subtitle: 'FRESH MOOD',
      tagline: '100% Organic / 20% Off Select Products',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      title: 'MARKET TO DOOR',
      subtitle: 'IN HOURS',
      tagline: 'Daily fresh picks delivered fast',
      image: 'https://images.pexels.com/photos/3737633/pexels-photo-3737633.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      title: 'EAT BETTER',
      subtitle: 'LIVE BETTER',
      tagline: 'Healthy choices for every basket',
      image: 'https://images.pexels.com/photos/4051786/pexels-photo-4051786.jpeg?auto=compress&cs=tinysrgb&w=1200'
    }
  ];

  const quickCategories = [
    { name: 'Fresh Juice', icon: '🥤' },
    { name: 'Carrot', icon: '🥕' },
    { name: 'Fresh Meat', icon: '🥩' },
    { name: 'Ice Cream', icon: '🍦' },
    { name: 'Apple', icon: '🍎' },
    { name: 'Cup Cream', icon: '🥛' },
    { name: 'Breast Meat', icon: '🍗' },
    { name: 'Cool Drinks', icon: '🥤' },
    { name: 'About', icon: 'ℹ️', link: '/about' },
    { name: 'Contact', icon: '📞', link: '/contact' },
    { name: 'Coupon', icon: '🏷️', link: '/coupon' },
    { name: 'Track Order', icon: '📦', link: '/track-order' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Countdown logic
  const [timeLeft, setTimeLeft] = useState(0);
  // Set countdown to next midnight (or any promo end time)
  useEffect(() => {
    const promoEnd = new Date();
    promoEnd.setHours(23, 59, 59, 999);
    const updateCountdown = () => {
      const now = new Date();
      const diff = promoEnd.getTime() - now.getTime();
      setTimeLeft(diff > 0 ? diff : 0);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-[#7cb342] to-[#558b2f] rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center min-h-[400px]">
              <div className="w-full lg:w-1/2 p-6 md:p-12 text-white z-10">
                <p className="text-yellow-300 italic text-xl mb-2">Introducing</p>
                {/* Countdown Timer */}
                <div className="mb-4">
                  <div className="bg-white/80 rounded-lg px-6 py-3 inline-block shadow">
                    <span className="text-lg font-bold text-[#7cb342]">FLASH DISCOUNT ENDS IN:</span>
                    <span className="ml-4 text-2xl font-mono text-red-600">
                      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-xs text-white mt-1">Shop now and get exclusive discounts before time runs out!</div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {heroSlides[currentSlide].title}
                  <br />
                  <span className="text-white">{heroSlides[currentSlide].subtitle}</span>
                </h1>
                <p className="text-lg mb-6">{heroSlides[currentSlide].tagline}</p>
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={onShopClick}
                    className="bg-yellow-400 text-black px-8 py-3 rounded-md font-semibold hover:bg-yellow-500 transition"
                  >
                    Shop Now
                  </button>
                  <button className="bg-[#689f38] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#558b2f] transition">
                    Read More
                  </button>
                </div>
              </div>
              <div className="hidden lg:block w-1/2 relative">
                <img
                  src={heroSlides[currentSlide].image}
                  alt="Hero"
                  className="w-full h-[320px] md:h-[400px] object-cover"
                />
              </div>
            </div>
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                  {heroSlides.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full ${i===currentSlide?'bg-white':'bg-white/50'} hover:bg-white transition`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Categories */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
              {quickCategories.map((cat, index) => (
                cat.link ? (
                  <a
                    key={index}
                    href={cat.link}
                    className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="text-4xl">{cat.icon}</div>
                    <span className="text-xs text-center">{cat.name}</span>
                  </a>
                ) : (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="text-4xl">{cat.icon}</div>
                    <span className="text-xs text-center">{cat.name}</span>
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">
                      {feature.icon === 'truck' && '🚚'}
                      {feature.icon === 'clock' && '⏰'}
                      {feature.icon === 'piggy-bank' && '💰'}
                      {feature.icon === 'rotate-ccw' && '↩️'}
                      {feature.icon === 'smartphone' && '📱'}
                      {feature.icon === 'award' && '🏆'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
              <img
                src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Groceries"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Groceries</h3>
                  <p className="text-sm mb-2">Sale Off 25% Get Over 20$ In saving</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
              <img
                src="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Nutrition Foods"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Nutrition Foods</h3>
                  <p className="text-sm mb-2">In Store Now Plus Gift Set With Deal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section with Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-6 border-b pb-4 flex-wrap">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`pb-2 font-semibold ${activeTab==='featured' ? 'text-[#7cb342] border-b-2 border-[#7cb342]' : 'text-gray-600 hover:text-[#7cb342]'}`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`pb-2 font-semibold ${activeTab==='new' ? 'text-[#7cb342] border-b-2 border-[#7cb342]' : 'text-gray-600 hover:text-[#7cb342]'}`}
                >
                  New Arrivals
                </button>
                <button
                  onClick={() => setActiveTab('bestseller')}
                  className={`pb-2 font-semibold ${activeTab==='bestseller' ? 'text-[#7cb342] border-b-2 border-[#7cb342]' : 'text-gray-600 hover:text-[#7cb342]'}`}
                >
                  Best Sellers
                </button>
              </div>
              <button onClick={onShopClick} className="text-sm text-[#2e7d32] hover:underline">See all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm">
                      <div className="w-full h-40 bg-gray-200 rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 w-1/2 bg-gray-200 rounded" />
                        <div className="h-3 w-1/3 bg-gray-200 rounded" />
                        <div className="h-6 w-1/4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))
                : displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
            {!loading && displayedProducts.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-8">No products to display.</div>
            )}
          </div>

          {/* Image gallery by product type */}
          {(products?.length || 0) > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">Browse by Type</h3>
              <div className="space-y-8">
                {products.some(p => p.type === 'shop') && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-[#2e7d32]">Shop</h4>
                      <button onClick={onShopClick} className="text-sm text-[#2e7d32] hover:underline">See all</button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                      {products.filter(p => p.type === 'shop').map((p) => (
                        <button
                          key={p.id}
                          onClick={() => open(p)}
                          className="w-full aspect-square rounded overflow-hidden group bg-neutral-100"
                          title={p.name}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {products.some(p => p.type === 'market') && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-[#2e7d32]">Market</h4>
                      <button onClick={onShopClick} className="text-sm text-[#2e7d32] hover:underline">See all</button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                      {products.filter(p => p.type === 'market').map((p) => (
                        <button
                          key={p.id}
                          onClick={() => open(p)}
                          className="w-full aspect-square rounded overflow-hidden group bg-neutral-100"
                          title={p.name}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
              <img
                src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Healthy Drinks"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Healthy Drinks</h3>
                </div>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
              <img
                src="https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Fresh Fruits"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Fresh Fruits</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="relative rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-purple-100 to-pink-100">
            <div className="p-6 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Eat Good Food
                <br />
                <span className="text-red-600">GET HEALTHY LIFE</span>
              </h2>
              <button className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Featured Brands */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">
              Featured Brands
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
              {[
                { name: 'Fresh Valley', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { name: 'Daily Dairy', image: 'https://images.pexels.com/photos/728273/pexels-photo-728273.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { name: 'Bakehouse Co.', image: 'https://images.pexels.com/photos/263168/pexels-photo-263168.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { name: 'Vital Drinks', image: 'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { name: 'PantryPro', image: 'https://images.pexels.com/photos/3952047/pexels-photo-3952047.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { name: 'MarketHub', image: 'https://images.pexels.com/photos/4051786/pexels-photo-4051786.jpeg?auto=compress&cs=tinysrgb&w=600' },
              ].map(brand => (
                <div key={brand.name} className="rounded-lg overflow-hidden border hover:shadow-md transition group bg-white">
                  <div className="w-full aspect-[3/2] bg-neutral-100 overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="px-3 py-2 text-center text-sm font-medium">{brand.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex flex-wrap gap-2">
              {['Sale', 'New', 'Best', 'Offer', 'Healthy', 'Nutrition', 'Fruits', 'Vegetables', 'Snacks', 'Groceries', 'Ice Cream'].map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#7cb342] hover:text-white rounded-md text-sm transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <BrandGallery />
      </div>
    </div>
  );
};

export default HomePage;
