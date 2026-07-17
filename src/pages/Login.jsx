import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginCustomer } from '../utils/customerAuth';
import { Mail, Lock, ChevronRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in both fields');
    setLoading(true);
    try {
      await loginCustomer({ email, password });
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 font-sans">
      <div className="max-w-md mx-auto p-6 rounded-lg border border-beige-dark shadow-sm">
        <h2 className="text-2xl font-display font-extrabold mb-3">Customer Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-3 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-3 border rounded-md" />
            </div>
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center gap-2" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Sign In'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          <Link to="/register" className="text-primary font-semibold">Create Account</Link>
          <span className="mx-2">•</span>
          <Link to="/" className="text-slate-500">Continue as Guest</Link>
        </div>
      </div>
    </div>
  );
}
