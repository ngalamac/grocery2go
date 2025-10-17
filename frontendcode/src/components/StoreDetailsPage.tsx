import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stores } from '../data/stores';
import { Container } from './ui';
import { ArrowLeft, Star, MapPin, Clock, Bike, MapPinned } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductsContext';

const StoreDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useMemo(() => stores.find(s => s.id === id), [id]);
  const { products } = useProducts();

  if (!store) return <div className="max-w-3xl mx-auto px-4 py-10">Store not found.</div>;

  // Demo: pick some products to show as from this store by type
  const featured = products.slice(0, 8);

  return (
    <div className="pb-24">
      <div className="relative h-40 sm:h-56">
        <img src={store.image} alt={store.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
        <div className="absolute top-3 left-3">
          <button onClick={()=>navigate(-1)} className="px-3 py-2 rounded-full bg-white/90 backdrop-blur border text-sm flex items-center gap-1">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">{store.name}</h1>
            {store.mapsQuery && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-white/90 text-neutral-900 border text-sm flex items-center gap-1"
                title="Open in Google Maps"
              >
                <MapPinned size={16} /> Map
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" /> {store.rating}
            <span className="mx-1">•</span>
            <MapPin size={16} /> {store.area}
            <span className="mx-1">•</span>
            <Clock size={16} /> {store.etaRangeMins[0]}-{store.etaRangeMins[1]} min
            <span className="mx-1">•</span>
            <Bike size={16} /> {store.deliveryFeeCFA} CFA
          </div>
        </div>
      </div>

      <Container className="py-4 space-y-4">
        {store.tags && (
          <div className="flex flex-wrap gap-2">
            {store.tags.map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-neutral-100 border text-sm">{t}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Popular at this store</h2>
          <button onClick={()=>navigate('/shop')} className="text-sm text-primary-700">See all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default StoreDetailsPage;
