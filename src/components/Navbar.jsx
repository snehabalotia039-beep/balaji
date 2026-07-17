import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import LogoImage from '../assets/logo.jpg';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll listener to toggle navbar solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Is current route active?
  const isActive = (path) => location.pathname === path;

  // We check if the current page is Home. If so, we can start transparent (if scrolled is false)
  const isHomePage = location.pathname === '/';
  const navbarBackground = isScrolled || !isHomePage
    ? 'bg-white shadow-md py-3 text-slate-800'
    : 'bg-black/20 backdrop-blur-xs py-5 text-white';

  const linkColorClass = isScrolled || !isHomePage
    ? 'text-slate-700 hover:text-primary font-medium'
    : 'text-white/90 hover:text-secondary font-medium';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navbarBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1 rounded-md shadow-xs border border-beige-dark transition-transform duration-300 group-hover:scale-105">
              <img 
                src={LogoImage} 
                alt="New Balaji Property" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  // If image fails, hide image and show a fallback
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold tracking-wide text-lg sm:text-xl leading-tight ${isScrolled || !isHomePage ? 'text-primary' : 'text-white'}`}>
                NEW BALAJI PROPERTY
              </span>
              <span className={`text-[10px] sm:text-xs tracking-widest font-semibold uppercase ${isScrolled || !isHomePage ? 'text-secondary-dark' : 'text-secondary'}`}>
                Real Estate Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className={`transition-colors text-sm tracking-wide ${isActive('/') ? 'text-primary font-semibold border-b-2 border-secondary' : linkColorClass}`}>
              Home
            </Link>
            <Link to="/properties" className={`transition-colors text-sm tracking-wide ${isActive('/properties') ? 'text-primary font-semibold border-b-2 border-secondary' : linkColorClass}`}>
              Properties
            </Link>
            <Link to="/services" className={`transition-colors text-sm tracking-wide ${isActive('/services') ? 'text-primary font-semibold border-b-2 border-secondary' : linkColorClass}`}>
              Services
            </Link>
            <Link to="/about" className={`transition-colors text-sm tracking-wide ${isActive('/about') ? 'text-primary font-semibold border-b-2 border-secondary' : linkColorClass}`}>
              About Us
            </Link>
            <Link to="/contact" className={`transition-colors text-sm tracking-wide ${isActive('/contact') ? 'text-primary font-semibold border-b-2 border-secondary' : linkColorClass}`}>
              Contact
            </Link>
          </div>

          {/* Desktop Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+919213521804" 
              className={`flex items-center gap-2 text-sm transition-colors ${isScrolled || !isHomePage ? 'text-slate-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}
            >
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-semibold">+91 9213521804</span>
            </a>
            <Link 
              to="/book" 
              className={`px-5 py-2.5 rounded-md text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                isScrolled || !isHomePage 
                  ? 'bg-primary hover:bg-primary-light text-white shadow-md hover:shadow-lg' 
                  : 'bg-secondary hover:bg-secondary-dark text-slate-900 shadow-md hover:shadow-lg'
              }`}
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <a 
              href="tel:+919213521804" 
              className={`p-2 rounded-full ${isScrolled || !isHomePage ? 'text-primary bg-slate-100' : 'text-white bg-white/10'}`}
              aria-label="Call Office"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors ${isScrolled || !isHomePage ? 'text-slate-800' : 'text-white'}`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-xl border-t border-slate-100 absolute top-full left-0 right-0 py-4 px-6 animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <Link 
              to="/" 
              className={`text-base py-2 border-b border-slate-50 transition-colors ${isActive('/') ? 'text-primary font-bold' : 'text-slate-700'}`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={`text-base py-2 border-b border-slate-50 transition-colors ${isActive('/properties') ? 'text-primary font-bold' : 'text-slate-700'}`}
            >
              Properties
            </Link>
            <Link 
              to="/services" 
              className={`text-base py-2 border-b border-slate-50 transition-colors ${isActive('/services') ? 'text-primary font-bold' : 'text-slate-700'}`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`text-base py-2 border-b border-slate-50 transition-colors ${isActive('/about') ? 'text-primary font-bold' : 'text-slate-700'}`}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className={`text-base py-2 border-b border-slate-50 transition-colors ${isActive('/contact') ? 'text-primary font-bold' : 'text-slate-700'}`}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <a 
                href="tel:+919213521804" 
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 py-3 rounded-md font-semibold text-slate-800 text-sm"
              >
                <Phone className="w-4 h-4 text-primary" />
                Call: +91 9213521804
              </a>
              <Link 
                to="/book" 
                className="bg-primary hover:bg-primary-light text-white text-center py-3 rounded-md font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
