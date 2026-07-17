import { supabase, isSupabaseConfigured } from '../supabaseClient'

// Initial Premium Karol Bagh Mock Data for Demo mode
const DEFAULT_MOCK_PROPERTIES = [
  {
    id: 'prop-1',
    title: 'Luxury 3 BHK Builder Floor',
    description: 'Premium semi-furnished 3 BHK builder floor available for sale in the heart of Karol Bagh. Features high-quality Italian marble flooring, false ceiling with ambient lighting, modular kitchen with chimney, and spacious wardrobes in all bedrooms. Centrally located with easy access to markets, Karol Bagh Metro Station, and top schools.',
    price: 18500000, // 1.85 Cr
    location: 'Sat Nagar, Karol Bagh, Delhi',
    type: 'Residential',
    deal_type: 'Buy',
    bedrooms: 3,
    bathrooms: 3,
    area: 1450,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    specifications: {
      "Facing": "North-East",
      "Furnishing": "Semi-Furnished",
      "Floor": "2nd Floor",
      "Parking": "1 Reserved Slot",
      "Age of Construction": "1 Year"
    },
    amenities: ['Reserved Parking', 'Lift', '24/7 Water Supply', 'Modular Kitchen', 'Balcony', 'Intercom'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: 'prop-2',
    title: 'Prime Commercial Showroom',
    description: 'Excellent corner commercial showroom space in Karol Bagh market. High footfall area, perfect for retail brands, banks, jewelry showrooms, or designer boutiques. Ground floor + Mezzanine floor with double-height glass frontage. Immediate possession available.',
    price: 45000000, // 4.5 Cr
    location: 'Ajmal Khan Road, Karol Bagh, Delhi',
    type: 'Commercial',
    deal_type: 'Buy',
    bedrooms: null,
    bathrooms: 2,
    area: 1800,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    specifications: {
      "Frontage": "25 Feet",
      "Furnishing": "Unfurnished",
      "Floor": "Ground + Mezzanine",
      "Suitable For": "Showroom/Bank/Retail"
    },
    amenities: ['Double Frontage', 'Power Backup', 'Air Conditioning Provision', 'High Footfall Area', 'Main Road Facing', 'Security Guards'],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prop-3',
    title: 'Modern 2 BHK Rental Apartment',
    description: 'Beautifully designed, fully ventilated 2 BHK residential apartment for rent. Located in a secure gated community near Karol Bagh. Features spacious rooms, modular kitchen, chimney, 2 balconies with pleasant views, and stilt parking.',
    price: 45000, // 45k
    location: 'Block 2A, Karol Bagh, Delhi',
    type: 'Residential',
    deal_type: 'Rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    specifications: {
      "Facing": "East",
      "Furnishing": "Semi-Furnished",
      "Floor": "1st Floor",
      "Security Deposit": "2 Months Rent",
      "Maintenance Charges": "Included"
    },
    amenities: ['Reserved Parking', 'Lift', 'Security Guards', 'Gated Community', 'Balcony', 'Water Storage'],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'prop-4',
    title: 'Spacious 4 BHK Duplex Penthouse',
    description: 'Exquisite ultra-luxury 4 BHK duplex penthouse available for sale. Features private terrace garden, modular kitchen, top-of-the-line bathroom fittings, wooden flooring in master bedroom, and individual elevator access. Experience high-end living in central Delhi.',
    price: 32500000, // 3.25 Cr
    location: 'Karol Bagh, Delhi',
    type: 'Residential',
    deal_type: 'Buy',
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    specifications: {
      "Facing": "North",
      "Furnishing": "Semi-Furnished",
      "Floor": "4th & 5th Floor",
      "Terrace": "Private 800 sq ft",
      "Age of Construction": "Brand New"
    },
    amenities: ['Private Terrace', 'Reserved Parking', '2 Lifts', '24/7 Water Supply', 'Power Backup', 'Piped Gas', 'Servant Room'],
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

const DEFAULT_MOCK_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Rajesh Kumar',
    review: 'I purchased a 3 BHK builder floor in Karol Bagh through New Balaji Property. Mr. Balotia and his team were extremely transparent. The legal documentation assistance was smooth, and they guided me through the entire home loan process. Highly recommended!',
    rating: 5,
    designation: 'Homeowner'
  },
  {
    id: 'test-2',
    name: 'Amit Sharma',
    review: 'Renting a commercial office space in Karol Bagh was seamless with New Balaji Property. They understood our requirement, showed only verified options, and handled the rent agreement and verification quickly. Exceptional local market expertise.',
    rating: 5,
    designation: 'Business Owner'
  },
  {
    id: 'test-3',
    name: 'Priya Malhotra',
    review: 'New Balaji Property helped us sell our ancestral property in Delhi. They did a fair valuation and ensured a completely transparent deal with no hidden charges. Very professional team.',
    rating: 5,
    designation: 'Property Seller'
  }
];

// LocalStorage Keys
const KEYS = {
  PROPERTIES: 'balaji_properties',
  BOOKINGS: 'balaji_bookings',
  ENQUIRIES: 'balaji_enquiries',
  TESTIMONIALS: 'balaji_testimonials'
};

// Initialize LocalStorage with mock data if not set
const initLocalStorage = () => {
  if (!localStorage.getItem(KEYS.PROPERTIES)) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(DEFAULT_MOCK_PROPERTIES));
  }
  if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_MOCK_TESTIMONIALS));
  }
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.ENQUIRIES)) {
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify([]));
  }
};

initLocalStorage();

// DB OPERATIONS ROUTER (SUPABASE VS LOCALSTORAGE FALLBACK)
export const db = {
  // PROPERTIES CRUD
  async getProperties() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) return data;
      console.error('Supabase Error:', error);
    }
    // Fallback to local storage
    return JSON.parse(localStorage.getItem(KEYS.PROPERTIES));
  },

  async getPropertyById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) return data;
      console.error('Supabase Error:', error);
    }
    const props = JSON.parse(localStorage.getItem(KEYS.PROPERTIES));
    return props.find(p => p.id === id) || null;
  },

  async createProperty(property) {
    const newProperty = {
      ...property,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select();
      if (!error) return data[0];
      throw error;
    }

    // Fallback
    newProperty.id = 'prop-' + Math.random().toString(36).substr(2, 9);
    const props = JSON.parse(localStorage.getItem(KEYS.PROPERTIES));
    props.unshift(newProperty);
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
    return newProperty;
  },

  async updateProperty(id, updatedFields) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .update({ ...updatedFields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (!error) return data[0];
      throw error;
    }

    // Fallback
    const props = JSON.parse(localStorage.getItem(KEYS.PROPERTIES));
    const idx = props.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    props[idx] = { ...props[idx], ...updatedFields, updated_at: new Date().toISOString() };
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
    return props[idx];
  },

  async deleteProperty(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    // Fallback
    const props = JSON.parse(localStorage.getItem(KEYS.PROPERTIES));
    const filtered = props.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(filtered));
    return true;
  },

  // BOOKINGS CRUD (Consultations)
  async submitBooking(booking) {
    const newBooking = {
      ...booking,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select();
      if (!error) return data[0];
      throw error;
    }

    // Fallback
    newBooking.id = 'book-' + Math.random().toString(36).substr(2, 9);
    const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS));
    bookings.unshift(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  },

  async getBookings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) return data;
      console.error('Supabase Error:', error);
    }
    return JSON.parse(localStorage.getItem(KEYS.BOOKINGS));
  },

  async updateBookingStatus(id, status) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select();
      if (!error) return data[0];
      throw error;
    }

    const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS));
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx].status = status;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[idx];
  },

  async deleteBooking(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS));
    const filtered = bookings.filter(b => b.id !== id);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filtered));
    return true;
  },

  // ENQUIRIES CRUD (Leads)
  async submitEnquiry(enquiry) {
    const newEnquiry = {
      ...enquiry,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([newEnquiry])
        .select();
      if (!error) return data[0];
      throw error;
    }

    // Fallback
    newEnquiry.id = 'enq-' + Math.random().toString(36).substr(2, 9);
    const enquiries = JSON.parse(localStorage.getItem(KEYS.ENQUIRIES));
    enquiries.unshift(newEnquiry);
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(enquiries));
    return newEnquiry;
  },

  async getEnquiries() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) return data;
      console.error('Supabase Error:', error);
    }
    return JSON.parse(localStorage.getItem(KEYS.ENQUIRIES));
  },

  async deleteEnquiry(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const enquiries = JSON.parse(localStorage.getItem(KEYS.ENQUIRIES));
    const filtered = enquiries.filter(e => e.id !== id);
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(filtered));
    return true;
  },

  // TESTIMONIALS CRUD
  async getTestimonials() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) return data;
      console.error('Supabase Error:', error);
    }
    return JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS));
  },

  async createTestimonial(testimonial) {
    const newTestimonial = {
      ...testimonial,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([newTestimonial])
        .select();
      if (!error) return data[0];
      throw error;
    }

    newTestimonial.id = 'test-' + Math.random().toString(36).substr(2, 9);
    const testimonials = JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS));
    testimonials.unshift(newTestimonial);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return newTestimonial;
  },

  async deleteTestimonial(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const testimonials = JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS));
    const filtered = testimonials.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(filtered));
    return true;
  }
};
