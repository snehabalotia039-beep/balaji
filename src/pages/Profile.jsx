import React, { useEffect, useState } from 'react';
import { getCustomerSession, logoutCustomer, updateCustomerProfile } from '../utils/customerAuth';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '' });

  useEffect(() => {
    (async () => {
      const s = await getCustomerSession();
      if (s && s.user) setUser(s.user);
      else setUser(s);
      if (s && s.user) setForm({ full_name: s.user.user_metadata?.full_name || '', phone: s.user.user_metadata?.phone || '', email: s.user.email });
      else if (s) setForm({ full_name: s.full_name || '', phone: s.phone || '', email: s.email });
    })();
  }, []);

  const handleLogout = async () => {
    await logoutCustomer();
    toast.success('Logged out');
    window.location.href = '/';
  };

  const handleSave = async () => {
    try {
      const updated = await updateCustomerProfile({ full_name: form.full_name, phone: form.phone });
      setUser(updated.user || updated);
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  if (!user) return (
    <div className="min-h-screen pt-24 font-sans flex items-center justify-center">Not logged in.</div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 font-sans">
      <div className="max-w-2xl mx-auto p-6 rounded-lg border border-beige-dark shadow-sm">
        <h2 className="text-2xl font-display font-extrabold mb-3">Your Profile</h2>
        {!editing ? (
          <div>
            <p className="font-bold">{form.full_name}</p>
            <p className="text-sm text-slate-600">{form.email}</p>
            <p className="text-sm text-slate-600">{form.phone}</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={() => setEditing(true)}>Edit</button>
              <button className="px-4 py-2 border rounded-md" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <input className="w-full p-3 border rounded-md" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            <input className="w-full p-3 border rounded-md" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={handleSave}>Save</button>
              <button className="px-4 py-2 border rounded-md" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
