import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentWaiting() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/payments/orders/${orderId}`
        );

        if (!res.ok) return;

        const order = await res.json();

        if (order.status === 'PAID') {
          clearInterval(interval);
          navigate(`/payment-result?orderId=${orderId}`);
        }

        if (order.status === 'FAILED') {
          clearInterval(interval);
          navigate(`/payment-result?orderId=${orderId}&status=failed`);
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold mb-2'>Ödeme Bekleniyor</h2>
        <p>Lütfen bu sayfayı kapatmayın</p>
      </div>
    </div>
  );
}
