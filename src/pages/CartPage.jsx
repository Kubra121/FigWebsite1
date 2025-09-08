import { useEffect, useState } from 'react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { fetchProducts } from '../services/fetchProducts';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const {
    cartItems,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
  } = useShoppingCart();

  const [fetchError, setFetchError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);

      if (fetchError) {
        setFetchError('Could not fetch.');
        setProducts(null);
        console.log(fetchError);
      }

      if (data) {
        setProducts(data);
        setFetchError(null);
      }
      setLoading(false);
    };

    fetchCartProducts();
  }, []);

  // 2️⃣ Toplam fiyat hesaplama
  const totalPrice = cartItems.reduce((total, cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    return total + (product?.price || 0) * cartItem.quantity;
  }, 0);

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>🛒 Sepetim</h1>

      {cartItems.length === 0 ? (
        <p className='text-gray-500'>Sepetiniz boş.</p>
      ) : (
        <div className='space-y-6'>
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return null; // henüz yüklenmediyse skip

            return (
              <div
                key={item.id}
                className='flex items-center justify-between border rounded-xl p-4 shadow-sm'
              >
                {/* Ürün görseli + adı */}
                <div className='flex items-center gap-4'>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className='w-20 h-20 object-cover rounded-lg'
                  />
                  <div>
                    <h2 className='font-semibold text-lg'>{product.name}</h2>
                    <p className='text-gray-600'>
                      {product.price.toFixed(2)} TL
                    </p>
                  </div>
                </div>

                {/* Adet artır/azalt */}
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => decreaseItemQuantity(item.id)}
                    className='px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer'
                  >
                    -
                  </button>
                  <span className='font-semibold'>{item.quantity}</span>
                  <button
                    onClick={() => increaseItemQuantity(item.id)}
                    className='px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer'
                  >
                    +
                  </button>
                </div>

                {/* Fiyat ve silme */}
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>
                    {(product.price * item.quantity).toFixed(2)} TL
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className='text-red-600 hover:underline cursor-pointer'
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })}

          {/* toplam */}
          <div className='flex justify-end items-center gap-6 mt-8'>
            <p className='text-2xl font-bold'>
              Toplam: {totalPrice.toFixed(2)} TL
            </p>
            <button
              className='bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition cursor-pointer'
              onClick={() => navigate('/purchase')}
            >
              Satın Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
