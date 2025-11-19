import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  // Eğer CartPage'den state ile gönderildiyse al (opsiyonel)
  const { state } = useLocation();
  const cartItemsFromState = state?.cartItems ?? [];

  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!name || !address) {
      alert('Lütfen gerekli alanları doldurun.');
      return;
    }

    // Kredi kartı sayfasına yönlendir, gerekli veriyi state ile geçir
    navigate('/user/payment', {
      state: {
        customer_name: name,
        shipping_address: address,
        phone,
        cartItems: cartItemsFromState,
      },
    });
    console.log('CART ITEMS:', cartItemsFromState);
  };

  return (
    <div className='max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border'>
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
          <label className='block mb-1 font-medium text-gray-700'>Adres</label>
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

        <button
          onClick={handleSubmit}
          className='mt-4 w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-md'
        >
          💳 Ödemeye Geç
        </button>
      </div>
    </div>
  );
}
