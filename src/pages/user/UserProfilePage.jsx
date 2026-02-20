import { useProfile } from '../../services/useProfile';
import { useOrders } from '../../services/useOrders';

const UserProfilePage = () => {
  const { profile, loadingProfile } = useProfile();
  const userId = profile?.id;
  const { orders, loadingOrders } = useOrders(userId);

  if (loadingProfile || loadingOrders)
    return <p className='p-4 mt-16'>Yükleniyor...</p>;

  return (
    <div className='max-w-3xl mx-auto p-6'>
      {/* Profil */}
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
