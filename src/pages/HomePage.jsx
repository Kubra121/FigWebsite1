import Hero from '../components/Hero';
import HomePageProducts from './HomePageProducts';

const HomePage = () => {
  return (
    <div className='p-4'>
      <Hero />
      <HomePageProducts />
      {/* <Analytics />
                    <Newsletter />
                    <Cards /> */}
    </div>
  );
};

export default HomePage;
