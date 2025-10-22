import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Headphones, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductsContext';
import BrandGallery from './BrandGallery';
import { useNavigate } from 'react-router-dom';
import { Container } from './ui';
import { useRestaurants } from '../context/RestaurantsContext';

interface HomePageProps { onShopClick: () => void }

const HomePage: React.FC<HomePageProps> = ({ onShopClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const { restaurants, loading: loadingRestaurants } = useRestaurants();


  const heroSlides = [
    {
      title: 'Get the Best and Fresh',
      subtitle: 'Groceries Delivered!',
      tagline: 'A grocery store only selling organic and fresh items delivered fast',
      image: 'https://images.pexels.com/photos/2255851/pexels-photo-2255851.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      title: 'Daily Fresh Picks',
      subtitle: 'Right to Your Door',
      tagline: 'Save up to 20% on select categories today',
      image: 'https://images.pexels.com/photos/4051786/pexels-photo-4051786.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      title: 'Organic & Healthy',
      subtitle: 'Eat Better, Live Better',
      tagline: 'All-natural products curated for you',
      image: 'https://images.pexels.com/photos/4393662/pexels-photo-4393662.jpeg?auto=compress&cs=tinysrgb&w=1600'
    }
  ];

  const categoryIcons = [
    { name: 'Category 1', icon: '🥬' },
    { name: 'Category 2', icon: '🍞' },
    { name: 'Category 3', icon: '🍗' },
    { name: 'Category 4', icon: '🥛' },
    { name: 'Category 5', icon: '🍎' },
    { name: 'Category 6', icon: '🥕' },
    { name: 'Category 7', icon: '🥚' },
    { name: 'Category 8', icon: '🥭' },
    { name: 'Category 9', icon: '🧀' },
    { name: 'Category 10', icon: '🥤' },
    { name: 'Category 11', icon: '🧁' },
    { name: 'Category 12', icon: '🍯' },
  ];

  const features = [
    { icon: <Truck className="text-primary-600" size={22} />, title: 'Free delivery', description: 'On all orders above 10,000 CFA' },
    { icon: <ShieldCheck className="text-primary-600" size={22} />, title: 'Secure payments', description: 'Pay safely with protection' },
    { icon: <Sparkles className="text-primary-600" size={22} />, title: 'Best quality', description: 'Curated fresh products' },
    { icon: <Headphones className="text-primary-600" size={22} />, title: 'Great support', description: '24/7 friendly service' },
  ];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  // removed countdown logic for simplified banner

  // Autoplay for hero
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Deal of the day countdown
  const dealEnd = useMemo(() => Date.now() + 1000 * 60 * 60 * 26, []); // ~26 hours from now
  const [dealRemainingMs, setDealRemainingMs] = useState<number>(dealEnd - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDealRemainingMs(Math.max(0, dealEnd - Date.now())), 1000);
    return () => clearInterval(t);
  }, [dealEnd]);

  const hours = Math.floor(dealRemainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((dealRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((dealRemainingMs % (1000 * 60)) / 1000);

  return (
    <Container className="py-6 md:py-10">
      <div className="space-y-8 md:space-y-10">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-2xl shadow-large">
          <img src={heroSlides[currentSlide].image} alt="Hero" className="w-full h-[220px] sm:h-[320px] md:h-[440px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-y-0 left-0 p-5 sm:p-10 flex items-center">
            <div className="text-white max-w-xl">
              <div className="uppercase tracking-wide text-xs sm:text-sm text-white/90">Welcome to Grocery Store</div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                {heroSlides[currentSlide].title}
                <br />
                <span className="font-medium">{heroSlides[currentSlide].subtitle}</span>
              </h1>
              <p className="mt-2 sm:mt-3 text-white/90 text-sm sm:text-base">{heroSlides[currentSlide].tagline}</p>
              <div className="mt-4 sm:mt-6">
                <button onClick={onShopClick} className="bg-primary-500 hover:bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold shadow-soft">Shop Now</button>
              </div>
            </div>
          </div>
          <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-2 rounded-full shadow">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-2 rounded-full shadow">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* CATEGORY ICON GRID */}
        <div className="bg-white rounded-xl shadow-soft p-3 sm:p-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
            {categoryIcons.map((c) => (
              <button key={c.name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition">
                <div className="text-2xl">{c.icon}</div>
                <div className="text-xs text-neutral-700 text-center">{c.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* FEATURE STRIP */}
        <div className="bg-white rounded-xl shadow-soft p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-50 grid place-items-center">{f.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{f.title}</div>
                  <div className="text-xs text-neutral-500">{f.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEAL + RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deal of the day card */}
          <div className="bg-white rounded-xl shadow-soft p-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,111,0,0.08),transparent_45%)]" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Deal of the Day</h3>
              <div className="flex items-center gap-2 text-sm text-neutral-600"><Clock size={16} /> Ends in {hours.toString().padStart(2,'0')}:{minutes.toString().padStart(2,'0')}:{seconds.toString().padStart(2,'0')}</div>
            </div>
            <div className="rounded-lg overflow-hidden bg-neutral-50 aspect-[16/10] mb-4">
              <img className="w-full h-full object-cover" src={(products[0]?.image) || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800'} alt="deal" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Fresh Basket</div>
                <div className="text-sm text-neutral-500">Special limited-time offer</div>
              </div>
              <button onClick={onShopClick} className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-md font-medium">Shop Now</button>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 w-2/3" />
              </div>
              <div className="mt-1 text-xs text-neutral-500">Sold: 68% • Hurry up!</div>
            </div>
          </div>

          {/* Recommendations grid */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recommendations For You</h3>
              <button onClick={onShopClick} className="text-sm text-primary-700 hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(loading ? Array.from({ length: 4 }) : products.slice(0, 4)).map((p, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border bg-white">
                  <div className="w-full aspect-square bg-neutral-100 overflow-hidden">
                    <img src={(p as any)?.image || 'https://images.pexels.com/photos/3952047/pexels-photo-3952047.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={(p as any)?.name || 'Product'} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium truncate">{(p as any)?.name || 'Organic basket'}</div>
                    <div className="text-xs text-neutral-500">Fresh & organic</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROMO BANNERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-xl overflow-hidden shadow-soft group">
            <img src="https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=1200" className="w-full h-56 object-cover group-hover:scale-105 transition" alt="Eggs" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="text-sm">Organic Fresh Delivered to You!</div>
              <div className="text-2xl font-bold">Discount 50%</div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-soft group">
            <img src="https://images.pexels.com/photos/6157055/pexels-photo-6157055.jpeg?auto=compress&cs=tinysrgb&w=1200" className="w-full h-56 object-cover group-hover:scale-105 transition" alt="Basket" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="text-sm">FRESH & ORGANIC</div>
              <div className="text-2xl font-bold">Mega Basket</div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-soft group">
            <img src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1200" className="w-full h-56 object-cover group-hover:scale-105 transition" alt="Crabs" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="text-sm">Get Egg Crabs Delivered to You!</div>
              <div className="text-2xl font-bold">Discount 50%</div>
            </div>
          </div>
        </div>

        {/* BRANDS STRIP */}
        <div className="bg-white rounded-xl shadow-soft p-4">
          <div className="text-sm text-neutral-500 mb-3">Shop by Brand</div>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="rounded-lg border bg-white p-3 grid place-items-center">
                <img src={`https://dummyimage.com/120x60/ffffff/aaa&text=Brand+${i}`} alt={`Brand ${i}`} className="opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* TRENDING PRODUCTS */}
        <div className="bg-white rounded-xl shadow-soft p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Trending Products</h3>
            <button onClick={onShopClick} className="text-sm text-primary-700 hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {(loading ? Array.from({ length: 12 }) : products.slice(0, 12)).map((p, idx) => (
              p ? <ProductCard key={(p as any).id} product={p as any} /> : (
                <div key={idx} className="rounded-xl bg-neutral-100 h-60 animate-pulse" />
              )
            ))}
          </div>
        </div>

        {/* VENDOR CTA */}
        <div className="relative overflow-hidden rounded-2xl shadow-large bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
          <div className="px-6 py-10 md:px-12 md:py-14 text-center">
            <h3 className="text-2xl md:text-4xl font-extrabold">Join Over 958 Vendors, Sell with Us Today!</h3>
            <div className="mt-3 text-white/90 max-w-2xl mx-auto">Grow your business with our marketplace and reach thousands of customers.</div>
            <button className="mt-5 bg-white text-primary-600 px-6 py-3 rounded-md font-semibold">Become a Partner</button>
          </div>
          <img src="https://images.pexels.com/photos/5946089/pexels-photo-5946089.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="fruits" className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[900px] opacity-40 pointer-events-none" />
        </div>

        {/* CLIENTS / PARTNERS */}
        <div className="bg-white rounded-xl shadow-soft p-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 place-items-center opacity-80">
            {[1,2,3,4,5,6].map(i => (
              <img key={i} src={`https://dummyimage.com/120x48/ffffff/aaa&text=Logo+${i}`} alt={`Logo ${i}`} />
            ))}
          </div>
        </div>

        {/* BEST SELLING CATEGORIES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-bold mb-2">Explore Best Selling Categories!</h3>
            <p className="text-sm text-neutral-600">Browse our most popular categories and find daily essentials at the best prices.</p>
            <button onClick={onShopClick} className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">Explore Shop</button>
          </div>
          {[['Fruits', '🍎'], ['Vegetables','🥕'], ['Bakery','🥐'], ['Dairy','🥛'], ['Snacks','🍪'], ['Beverages','🥤']].map(([name, emoji]) => (
            <div key={name} className="bg-white rounded-xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full grid place-items-center bg-neutral-100 text-xl">{emoji}</div>
              <div>
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-neutral-500">Shop now</div>
              </div>
            </div>
          ))}
        </div>

        {/* RESTAURANTS HIGHLIGHT */}
        <div className="bg-white rounded-xl shadow-soft p-4 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold">Popular Restaurants</h3>
            <button onClick={() => navigate('/restaurants')} className="text-sm text-primary-700 hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingRestaurants
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm">
                    <div className="w-full aspect-square bg-gray-200 rounded-t-lg" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              : (restaurants || []).slice(0, 12).map(r => (
                  <button key={r.id} onClick={() => navigate(`/restaurants/${r.slug}`)} className="rounded-lg overflow-hidden border hover:shadow-md transition group bg-white text-left">
                    <div className="w-full aspect-square bg-neutral-100 overflow-hidden">
                      <img src={r.logo || r.coverImage || 'https://via.placeholder.com/300'} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="px-3 py-2">
                      <div className="font-medium text-sm truncate">{r.name}</div>
                      <div className="text-xs text-neutral-500 truncate">{r.cuisine?.join(', ')}</div>
                    </div>
                  </button>
                ))}
          </div>
        </div>

        {/* BLOG TEASERS */}
        <div className="bg-white rounded-xl shadow-soft p-4 md:p-6">
          <h3 className="text-xl font-semibold mb-4">Our Recent News & Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'What Final Touches Can I Add to my Business', image: 'https://images.pexels.com/photos/4199091/pexels-photo-4199091.jpeg?auto=compress&cs=tinysrgb&w=1200' },
              { title: 'What Final Touches Can I Add to my Business', image: 'https://images.pexels.com/photos/4392039/pexels-photo-4392039.jpeg?auto=compress&cs=tinysrgb&w=1200' },
              { title: 'What Final Touches Can I Add to my Business', image: 'https://images.pexels.com/photos/5514799/pexels-photo-5514799.jpeg?auto=compress&cs=tinysrgb&w=1200' },
            ].map((a, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border bg-white group">
                <img src={a.image} alt={a.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform" />
                <div className="p-4">
                  <div className="text-xs text-neutral-500">Fresh Fit</div>
                  <div className="font-semibold">{a.title}</div>
                  <button className="mt-2 text-sm text-primary-700 hover:underline">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL TAG STRIP + GALLERY */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-wrap gap-2">
            {['Sale', 'New', 'Best', 'Offer', 'Healthy', 'Nutrition', 'Fruits', 'Vegetables', 'Snacks', 'Groceries', 'Ice Cream'].map((tag) => (
              <button key={tag} className="px-4 py-2 bg-gray-100 hover:bg-primary-500 hover:text-white rounded-md text-sm transition">{tag}</button>
            ))}
          </div>
        </div>

        <BrandGallery />
      </div>
    </Container>
  );
};

export default HomePage;
