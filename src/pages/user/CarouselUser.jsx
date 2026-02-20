import { useEffect, useState } from 'react';
import { fetchCarousel } from '../../services/fetchCarousel';

const CarouselUser = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const getSlides = async () => {
      const data = await fetchCarousel();
      setSlides(data);
    };

    getSlides();
  }, []);

  // ⏱️ Otomatik geçiş
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className='px-0 sm:px-4 md:px-10 lg:px-24 xl:px-48'>
      <div className='relative w-full h-[500px] overflow-hidden rounded-2xl'>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image_url}
              alt={slide.title}
              className='w-full h-full object-cover'
            />
          </div>
        ))}

        {/* Dots */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselUser;
