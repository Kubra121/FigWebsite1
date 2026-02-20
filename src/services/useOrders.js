// src/hooks/useOrders.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error: ordersError } = await supabase
          .from('orders')
          .select(
            `
            id,
            order_no,
            total_amount,
            status,
            shipping_address,
            created_at,
            order_items (
              product_id,
              quantity,
              price
            )
          `
          )
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(data);
      } catch (err) {
        setError(err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return { orders, loadingOrders, error, setOrders };
};
