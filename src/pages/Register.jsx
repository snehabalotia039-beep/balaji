import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerCustomer } from '../utils/customerAuth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.email || !form.password) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await registerCustomer(form);
      toast.success('Account created. You are now logged in.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 font-sans">
      <div className="max-w-md mx-auto p-6 rounded-lg border border-beige-dark shadow-sm">
        <h2 className="text-2xl font-display font-extrabold mb-3">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full mt-1 p-3 border rounded-md" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full mt-1 p-3 border rounded-md" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-3 border rounded-md" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" className="w-full mt-1 p-3 border rounded-md" />
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-md" disabled={loading} type="submit">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  );
}
