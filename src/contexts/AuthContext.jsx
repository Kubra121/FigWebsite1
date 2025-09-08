import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  //Sign Up
  const signUpNewUser = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Email ve parola zorunludur.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Parola en az 6 karakter olmalıdır.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      const msg = error.message || JSON.stringify(error);

      if (
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('user already registered')
      ) {
        return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' };
      }

      return { success: false, error: msg };
    }

    return { success: true, data };
  };

  //Sign In
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign in error occured: ', error);
        return { success: false, error: error.message };
      }
      console.log('Sign in success: ', data); //!!!sil sonra
      return { success: true, data };
    } catch (error) {
      console.error('An error occured: ', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  //Sign out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error('There was a problem signing up: ', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signInUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
