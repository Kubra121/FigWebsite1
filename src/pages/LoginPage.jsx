import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const { session, signInUser } = UserAuth();

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      setError('An error occured');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn} className='max-w-md m-auto pt-24'>
        <h2 className='font-bold pb-2'>Sign in</h2>
        <p>
          Don't have an account? <Link to='/register'>Sign up!</Link>
        </p>
        <div className='flex flex-col py-4'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className='p-3 mt-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600'
            type='email'
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            className='p-3 mt-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600'
            type='password'
          />
          <button
            type='submit'
            disabled={loading}
            className='mt-4 w-full bg-[#04310a] text-white py-2 rounded-full hover:bg-[#06531c] transition-colors duration-300 ease-in-out cursor-pointer'
          >
            Sign In
          </button>
          {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
