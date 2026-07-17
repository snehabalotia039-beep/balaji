import React, { useEffect, useState } from 'react';
import { getCustomerSession } from '../utils/customerAuth';
import { db } from '../utils/db';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const sess = await getCustomerSession();
      const user = sess?.user || sess;
      if (!user) {
        setAppointments([]);
        setLoading(false);
        return;
      }
      try {
        const all = await db.getBookings();
        const filtered = all.filter(b => b.email === (user.email || user.user?.email));
        setAppointments(filtered || []);
      } catch (err) {
        console.error(err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="pt-24">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pt-24 font-sans">
      <div className="max-w-3xl mx-auto p-6 rounded-lg border border-beige-dark shadow-sm">
        <h2 className="text-2xl font-display font-extrabold mb-4">My Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-slate-600">No appointments found.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map(a => (
              <div key={a.id || a.created_at} className="border p-3 rounded-md">
                <div className="text-sm font-semibold">{a.preferred_date} • {a.preferred_time}</div>
                <div className="text-xs text-slate-600">Status: {a.status || 'Pending'}</div>
                <div className="text-sm mt-2">{a.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
