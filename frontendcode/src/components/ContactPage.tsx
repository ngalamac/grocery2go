import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sent');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-6">{(typeof window !== 'undefined' && localStorage.getItem('g2g_setting_contact')) || "We'd love to hear from you! Fill the form and we'll respond shortly."}</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]" placeholder="Your Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <textarea className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]" placeholder="Your Message" rows={5} value={message} onChange={e => setMessage(e.target.value)} required />
            <button className="w-full bg-[#7cb342] text-white px-6 py-3 rounded font-semibold hover:bg-[#689f38] transition" type="submit">Send Message</button>
            {status === 'sent' && (
              <div className="text-green-700 bg-green-50 border border-green-200 rounded p-3 text-sm">Message sent! We'll get back to you soon.</div>
            )}
          </form>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Get in touch</h2>
            <div className="space-y-3 text-gray-700">
              <div><span className="font-semibold">Phone:</span> 6 79 83 81 82</div>
              <div><span className="font-semibold">Email:</span> info@grocery2go.shop</div>
              <div><span className="font-semibold">Location:</span> Mimboman- Chateaux Yaounde</div>
              <div className="text-sm text-gray-500">Mon - Sat: 8:00 - 18:00</div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <img src="https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Store" className="w-full h-64 object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
