import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabaseClient';
import { fetchProducts } from '../services/fetchProducts';

const ProductsPage = () => {
  const [fetchError, setFetchError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
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

    fetchAllProducts();
  }, []);

  if (loading) {
    return <div className='text-center py-10 text-gray-600'>Yükleniyor...</div>;
  }

  return (
    <div className='max-w-[1700px] mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-left text-[#04310a] mb-8'>
        Ürünler
      </h2>
      {fetchError && <p>{fetchError}</p>}
      {products.length === 0 ? (
        <p className='text-center text-gray-500'>Henüz ürün bulunamadı.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
