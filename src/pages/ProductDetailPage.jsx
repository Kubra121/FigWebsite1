import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductByID } from '../services/getProductByID';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { increaseItemQuantity } = useShoppingCart();

  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCart = (id) => {
    increaseItemQuantity(id);

    // "Sepete eklendi" mesajını göster
    setShowAddedMessage(true);

    // 2 saniye sonra mesajı gizle
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByID(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className='p-4 mt-16'>Yükleniyor...</p>;

  return (
    <div className='max-w-6xl max-h-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8'>
      <div className='flex justify-center'>
        <img
          src={product.image_url}
          alt={product.name}
          className='w-full h-80 object-cover rounded-xl mb-4'
        />
      </div>
      <div>
        <h1 className='text-3xl font-bold mb-4'>{product.name}</h1>
        <p className='text-sm text-gray-500 mt-1'>{product.category}</p>
        <p className='text-gray-700 mb-2'>{product.description}</p>
        <p className='text-xl font-bold text-[#04310a]'>{product.price} TL</p>
        {/* <p className='text-gray-500'>Marka: {product.brand}</p> */}

        {/* Adet seçimi */}
        <div className='flex items-center gap-4 mt-6'>
          <button
            className='w-8 h-8 border rounded-full flex items-center justify-center'
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          >
            -
          </button>
          <span className='text-lg font-semibold'>{quantity}</span>
          <button
            className='w-8 h-8 border rounded-full flex items-center justify-center'
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        {/* Sepete ekle butonu */}
        <div className='mt-6 flex gap-3'>
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
      </div>
    </div>
  );
};

export default ProductDetailPage;
