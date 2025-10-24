import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient'; // supabase client'ını import et

const PrivateRoute = ({ children, role }) => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    if (session === undefined) return; // Loading

    if (!session) {
      navigate('/register'); // Login değilse register
      return;
    }

    const fetchUserRole = async () => {
      // profiles tablosundan role çek
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id) // genelde id aynı oluyor
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        navigate('/');
        return;
      }

      const userRole = data?.role;

      if (role) {
        if (!userRole || userRole !== role) {
          navigate('/'); // rol uyuşmuyorsa ana sayfa
          return;
        }
      }

      setAllow(true); // rol uygunsa erişime izin
    };

    fetchUserRole();
  }, [session, role, navigate]);

  if (session === undefined) return <p>Loading...</p>;
  if (!allow) return <p>Redirecting...</p>;

  return <>{children}</>;
};

export default PrivateRoute;
