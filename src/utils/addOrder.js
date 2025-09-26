import { supabase } from '../supabaseClient';

export const addOrder = async (cartItems) => {
  // cartItems örneği:
  // [{ productName: 'Ürün A', quantity: 2, price: 10 }, { productName: 'Ürün B', quantity: 1, price: 20 }]

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: 'Giriş yapmalısınız.' };
  }

  const insertData = cartItems.map((item) => ({
    user_id: user.id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
  }));

  const { data, error } = await supabase.from('orders').insert(insertData);
  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
