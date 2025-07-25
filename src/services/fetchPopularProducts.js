import { supabase } from '../supabaseClient';

export const fetchPopularProducts = async (limit) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('purchase_count', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data ?? []; // burada null ise boş dizi dönmesini sağla
};
