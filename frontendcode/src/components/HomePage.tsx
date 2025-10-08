import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import { features } from '../data/mockData';
import { useProducts } from '../context/ProductsContext';
import BrandGallery from './BrandGallery';

interface HomePageProps {
  onShopClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onShopClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products } = useProducts();
  const featuredProducts = (() => {
    try {
      const ids = (localStorage.getItem('g2g_featured_ids') || '').split(',').map(s=>s.trim()).filter(Boolean);
      if (ids.length === 0) return products.slice(0,8);
      const picked = products.filter(p => ids.includes(p.id));
      return picked.length > 0 ? picked : products.slice(0,8);
    } catch { return products.slice(0,8); }
  })();

  const heroSlides = [
    {
      title: 'FRESH FOOD FOR',
      subtitle: 'FRESH MOOD',
      tagline: '100% Organic / 20% Off Select Products',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1200'
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-[#7cb342] to-[#558b2f] rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center min-h-[400px]">
              <div className="w-full md:w-1/2 p-6 md:p-12 text-white z-10">
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
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
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
              <div className="hidden md:block w-1/2 relative">
                <img
                  src={heroSlides[currentSlide].image}
                  alt="Hero"
                  className="w-full h-[400px] object-cover"
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
              </>
            )}
          </div>

          {/* Quick Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
          <div className="grid md:grid-cols-2 gap-6">
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

          {/* Featured Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center gap-6 mb-6 border-b pb-4">
              <button className="text-[#7cb342] font-semibold border-b-2 border-[#7cb342] pb-2">
                Featured Product
              </button>
              <button className="text-gray-600 hover:text-[#7cb342] font-semibold pb-2">
                New Arrival
              </button>
              <button className="text-gray-600 hover:text-[#7cb342] font-semibold pb-2">
                Best Sellers
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Category Sections */}
          <div className="grid md:grid-cols-2 gap-6">
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
            <div className="p-8 md:p-12 text-center">
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

          {/* Logo List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">
              Logo List
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 flex items-center justify-center hover:shadow-md transition">
                  <div className="text-gray-400 text-xs text-center">Brand Logo</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
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
