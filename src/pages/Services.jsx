import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Building, Coins, Scale, CheckSquare, 
  BadgeHelp, BadgePercent, ArrowRight, MessageSquare, Handshake
} from 'lucide-react';
import { updateSEO } from '../utils/seo';

export default function Services() {
  useEffect(() => {
    updateSEO({
      title: 'Our Services - Builder Floors, Showrooms & Home Loans',
      description: 'Discover the complete suite of services offered by New Balaji Property: property buying, selling, commercial showrooms, leasing, documentation checks, and home loan guidance.'
    });
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = '919213521804';
    const text = encodeURIComponent('Hello NEW BALAJI PROPERTY, I am interested in consulting regarding real estate services.');
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const servicesList = [
    {
      icon: Home,
      title: 'Residential Properties',
      desc: 'Expert assistance in finding and securing luxury 2, 3, and 4 BHK builder floors, duplex apartments, and houses in Karol Bagh. We list only verified properties with clear ownership papers.'
    },
    {
      icon: Building,
      title: 'Commercial Properties',
      desc: 'Premium commercial showrooms, retail corners, and office spaces on high-street markets. Perfect for national brands, banking branches, and high-growth retail outlets.'
    },
    {
      icon: Handshake,
      title: 'Property Buying Guidance',
      desc: 'End-to-end guidance for home buyers. From matching your budget, shortlisting properties, negotiating prices, executing sales agreements, to handling the registrar registry.'
    },
    {
      icon: BadgePercent,
      title: 'Property Selling Support',
      desc: 'Need to sell your property in Karol Bagh? We offer realistic market valuations, showcase your property to vetted buyers, and handle negotiations transparently.'
    },
    {
      icon: CheckSquare,
      title: 'Rental & Leasing Services',
      desc: 'Professional assistance in renting out residential apartments or leasing commercial shops. We verify tenants, negotiate lease terms, and draft clean lease agreements.'
    },
    {
      icon: Coins,
      title: 'Investment Consultancy',
      desc: 'Looking for high rental yields or capital appreciation in Delhi real estate? We consult on high-value builder floors and commercial spaces that offer strong returns.'
    },
    {
      icon: Scale,
      title: 'Property Documentation Check',
      desc: 'Before any exchange, our legal experts verify property titles, chain deeds, municipal corporation tax records, and approvals to ensure complete safety.'
    },
    {
      icon: CheckSquare,
      title: 'Registration Assistance',
      desc: 'Hassle-free registration at the Sub-Registrar office. We schedule appointments, calculate exact stamp duties, draft sale deeds, and coordinate registries.'
    },
    {
      icon: BadgeHelp,
      title: 'Home Loan Guidance',
      desc: 'Secure home loans through leading public and private banks. We assist with bank documentation, structural evaluation, and help you get competitive interest rates.'
    }
  ];

  return (
    <div className="bg-white text-slate-800 font-sans">
      
      {/* Header */}
      <section className="bg-slate-950 text-white pt-32 pb-16 relative">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Comprehensive Real Estate Support</span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-2 tracking-tight">
            Consultancy Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed font-normal">
            Your single window for buy, sell, rent, legal registry, and finance consultation in central Delhi.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-lg border border-beige-dark hover:border-secondary shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-start"
              >
                <div className="bg-primary/5 p-4 rounded-md text-primary mb-6 border border-primary/10">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                <button 
                  onClick={() => {
                    const phoneNumber = '919213521804';
                    const text = encodeURIComponent(`Hello NEW BALAJI PROPERTY, I want to enquire regarding your service: "${service.title}". Please guide me.`);
                    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
                  }}
                  className="mt-auto flex items-center gap-1 text-primary hover:text-primary-light text-xs uppercase font-extrabold tracking-wider"
                >
                  <span>WhatsApp Query</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Banner */}
      <section className="bg-beige-light border-t border-b border-beige-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            No Hidden Charges. 100% Transparent Documentation.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Unlike standard brokers, we do not believe in hidden brokerage fees or surprise documentation costs. All agreements, commissions, and registration fees are clearly stated from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 max-w-md mx-auto sm:max-w-none">
            <Link 
              to="/book" 
              className="bg-primary hover:bg-primary-light text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-md shadow-md transition-colors"
            >
              Book Free Consultation
            </Link>
            <button 
              onClick={handleWhatsAppClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-md shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
