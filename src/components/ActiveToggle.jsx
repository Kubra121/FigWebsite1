import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ActiveToggle = ({ productId, isActive, onChange }) => {
  const [active, setActive] = useState(false);

  // Başlangıçta Supabase değerini al
  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const handleToggle = async () => {
    const newStatus = !active;
    setActive(newStatus);

    // Supabase güncellemesi
    const { error } = await supabase
      .from('products') // tablonun adı
      .update({ is_active: newStatus })
      .eq('id', productId);

    if (error) {
      console.error('Supabase update error:', error);
      // Hata olursa toggle geri al
      setActive(!newStatus);
    } else if (onChange) {
      onChange(newStatus); // parent component’e durumu bildir
    }
  };

  return (
    <label className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={active}
          onChange={handleToggle}
          className='sr-only'
        />
        {/* Arka plan */}
        <div
          className={`block h-3.5 w-7 rounded-full transition-colors duration-300 ${
            active ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        ></div>
        {/* Daire */}
        <div
          className={`dot absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            active ? 'translate-x-3' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ActiveToggle;
