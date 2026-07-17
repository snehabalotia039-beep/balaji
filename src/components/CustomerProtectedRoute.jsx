import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCustomerSession } from '../utils/customerAuth';

export default function CustomerProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const sess = await getCustomerSession();
      const user = sess?.user || sess;
      setIsAuthenticated(!!user);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="pt-24">Verifying...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
