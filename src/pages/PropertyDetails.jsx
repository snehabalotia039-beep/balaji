import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { formatPrice } from '../components/PropertyCard';
import { updateSEO } from '../utils/seo';

// Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { 
  MapPin, BedDouble, Bath, Square, MessageSquare, 
  Calendar, Check, ShieldAlert, Phone, ArrowLeft, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enquiry Form State
  const [enquiry, setEnquiry] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    requirement: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        const data = await db.getPropertyById(id);
        if (data) {
          setProperty(data);
          // Set Dynamic SEO
          updateSEO({
            title: `${data.title} in ${data.location}`,
            description: `Check details of ${data.title} for ${data.deal_type === 'Rent' ? 'rent' : 'sale'} in Karol Bagh. Price: ${formatPrice(data.price, data.deal_type)}. Verified property by New Balaji Property.`,
            ogImage: data.images && data.images[0] ? data.images[0] : '/assets/visiting_card.jpg'
          });
        } else {
          toast.error('Property not found');
          navigate('/properties');
        }
      } catch (err) {
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.phone || !enquiry.email) {
      toast.error('Please fill in all required fields (Name, Phone, Email)');
      return;
    }

    setSubmitting(true);
    try {
      // Save Enquiry to database
      await db.submitEnquiry({
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        property_id: property.id,
        property_title: property.title,
        budget: enquiry.budget || formatPrice(property.price, property.deal_type),
        requirement: enquiry.requirement || 'Urgent Info Request',
        message: enquiry.message
      });

      toast.success('Enquiry Submitted Successfully!');

      // Formulate WhatsApp message and redirect
      const phoneNumber = '919213521804';
      const whatsAppText = `Hello NEW BALAJI PROPERTY,

I have submitted an enquiry through your website and would like more information regarding the property:
- Property: ${property.title}
- Deal Type: ${property.deal_type === 'Rent' ? 'Rent' : 'Buy'}
- Price: ${formatPrice(property.price, property.deal_type)}
- Location: ${property.location}

My Contact:
- Name: ${enquiry.name}
- Phone: ${enquiry.phone}
- Budget: ${enquiry.budget || formatPrice(property.price, property.deal_type)}
- Message: ${enquiry.message || 'No additional message.'}`;

      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsAppText)}`, '_blank');
      }, 1000);

      // Reset form
      setEnquiry({
        name: '',
        phone: '',
        email: '',
        budget: '',
        requirement: '',
        message: ''
      });
    } catch (err) {
      toast.error('Failed to submit enquiry. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppInstant = () => {
    const phoneNumber = '919213521804';
    const text = `Hello NEW BALAJI PROPERTY, I am interested in your property listing: "${property.title}" (${property.deal_type === 'Rent' ? 'For Rent' : 'For Sale'} at ${formatPrice(property.price, property.deal_type)}). Please share details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold tracking-wider text-xs sm:text-sm uppercase">Loading Property Details...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const {
    title,
    description,
    price,
    location,
    type,
    deal_type,
    bedrooms,
    bathrooms,
    area,
    status,
    images,
    specifications,
    amenities
  } = property;

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen pt-24">
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/properties" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary text-xs uppercase font-extrabold tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
      </div>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-xs text-white ${
                  deal_type === 'Rent' ? 'bg-accent' : 'bg-primary'
                }`}>
                  For {deal_type === 'Rent' ? 'Rent' : 'Sale'}
                </span>
                <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2.5 py-1 rounded-xs">
                  {type}
                </span>
                {status !== 'Available' && (
                  <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-xs">
                    {status}
                  </span>
                )}
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-1 text-slate-500 text-sm mt-3 font-medium">
                <MapPin className="w-4 h-4 text-secondary-dark" />
                <span>{location}</span>
              </div>
            </div>

            {/* Premium Swiper Slider */}
            <div className="relative rounded-lg overflow-hidden border border-beige-dark shadow-sm bg-slate-900 aspect-[16/9]">
              {images && images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  className="w-full h-full"
                >
                  {images.map((imgUrl, idx) => (
                    <SwiperSlide key={idx}>
                      <img 
                        src={imgUrl} 
                        alt={`${title} - View ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  No Image Available
                </div>
              )}
            </div>

            {/* Highlights Bar */}
            <div className="grid grid-cols-3 gap-4 border border-beige-dark rounded-lg p-5 bg-beige-light text-center">
              <div>
                <span className="text-slate-400 text-xs font-semibold block mb-1">Price</span>
                <span className="text-primary font-display font-bold text-lg sm:text-xl">{formatPrice(price, deal_type)}</span>
              </div>
              <div className="border-l border-r border-beige-dark">
                <span className="text-slate-400 text-xs font-semibold block mb-1">Configuration</span>
                <span className="text-slate-800 font-display font-semibold text-base sm:text-lg">
                  {bedrooms ? `${bedrooms} BHK` : 'Commercial'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold block mb-1">Super Area</span>
                <span className="text-slate-800 font-display font-semibold text-base sm:text-lg">{area} Sq. Ft.</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-beige-dark pb-2">
                Property Description
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {description}
              </p>
            </div>

            {/* Specifications */}
            {specifications && Object.keys(specifications).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b border-beige-dark pb-2">
                  Property Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-dashed border-beige-dark py-2.5 text-sm">
                      <span className="text-slate-400 font-medium">{key}</span>
                      <span className="text-slate-800 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b border-beige-dark pb-2">
                  Premium Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="bg-emerald-500/10 p-1 rounded-sm text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-beige-dark pb-2">
                Location Map
              </h3>
              <div className="rounded-lg overflow-hidden border border-beige-dark shadow-sm bg-slate-100 aspect-[16/9]">
                <iframe
                  title="New Balaji Property Office Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.077227443681!2d77.18680197621147!3d28.650646075654518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02996d910609%3A0xc3cf9e32a6773a7c!2sSat%20Nagar%2C%20Karol%20Bagh%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                *Exact building location may vary. Schedule a guided tour using the visit booker for site inspection.
              </p>
            </div>

          </div>

          {/* Right Column: Lead Forms */}
          <div className="space-y-8">
            
            {/* Quick Actions Panel */}
            <div className="bg-slate-950 text-white p-6 rounded-lg shadow-md border-t-4 border-secondary space-y-5">
              <h3 className="font-display font-bold text-lg border-b border-slate-900 pb-3 text-white">
                Interested in this Property?
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect directly with Anil Balotia for immediate pricing, site visit scheduling, or negotiations.
              </p>
              
              <button
                onClick={handleWhatsAppInstant}
                disabled={status !== 'Available'}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm py-3.5 rounded-md transition-all shadow-md uppercase tracking-wider cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                Enquire on WhatsApp
              </button>
              
              <Link
                to="/book"
                state={{ propertyTitle: title }}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm py-3.5 rounded-md transition-all shadow-sm uppercase tracking-wider"
              >
                <Calendar className="w-4 h-4 text-primary" />
                Book Guided Visit
              </Link>
            </div>

            {/* Detailed Enquiry Form */}
            <div className="bg-beige-light border border-beige-dark p-6 rounded-lg shadow-sm space-y-5">
              <h3 className="font-display font-bold text-lg border-b border-slate-200 pb-3 text-slate-900">
                Submit Lead Enquiry
              </h3>
              
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    value={enquiry.name}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter 10 digit number"
                    value={enquiry.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@email.com"
                    value={enquiry.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>

                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Your Budget (Optional)</label>
                  <input
                    type="text"
                    name="budget"
                    placeholder={`e.g. ${formatPrice(price, deal_type)}`}
                    value={enquiry.budget}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  />
                </div>

                {/* Requirement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Requirement Timeline</label>
                  <select
                    name="requirement"
                    value={enquiry.requirement}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-semibold cursor-pointer"
                  >
                    <option value="Urgent Information Request">Urgent Information Request</option>
                    <option value="Planning to buy/rent in 1 month">Planning to buy/rent in 1 month</option>
                    <option value="Just browsing / planning future purchase">Just browsing / planning future purchase</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Mention specific questions..."
                    value={enquiry.message}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || status !== 'Available'}
                  className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-light disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm py-3.5 rounded-md transition-colors shadow-md uppercase tracking-wider cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  {submitting ? 'Submitting...' : 'Submit & Chat'}
                </button>
                
              </form>

              <div className="flex gap-2 items-start bg-amber-50 border border-amber-200/50 p-3 rounded-md text-amber-800 text-[11px] font-medium leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>By submitting, you will be redirected to WhatsApp to immediately receive photos and verified documents for this listing.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
