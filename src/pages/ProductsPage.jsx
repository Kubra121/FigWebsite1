import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/fetchProducts';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Veri çekme hatası:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div className='text-center py-10 text-gray-600'>Yükleniyor...</div>;
  }

  return (
    <div className='max-w-[1700px] mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-left text-[#04310a] mb-8'>
        Ürünler
      </h2>
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
