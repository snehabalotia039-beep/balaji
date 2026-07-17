import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Check if user is in admins table
            const { data: adminRecord, error } = await supabase
              .from('admins')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle();

            if (adminRecord && !error) {
              setIsAuthenticated(true);
            } else {
              // If not found in admin table but logged in, sign them out
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        } else {
          // Demo Mode: Check session storage
          const loggedIn = sessionStorage.getItem('balaji_admin_logged_in') === 'true';
          setIsAuthenticated(loggedIn);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    let authSubscription = null;
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();
          setIsAuthenticated(!!adminRecord);
        } else {
          setIsAuthenticated(false);
        }
        setLoading(false);
      });
      authSubscription = subscription;
    }

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-semibold tracking-wider text-sm uppercase">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
