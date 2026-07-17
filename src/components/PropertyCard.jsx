import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square, MessageSquare, ChevronRight } from 'lucide-react';

export const formatPrice = (price, dealType) => {
  if (dealType === 'Rent') {
    return `₹${price.toLocaleString('en-IN')} / Month`;
  }
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  } else {
    const lk = price / 100000;
    return `₹${lk.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
};

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    location,
    type,
    deal_type,
    bedrooms,
    bathrooms,
    area,
    status,
    images
  } = property;

  // Fallback if no images array or it's empty
  const displayImage = images && images.length > 0 && images[0]
    ? images[0]
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

  const handleWhatsAppEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const phoneNumber = '919213521804';
    const text = `Hello NEW BALAJI PROPERTY, I am interested in the property: "${title}" (${deal_type === 'Rent' ? 'For Rent' : 'For Sale'} at ${formatPrice(price, deal_type)}) in ${location}. Please provide details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-beige-dark shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      
      {/* Property Image & Status Badges */}
      <div className="relative overflow-hidden aspect-[4/3] w-full">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Unsplash fallback for missing local files
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Deal Type Badge (For Sale / For Rent) */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-[11px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-sm shadow-md text-white ${
            deal_type === 'Rent' ? 'bg-navy-blue bg-accent' : 'bg-primary'
          }`}>
            {deal_type === 'Rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Status Badge (Sold / Rented / Available) */}
        {status !== 'Available' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="text-white font-display uppercase tracking-widest text-sm font-extrabold border-2 border-white px-4 py-2 rotate-[-5deg]">
              {status}
            </span>
          </div>
        )}
        
        {/* Type Badge (Residential / Commercial) */}
        <div className="absolute bottom-4 right-4 z-10">
          <span className="bg-slate-900/80 backdrop-blur-xs text-[10px] uppercase font-bold text-white px-2.5 py-1 rounded-xs">
            {type}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Price & Location */}
        <div className="mb-2">
          <h3 className="text-primary font-display font-bold text-xl sm:text-2xl leading-none">
            {formatPrice(price, deal_type)}
          </h3>
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-2.5 font-medium">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-secondary-dark" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Property Title */}
        <h4 className="text-slate-800 font-display font-semibold text-base md:text-lg line-clamp-1 mb-4 group-hover:text-primary transition-colors">
          {title}
        </h4>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-beige-dark py-3.5 mb-5 text-slate-600 text-xs">
          
          {/* Bed Count */}
          <div className="flex items-center gap-1.5 justify-center">
            <BedDouble className="w-4 h-4 text-secondary-dark shrink-0" />
            <span>{bedrooms ? `${bedrooms} BHK` : 'Commercial'}</span>
          </div>

          {/* Bath Count */}
          <div className="flex items-center gap-1.5 justify-center border-l border-r border-beige-dark">
            <Bath className="w-4 h-4 text-secondary-dark shrink-0" />
            <span>{bathrooms ? `${bathrooms} Bath` : 'N/A'}</span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1.5 justify-center">
            <Square className="w-3.5 h-3.5 text-secondary-dark shrink-0" />
            <span>{area} sq ft</span>
          </div>
          
        </div>

        {/* Actions CTAs */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Link
            to={`/properties/${id}`}
            className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-3 rounded-md transition-colors uppercase tracking-wider"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          
          <button
            onClick={handleWhatsAppEnquiry}
            disabled={status !== 'Available'}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs py-3 rounded-md transition-colors uppercase tracking-wider"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
