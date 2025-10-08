import React from 'react';

const imgs = [
  'https://images.pexels.com/photos/4051786/pexels-photo-4051786.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1476412/pexels-photo-1476412.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4021975/pexels-photo-4021975.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7156883/pexels-photo-7156883.jpeg?auto=compress&cs=tinysrgb&w=800'
];

const BrandGallery: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">Our Brand in Action</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imgs.map((src, i) => (
          <div key={i} className="rounded overflow-hidden group relative">
            <img src={src} alt="Brand" className="w-full h-40 object-cover group-hover:scale-110 transition duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGallery;

