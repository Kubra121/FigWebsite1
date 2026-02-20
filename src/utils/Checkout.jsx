import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addOrder } from '../utils/addOrder';
import { supabase } from '../supabaseClient';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartItemsFromState = state?.cartItems ?? [];

  const [userId, setUserId] = useState(null); // Profiles tablosundaki user id

  const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const normalizePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return null;
    return digits.slice(-10);
  };

  // Teslimat bilgileri
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Profiles tablosundan user id al
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserId(data.id);
      }
    };

    fetchUserProfile();
  }, []);

  // Sipariş oluşturma ve ödeme başlatma
  const handleSubmit = async () => {
    if (!userId)
      return alert('Kullanıcı bilgisi alınamadı. Lütfen giriş yapın.');

    // Hangi alan eksik kontrolü
    const missingFields = [];

    if (!isNonEmptyString(name)) missingFields.push('Ad Soyad');
    if (!isNonEmptyString(address)) missingFields.push('Adres');
    if (!isValidEmail(email)) missingFields.push('Geçerli Email');

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) missingFields.push('Geçerli Telefon');

    if (!cartItemsFromState.length) missingFields.push('Sepet boş');

    const totalPrice = cartItemsFromState.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    if (!totalPrice || totalPrice <= 0) missingFields.push('Toplam tutar');

    if (missingFields.length > 0) {
      return alert(
        'Aşağıdaki alanlar eksik veya hatalı:\n' + missingFields.join(', ')
      );
    }

    try {
      const result = await addOrder({
        items: cartItemsFromState,
        shippingAddress: address,
        phone,
        email,
        status: 'pending',
        totalPrice,
        userId, // Artık profiles tablosundan alınan id
      });
      // Debug: backend'e göndereceğimiz payload
      const cleanName = name.trim().replace(/\s+/g, ' ');
      const cleanAddress = address.trim();
      const cleanEmail = email.trim().toLowerCase();
      const payload = {
        orderId: result.order_id,
        price: totalPrice,
        buyer: {
          user_id: userId,
          name: cleanName,
          phone: normalizedPhone, // sadece 10 haneli
          email: cleanEmail,
          address: cleanAddress,
        },
      };

      console.log('Gönderilen payload:', payload);
      if (!result?.success) {
        return alert('Sipariş oluşturulamadı: ' + result.error);
      }
      // Backend ödeme isteği
      const res = await fetch('http://localhost:3001/api/payments/iyzico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Backend döndü:', data);

      if (data.paymentPageUrl) {
        // Artık direkt iyzico sayfasına gidiyor
        // Ödeme tamamlandıktan sonra kullanıcı frontend PaymentResult sayfasına yönlendirilecek
        // orderId parametresi ile
        // window.location.href = `${data.paymentPageUrl}&redirectUrl=http://localhost:5173/payment-result?orderId=${result.order_id}`;
        // 1️⃣ önce waiting sayfasını aç
        navigate(`/payment-waiting?orderId=${result.order_id}`);

        // 2️⃣ küçük bir gecikmeyle iyzico'ya git
        setTimeout(() => {
          window.location.href = data.paymentPageUrl;
        }, 300);
      } else {
        alert('Ödeme sayfası açılamadı: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error('Ödeme başlatma hatası:', err);
      alert('Ödeme sırasında hata oluştu.');
    }
  };

  return (
    <div className='flex justify-center items-start min-h-screen bg-white-100 py-10'>
      <div className='w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          📝 Teslimat Bilgileri
        </h2>

        <div className='flex flex-col gap-4'>
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Ad Soyad
            </label>
            <input
              type='text'
              className='w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm'
              placeholder='Örn: Ahmet Yılmaz'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Adres
            </label>
            <textarea
              className='w-full px-4 py-2 rounded-lg border h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm'
              placeholder='Mahalle, Sokak, Bina No, Daire No, İl / İlçe'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Telefon
            </label>
            <input
              type='tel'
              className='w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm'
              placeholder='Örn: 0532 000 00 00'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              className='w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm'
              placeholder='Email adresiniz'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className='mt-6 w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition shadow-md'
          >
            🛒 Siparişi Tamamla & Ödeme
          </button>
        </div>
      </div>
    </div>
  );
}
