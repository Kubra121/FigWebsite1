// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setProfile(null);
          setLoadingProfile(false);
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(data);
      } catch (err) {
        setError(err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loadingProfile, error, setProfile };
};
