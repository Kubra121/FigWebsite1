import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';
import { FaShoppingCart } from 'react-icons/fa'; // Sepet ikonu
import { FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  const [nav, setNav] = useState(false);

  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
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

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='mt-12 flex justify-between items-center h-24 max-w-[1800px] mx-auto px-4 text-black'>
      <h1
        className='w-full text-3xl font-bold text-[#04310a] cursor-pointer'
        onClick={() => navigate('/')}
      >
        FIG
      </h1>

      {/* Menü linkleri (Masaüstü) */}
      <ul className='hidden md:flex items-center space-x-2'>
        <li
          className='p-4 cursor-pointer'
          onClick={() => navigate('/products')}
        >
          Ürünler
        </li>
        <li
          className='p-4 cursor-pointer pr-9'
          onClick={() => navigate('/contact')}
        >
          İletişim
        </li>
      </ul>

      {/* Üye Giriş / Üye Ol butonları */}
      <div className='hidden md:flex items-center justify-center space-x-9 w-96'>
        {!session ? (
          <>
            <button
              className='px-6 py-3 border border-[#04310a] rounded-full hover:bg-[#04310a] hover:text-white transition cursor-pointer'
              onClick={() => navigate('/login')}
            >
              Üye Girişi
            </button>
            <button
              className='px-6 py-3 bg-[#04310a] rounded-full text-white hover:bg-white hover:text-black border hover:border-[#04310a] transition cursor-pointer'
              onClick={() => navigate('/register')}
            >
              Üye Ol
            </button>
            <button
              aria-label='Sepet'
              onClick={() => navigate('/cart')}
              className='relative p-2 hover:text-[#04310a]'
            >
              <FaShoppingCart size={24} className='cursor-pointer' />
            </button>
          </>
        ) : (
          <>
            {/* Sepet butonu masaüstü menüsünde */}
            <button
              aria-label='Sepet'
              onClick={() => navigate('/cart')}
              className='relative p-2 hover:text-[#04310a]'
            >
              <FaShoppingCart size={24} className='cursor-pointer' />
            </button>
            <FaUserCircle
              className='text-3xl text-gray-700 hover:text-black cursor-pointer'
              onClick={() => navigate('/profile')}
            />
            <button
              onClick={handleLogOut}
              className='px-2 py-2 border border-red-500 text-red-600 rounded hover:bg-red-600 hover:text-white'
            >
              Çıkış Yap
            </button>
          </>
        )}
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

          {!session ? (
            <>
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
            </>
          ) : (
            <>
              <li className='p-4 text-gray-600'>{session?.user?.email}</li>
              <li
                className='p-4 cursor-pointer text-red-600'
                onClick={(e) => {
                  e.preventDefault();
                  handleLogOut(e);
                  setNav(false);
                }}
              >
                Çıkış Yap
              </li>
            </>
          )}

          {/* Sepet butonu mobil menüde */}
          <li
            className='p-4 cursor-pointer flex items-center'
            onClick={() => {
              navigate('/cart');
              setNav(false);
            }}
          >
            Sepet
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
