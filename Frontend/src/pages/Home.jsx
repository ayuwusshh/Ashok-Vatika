import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Sprout } from 'lucide-react';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-background pt-16 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-gradient-to-b from-[#e8f5e9] to-transparent opacity-50 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center space-x-2 bg-brand-surface border border-brand-surface-dim rounded-full px-4 py-1.5 mb-8 shadow-sm">
                <Leaf className="h-4 w-4 text-brand-primary" />
                <span className="text-sm font-medium text-brand-on-surface-variant">Your Virtual Herbal Garden</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-primary leading-[1.1] tracking-tight mb-6">
                Bringing Life to your space.
              </h1>
              <p className="text-lg text-brand-on-surface-variant mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore ancient botanical wisdom through modern digital education. Discover, learn, and safely identify plants and herbal ingredients.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/search">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Plants <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/analyzer">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Analyze Ingredients
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-secondary/20 to-transparent rounded-[2.5rem] transform rotate-3 scale-105 blur-lg -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Lush green botanical garden" 
                className="w-full h-[500px] lg:h-[600px] object-cover rounded-[2rem] shadow-ambient"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-brand-surface p-6 rounded-2xl shadow-ambient hidden md:flex items-center space-x-4 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="bg-[#e4e4cc] p-3 rounded-xl">
                  <ShieldCheck className="h-8 w-8 text-[#1b1d0e]" />
                </div>
                <div>
                  <p className="text-sm text-brand-on-surface-variant font-medium">Database</p>
                  <p className="text-lg font-display font-bold text-brand-primary">26,000+ Herbs</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section: No Garden? No Problem */}
      <section className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-brand-primary mb-4">No Garden? No Problem.</h2>
            <p className="text-lg text-brand-on-surface-variant">We bring the knowledge of nature directly to your screen. Whether you are looking for indoor air purifiers or ancient medicinal remedies, we have you covered.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Indoor Wonders",
                desc: "Plants that thrive inside and purify your air naturally.",
                icon: <Sprout className="h-8 w-8" />,
                color: "bg-[#e8f5e9]",
                textColor: "text-[#1b5e20]"
              },
              {
                title: "Medicinal Herbs",
                desc: "Ancient remedies backed by modern botanical science.",
                icon: <Leaf className="h-8 w-8" />,
                color: "bg-[#fff3e0]",
                textColor: "text-[#e65100]"
              },
              {
                title: "Ingredient Safety",
                desc: "Scan product labels to instantly identify harmful chemicals.",
                icon: <ShieldCheck className="h-8 w-8" />,
                color: "bg-[#e3f2fd]",
                textColor: "text-[#1565c0]"
              }
            ].map((cat, i) => (
              <div key={i} className="bg-brand-background rounded-[1.5rem] p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md">
                <div className={`${cat.color} ${cat.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-brand-primary mb-3">{cat.title}</h3>
                <p className="text-brand-on-surface-variant leading-relaxed mb-6">{cat.desc}</p>
                <Link to="/search" className="text-brand-primary font-medium hover:text-brand-secondary transition-colors inline-flex items-center">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to grow your knowledge?</h2>
          <p className="text-brand-primary-fixed mb-10 text-lg">Join thousands of others learning about the botanical world.</p>
          <Link to="/signup">
            <Button  size="lg" className="bg-brand-secondary/90 text-brand-primary-dark hover:bg-white hover:text-brand-secondary transition-colors border-none shadow-xl">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
