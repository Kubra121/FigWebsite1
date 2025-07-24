import Footer from '../components/Footer';
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
      <Footer />
    </div>
  );
};

export default HomePage;
