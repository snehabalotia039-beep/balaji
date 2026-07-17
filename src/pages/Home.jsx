import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, Award, ShieldCheck, FileCheck, Landmark, 
  MessageSquare, Users, ChevronRight, ArrowRight, Search, 
  MapPin, CheckCircle2, Star, CalendarDays
} from 'lucide-react';
import { db } from '../utils/db';
import PropertyCard from '../components/PropertyCard';
import { updateSEO } from '../utils/seo';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [dealType, setDealType] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    // Set Page SEO
    updateSEO({
      title: 'Verified Properties & Transparent Deals in Karol Bagh',
      description: 'Find your dream home or commercial space with New Balaji Property. 5+ Years of trusted real estate consultancy in Karol Bagh, Sat Nagar, Delhi. Personalised consultation and home loan guidance.'
    });

    // Fetch featured properties & testimonials
    const loadData = async () => {
      try {
        const props = await db.getProperties();
        // filter featured properties or show first 3
        const featured = props.filter(p => p.featured).slice(0, 3);
        setFeaturedProperties(featured.length > 0 ? featured : props.slice(0, 3));

        const tests = await db.getTestimonials();
        setTestimonials(tests.slice(0, 3));
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}&type=${propertyType}&deal=${dealType}`);
  };

  const handleWhatsAppChat = () => {
    const phoneNumber = '919213521804';
    const text = 'Hello NEW BALAJI PROPERTY, I am visiting your website and would like to chat regarding available properties.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // USPs Data
  const usps = [
    { icon: Award, title: '5+ Years Experience', desc: 'A proven track record of helping families and businesses find the right properties in Karol Bagh.' },
    { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every listing undergoes strict verification processes to ensure no legal or ownership surprises.' },
    { icon: Users, title: 'Transparent Process', desc: 'We believe in 100% transparency with zero hidden charges. Honest negotiations from start to finish.' },
    { icon: FileCheck, title: 'Legal & Doc Assistance', desc: 'Complete support with property documentation, verification, and registration assistance.' },
    { icon: Landmark, title: 'Home Loan Guidance', desc: 'Strategic tie-ups with leading banks to help you secure home loans at competitive rates.' },
    { icon: MessageSquare, title: 'Fast WhatsApp Support', desc: 'Get quick replies and real-time property details directly on your phone.' },
    { icon: Building, title: 'Local Market Experts', desc: 'Unmatched neighborhood-level knowledge in Karol Bagh, Sat Nagar, and surrounding Delhi regions.' },
    { icon: CheckCircle2, title: 'End-to-End Support', desc: 'Complete buying, selling, renting, and property management services under one roof.' }
  ];

  // Process Timeline Data
  const processSteps = [
    { number: '01', title: 'Share Requirement', desc: 'Tell us your ideal location, budget, configurations, and commercial or residential purpose.' },
    { number: '02', title: 'Property Shortlisting', desc: 'We handpick and share matching verified listings that fit your criteria perfectly.' },
    { number: '03', title: 'Property Visit', desc: 'Schedule physical guided tours of your shortlisted properties at your convenience.' },
    { number: '04', title: 'Documentation', desc: 'We conduct title verification and coordinate draft agreements to ensure absolute legal safety.' },
    { number: '05', title: 'Registration', desc: 'Complete coordinate support for official registrar stamp duty and signing formalities.' },
    { number: '06', title: 'Move In', desc: 'Collect your keys and move into your new home or start operations in your business location.' }
  ];

  return (
    <div className="overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white pt-24 pb-16">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80" 
            alt="Premium Delhi Real Estate" 
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 px-4 py-2 rounded-full text-secondary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6"
          >
            <Award className="w-4.5 h-4.5" />
            <span>Trusted Karol Bagh Consultancy • 5+ Years Experience</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight max-w-4xl mb-6 text-white"
          >
            Find Your Dream Property With <span className="text-secondary">Confidence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-10 font-normal"
          >
            Helping families and businesses buy, sell, rent and invest with verified listings, transparent guidance and personalized consultation in Delhi.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-14 w-full justify-center max-w-md sm:max-w-none"
          >
            <Link 
              to="/properties" 
              className="bg-primary hover:bg-primary-light text-white font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
            >
              Explore Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/book" 
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-md shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 border border-slate-200"
            >
              <CalendarDays className="w-4 h-4 text-primary" />
              Book Consultation
            </Link>

            <button 
              onClick={handleWhatsAppChat}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-md shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              Chat on WhatsApp
            </button>
          </motion.div>

          {/* Quick Search Widget */}
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl bg-white text-slate-800 p-3 sm:p-4 rounded-lg shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center border border-beige-dark"
          >
            {/* Search query input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search location or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
              />
            </div>

            {/* Type selector */}
            <div>
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 font-semibold cursor-pointer"
              >
                <option value="All">All Property Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Deal selector */}
            <div>
              <select 
                value={dealType}
                onChange={(e) => setDealType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 font-semibold cursor-pointer"
              >
                <option value="All">All Deals (Buy/Rent)</option>
                <option value="Buy">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-light text-white font-semibold tracking-wider text-xs sm:text-sm py-3 rounded-md transition-colors uppercase h-full flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Listings
            </button>
          </motion.form>
        </div>
      </section>

      {/* 2. STATS RIBBON */}
      <section className="bg-primary text-white py-10 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-secondary">5+</p>
              <p className="text-xs uppercase tracking-widest font-semibold mt-1.5 text-white/80">Years Experience</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-secondary">500+</p>
              <p className="text-xs uppercase tracking-widest font-semibold mt-1.5 text-white/80">Happy Clients</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-secondary">100%</p>
              <p className="text-xs uppercase tracking-widest font-semibold mt-1.5 text-white/80">Verified Listings</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-secondary">0</p>
              <p className="text-xs uppercase tracking-widest font-semibold mt-1.5 text-white/80">Hidden Charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US (USPs) */}
      <section className="py-24 bg-beige-light text-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Why Choose Us</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 mt-2">
              Our Commitment to Transparency & Excellence
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed font-medium">
              We stand apart in Karol Bagh real estate by ensuring complete peace of mind, expert legal consultancy, and customer-first support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp, idx) => {
              const IconComponent = usp.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-lg border border-beige-dark shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-start"
                >
                  <div className="bg-primary/5 p-3.5 rounded-md text-primary mb-4.5 border border-primary/10">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-slate-900 mb-2">{usp.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{usp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES */}
      <section className="py-24 bg-white text-slate-800 border-t border-b border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Exclusive Listings</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 mt-2">
                Featured Properties
              </h2>
              <p className="text-slate-500 mt-3 max-w-2xl font-medium">
                Browse our premium selection of residential builder floors and commercial showrooms in Karol Bagh.
              </p>
            </div>
            
            <Link 
              to="/properties" 
              className="mt-6 md:mt-0 flex items-center gap-1.5 text-primary hover:text-primary-light font-bold text-sm tracking-wider uppercase border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
            >
              <span>View All Listings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="bg-slate-50 py-16 text-center border border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-500 font-medium">No properties found. Please upload properties from the Admin Dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <div key={property.id}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. OUR PROCESS (TIMELINE) */}
      <section className="py-24 bg-beige-light text-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Structured Buying</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 mt-2">
              Our Professional Workflow
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed font-medium">
              We guide you step-by-step through a completely hassle-free process, from selecting your property to collecting the keys.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal Timeline Connector on Desktop */}
            <div className="hidden lg:block absolute top-[52px] left-16 right-16 h-1 bg-gradient-to-r from-primary/10 via-secondary to-primary/10 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
              {processSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  {/* Step Bubble */}
                  <div className="w-20 h-20 rounded-full bg-white border border-beige-dark text-slate-800 flex items-center justify-center font-display font-extrabold text-xl sm:text-2xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 relative">
                    <span className="relative z-10">{step.number}</span>
                    {/* Ring animation */}
                    <div className="absolute inset-[-4px] rounded-full border border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-105"></div>
                  </div>
                  
                  <h3 className="font-display font-bold text-base text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SERVICES PREVIEW */}
      <section className="py-24 bg-white text-slate-800 border-t border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Sidebar Intro */}
            <div className="lg:pr-8 space-y-6">
              <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">What We Do</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900">
                End-to-End Property Consultation
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Whether you are a family seeking a spacious builder floor, a business looking for a high-footfall showroom, or an investor seeking rent yields, we cover all your real estate needs.
              </p>
              <div>
                <Link 
                  to="/services" 
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md transition-colors shadow-md"
                >
                  Explore All Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Services Grid (4 items) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Residential Properties', desc: 'Spacious builder floors, independent houses, and modern apartments across premium Karol Bagh neighborhoods.' },
                { title: 'Commercial Showrooms & Offices', desc: 'High footfall retail stores, showrooms, and commercial corporate spaces on Karol Bagh high-streets.' },
                { title: 'Documentation & Registration', desc: 'Complete hassle-free title verification, mutation assistance, and registries done by legal experts.' },
                { title: 'Home Loan Assistance', desc: 'Simplified processes and guidance to secure the lowest possible interest rates from leading private and public banks.' }
              ].map((serv, idx) => (
                <div key={idx} className="bg-beige-light p-8 rounded-lg border border-beige-dark hover:border-secondary transition-colors duration-300">
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-3">{serv.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{serv.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="py-24 bg-beige-light text-slate-800 border-t border-b border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm font-semibold">Testimonials</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 mt-2">
              Trusted by Hundreds of Happy Clients
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed font-medium">
              See what families and business owners in Delhi say about their experience working with us.
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center text-slate-500 font-medium">No reviews posted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-white p-8 rounded-lg border border-beige-dark shadow-xs flex flex-col justify-between h-full">
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-5 text-amber-500">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                      "{test.review}"
                    </p>
                  </div>
                  <div className="border-t border-beige-dark pt-4.5">
                    <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-none">{test.name}</h4>
                    <span className="text-slate-400 text-xs font-semibold block mt-1.5">{test.designation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. LAST CALL TO ACTION SECTION */}
      <section className="bg-accent text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')" }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
            Ready to Take the Next Step in Your Property Journey?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you want to buy, sell, or rent residential or commercial properties in Karol Bagh, we are here to ensure a transparent deal and legally secured paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-md mx-auto sm:max-w-none">
            <Link 
              to="/book" 
              className="bg-primary hover:bg-primary-light text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-md shadow-md transition-colors"
            >
              Book Free Consultation
            </Link>
            <button 
              onClick={handleWhatsAppChat}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-md shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Chat Directly on WhatsApp
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
