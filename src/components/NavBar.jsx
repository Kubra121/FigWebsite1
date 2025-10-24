import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

// -------------------- Tek Menü Linki --------------------
const NavLink = ({ name, onClick, className = '' }) => (
  <li className={`p-4 cursor-pointer ${className}`} onClick={onClick}>
    {name}
  </li>
);

// -------------------- Auth Butonları --------------------
const AuthButtons = ({ session, isAdmin, navigate, handleLogOut }) => {
  if (!session) {
    return (
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
      </>
    );
  }

  return (
    <>
      {!isAdmin && <CartButton navigate={navigate} />}
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
  );
};

// -------------------- Sepet Butonu --------------------
const CartButton = ({ navigate }) => (
  <button
    aria-label='Sepet'
    onClick={() => navigate('/user/cart')}
    className='relative p-2 hover:text-[#04310a]'
  >
    <FaShoppingCart size={24} className='cursor-pointer' />
  </button>
);

// -------------------- Mobil Menü --------------------
const MobileMenu = ({
  navOpen,
  toggleNav,
  commonLinks,
  authLinks,
  session,
  isAdmin,
  navigate,
}) => {
  const renderLink = (link, index) => (
    <NavLink
      key={index}
      name={link.name}
      onClick={() => {
        if (link.action) link.action();
        toggleNav();
      }}
      className={link.className || ''}
    />
  );

  return (
    <div
      className={`fixed top-0 left-0 w-[75%] h-full border-r border-r-gray-900 bg-[#ffffff] z-40 ease-in-out duration-500 ${
        navOpen ? 'left-0' : 'left-[-100%]'
      }`}
    >
      <h1 className='w-full text-3xl font-bold text-[#04310a] m-4'>FIG</h1>
      <ul className='pt-12 uppercase p-4 space-y-2'>
        {commonLinks.map((link, i) =>
          renderLink({ name: link.name, action: () => navigate(link.path) }, i)
        )}
        {authLinks.map((link, i) => renderLink(link, i + commonLinks.length))}
        {session &&
          !isAdmin &&
          renderLink(
            { name: 'Sepet', action: () => navigate('/user/cart') },
            commonLinks.length + authLinks.length
          )}
      </ul>
    </div>
  );
};

// -------------------- Ana NavBar --------------------
const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { session, signOut, userProfile } = UserAuth();
  const navigate = useNavigate();

  const isAdmin = userProfile?.role === 'admin';
  const toggleNav = () => setNavOpen(!navOpen);

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setNavOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const commonLinks = [
    { name: 'Ürünler', path: '/products' },
    { name: 'İletişim', path: '/contact' },
  ];

  const authLinks = !session
    ? [
        { name: 'Üye Girişi', action: () => navigate('/login') },
        { name: 'Üye Ol', action: () => navigate('/register') },
      ]
    : [
        { name: session.user.email },
        { name: 'Çıkış Yap', action: handleLogOut, className: 'text-red-600' },
      ];

  return (
    <div className='mt-12 flex justify-between items-center h-24 max-w-[1800px] mx-auto px-4 text-black'>
      <h1
        className='w-full text-3xl font-bold text-[#04310a] cursor-pointer'
        onClick={() => navigate('/')}
      >
        FIG
      </h1>

      {/* Masaüstü Menü */}
      <ul className='hidden md:flex items-center space-x-2'>
        {commonLinks.map((link, i) => (
          <li
            key={i}
            className='p-4 cursor-pointer'
            onClick={() => navigate(link.path)}
          >
            {link.name}
          </li>
        ))}
      </ul>

      <div className='hidden md:flex items-center justify-center space-x-6 w-96'>
        <AuthButtons
          session={session}
          isAdmin={isAdmin}
          navigate={navigate}
          handleLogOut={handleLogOut}
        />
      </div>

      {/* Mobil Menü Aç/Kapa */}
      <div onClick={toggleNav} className='block md:hidden z-50 cursor-pointer'>
        {navOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </div>

      {/* Mobil Menü */}
      <MobileMenu
        navOpen={navOpen}
        toggleNav={toggleNav}
        commonLinks={commonLinks}
        authLinks={authLinks}
        session={session}
        isAdmin={isAdmin}
        navigate={navigate}
      />
    </div>
  );
};

export default NavBar;
