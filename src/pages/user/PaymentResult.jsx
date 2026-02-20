import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentResult() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const orderId = new URLSearchParams(search).get('orderId');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `http://localhost:3001/api/payments/orders/${orderId}`,
      );
      const data = await res.json();

      if (data.status === 'PAID') {
        clearInterval(interval);
        setOrder(data);
        setLoading(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading)
    return (
      <div className='text-center py-20'>💳 Ödeme kontrol ediliyor...</div>
    );

  return (
    <div className='max-w-xl mx-auto py-20 text-center'>
      <h1 className='text-3xl font-bold text-green-600'>✅ Ödeme Başarılı!</h1>
      <p>
        Sipariş No: <strong>{order.order_no}</strong>
      </p>
      <p>Tutar: {order.total_amount}₺</p>
      <p>Adres: {order.shipping_address?.address}</p>

      <button
        onClick={() => navigate('/user/profile')}
        className='mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
      >
        Siparişlerime Git
      </button>
    </div>
  );
}
