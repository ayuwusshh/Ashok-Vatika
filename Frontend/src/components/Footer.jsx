import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-background border-t border-brand-surface-dim mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Leaf className="h-6 w-6 text-brand-primary" />
            <span className="text-xl font-display font-bold text-brand-primary">Ashok Vatika 2.0</span>
          </div>
          <div className="flex space-x-6 text-brand-on-surface-variant">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <Link to="/search" className="hover:text-brand-primary transition-colors">Search</Link>
            <Link to="/analyzer" className="hover:text-brand-primary transition-colors">Analyzer</Link>
            <Link to="/tours" className="hover:text-brand-primary transition-colors">Virtual Tours</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-brand-surface-dim text-center text-sm text-brand-on-surface-variant">
          <p>&copy; {new Date().getFullYear()} Ashok Vatika. Bringing life to your space.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
