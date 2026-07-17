import { supabase, isSupabaseConfigured } from '../supabaseClient';

const CUSTOMER_CONFIG_ERROR = 'Customer authentication requires Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';

async function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(CUSTOMER_CONFIG_ERROR);
  }
}

async function isAdminUser(userId) {
  if (!isSupabaseConfigured) return false;
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  return !!(data && !error);
}

export async function registerCustomer({ full_name, phone, email, password }) {
  await ensureConfigured();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone }
    }
  });

  if (error) throw error;

  if (data?.user && await isAdminUser(data.user.id)) {
    await supabase.auth.signOut();
    throw new Error('Customer registration is not available for this account.');
  }

  return data;
}

export async function loginCustomer({ email, password }) {
  await ensureConfigured();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  if (data?.user && await isAdminUser(data.user.id)) {
    await supabase.auth.signOut();
    throw new Error('Invalid email or password');
  }

  return data;
}

export async function logoutCustomer() {
  await ensureConfigured();
  await supabase.auth.signOut();
}

export async function getCustomerSession() {
  await ensureConfigured();
  const { data } = await supabase.auth.getSession();
  const session = data.session || null;
  if (!session) return null;
  if (await isAdminUser(session.user.id)) {
    await supabase.auth.signOut();
    return null;
  }
  return session;
}

export async function updateCustomerProfile(updates) {
  await ensureConfigured();
  const { data, error } = await supabase.auth.updateUser({ data: updates });
  if (error) throw error;
  if (data?.user && await isAdminUser(data.user.id)) {
    await supabase.auth.signOut();
    throw new Error('Unauthorized customer profile update.');
  }
  return data;
}

export default {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerSession,
  updateCustomerProfile
};
