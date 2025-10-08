import React from 'react';

const AboutPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 py-10">
    <div className="relative rounded-lg overflow-hidden shadow-md bg-gradient-to-r from-[#7cb342] to-[#558b2f] mb-8">
      <div className="p-10 md:p-14 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">About Grocery2Go</h1>
        <p className="text-white/90 max-w-3xl">We deliver market-fresh groceries across Yaoundé. Local, affordable, and fast — we exist to save your time without compromising quality.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mb-10">
      {[{
        title: 'Fresh & Local',
        desc: 'We prioritize local producers and daily-fresh selections.'
      },{
        title: 'Fast Delivery',
        desc: 'Same-day delivery in Yaoundé with reliable riders.'
      },{
        title: 'Customer First',
        desc: 'Friendly support and transparent pricing every time.'
      }].map((f, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-600">{f.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
      <p className="text-gray-700">We aim to make everyday shopping effortless. From pantry staples to market-fresh produce, we curate, pack, and deliver with care. Your satisfaction is our priority.</p>
    </div>
  </div>
);

export default AboutPage;
