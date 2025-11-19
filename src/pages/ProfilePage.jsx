import { UserAuth } from '../contexts/AuthContext';
import UserProfile from './user/UserProfilePage';
import AdminProfile from './admin/AdminProfilePage';

const ProfilePage = () => {
  const { userProfile } = UserAuth();

  if (!userProfile) return <p>Loading...</p>;

  return userProfile.role === 'admin' ? <AdminProfile /> : <UserProfile />;
};

export default ProfilePage;
