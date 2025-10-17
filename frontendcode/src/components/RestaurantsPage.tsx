import React from 'react';
import { useRestaurants } from '../context/RestaurantsContext';
import { Container } from './ui';
import { useNavigate } from 'react-router-dom';

const RestaurantsPage: React.FC = () => {
  const { restaurants, loading } = useRestaurants();
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      <div className="bg-white rounded-xl shadow-soft p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Restaurants</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm">
                <div className="w-full aspect-square bg-gray-200 rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(restaurants || []).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/restaurants/${r.slug}`)}
                className="rounded-lg overflow-hidden border hover:shadow-md transition group bg-white text-left"
              >
                <div className="w-full aspect-square bg-neutral-100 overflow-hidden">
                  <img
                    src={r.logo || r.coverImage || 'https://via.placeholder.com/300'}
                    alt={r.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="px-3 py-2">
                  <div className="font-medium text-sm truncate">{r.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{r.cuisine?.join(', ')}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default RestaurantsPage;
