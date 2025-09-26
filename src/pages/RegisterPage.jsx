import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const { session, signUpNewUser } = UserAuth();

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password, firstName, lastName);
      if (result.success) {
        navigate('/');
      } else if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occured');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp} className='max-w-md m-auto pt-24'>
        <h2 className='font-bold pb-2'>Sign up today!</h2>
        <p>
          Already have an account? <Link to='/login'>Sign in!</Link>
        </p>
        <div className='flex flex-col py-4'>
          <input
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
            className='p-3 mt-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600'
            type='text'
          />
          <input
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
            className='p-3 mt-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600'
            type='text'
          />
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
            Sign Up
          </button>
          {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
        </div>
      </form>

      {error && (
        <div className='mt-4 p-2 border border-red-500 bg-red-100 text-red-600'>
          {error}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
