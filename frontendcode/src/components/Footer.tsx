import React, { useState } from 'react';
import { ArrowUp, Send } from 'lucide-react';
import { Container } from './ui';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <footer className="bg-primary-500 text-white">
      {/* Newsletter Section */}
      <div className="py-10 md:py-12">
        <Container className="max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Subscribe to our emails</h2>
          <p className="mb-6 text-white/90">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="flex-1 px-6 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-primary-500 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              Subscribe
              <Send size={18} />
            </button>
          </form>
        </Container>
      </div>

      {/* Social Media Links */}
      <div className="border-t border-white/20 py-6">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-yellow-400 transition"
            >
              <span>Twitter</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-yellow-400 transition"
            >
              <span>Facebook</span>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-yellow-400 transition"
            >
              <span>Pinterest</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-yellow-400 transition"
            >
              <span>Instagram</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/20 py-6">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/80">
            © 2024 Grocery2Go. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-yellow-400 transition">Contact Us</a>
          </div>
        </Container>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-white text-primary-500 w-12 h-12 rounded-full shadow-lg hover:bg-gray-100 transition flex items-center justify-center z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </footer>
  );
};

export default Footer;
