import React from 'react';
import { Plus, Star } from 'lucide-react';
import { categories, testimonials } from '../data/mockData';
import { useProducts } from '../context/ProductsContext';


interface SidebarProps {
  onCategorySelect?: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCategorySelect }) => {
  const { products } = useProducts();
  const topSellers = products.slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">
          Categories
        </h3>
        <ul className="space-y-3">
          {categories.map(category => (
            <li key={category.id} className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 text-gray-700 hover:text-[#7cb342] transition"
                onClick={() => onCategorySelect && onCategorySelect(category.name)}
              >
                <span className="w-2 h-2 bg-[#7cb342] rounded-full"></span>
                <span>{category.name}</span>
              </button>
              <button className="text-gray-400 hover:text-[#7cb342] transition">
                <Plus size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-8 text-center">
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">Contact Us</h3>
        <div className="mb-4">
          <div className="text-lg font-bold text-[#7cb342] mb-2">Phone:</div>
          <div className="text-2xl font-bold mb-2">6 79 83 81 82</div>
          <div className="text-lg font-bold text-[#7cb342] mb-2">Email:</div>
          <div className="text-base font-semibold mb-2">info@grocery2go.shop</div>
          <div className="text-lg font-bold text-[#7cb342] mb-2">Store Location:</div>
          <div className="text-base font-semibold">Mimboman- Chateaux Yaounde</div>
        </div>
        <div className="mt-6">
          <img
            src="https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Fresh vegetables"
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* Featured Product */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">
          Featured Product
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Fresh fruits"
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded">
              <div className="text-xs text-gray-500 mb-1">July 16, 2018</div>
              <div className="font-semibold">Tasty Fruits & Vegetables</div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Mixed dry fruits"
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded">
              <div className="text-xs text-gray-500 mb-1">July 16, 2018</div>
              <div className="font-semibold">Mixed Dry Fruits</div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Market place"
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded">
              <div className="text-xs text-gray-500 mb-1">July 16, 2018</div>
              <div className="font-semibold">A Market Place For Vegetables</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">
          Testimonials
        </h3>
        <div className="space-y-6">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="text-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-semibold text-[#7cb342]">{testimonial.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{testimonial.role}</p>
              <div className="text-2xl text-gray-300 mb-2">"</div>
              <p className="text-sm text-gray-600 mb-3">{testimonial.text}</p>
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-center gap-2 mt-4">
            <button className="w-3 h-3 rounded-full bg-yellow-400"></button>
            <button className="w-3 h-3 rounded-full bg-[#c8e6c9]"></button>
          </div>
        </div>
      </div>

      {/* Top Sellers */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-[#7cb342]">
          Top Sellers
        </h3>
        <div className="space-y-4">
          {topSellers.map(product => (
            <div key={product.id} className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-[#7cb342] text-sm mb-1">{product.name}</h4>
                <div className="text-lg font-semibold mb-1">{product.price.toFixed(0)} CFA</div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
