import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNav(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();

  return (
    <div className='mt-12 flex justify-between items-center h-24 max-w-[1800px] mx-auto px-4 text-black'>
      <h1
        className='w-full text-3xl font-bold text-[#04310a] cursor-pointer'
        onClick={() => navigate('/')}
      >
        FIG
      </h1>

      {/* Menü linkleri (Masaüstü) */}
      <ul className='hidden md:flex'>
        <li
          className='p-4 cursor-pointer'
          onClick={() => navigate('/products')}
        >
          Ürünler
        </li>
        <li className='p-4 cursor-pointer' onClick={() => navigate('/contact')}>
          İletişim
        </li>
      </ul>

      {/* Üye Giriş / Üye Ol butonları */}
      <div className='hidden md:flex space-x-6 w-96'>
        <button
          className='w-full px-6 py-3 border border-[#04310a] rounded-full hover:bg-[#04310a] hover:text-white transition cursor-pointer'
          onClick={() => navigate('/login')}
        >
          Üye Girişi
        </button>
        <button
          className='w-full px-6 py-3 bg-[#04310a] rounded-full text-white border border-transparent hover:border-[#04310a] hover:bg-[#ffffff] hover:text-black transition cursor-pointer'
          onClick={() => navigate('/register')}
        >
          Üye Ol
        </button>
      </div>

      {/* Mobil Menü Aç/Kapa */}
      <div onClick={handleNav} className='block md:hidden z-50 cursor-pointer'>
        {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </div>

      {/* Mobil Menü */}
      <div
        className={
          nav
            ? 'fixed left-0 top-0 w-[75%] h-full border-r border-r-gray-900 bg-[#ffffff] ease-in-out duration-500 z-40'
            : 'fixed left-[-100%] top-0 w-[75%] h-full ease-in-out duration-500 z-40'
        }
      >
        <h1 className='w-full text-3xl font-bold text-[#04310a] m-4'>FIG</h1>
        <ul className='pt-12 uppercase p-4'>
          <li
            className='p-4 cursor-pointer'
            onClick={() => {
              navigate('/products');
              setNav(false);
            }}
          >
            Ürünler
          </li>
          <li
            className='p-4 cursor-pointer'
            onClick={() => {
              navigate('/contact');
              setNav(false);
            }}
          >
            İletişim
          </li>
          <li
            className='p-4 cursor-pointer'
            onClick={() => {
              navigate('/login');
              setNav(false);
            }}
          >
            Üye Girişi
          </li>
          <li
            className='p-4 cursor-pointer'
            onClick={() => {
              navigate('/register');
              setNav(false);
            }}
          >
            Üye Ol
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
