import { useEffect, useRef, useState } from 'react';
import { fetchPopularProducts } from '../services/fetchPopularProducts';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductCard from '../components/ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // 👈 şık ok ikonları

const HomePageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchPopularProducts(10);
        setProducts(data);
      } catch (error) {
        console.error('Hata:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className='p-4 max-w-[1700px] mx-auto relative'>
      <h1 className='text-[30px] font-bold mb-4 text-[#04310a]'>
        Popüler Ürünler
      </h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className='relative'>
          {/* Sol ok */}
          <div
            ref={prevRef}
            className='absolute -left-10 top-1/2 z-10 -translate-y-1/2 p-3 cursor-pointer transition-all duration-200'
          >
            <FaChevronLeft className='text-xl text-gray-700' />
          </div>

          {/* Sağ ok */}
          <div
            ref={nextRef}
            className='absolute -right-10 top-1/2 z-10 -translate-y-1/2 p-3  cursor-pointer  transition-all duration-200'
          >
            <FaChevronRight className='text-xl text-gray-700' />
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={3}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default HomePageProducts;
