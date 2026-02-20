import { useEffect, useState } from 'react';
import CarouselUser from './user/CarouselUser';
import AdminCarousel from './admin/AdminCarousel';
import HomePageProducts from './HomePageProducts';
import { fetchUserRole } from '../services/fetchUserRole';

const HomePage = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      const role = await fetchUserRole();
      setUserRole(role);
    };
    getRole();
  }, []);

  return (
    <div className='p-4'>
      {/* 👁️ User görür */}
      {(userRole === 'user' || !userRole) && (
        <div className='mt-6'>
          <CarouselUser />
        </div>
      )}

      {/* 🔐 SADECE ADMIN */}
      {userRole === 'admin' && (
        <div className='mt-6'>
          <AdminCarousel />
        </div>
      )}

      <HomePageProducts />
    </div>
  );
};

export default HomePage;
