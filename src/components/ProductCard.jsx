import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { increaseItemQuantity } = useShoppingCart();

  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCart = (id) => {
    increaseItemQuantity(id);

    // "Sepete eklendi" mesajını göster
    setShowAddedMessage(true);

    // 2 saniye sonra mesajı gizle
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className='border rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 p-4 xl:scale-95 2xl:scale-90 h-auto min-h-[350px] flex flex-col'
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
        className='mt-4 w-full bg-[#04310a] text-white py-2 rounded-full hover:bg-[#06531c] transition-colors duration-300 ease-in-out cursor-pointer'
        onClick={() => handleAddToCart(product.id)}
      >
        Sepete Ekle
      </button>

      {/* Sepete eklendi mesajı */}
      {showAddedMessage && (
        <p className='mt-2 text-green-600 font-semibold text-center'>
          Sepete eklendi ✅
        </p>
      )}
    </div>
  );
};

export default ProductCard;
