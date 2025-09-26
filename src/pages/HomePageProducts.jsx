import { useEffect, useRef, useState } from 'react';
import { fetchProducts } from '../services/fetchProducts';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductCard from '../components/ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // 👈 şık ok ikonları

const HomePageProducts = () => {
  const [loading, setLoading] = useState(true);
  const [popularProducts, setPopularProducts] = useState([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(2);
        setPopularProducts(data);
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
            className='hidden md:flex absolute -left-10 top-1/2 z-10 -translate-y-1/2 p-3 cursor-pointer'
          >
            <FaChevronLeft className='text-xl text-gray-700' />
          </div>

          {/* Sağ ok */}
          <div
            ref={nextRef}
            className='hidden md:flex absolute -right-10 top-1/2 z-10 -translate-y-1/2 p-3 cursor-pointer'
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
              0: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 1, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 25 },
            }}
          >
            {popularProducts.map((product) => (
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
