import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useShoppingCart(); // 🔥 increaseItemQuantity yerine addToCart

  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // 🛑 Kart tıklanınca ürün sayfasına gitmesin
    addToCart(product); // 🔥 Ürün objesinin tamamını ekle

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className='border rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 p-4 xl:scale-95 2xl:scale-90 h-auto min-h-[350px] flex flex-col cursor-pointer'
    >
      <img
        src={product.image_url}
        alt={product.name}
        className='w-full h-48 object-cover rounded-xl mb-4'
      />
      <div className='flex-grow'>
        <h3 className='text-xl font-semibold'>{product.name}</h3>
        <p className='text-gray-600'>{product.description}</p>
      </div>
      <p className='text-lg font-bold mt-2 text-[#04310a]'>
        {product.price} TL
      </p>

      <button
        className='mt-4 w-full bg-[#04310a] text-white py-2 rounded-full hover:bg-[#06531c] transition-colors duration-300 ease-in-out'
        onClick={handleAddToCart}
      >
        Sepete Ekle
      </button>

      {showAddedMessage && (
        <p className='mt-2 text-green-600 font-semibold text-center'>
          Sepete eklendi ✅
        </p>
      )}
    </div>
  );
};

export default ProductCard;
