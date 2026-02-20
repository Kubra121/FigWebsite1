import { createContext, useContext, useState, useEffect } from 'react';

const ShoppingCartContext = createContext({});

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }) {
  // 📝 LocalStorage'dan sepeti başlat
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 📝 cartItems değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    const normalized = cartItems.map((item) => {
      const id =
        typeof item.id === 'object'
          ? item.id.id
          : item.id ?? item.product_id?.id;

      const price =
        item.price ??
        item.product_id?.price ??
        (typeof item.id === 'object' ? item.id.price : null) ??
        0;

      return {
        id: id,
        quantity: item.quantity ?? 1,
        price: price,
      };
    });

    // Eğer normalize edilmiş halleri değiştiyse kaydet
    if (JSON.stringify(normalized) !== JSON.stringify(cartItems)) {
      setCartItems(normalized);
    }
  }, []);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function getItemQuantity(id) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseItemQuantity(id) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseItemQuantity(id) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  function addToCart(product) {
    const id = product.id ?? product.product_id?.id;
    const price = product.price ?? product.product_id?.price;

    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.id === id);

      if (existingItem) {
        return currItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currItems, { id, price, quantity: 1 }];
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        addToCart,
        getItemQuantity,
        increaseItemQuantity,
        decreaseItemQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
