import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { updateSEO } from '../utils/seo';
import { Calendar, Phone, Mail, User, Clock, CheckCircle2, ChevronRight, Landmark, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookAppointment() {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  // Retrieve preselected property title from navigation state if available
  const initialPropTitle = routerLocation.state?.propertyTitle || '';

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: 'Buy',
    budget: '',
    preferred_date: '',
    preferred_time: '10:00 AM - 1:00 PM',
    message: initialPropTitle ? `Interested in booking a visit for: ${initialPropTitle}` : ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Book a Consultation - Direct Real Estate Booking',
      description: 'Book a face-to-face or digital property consultation with Anil Balotia. Buy, sell, or rent residential and commercial properties with transparent support.'
    });
  }, []);

  const handleInputChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!booking.name || !booking.phone || !booking.email || !booking.preferred_date) {
      toast.error('Please fill in all required fields (Name, Phone, Email, Preferred Date)');
      return;
    }

    setLoading(true);
    try {
      await db.submitBooking({
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        purpose: booking.purpose,
        budget: booking.budget || 'Not Specified',
        preferred_date: booking.preferred_date,
        preferred_time: booking.preferred_time,
        message: booking.message
      });

      toast.success('Consultation Booked Successfully!');
      
      // Navigate to success landing or home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

      // Reset
      setBooking({
        name: '',
        phone: '',
        email: '',
        purpose: 'Buy',
        budget: '',
        preferred_date: '',
        preferred_time: '10:00 AM - 1:00 PM',
        message: ''
      });
    } catch (err) {
      toast.error('Failed to book consultation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen pt-24">
      
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 relative">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Personalised Advisory</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-2 tracking-tight">
            Book Consultation
          </h1>
        </div>
      </section>

      {/* Main Grid split: Info/Process & Form */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side (4 cols) */}
          <div className="lg:col-span-5 space-y-8 bg-beige-light border border-beige-dark p-8 rounded-lg">
            <h3 className="font-display font-bold text-xl text-slate-900 border-b border-slate-200 pb-3">
              Why Consult With Us?
            </h3>
            
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2.5 rounded-sm text-primary shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base leading-none mb-1.5">Direct Owner Interaction</h4>
                  <p className="text-slate-500 leading-relaxed">No intermediary broker calls. Speak directly with Mr. Anil Balotia to negotiate real prices.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2.5 rounded-sm text-primary shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base leading-none mb-1.5 font-bold">Document Title Verification</h4>
                  <p className="text-slate-500 leading-relaxed">Bring your property papers or let us show you verified deeds before you draft agreements.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2.5 rounded-sm text-primary shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-base leading-none mb-1.5">Bank Loan Pre-Approvals</h4>
                  <p className="text-slate-500 leading-relaxed">Our relationships with top banks ensure fast structural inspections and pre-sanction letters.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-2 text-xs font-semibold text-slate-500">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                No consultation or registration fees
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Response within 2 hours during business hours
              </p>
            </div>
          </div>

          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-beige-dark shadow-sm">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={booking.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={booking.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={booking.email}
                    onChange={handleInputChange}
                    placeholder="name@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>

                {/* Purpose */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Consultation Purpose</label>
                  <select
                    name="purpose"
                    value={booking.purpose}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-semibold cursor-pointer"
                  >
                    <option value="Buy">Buy Property</option>
                    <option value="Sell">Sell Property</option>
                    <option value="Rent">Rent / Lease</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Preferred Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferred_date"
                    required
                    value={booking.preferred_date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-medium cursor-pointer"
                  />
                </div>

                {/* Preferred Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Preferred Time Slot</label>
                  <select
                    name="preferred_time"
                    value={booking.preferred_time}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-semibold cursor-pointer"
                  >
                    <option value="10:00 AM - 1:00 PM">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="1:00 PM - 4:00 PM">Afternoon (1:00 PM - 4:00 PM)</option>
                    <option value="4:00 PM - 7:00 PM">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Approximate Budget (Optional)</label>
                <input
                  type="text"
                  name="budget"
                  value={booking.budget}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹1.5 Cr, ₹35,000 rent..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Requirements / Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={booking.message}
                  onChange={handleInputChange}
                  placeholder="Share details of the builder floor, retail showroom, or specific location you want to consult about..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1 bg-primary hover:bg-primary-light disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-4 rounded-md shadow-md transition-colors uppercase tracking-wider cursor-pointer"
              >
                {loading ? 'Securing Slot...' : 'Confirm Appointment'}
                <ChevronRight className="w-4 h-4" />
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
