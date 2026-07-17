import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Is it the admin dashboard or login page? If so, we might want to hide the standard navbar/footer or render them differently.
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      {/* Premium Sticky Navigation */}
      <Navbar />
      
      {/* Main Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Floating WhatsApp Action Trigger */}
      <FloatingWhatsApp />

      {/* Corporate Premium Footer */}
      <Footer />
    </div>
  );
}
