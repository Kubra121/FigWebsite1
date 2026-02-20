import { useEffect, useState } from 'react';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';
import { fetchProducts } from '../../services/fetchProducts';
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

  // Satın Al → Checkout sayfasına yönlendir
  const goToCheckout = () => {
    if (cartItems.length === 0) return alert('Sepetiniz boş.');

    // Price ve name ekleyelim
    const cartItemsWithDetails = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.id);
      return {
        id: item.id,
        name: product?.name ?? '',
        price: product?.price ?? 0,
        quantity: item.quantity,
      };
    });

    navigate('/user/checkout', {
      state: { cartItems: cartItemsWithDetails },
    });
  };

  useEffect(() => {
    const fetchCartProducts = async () => {
      const data = await fetchProducts();

      if (!data) {
        setFetchError('Ürünler getirilemedi.');
        setLoading(false);
        return;
      }

      setProducts(data);
      setFetchError(null);
      setLoading(false);
    };

    fetchCartProducts();
  }, []);

  // Toplam fiyat
  const totalPrice = cartItems.reduce((total, cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    return total + (product?.price || 0) * cartItem.quantity;
  }, 0);

  if (loading) return <p className='p-4 mt-16'>Yükleniyor...</p>;

  return (
    <div className='max-w-5xl mx-auto p-6 ml-72 mt-16'>
      <h1 className='text-3xl font-bold mb-6  '>🛒 Sepetim</h1>

      {cartItems.length === 0 ? (
        <p className='text-gray-500'>Sepetiniz boş.</p>
      ) : (
        <div className='space-y-6'>
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return null;

            return (
              <div
                key={item.id}
                className='flex items-center justify-between border rounded-xl p-4 shadow-sm'
              >
                {/* Ürün */}
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

                {/* Adet */}
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => decreaseItemQuantity(item.id)}
                    className='px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300'
                  >
                    -
                  </button>
                  <span className='font-semibold'>{item.quantity}</span>
                  <button
                    onClick={() => increaseItemQuantity(item.id)}
                    className='px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300'
                  >
                    +
                  </button>
                </div>

                {/* Fiyat ve Sil */}
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>
                    {(product.price * item.quantity).toFixed(2)} TL
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className='text-red-600 hover:underline'
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })}

          {/* Toplam */}
          <div className='flex justify-end items-center gap-6 mt-8'>
            <p className='text-2xl font-bold'>
              Toplam: {totalPrice.toFixed(2)} TL
            </p>
            <button
              className='bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800'
              onClick={goToCheckout}
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
