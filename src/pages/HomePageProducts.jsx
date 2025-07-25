import { useEffect, useState } from 'react';
import { fetchPopularProducts } from '../services/fetchPopularProducts';
import ProductCard from '../components/ProductCard';

const HomePageProducts = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchPopularProducts(5);
        setPopularProducts(data);
      } catch (error) {
        console.error('Popüler ürünler yüklenirken hata:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className='p-4 max-w-[1700px] mx-auto'>
      <h1 className='text-[30px] font-bold mb-4 text-[#04310a]'>
        Popüler Ürünler
      </h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePageProducts;
