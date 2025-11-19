import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const UserProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setProfile(data);
      }

      // Siparişler
      const { data: ordersData } = await supabase
        .from('orders')
        .select(
          `
          id,
          order_no,
          total_amount,
          status,
          created_at,
          order_items (
            product_id,
            quantity,
            price
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(ordersData);
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  //updating profile
  const updateProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUSer();
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        update_at: new Date(),
      })
      .eq('id', user.id);

    if (error) {
      alert('Hata' + error.message);
    } else {
      alert('Profil güncellendi!');
    }

    if (loading) return <p className='p-4'>Yükleniyor...</p>;
  };

  return (
    <div className='max-w-3xl mx-auto p-6'>
      {/* Profil Bilgileri */}
      <div className='bg-white shadow rounded-xl p-6 mb-8'>
        <h1 className='text-2xl font-bold mb-2'>
          {profile.first_name} {profile.last_name}
        </h1>
        <p className='text-gray-600'>{profile.email}</p>
      </div>

      {/* Siparişler */}
      <div className='bg-white shadow rounded-xl p-6'>
        <h2 className='text-xl font-bold mb-4'>Sipariş Geçmişim</h2>

        {orders.length === 0 ? (
          <p className='text-gray-500'>Henüz siparişiniz yok.</p>
        ) : (
          <ul className='space-y-4'>
            {orders.map((order) => (
              <li key={order.id} className='border rounded-lg p-4 bg-white'>
                {/* Üst Bilgi */}
                <div className='flex items-center justify-between mb-2'>
                  <p className='font-semibold text-gray-800'>
                    Sipariş No: {order.order_no}
                  </p>

                  <p className='text-green-600 font-bold'>
                    {order.total_amount} ₺
                  </p>
                </div>

                <p className='text-sm text-gray-500 mb-3'>
                  {new Date(order.created_at).toLocaleDateString()}
                </p>

                {/* Orta Bilgiler */}
                <div className='text-sm text-gray-700 space-y-1'>
                  <p>
                    <span className='font-medium'>Durum:</span> {order.status}
                  </p>
                  <p>
                    <span className='font-medium'>Adres:</span>{' '}
                    {order.shipping_address}
                  </p>
                  <p>
                    <span className='font-medium'>Ürün Sayısı:</span>{' '}
                    {order.order_items.reduce(
                      (t, item) => t + item.quantity,
                      0
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
