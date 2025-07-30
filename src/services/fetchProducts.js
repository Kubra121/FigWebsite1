// fetchProducts.js (veya başka ortak bir dosya)
import { supabase } from '../supabaseClient';

export const fetchProducts = async (limit = null) => {
  let query = supabase
    .from('products')
    .select('*')
    .order('purchase_count', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
};
