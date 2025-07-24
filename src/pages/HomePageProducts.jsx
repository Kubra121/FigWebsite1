import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const HomePageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products') // Tablo adını burada doğru yazmalısın
        .select('*');

      if (error) {
        console.error('Veri çekme hatası:', error);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className='p-4 max-w-[1800px] mx-auto'>
      <h1 className='text-[30px] font-bold mb-4 text-[#04310a]'>
        Popüler Ürünler
      </h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {products.map((product) => (
            <div
              key={product.id}
              className='border p-4 rounded-lg shadow hover:shadow-lg transition h-[400px] flex flex-col'
            >
              <img
                src={product.image_url}
                alt={product.name}
                className='w-full h-56 object-cover rounded'
              />
              <div className='mt-2 flex-grow'>
                <h2 className='font-semibold'>{product.name}</h2>
                <p className='text-gray-600'>{product.description}</p>
              </div>
              <p className='mt-2 font-bold text-green-700'>
                {product.price} TL
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePageProducts;
