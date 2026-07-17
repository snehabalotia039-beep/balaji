import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { formatPrice } from '../components/PropertyCard';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { updateSEO } from '../utils/seo';
import { 
  Building, MessageSquare, CalendarCheck, LogOut, Search, 
  Plus, Edit, Trash2, Check, X, Star, Upload, Trash, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import LogoImage from '../assets/logo.jpg';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState('properties'); // properties, enquiries, bookings
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ properties: 0, enquiries: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  // Property Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // null means "Add Property", otherwise ID of editing property
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: 'Karol Bagh, Delhi',
    type: 'Residential',
    deal_type: 'Buy',
    bedrooms: '3',
    bathrooms: '3',
    area: '',
    status: 'Available',
    images: [],
    featured: false,
    specifications: {
      "Facing": "North",
      "Furnishing": "Semi-Furnished",
      "Floor": "1st Floor",
      "Parking": "1 Reserved Slot"
    },
    amenities: ['Reserved Parking', '24/7 Water Supply']
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [customSpecKey, setCustomSpecKey] = useState('');
  const [customSpecValue, setCustomSpecValue] = useState('');

  // Search/Filters in Dashboard
  const [propertySearch, setPropertySearch] = useState('');

  // Common amenities list
  const COMMON_AMENITIES = [
    'Reserved Parking', 'Lift', '24/7 Water Supply', 'Power Backup', 
    'Modular Kitchen', 'Balcony', 'Intercom', 'Gated Community', 'Security Guards'
  ];

  useEffect(() => {
    updateSEO({
      title: 'Admin Operations Dashboard',
      description: 'Management dashboard for property listings, customer consultation appointments, and lead enquiries.'
    });
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const props = await db.getProperties();
      const enqs = await db.getEnquiries();
      const books = await db.getBookings();

      setProperties(props);
      setEnquiries(enqs);
      setBookings(books);

      setStats({
        properties: props.length,
        enquiries: enqs.length,
        bookings: books.length
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Error synchronizing database listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Successfully logged out');
    navigate('/admin/login');
  };

  // Property Form handlers
  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSpecChange = (key, value) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [key]: value
      }
    });
  };

  const removeSpecKey = (key) => {
    const nextSpecs = { ...formData.specifications };
    delete nextSpecs[key];
    setFormData({ ...formData, specifications: nextSpecs });
  };

  const addCustomSpec = () => {
    if (customSpecKey.trim() && customSpecValue.trim()) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [customSpecKey.trim()]: customSpecValue.trim()
        }
      });
      setCustomSpecKey('');
      setCustomSpecValue('');
    } else {
      toast.error('Enter both specification title and value');
    }
  };

  const handleAmenityToggle = (amenity) => {
    const nextAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    
    setFormData({ ...formData, amenities: nextAmenities });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls = [...formData.images];

    try {
      for (const file of files) {
        if (isSupabaseConfigured) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `property-images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        } else {
          // Demo Mode file upload mockup (convert to base64 so they actually show up locally)
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
          });
          reader.readAsDataURL(file);
          const base64Url = await base64Promise;
          uploadedUrls.push(base64Url);
        }
      }

      setFormData(prev => ({ ...prev, images: uploadedUrls }));
      toast.success('Images uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed: ' + err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      location: 'Karol Bagh, Delhi',
      type: 'Residential',
      deal_type: 'Buy',
      bedrooms: '3',
      bathrooms: '3',
      area: '',
      status: 'Available',
      images: [],
      featured: false,
      specifications: {
        "Facing": "North",
        "Furnishing": "Semi-Furnished",
        "Floor": "1st Floor",
        "Parking": "1 Reserved Slot"
      },
      amenities: ['Reserved Parking', '24/7 Water Supply']
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditId(prop.id);
    setFormData({
      title: prop.title,
      description: prop.description,
      price: prop.price.toString(),
      location: prop.location,
      type: prop.type,
      deal_type: prop.deal_type,
      bedrooms: prop.bedrooms ? prop.bedrooms.toString() : '',
      bathrooms: prop.bathrooms ? prop.bathrooms.toString() : '',
      area: prop.area.toString(),
      status: prop.status,
      images: prop.images || [],
      featured: prop.featured || false,
      specifications: prop.specifications || {},
      amenities: prop.amenities || []
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.area) {
      toast.error('Fill in all required fields (Title, Price, Area)');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || 'Verified property by New Balaji Property.',
      price: parseFloat(formData.price),
      location: formData.location || 'Karol Bagh, Delhi',
      type: formData.type,
      deal_type: formData.deal_type,
      bedrooms: formData.type === 'Commercial' ? null : parseInt(formData.bedrooms) || null,
      bathrooms: parseInt(formData.bathrooms) || null,
      area: parseFloat(formData.area),
      status: formData.status,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
      featured: formData.featured,
      specifications: formData.specifications,
      amenities: formData.amenities
    };

    try {
      if (editId) {
        // Edit Property
        await db.updateProperty(editId, payload);
        toast.success('Property updated successfully!');
      } else {
        // Add Property
        await db.createProperty(payload);
        toast.success('Property created successfully!');
      }
      setShowModal(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Error saving property: ' + err.message);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      try {
        await db.deleteProperty(id);
        toast.success('Property deleted successfully!');
        loadDashboardData();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete property.');
      }
    }
  };

  // Bookings Handlers
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      await db.updateBookingStatus(id, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Delete this booking?')) {
      try {
        await db.deleteBooking(id);
        toast.success('Booking deleted.');
        loadDashboardData();
      } catch (err) {
        console.error(err);
        toast.error('Delete failed.');
      }
    }
  };

  // Enquiries Handlers
  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Delete this lead enquiry?')) {
      try {
        await db.deleteEnquiry(id);
        toast.success('Enquiry deleted.');
        loadDashboardData();
      } catch (err) {
        console.error(err);
        toast.error('Delete failed.');
      }
    }
  };

  // Filters property list
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
    p.location.toLowerCase().includes(propertySearch.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* 1. Header Navigation Bar */}
      <header className="bg-slate-950 text-white py-4 px-6 sm:px-8 border-b-2 border-secondary/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-0.5 rounded-sm border border-secondary/20 shrink-0">
            <img src={LogoImage} alt="Logo" className="h-9 w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold tracking-wide text-sm sm:text-base text-white leading-tight">
              NEW BALAJI PROPERTY
            </span>
            <span className="text-[9px] tracking-widest font-semibold uppercase text-secondary">
              Admin Ops Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-slate-400 hover:text-white text-xs sm:text-sm font-bold uppercase transition-colors"
          >
            <LogOut className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Top Stats Dashboard Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Properties stat */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="bg-primary/5 p-4 rounded-md text-primary">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Properties</span>
            <span className="text-2xl font-display font-extrabold text-slate-800">{stats.properties}</span>
          </div>
        </div>

        {/* Enquiries stat */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="bg-secondary/15 p-4 rounded-md text-secondary-dark">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Leads / Enquiries</span>
            <span className="text-2xl font-display font-extrabold text-slate-800">{stats.enquiries}</span>
          </div>
        </div>

        {/* Bookings stat */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="bg-emerald-500/10 p-4 rounded-md text-emerald-600">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Appointments</span>
            <span className="text-2xl font-display font-extrabold text-slate-800">{stats.bookings}</span>
          </div>
        </div>
      </section>

      {/* 3. Navigation Tabs */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-b border-slate-200 flex gap-4">
          {[
            { id: 'properties', label: 'Properties Catalog', icon: Building },
            { id: 'enquiries', label: 'Lead Enquiries', icon: MessageSquare },
            { id: 'bookings', label: 'Consultations', icon: CalendarCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 pb-4 px-2 font-display font-bold text-xs sm:text-sm tracking-wider uppercase border-b-2 cursor-pointer transition-all ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Tab Views Contents */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-lg shadow-xs">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase mt-4">Syncing Database...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            
            {/* VIEW A: PROPERTIES CATALOG */}
            {activeTab === 'properties' && (
              <div>
                {/* Catalog Actions Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search title, location..." 
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                    />
                  </div>
                  
                  <button
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Property
                  </button>
                </div>

                {/* Catalog Table */}
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium">No properties found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                      <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Title / Price</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Config / Area</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Featured</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredProperties.map(prop => (
                          <tr key={prop.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-900 block">{prop.title}</span>
                              <span className="text-primary font-bold text-xs mt-1 block">{formatPrice(prop.price, prop.deal_type)}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{prop.location}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {prop.bedrooms ? `${prop.bedrooms} BHK` : 'Commercial'} • {prop.area} sq ft
                            </td>
                            <td className="px-6 py-4 text-xs font-bold uppercase">{prop.deal_type} ({prop.type})</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                                prop.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {prop.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {prop.featured ? (
                                <span className="inline-block text-amber-500" title="Featured on Homepage">
                                  <Star className="w-5 h-5 fill-amber-500" />
                                </span>
                              ) : (
                                <span className="text-slate-200">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 shrink-0">
                              <button 
                                onClick={() => handleOpenEditModal(prop)}
                                className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-block"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProperty(prop.id)}
                                className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-block"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VIEW B: LEAD ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div>
                <div className="p-4 bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold tracking-wider uppercase">
                  Property specific leads & general contact queries
                </div>

                {enquiries.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium">No leads received yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                      <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Client Details</th>
                          <th className="px-6 py-4">Property Hook</th>
                          <th className="px-6 py-4">Budget / Req</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {enquiries.map(enq => (
                          <tr key={enq.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-900 block">{enq.name}</span>
                              <span className="text-xs text-slate-500 block mt-1">{enq.phone}</span>
                              <span className="text-xs text-slate-400 block">{enq.email}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-600">
                              {enq.property_title || 'General Site Form'}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-primary font-bold text-xs block">{enq.budget}</span>
                              <span className="text-[10px] text-slate-400 block mt-1">{enq.requirement}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-normal text-slate-600 max-w-xs truncate" title={enq.message}>
                              {enq.message || '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-block"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VIEW C: CONSULTATIONS BOOKINGS */}
            {activeTab === 'bookings' && (
              <div>
                <div className="p-4 bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold tracking-wider uppercase">
                  Scheduled Property Consultations & Office Visits
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium">No bookings recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                      <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Client</th>
                          <th className="px-6 py-4">Preferred Slot</th>
                          <th className="px-6 py-4">Purpose / Budget</th>
                          <th className="px-6 py-4">Details / Msg</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {bookings.map(book => (
                          <tr key={book.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-900 block">{book.name}</span>
                              <span className="text-xs text-slate-500 block mt-1">{book.phone}</span>
                              <span className="text-xs text-slate-400 block">{book.email}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-900 font-bold block">{new Date(book.preferred_date).toLocaleDateString()}</span>
                              <span className="text-slate-400 text-xs mt-1 block">{book.preferred_time}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm block w-fit mb-1">
                                {book.purpose}
                              </span>
                              <span className="text-primary font-bold text-xs">{book.budget}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-normal text-slate-600 max-w-xs truncate" title={book.message}>
                              {book.message || '-'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                                book.status === 'Confirmed' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : book.status === 'Cancelled' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {book.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 shrink-0">
                              {book.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(book.id, 'Confirmed')}
                                    className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors inline-block"
                                    title="Confirm Appointment"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(book.id, 'Cancelled')}
                                    className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-block"
                                    title="Cancel Appointment"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleDeleteBooking(book.id)}
                                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-red-600 transition-colors inline-block"
                                title="Delete Log"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* 5. ADD / EDIT PROPERTY FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white rounded-t-lg">
              <h2 className="font-display font-extrabold text-xl flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-secondary" />
                {editId ? 'Edit Property Listing' : 'Create New Property Listing'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              
              {/* Row 1: Title & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxury 3 BHK Builder Floor"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Location Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sat Nagar, Karol Bagh, Delhi"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Price, Super Area, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Price (in Indian Rupees) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 18500000 for 1.85 Cr"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Super Area (in Sq. Ft.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1450"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Listing Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-semibold cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Deal Type, Property Type, Bedrooms, Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Deal Purpose</label>
                  <select
                    value={formData.deal_type}
                    onChange={(e) => setFormData({ ...formData, deal_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-semibold cursor-pointer"
                  >
                    <option value="Buy">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Sector Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 font-semibold cursor-pointer"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {formData.type === 'Residential' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Bedrooms</label>
                      <input
                        type="number"
                        placeholder="3"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Bathrooms</label>
                      <input
                        type="number"
                        placeholder="3"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Full Property Description</label>
                <textarea
                  rows="4"
                  placeholder="Detail the floor highlights, marble tiles, nearby landmarks..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                ></textarea>
              </div>

              {/* Multiple Images Upload & Preview */}
              <div className="space-y-3.5 border border-dashed border-slate-200 rounded-lg p-5 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 block">Property Images (Multiple Uploads Supported)</h4>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Select image files. Stored in Supabase Bucket.</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="file-upload"
                      className="hidden"
                      disabled={uploadingImages}
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-primary hover:bg-primary-light text-white font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-md cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImages ? 'Uploading...' : 'Choose Files'}
                    </label>
                  </div>
                </div>

                {/* Previews Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-4 border-t border-slate-200">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-slate-200 border border-slate-300 group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications Sub-Form */}
              <div className="space-y-4 border border-slate-200 rounded-lg p-5">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Property Specifications (Key-Value)</h4>
                
                {/* Current Specifications List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(formData.specifications).map(([key, val]) => (
                    <div key={key} className="bg-slate-100 px-3 py-2 rounded-md flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[9px]">{key}</span>
                        <span className="font-bold text-slate-800">{val}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeSpecKey(key)}
                        className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Spec Add Inputs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spec Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Facing, Furnishing" 
                      value={customSpecKey}
                      onChange={(e) => setCustomSpecKey(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none text-slate-700"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Value</label>
                    <input 
                      type="text"
                      placeholder="e.g. North-West, Semi-Furnished" 
                      value={customSpecValue}
                      onChange={(e) => setCustomSpecValue(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none text-slate-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCustomSpec}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-md cursor-pointer transition-colors"
                  >
                    Add Specification
                  </button>
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Amenities Checklist</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COMMON_AMENITIES.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200/50 rounded-md">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleFormInputChange}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-bold text-amber-900 cursor-pointer select-none">
                  Feature on Homepage (Display this listing under "Featured Properties" slider on the main page)
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-500 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  {editId ? 'Save Changes' : 'Publish Property'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
