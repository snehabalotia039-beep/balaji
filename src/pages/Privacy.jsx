import React, { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

export default function Privacy() {
  useEffect(() => {
    updateSEO({
      title: 'Privacy Policy - Client Data Protection',
      description: 'Review our privacy policy to understand how New Balaji Property handles your contact details and enquiry information.'
    });
  }, []);

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-primary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Legal Terms</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-xs mt-1">Last Updated: July 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base space-y-6 leading-relaxed">
          <p>
            At <strong>NEW BALAJI PROPERTY</strong>, we are committed to protecting the privacy and security of our clients' personal data. This Privacy Policy details how we collect, store, and utilize the details you share on our website.
          </p>

          <h3 className="text-lg font-display font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">1. Information We Collect</h3>
          <p>
            When you interact with our forms (Book Consultation, Submit Enquiry, or Contact forms), we collect personal information which includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 font-medium">
            <li>Full Name</li>
            <li>Phone / Mobile Number (crucial for WhatsApp communication)</li>
            <li>Email Address</li>
            <li>Property requirements, budgets, and timeslot preferences</li>
          </ul>

          <h3 className="text-lg font-display font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">2. How We Use Your Data</h3>
          <p>
            Your information is used solely to facilitate the consultancy service you request:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 font-medium">
            <li>To contact you regarding builder floors or commercial shops you are interested in.</li>
            <li>To schedule physical property visits with Mr. Anil Balotia.</li>
            <li>To assist with banking partners for home loans.</li>
            <li>To coordinate legal registry documents.</li>
          </ul>
          <p>
            We **never** sell, trade, or distribute your email or phone numbers to third-party marketing companies.
          </p>

          <h3 className="text-lg font-display font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">3. WhatsApp Integrations</h3>
          <p>
            When submitting property-specific enquiries, our website automatically redirects you to WhatsApp (https://wa.me/...) with prefilled text. This is a conversion action designed for rapid support. Note that any messages sent via WhatsApp are subject to WhatsApp's own privacy terms.
          </p>

          <h3 className="text-lg font-display font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">4. Database Storage</h3>
          <p>
            Data submitted on our forms is securely stored inside PostgreSQL databases hosted by Supabase Cloud. When Supabase is not connected (demo mode), data is stored in your local browser's LocalStorage memory.
          </p>

          <h3 className="text-lg font-display font-bold text-slate-900 pt-2 border-b border-slate-100 pb-2">5. Contact Us</h3>
          <p>
            If you have any questions about this privacy policy or wish to request deletion of your booking/enquiry logs from our database, contact us at:
          </p>
          <p className="font-semibold text-slate-900">
            NEW BALAJI PROPERTY<br />
            Sat Nagar, Karol Bagh, Delhi - 110005<br />
            Phone: +91 9213521804
          </p>
        </div>
      </div>
    </div>
  );
}
