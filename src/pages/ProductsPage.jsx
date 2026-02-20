import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/fetchProducts';

const ProductsPage = () => {
  const [fetchError, setFetchError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = [
    'Tümü',
    'Ceviz',
    'Kuru İncir',
    'Zeytinyağı',
    'Pekmez',
    'Diğer',
  ];

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

  const filteredProducts =
    selectedCategory === 'Tümü'
      ? products.filter((p) => p.is_active)
      : products.filter((p) => p.is_active && p.category === selectedCategory);

  if (loading) {
    return (
      <div className='text-center py-10 text-gray-600 mt-16'>Yükleniyor...</div>
    );
  }

  return (
    <div className='max-w-[1700px] mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-left text-[#04310a] mb-8 mt-8 ml-8'>
        Ürünler
      </h2>
      <div className='flex justify-center gap-3 mb-8 flex-wrap'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                selectedCategory === category
                  ? 'bg-[#04310a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {fetchError && <p>{fetchError}</p>}

      {filteredProducts.length === 0 ? (
        <p className='text-center text-gray-500'>
          Bu kategoride ürün bulunamadı.
        </p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
