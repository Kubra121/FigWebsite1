import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const PrivateRoute = ({ children, role }) => {
  const { session } = UserAuth();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkRole = async () => {
      // session yüklenene kadar bekle
      if (session === undefined) return;

      // session yok → signup
      if (!session) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // role varsa kontrol et
      if (role) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          if (data.role !== role) {
            if (mounted) {
              setAllowed(false);
              setLoading(false);
            }
            return;
          }
        } catch (err) {
          console.error(err);
          if (mounted) {
            setAllowed(false);
            setLoading(false);
          }
          return;
        }
      }

      // role uygun
      if (mounted) {
        setAllowed(true);
        setLoading(false);
      }
    };

    checkRole();
    return () => (mounted = false);
  }, [session, role]);

  if (loading) return <p className='p-4 mt-16'>Yükleniyor...</p>;

  if (!session) {
    return <Navigate to='/register' replace state={{ from: location }} />;
  }

  if (!allowed) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserAuth } from '../contexts/AuthContext';
// import { supabase } from '../supabaseClient'; // supabase client'ını import et

// const PrivateRoute = ({ children, role }) => {
//   const { session } = UserAuth();
//   const navigate = useNavigate();
//   const [allow, setAllow] = useState(false);

//   useEffect(() => {
//     if (session === undefined) return; // Loading

//     if (!session) {
//       navigate('/register'); // Login değilse register
//       return;
//     }

//     const fetchUserRole = async () => {
//       // profiles tablosundan role çek
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', session.user.id) // genelde id aynı oluyor
//         .single();

//       if (error) {
//         console.error('Profile fetch error:', error);
//         navigate('/');
//         return;
//       }

//       const userRole = data?.role;

//       if (role) {
//         if (!userRole || userRole !== role) {
//           navigate('/'); // rol uyuşmuyorsa ana sayfa
//           return;
//         }
//       }

//       setAllow(true); // rol uygunsa erişime izin
//     };

//     fetchUserRole();
//   }, [session, role, navigate]);

//   if (session === undefined) return <p className='p-4 mt-16'>Yükleniyor...</p>;
//   if (!allow) return <p>Redirecting...</p>;

//   return <>{children}</>;
// };

// export default PrivateRoute;
