import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`font-medium transition-colors ${
        isActive(to) 
          ? 'text-brand-primary' 
          : 'text-brand-on-surface-variant hover:text-brand-primary'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-brand-surface/80 backdrop-blur-xl border-b border-brand-surface-dim shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-brand-primary/10 p-2 rounded-xl group-hover:bg-brand-primary transition-colors duration-300">
              <Leaf className="h-6 w-6 text-brand-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="text-2xl font-display font-bold text-brand-primary tracking-tight">
              Ashok Vatika
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/search">Plant Search</NavLink>
            <NavLink to="/analyzer">Analyzer</NavLink>
            <NavLink to="/tours">Virtual Tours</NavLink>
          </div>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link to="/login" className="text-brand-primary font-medium hover:text-brand-primary-light transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-secondary transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                Sign up
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "h-10 w-10 border-2 border-brand-primary/20",
                }
              }}/>
            </SignedIn>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
