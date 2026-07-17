import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import LogoImage from '../assets/logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = '919213521804';
    const message = encodeURIComponent('Hello NEW BALAJI PROPERTY, I am visiting your website and have a query.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-2 border-secondary/30 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-md shadow-md border border-secondary/20">
                <img 
                  src={LogoImage} 
                  alt="New Balaji Property" 
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold tracking-wide text-lg text-white leading-tight">
                  NEW BALAJI PROPERTY
                </span>
                <span className="text-[10px] tracking-widest font-semibold uppercase text-secondary">
                  Real Estate Consultancy
                </span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-slate-400">
              Verified Properties. Transparent Deals. Trusted Local Expertise. Providing complete end-to-end support for buying, selling, and renting properties in Karol Bagh for 5+ years.
            </p>
            
            <div className="pt-2">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-white border border-emerald-500/30 px-4 py-2.5 rounded-md text-sm font-semibold tracking-wider transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Quick WhatsApp Support
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold text-base tracking-wider uppercase mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-secondary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Properties Catalog', path: '/properties' },
                { label: 'Our Services', path: '/services' },
                { label: 'About Company', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Book Consultation', path: '/book' },
                { label: 'Admin Login', path: '/admin/login' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-secondary transition-colors duration-200 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quicklist */}
          <div>
            <h3 className="text-white font-display font-semibold text-base tracking-wider uppercase mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-secondary">
              Consultancy Services
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Residential Builder Floors</li>
              <li>Commercial Showrooms & Offices</li>
              <li>Property Buying Guidance</li>
              <li>Property Selling Support</li>
              <li>Rental Lease Agreements</li>
              <li>Home Loan Liaison</li>
              <li>Property Documentation & Registration</li>
            </ul>
          </div>

          {/* Contact Details & Office Hours */}
          <div className="space-y-6">
            <h3 className="text-white font-display font-semibold text-base tracking-wider uppercase relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-secondary">
              Contact & Hours
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span>
                  Near Sanjeevya Model School,<br />
                  Block 2A, Sat Nagar,<br />
                  Karol Bagh, Delhi - 110005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a href="tel:+919213521804" className="hover:text-white transition-colors">
                  +91 9213521804
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Business Hours:</span>
                  <span>Open Daily: 9:30 AM – 8:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {currentYear} NEW BALAJI PROPERTY. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span className="text-slate-800">|</span>
            <span className="text-slate-600">Local Partner: Anil Balotia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
