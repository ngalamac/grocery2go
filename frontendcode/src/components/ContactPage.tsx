import React from 'react';

const ContactPage: React.FC = () => (
  <div className="max-w-2xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
    <p className="mb-4">We'd love to hear from you! Reach out using the info below or the form.</p>
    <div className="mb-6">
      <div className="mb-2"><span className="font-semibold">Phone:</span> 6 79 83 81 82</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> info@grocery2go.shop</div>
      <div><span className="font-semibold">Location:</span> Mimboman- Chateaux Yaounde</div>
    </div>
    <form className="space-y-4">
      <input className="w-full border rounded px-4 py-2" placeholder="Your Name" required />
      <input className="w-full border rounded px-4 py-2" placeholder="Your Email" type="email" required />
      <textarea className="w-full border rounded px-4 py-2" placeholder="Your Message" rows={4} required />
      <button className="bg-[#7cb342] text-white px-6 py-2 rounded" type="submit">Send Message</button>
    </form>
  </div>
);

export default ContactPage;
