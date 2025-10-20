import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantsContext';
import { Container } from './ui';

const RestaurantDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { restaurants, loading } = useRestaurants();
  const restaurant = useMemo(() => restaurants.find(r => r.slug === slug), [restaurants, slug]);

  if (loading && !restaurant) {
    return (
      <Container className="py-4">
        <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse h-64" />
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container className="py-10">
        <div className="text-center text-sm text-neutral-500">Restaurant not found.</div>
      </Container>
    );
  }

  const { name, coverImage, logo, cuisine, rating, deliveryFee, deliveryTimeMin, deliveryTimeMax, menu } = restaurant;

  return (
    <Container className="py-4">
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="relative h-40 sm:h-56 md:h-64 w-full bg-neutral-100">
          {coverImage && <img src={coverImage} alt={name} className="w-full h-full object-cover" />}
          <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow p-2 flex items-center gap-3">
            {logo && <img src={logo} alt={name} className="w-12 h-12 rounded" />}
            <div>
              <h1 className="font-semibold">{name}</h1>
              <div className="text-xs text-neutral-500">{cuisine?.join(', ')}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b text-sm text-neutral-600 flex flex-wrap gap-4">
          <div>⭐ {rating.toFixed(1)}</div>
          <div>🕒 {deliveryTimeMin}-{deliveryTimeMax} min</div>
          <div>🚚 {deliveryFee} CFA</div>
        </div>

        <div className="p-4">
          <h2 className="font-semibold mb-3">Menu</h2>
          {menu.length === 0 ? (
            <div className="text-sm text-neutral-500">No items yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menu.map(item => (
                <div key={item.id || item.name} className="border rounded-lg overflow-hidden">
                  {item.image && (
                    <div className="w-full aspect-video bg-neutral-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="font-medium text-sm">{item.name}</div>
                    {item.description && <div className="text-xs text-neutral-500 line-clamp-2">{item.description}</div>}
                    <div className="mt-2 font-semibold text-primary-700">{item.price} CFA</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default RestaurantDetailsPage;
