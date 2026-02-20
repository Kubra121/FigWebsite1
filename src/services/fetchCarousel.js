import { supabase } from '../supabaseClient';

export const fetchCarousel = async () => {
  const { data, error } = await supabase
    .from('carousel_items')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};
