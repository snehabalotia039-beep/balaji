import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, Handshake, Star, Building, Users } from 'lucide-react';
import { db } from '../utils/db';
import { updateSEO } from '../utils/seo';
import VisitingCardImage from '../assets/visiting_card.jpg';

export default function About() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    updateSEO({
      title: 'About Anil Balotia & Our 5+ Years Legacy',
      description: 'Learn about New Balaji Property, led by Anil Balotia. Discover our mission of offering transparent real estate deals and verified listings in Karol Bagh, Sat Nagar, Delhi.'
    });

    const loadData = async () => {
      const tests = await db.getTestimonials();
      setTestimonials(tests);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white text-slate-800 font-sans">
      
      {/* 1. Header Section */}
      <section className="bg-slate-950 text-white pt-32 pb-16 relative">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">About Our Consultancy</span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-2 tracking-tight">
            New Balaji Property
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed font-normal">
            Your trusted local partner for verified residential builder floors and high-growth commercial spaces in Karol Bagh, Delhi.
          </p>
        </div>
      </section>

      {/* 2. Brand Identity & Card Showcase */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Story */}
          <div className="space-y-6">
            <div className="inline-block bg-primary/5 px-4 py-2 border border-primary/10 rounded-sm text-primary font-bold text-xs uppercase tracking-widest">
              Our Professional Story
            </div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 leading-tight">
              5+ Years of Building Trust in Delhi Real Estate
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Founded with a mission to eliminate ambiguity in property transactions, <strong>New Balaji Property</strong> has established itself as Karol Bagh's premier real estate consultancy. Under the leadership of <strong>Mr. Anil Balotia</strong>, we have consistently delivered smooth and transparent buying, selling, and leasing experiences.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We specialize in premium residential builder floors and commercial showrooms. Our USP lies in complete legal support — we do not just show you properties, we stand beside you through title checks, banking partnerships for home loans, registry documentation, and final key handover.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 text-slate-800">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-sm text-primary mt-1">
                  <Award className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-none">Local Market Lead</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Unrivaled knowledge of Karol Bagh, Sat Nagar & Karol Bagh Metro areas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-sm text-primary mt-1">
                  <Handshake className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-none">Transparent Deals</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Direct negotiation between client and owner. Zero markup.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visiting Card Showcase */}
          <div className="flex flex-col items-center">
            <div className="bg-beige-light p-6 sm:p-8 rounded-lg border border-beige-dark shadow-lg w-full max-w-lg">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-4 text-center">
                Official Visiting Card
              </span>
              
              <div className="overflow-hidden rounded-md border border-slate-200 shadow-md group relative">
                <img 
                  src={VisitingCardImage} 
                  alt="Anil Balotia Visiting Card" 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-102"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="mt-6 space-y-2 text-center text-xs text-slate-500 font-semibold">
                <p>Phone: +91 9213521804 • +91 9891862599</p>
                <p>Office Location: Sat Nagar, Karol Bagh, Delhi</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values */}
      <section className="py-24 bg-beige-light border-t border-b border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Value System</span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 mt-2">
              The Principles That Guide Us
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed font-medium">
              We understand that buying property is one of life's largest financial commitments. We protect your investments with our core pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Legal Authenticity First', 
                desc: 'We conduct thorough title searches and verification processes on properties before adding them to our catalog. If a property has registry issues, we will not list it.' 
              },
              { 
                icon: Users, 
                title: 'Customer Satisfaction', 
                desc: 'Our success is measured by the satisfaction of over 500 happy families who have relocated or established business spaces through our consultation.' 
              },
              { 
                icon: Building, 
                title: 'Karol Bagh Specialists', 
                desc: 'Focusing deeply on Karol Bagh allows us to track builder movements, local authority regulations, rent indices, and hot locations better than broad agencies.' 
              }
            ].map((val, idx) => {
              const IconComponent = val.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-lg border border-beige-dark shadow-xs text-center flex flex-col items-center">
                  <div className="bg-primary/5 p-4 rounded-full text-primary mb-6">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-3">{val.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Client Feedback</span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 mt-2">
              What Our Clients Say
            </h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center text-slate-500 font-medium">No reviews posted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-beige-light p-8 rounded-lg border border-beige-dark flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-1 mb-5 text-amber-500">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                      "{test.review}"
                    </p>
                  </div>
                  <div className="border-t border-slate-200 pt-4.5">
                    <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-none">{test.name}</h4>
                    <span className="text-slate-400 text-xs font-semibold block mt-1.5">{test.designation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
