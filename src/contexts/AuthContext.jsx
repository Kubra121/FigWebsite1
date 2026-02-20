import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [userProfile, setUserProfile] = useState(null);

  // -------------------- SIGN UP --------------------
  const signUpNewUser = async (
    email,
    password,
    firstName = '',
    lastName = '',
  ) => {
    if (!email || !password)
      return { success: false, error: 'Email ve parola zorunludur.' };
    if (password.length < 6)
      return { success: false, error: 'Parola en az 6 karakter olmalıdır.' };

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      const msg = error.message || JSON.stringify(error);
      if (msg.toLowerCase().includes('already registered')) {
        return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' };
      }
      return { success: false, error: msg };
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'user', // signup olan herkesin default rolü user
        },
      ]);

      if (profileError)
        console.error('Profil oluşturulamadı:', profileError.message);
    }

    return { success: true, data };
  };

  // -------------------- SIGN IN --------------------
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { success: false, error: error.message };

      // Profile tablosundan kullanıcı bilgilerini al
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      if (profileError) return { success: false, error: profileError.message };
      setUserProfile(profileData);

      return { success: true, data: { ...data, profile: profileData } };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Unexpected error' };
    }
  };

  // -------------------- SESSION --------------------
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profileError) setUserProfile(profileData);
      }
    };

    fetchSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session?.user?.id) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error) setUserProfile(data);
            });
        } else {
          setUserProfile(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------- SIGN OUT --------------------
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);

    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, userProfile, signUpNewUser, signInUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
