-- ==========================================
-- NEW BALAJI PROPERTY DATABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create ADMINS Table
-- Stores user IDs that are allowed administrative access
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PROPERTIES Table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL, -- e.g., 8500000 (85 Lakhs) or 25000000 (2.5 Crores)
    location TEXT NOT NULL, -- e.g., Karol Bagh, Delhi
    type TEXT NOT NULL CHECK (type IN ('Residential', 'Commercial')),
    deal_type TEXT NOT NULL CHECK (deal_type IN ('Buy', 'Rent')),
    bedrooms INTEGER, -- Nullable for commercial
    bathrooms INTEGER,
    area NUMERIC NOT NULL, -- in Sq. Ft.
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Rented')),
    images TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    specifications JSONB DEFAULT '{}'::jsonb, -- e.g., {"Facing": "North", "Furnishing": "Semi-Furnished"}
    amenities TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create BOOKINGS Table (Consultation Appointments)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('Buy', 'Sell', 'Rent')),
    budget TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create ENQUIRIES Table (Property-Specific Inquiries)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT, -- Stored as text to preserve even if property is deleted
    budget TEXT NOT NULL,
    requirement TEXT NOT NULL, -- e.g., "Looking to buy urgently"
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create TESTIMONIALS Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    designation TEXT NOT NULL, -- e.g., "Karol Bagh Resident", "Business Owner"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- --- ADMINS POLICIES ---
-- Users can read their own admin entry
CREATE POLICY "Admins can view their own record" 
ON public.admins FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Super admin check helper function
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROPERTIES POLICIES ---
CREATE POLICY "Anyone can view properties" 
ON public.properties FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Only admins can insert properties" 
ON public.properties FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update properties" 
ON public.properties FOR UPDATE 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete properties" 
ON public.properties FOR DELETE 
TO authenticated 
USING (public.is_admin());


-- --- BOOKINGS POLICIES ---
CREATE POLICY "Anyone can submit a booking" 
ON public.bookings FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Only admins can view bookings" 
ON public.bookings FOR SELECT 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Only admins can update bookings" 
ON public.bookings FOR UPDATE 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete bookings" 
ON public.bookings FOR DELETE 
TO authenticated 
USING (public.is_admin());


-- --- ENQUIRIES POLICIES ---
CREATE POLICY "Anyone can submit an enquiry" 
ON public.enquiries FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Only admins can view enquiries" 
ON public.enquiries FOR SELECT 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Only admins can delete enquiries" 
ON public.enquiries FOR DELETE 
TO authenticated 
USING (public.is_admin());


-- --- TESTIMONIALS POLICIES ---
CREATE POLICY "Anyone can view testimonials" 
ON public.testimonials FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Only admins can manage testimonials" 
ON public.testimonials ALL 
TO authenticated 
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==========================================
-- STORAGE SETUP (For Property Images)
-- ==========================================
-- Inserts "property-images" bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies
CREATE POLICY "Public Access to Property Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

CREATE POLICY "Admin Upload to Property Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Admin Delete from Property Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Admin Update Property Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND public.is_admin());

-- ==========================================
-- INITIAL TEST DATA (Optional Seed)
-- ==========================================
-- Run this seed to see properties on the front-end initially
INSERT INTO public.properties (title, description, price, location, type, deal_type, bedrooms, bathrooms, area, status, featured, specifications, amenities, images)
VALUES 
(
  'Luxury 3 BHK Builder Floor', 
  'Premium semi-furnished 3 BHK builder floor available for sale in the heart of Karol Bagh. Features high-quality Italian marble flooring, false ceiling with ambient lighting, modular kitchen with chimney, and spacious wardrobes in all bedrooms. Centrally located with easy access to markets, Karol Bagh Metro Station, and top schools.', 
  18500000, 
  'Sat Nagar, Karol Bagh, Delhi', 
  'Residential', 
  'Buy', 
  3, 
  3, 
  1450, 
  'Available', 
  true, 
  '{"Facing": "North-East", "Furnishing": "Semi-Furnished", "Floor": "2nd Floor", "Parking": "1 Reserved Slot", "Age of Construction": "1 Year"}'::jsonb, 
  ARRAY['Reserved Parking', 'Lift', '24/7 Water Supply', 'Modular Kitchen', 'Balcony', 'Intercom'],
  ARRAY['/assets/property-1.jpg']
),
(
  'Prime Commercial Showroom', 
  'Excellent corner commercial showroom space in Karol Bagh market. High footfall area, perfect for retail brands, banks, jewelry showrooms, or designer boutiques. Ground floor + Mezzanine floor with double-height glass frontage. Immediate possession available.', 
  45000000, 
  'Ajmal Khan Road, Karol Bagh, Delhi', 
  'Commercial', 
  'Buy', 
  NULL, 
  2, 
  1800, 
  'Available', 
  true, 
  '{"Frontage": "25 Feet", "Furnishing": "Unfurnished", "Floor": "Ground + Mezzanine", "Suitable For": "Showroom/Bank/Retail"}'::jsonb, 
  ARRAY['Double Frontage', 'Power Backup', 'Air Conditioning Provision', 'High Footfall Area', 'Main Road Facing', 'Security Guards'],
  ARRAY['/assets/property-2.jpg']
),
(
  'Modern 2 BHK Rental Apartment', 
  'Beautifully designed, fully ventilated 2 BHK residential apartment for rent. Located in a secure gated community near Karol Bagh. Features spacious rooms, modular kitchen, chimney, 2 balconies with pleasant views, and stilt parking.', 
  45000, 
  'Block 2A, Karol Bagh, Delhi', 
  'Residential', 
  'Rent', 
  2, 
  2, 
  1100, 
  'Available', 
  false, 
  '{"Facing": "East", "Furnishing": "Semi-Furnished", "Floor": "1st Floor", "Security Deposit": "2 Months Rent", "Maintenance Charges": "Included"}'::jsonb, 
  ARRAY['Reserved Parking', 'Lift', 'Security Guards', 'Gated Community', 'Balcony', 'Water Storage'],
  ARRAY['/assets/property-3.jpg']
),
(
  'Spacious 4 BHK Duplex Penthouse', 
  'Exquisite ultra-luxury 4 BHK duplex penthouse available for sale. Features private terrace garden, modular kitchen, top-of-the-line bathroom fittings, wooden flooring in master bedroom, and individual elevator access. Experience high-end living in central Delhi.', 
  32500000, 
  'Karol Bagh, Delhi', 
  'Residential', 
  'Buy', 
  4, 
  4, 
  2800, 
  'Available', 
  true, 
  '{"Facing": "North", "Furnishing": "Semi-Furnished", "Floor": "4th & 5th Floor", "Terrace": "Private 800 sq ft", "Age of Construction": "Brand New"}'::jsonb, 
  ARRAY['Private Terrace', 'Reserved Parking', '2 Lifts', '24/7 Water Supply', 'Power Backup', 'Piped Gas', 'Servant Room'],
  ARRAY['/assets/property-4.jpg']
);

-- Seed Testimonials
INSERT INTO public.testimonials (name, review, rating, designation)
VALUES 
('Rajesh Kumar', 'I purchased a 3 BHK builder floor in Karol Bagh through New Balaji Property. Mr. Balotia and his team were extremely transparent. The legal documentation assistance was smooth, and they guided me through the entire home loan process. Highly recommended!', 5, 'Homeowner'),
('Amit Sharma', 'Renting a commercial office space in Karol Bagh was seamless with New Balaji Property. They understood our requirement, showed only verified options, and handled the rent agreement and verification quickly. Exceptional local market expertise.', 5, 'Business Owner'),
('Priya Malhotra', 'New Balaji Property helped us sell our ancestral property in Delhi. They did a fair valuation and ensured a completely transparent deal with no hidden charges. Very professional team.', 5, 'Property Seller');
