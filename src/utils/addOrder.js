import { supabase } from '../supabaseClient';

export async function addOrder({
  items,
  shipping_address,
  phone,
  status = 'pending',
}) {
  try {
    // Kullanıcıyı al
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      throw new Error('Kullanıcı oturumu bulunamadı');
    }

    // Order oluştur
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          shipping_address,
          phone,
          status,
          order_no: Math.floor(100000 + Math.random() * 900000).toString(),
          total_amount: items.reduce(
            (t, item) => t + (item.price ?? item.unit_price) * item.quantity,
            0
          ),
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Order items ekle
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id || item.product_id,
      quantity: item.quantity,
      price: item.price ?? item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, order_id: order.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
