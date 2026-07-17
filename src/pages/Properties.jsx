import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../utils/db';
import PropertyCard from '../components/PropertyCard';
import { updateSEO } from '../utils/seo';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // URL Search Params integration
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUrlParam = searchParams.get('search') || '';
  const typeUrlParam = searchParams.get('type') || 'All';
  const dealUrlParam = searchParams.get('deal') || 'All';

  // Component Filter State
  const [search, setSearch] = useState(searchUrlParam);
  const [type, setType] = useState(typeUrlParam);
  const [dealType, setDealType] = useState(dealUrlParam);
  const [priceRange, setPriceRange] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');

  // Load properties
  useEffect(() => {
    updateSEO({
      title: 'Verified Properties Catalog - Builder Floors & Showrooms',
      description: 'Explore our catalog of verified properties in Karol Bagh. Residential builder floors, apartments, commercial showrooms, retail stores for sale and rent.'
    });

    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await db.getProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        console.error('Error loading properties:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  // Sync state with URL change (e.g. searching from Home Page)
  useEffect(() => {
    setSearch(searchUrlParam);
    setType(typeUrlParam);
    setDealType(dealUrlParam);
  }, [searchUrlParam, typeUrlParam, dealUrlParam]);

  // Apply filters whenever state changes
  useEffect(() => {
    let result = [...properties];

    // 1. Search Query (Title/Location description)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // 2. Property Type
    if (type !== 'All') {
      result = result.filter(p => p.type === type);
    }

    // 3. Deal Type
    if (dealType !== 'All') {
      result = result.filter(p => p.deal_type === dealType);
    }

    // 4. Bedrooms
    if (bedrooms !== 'All') {
      if (bedrooms === '4+') {
        result = result.filter(p => p.bedrooms >= 4);
      } else {
        result = result.filter(p => p.bedrooms === parseInt(bedrooms));
      }
    }

    // 5. Price Range Filter
    if (priceRange !== 'All') {
      if (dealType === 'Rent') {
        // Rent Buckets (monthly rent in Rupees)
        if (priceRange === 'under-30k') result = result.filter(p => p.price < 30000);
        else if (priceRange === '30k-60k') result = result.filter(p => p.price >= 30000 && p.price <= 60000);
        else if (priceRange === 'above-60k') result = result.filter(p => p.price > 60000);
      } else {
        // Sale Buckets (price in Rupees)
        if (priceRange === 'under-1cr') result = result.filter(p => p.price < 10000000);
        else if (priceRange === '1cr-2.5cr') result = result.filter(p => p.price >= 10000000 && p.price <= 25000000);
        else if (priceRange === 'above-2.5cr') result = result.filter(p => p.price > 25000000);
      }
    }

    setFilteredProperties(result);
  }, [search, type, dealType, priceRange, bedrooms, properties]);

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setDealType('All');
    setPriceRange('All');
    setBedrooms('All');
    setSearchParams({});
  };

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen">
      
      {/* Page Header */}
      <section className="bg-slate-950 text-white pt-32 pb-12 relative">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-secondary font-display font-bold uppercase tracking-wider text-xs sm:text-sm">Verified Listings Only</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-2 tracking-tight">
            Properties Directory
          </h1>
        </div>
      </section>

      {/* Filter and Catalog Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 1. FILTER SIDEBAR (Desktop) */}
          <div className="bg-beige-light p-6 rounded-lg border border-beige-dark h-fit space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span className="font-display font-bold text-slate-900 text-base">Filter Search</span>
              </div>
              <button 
                onClick={handleResetFilters}
                className="text-slate-400 hover:text-primary text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Search Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Sat Nagar, BHK..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                />
              </div>
            </div>

            {/* Deal Type */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Purpose</label>
              <div className="flex gap-2">
                {['All', 'Buy', 'Rent'].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDealType(d);
                      setPriceRange('All'); // Reset price range when changing buy/rent because scales are different
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md border transition-all ${
                      dealType === d 
                        ? 'bg-primary text-white border-primary shadow-xs' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d === 'All' ? 'All' : d === 'Buy' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 font-semibold cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Bedrooms (Only relevant for Residential) */}
            {type !== 'Commercial' && (
              <div className="space-y-2">
                <label className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 font-semibold cursor-pointer"
                >
                  <option value="All">Any Bedrooms</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4+">4+ BHK</option>
                </select>
              </div>
            )}

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Budget</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 font-semibold cursor-pointer"
              >
                <option value="All">Any Budget</option>
                
                {dealType === 'Rent' ? (
                  // Rent options
                  <>
                    <option value="under-30k">Under ₹30,000 / month</option>
                    <option value="30k-60k">₹30,000 - ₹60,000 / month</option>
                    <option value="above-60k">Above ₹60,000 / month</option>
                  </>
                ) : (
                  // Sale options
                  <>
                    <option value="under-1cr">Under 1 Crore</option>
                    <option value="1cr-2.5cr">1 Crore - 2.5 Crore</option>
                    <option value="above-2.5cr">Above 2.5 Crore</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 2. CATALOG GRID */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase mt-4">Loading Properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-slate-50 py-24 text-center border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-6">
                <Filter className="w-8 h-8 text-slate-300 mb-4" />
                <h3 className="font-display font-bold text-slate-800 text-lg">No Matching Properties Found</h3>
                <p className="text-slate-400 text-sm max-w-sm mt-2">
                  We couldn't find any properties matching your current filter selections. Try resetting the filters or broadening your search.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-md mt-6 shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6 text-sm text-slate-500 font-medium">
                  <p>Showing <span className="text-slate-900 font-bold">{filteredProperties.length}</span> properties</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map(property => (
                    <div key={property.id}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
