import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { updateSEO } from '../utils/seo';
import { Lock, Mail, ChevronRight, HelpCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import LogoImage from '../assets/logo.jpg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Admin Secure Login',
      description: 'Admin portal login for New Balaji Property. Access is restricted to authorized personnel.'
    });

    // If already logged in, redirect
    const checkSession = async () => {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if admin
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (adminRecord) {
            navigate('/admin/dashboard');
          }
        }
      } else {
        // If env-based admin is present, consider session flag
        if (sessionStorage.getItem('balaji_admin_logged_in') === 'true') {
          navigate('/admin/dashboard');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Verify if the authenticated user is registered in the admins table
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admins')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!adminRecord || adminErr) {
          // Sign out immediately if they are not in the admins whitelist
          await supabase.auth.signOut();
          toast.error('Invalid username or password.');
          setLoading(false);
          return;
        }

        toast.success('Successfully authenticated!');
        navigate('/admin/dashboard');
      } else {
        // Environment variable based fallback (do NOT display credentials anywhere)
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '';
        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          sessionStorage.setItem('balaji_admin_logged_in', 'true');
          toast.success('Successfully authenticated!');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid username or password.');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please verify credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative">
      <div className="absolute inset-0 opacity-5 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')" }}></div>
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-white text-xs uppercase font-extrabold tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center">
          <div className="bg-white p-2 rounded-md shadow-lg border border-secondary mb-4">
            <img 
              src={LogoImage} 
              alt="Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-center text-3xl font-display font-extrabold text-white">
            Admin Portal Secure Login
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-slate-400 font-medium">
            NEW BALAJI PROPERTY MANAGEMENT
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 py-8 px-4 border border-slate-800 shadow-2xl rounded-lg sm:px-10">
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@balaji.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white font-medium"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-light disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-sm py-3.5 rounded-md transition-colors uppercase tracking-wider cursor-pointer shadow-md"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>

          </form>

          {/* Info card describing fallback */}
          {!isSupabaseConfigured && (
            <div className="mt-8 bg-slate-950 p-4 border border-dashed border-slate-800 rounded-md flex gap-2.5 items-start text-[11px] leading-relaxed text-slate-400 font-medium">
              <HelpCircle className="w-5 h-5 shrink-0 text-secondary-dark mt-0.5" />
              <div>
                <span className="font-bold text-slate-300 block mb-1">Admin Login Unavailable</span>
                <span>Please configure Supabase or provide admin credentials via environment variables to enable admin access.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
