import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tool tip after 3 seconds for better conversion rates
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = '919213521804';
    const message = encodeURIComponent('Hello NEW BALAJI PROPERTY, I visited your website and would like to consult regarding residential/commercial properties.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {showTooltip && (
        <div className="mb-2 bg-white text-slate-800 text-sm font-medium px-4 py-2 rounded-lg shadow-xl border border-beige-dark max-w-xs animate-fade-in-up pointer-events-auto flex items-center gap-2 relative">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span>Direct WhatsApp Consultation</span>
          <button 
            onClick={() => setShowTooltip(false)} 
            className="ml-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ×
          </button>
          <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-beige-dark transform rotate-45"></div>
        </div>
      )}
      
      <button
        onClick={handleWhatsAppClick}
        className="pointer-events-auto bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group relative flex items-center justify-center"
        aria-label="Contact on WhatsApp"
      >
        {/* Pulsing Outer Rings */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75"></span>
        <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-slow"></span>
        
        <MessageCircle className="w-7 h-7 relative z-10" />
      </button>
    </div>
  );
}
