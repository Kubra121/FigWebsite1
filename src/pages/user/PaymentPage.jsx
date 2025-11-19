import { useState, useEffect } from 'react';
import { addOrder } from '../../utils/addOrder';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../services/fetchProducts';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Checkout'tan gelen veriler
  const { shipping_address, phone, cartItems } = state || {};

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);

  // ✔ Ürün fiyatlarını çekiyoruz (zorunlu!)
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  const handlePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert('Sepet verisi bulunamadı!');
      return;
    }

    // ✔ cartItems + ürün fiyatlarını birleştir
    const itemsWithPrice = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.id);

      return {
        product_id: item.id,
        quantity: item.quantity,
        price: product?.price ?? null, // ✔ Supabase null olmaz → garanti veriyoruz
      };
    });

    // Eğer herhangi bir ürün bulunamadıysa işlem iptal edilir
    if (itemsWithPrice.some((i) => i.price === null)) {
      alert('Ürün fiyatı bulunamadı, işlem gerçekleştirilemedi.');
      console.error('PRICE ERROR:', itemsWithPrice);
      return;
    }

    setLoading(true);

    const result = await addOrder({
      items: itemsWithPrice,
      shipping_address,
      phone,
      status: 'paid',
    });

    setLoading(false);

    if (result.success) {
      navigate('/order-success/' + result.order_id);
    } else {
      alert('Ödeme başarısız: ' + result.error);
    }
  };

  return (
    <div className='max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border'>
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
        💳 Kredi Kartı ile Ödeme
      </h2>

      <div className='space-y-4'>
        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            Kart Üzerindeki İsim
          </label>
          <input
            type='text'
            className='w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm'
            placeholder='Örn: Ahmet Yılmaz'
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>

        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            Kart Numarası
          </label>
          <input
            type='text'
            maxLength={19}
            className='w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400 focus:outline-none tracking-widest shadow-sm'
            placeholder='1234 5678 9012 3456'
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>

        <div className='flex gap-4'>
          <div className='w-1/2'>
            <label className='block font-medium text-gray-700 mb-1'>
              Son Kullanma (AA/YY)
            </label>
            <input
              type='text'
              maxLength={5}
              className='w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm'
              placeholder='09/29'
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>

          <div className='w-1/2'>
            <label className='block font-medium text-gray-700 mb-1'>CVV</label>
            <input
              type='password'
              maxLength={3}
              className='w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm'
              placeholder='123'
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className='w-full py-3 mt-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition shadow-lg disabled:opacity-50'
        >
          {loading ? 'İşleniyor...' : 'Satın Al ✔️'}
        </button>
      </div>
    </div>
  );
}
