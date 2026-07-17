import React, { useEffect, useState } from 'react';
import { db } from '../utils/db';
import { updateSEO } from '../utils/seo';
import { MapPin, Phone, MessageSquare, Clock, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [enquiry, setEnquiry] = useState({
    name: '',
    phone: '',
    email: '',
    budget: 'General Consultation',
    requirement: 'Contact Form Message',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Contact Us - Office Address & Phone Number',
      description: 'Get in touch with New Balaji Property in Karol Bagh. Phone: +91 9213521804. View office address near Sanjeevya Model School, Sat Nagar, Delhi.'
    });
  }, []);

  const handleInputChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.phone || !enquiry.message) {
      toast.error('Please fill in required fields (Name, Phone, Message)');
      return;
    }

    setSubmitting(true);
    try {
      await db.submitEnquiry({
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email || 'no-email@contact.com',
        property_id: null,
        property_title: 'General Contact Enquiry',
        budget: enquiry.budget,
        requirement: enquiry.requirement,
        message: enquiry.message
      });

      toast.success('Message sent successfully!');

      // Redirect to WhatsApp chat after successful submit
      const phoneNumber = '919213521804';
      const whatsAppText = `Hello NEW BALAJI PROPERTY,

I have sent a general message through your website contact form:
- Name: ${enquiry.name}
- Phone: ${enquiry.phone}
- Message: ${enquiry.message}`;

      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsAppText)}`, '_blank');
      }, 1000);

      // Reset
      setEnquiry({
        name: '',
        phone: '',
        email: '',
        budget: 'General Consultation',
        requirement: 'Contact Form Message',
        message: ''
      });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const phoneNumber = '919213521804';
    const text = 'Hello NEW BALAJI PROPERTY, I am visiting your website contact page and want to enquire about property consultancy.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen">
      
      {/* Page Header */}
      <section className="bg-slate-950 text-white pt-32 pb-16 relative">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Reach Out to Us</span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-2 tracking-tight">
            Contact Us
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed font-normal">
            Have questions about a builder floor or showroom? Call us, chat on WhatsApp, or visit our office in Karol Bagh.
          </p>
        </div>
      </section>

      {/* Info & Form Split */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="font-display font-bold text-2xl text-slate-900 leading-tight">
              Get in Touch Directly
            </h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
              We are available daily for consultation. Walk into our Sat Nagar office or drop a message to schedule a guided property viewing.
            </p>

            <div className="space-y-6">
              {/* Office Location */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-3 rounded-md text-primary shrink-0 border border-primary/10">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base leading-none mb-2">Office Address</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Near Sanjeevya Model School,<br />
                    Block 2A, Sat Nagar,<br />
                    Karol Bagh, Delhi - 110005
                  </p>
                </div>
              </div>

              {/* Phone Contacts */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-3 rounded-md text-primary shrink-0 border border-primary/10">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base leading-none mb-2">Call Office</h4>
                  <p className="text-slate-500 text-sm font-semibold">
                    <a href="tel:+919213521804" className="hover:text-primary transition-colors block mb-1">
                      +91 9213521804
                    </a>
                    <a href="tel:+919891862599" className="hover:text-primary transition-colors block">
                      +91 9891862599
                    </a>
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-3 rounded-md text-primary shrink-0 border border-primary/10">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base leading-none mb-2">Working Hours</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                    Open Daily: 9:30 AM – 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Button Group */}
            <div className="pt-4 flex gap-4 flex-wrap">
              <a 
                href="tel:+919213521804" 
                className="bg-primary hover:bg-primary-light text-white font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-md shadow-md transition-colors"
              >
                Call Now
              </a>
              <button 
                onClick={handleWhatsAppDirect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-md shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Chat WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-beige-light border border-beige-dark p-6 sm:p-8 rounded-lg">
            <h3 className="font-display font-bold text-xl text-slate-900 border-b border-slate-200 pb-3 mb-6">
              Send a Quick Message
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    value={enquiry.name}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase block">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter 10 digit number"
                    value={enquiry.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@email.com"
                  value={enquiry.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase block">Message *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="Detail your requirements (e.g. looking to rent 3 BHK builder floor in Karol Bagh)"
                  value={enquiry.message}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-light disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-3.5 rounded-md transition-colors shadow-md uppercase tracking-wider cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Sending Message...' : 'Send & Chat on WhatsApp'}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* Full-width Map Section at bottom */}
      <section className="bg-slate-100 border-t border-beige-dark h-[450px]">
        <iframe
          title="New Balaji Property Office Address Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.077227443681!2d77.18680197621147!3d28.650646075654518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02996d910609%3A0xc3cf9e32a6773a7c!2sSat%20Nagar%2C%20Karol%20Bagh%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

    </div>
  );
}
