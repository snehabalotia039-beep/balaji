import { supabase, isSupabaseConfigured } from '../supabaseClient';

const CUSTOMER_KEY = 'balaji_customer_session';
const CUSTOMERS_KEY = 'balaji_customers';

export async function registerCustomer({ full_name, phone, email, password }) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone }
      }
    });
    if (error) throw error;
    return data;
  }

  // Local fallback
  const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
  if (customers.find(c => c.email === email)) throw new Error('User already exists');
  const user = { id: 'cust-' + Math.random().toString(36).substr(2,9), full_name, phone, email };
  customers.push({ ...user, password });
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(user));
  return user;
}

export async function loginCustomer({ email, password }) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
  const found = customers.find(c => c.email === email && c.password === password);
  if (!found) throw new Error('Invalid credentials');
  const session = { id: found.id, full_name: found.full_name, phone: found.phone, email: found.email };
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
  return { user: session };
}

export async function logoutCustomer() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
    return;
  }
  localStorage.removeItem(CUSTOMER_KEY);
}

export async function getCustomerSession() {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  }
  return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || 'null');
}

export async function updateCustomerProfile(updates) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (error) throw error;
    return data;
  }
  const session = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || 'null');
  if (!session) throw new Error('Not authenticated');
  const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
  const idx = customers.findIndex(c => c.email === session.email);
  if (idx === -1) throw new Error('User not found');
  customers[idx] = { ...customers[idx], ...updates };
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  const updated = { ...session, ...updates };
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(updated));
  return updated;
}

export default {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerSession,
  updateCustomerProfile
};
