import { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart as addToCartApi,
  increaseCartItem,
  decreaseCartItem,
  removeCartItem,
} from "../api/CartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingCost, setShippingCost] = useState("")


  /* =====================================================
   ADD PRODUCT TO CART
===================================================== */
  const addToCart = async ({ productId, quantity = 1 }) => {
    try {
      // call backend
      await addToCartApi({
        product_id: productId,
        quantity,
      });

      // refresh cart after add
      await fetchCart();

      return { success: true };
    } catch (err) {
      console.error("Add to cart failed", err);

      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to add product",
      };
    }
  };

  /* =====================================================
     FETCH CART FROM BACKEND
  ===================================================== */
  const fetchCart = async () => {
    try {
      const res = await getCart();


      if (res?.success && res.data?.items) {
        // transform backend → frontend format
        setShippingCost(res.data?.shipping || 0);

        const formattedItems = res.data.items.map((item) => ({
          productId:
            item.product_id?._id || item.product_id,
          name: item.product_id?.name || "Product",
          price: item.product_id?.price,
          quantity: item.quantity,
          image:
            item.product_id?.images?.[0]?.secure_url ||
            "https://placehold.co/100x100",
        }));

        setCartItems(formattedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* =====================================================
     INCREMENT QUANTITY (Optimistic + API)
  ===================================================== */
  const incrementQty = async (productId) => {
    // optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    try {
      await increaseCartItem(productId);
    } catch (err) {
      console.error("Increase failed → reverting");
      fetchCart(); // revert if failed
    }
  };

  /* =====================================================
     DECREMENT QUANTITY
  ===================================================== */
  const decrementQty = async (productId) => {
    // optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    try {
      await decreaseCartItem(productId);
    } catch (err) {
      console.error("Decrease failed → reverting");
      fetchCart();
    }
  };

  /* =====================================================
     REMOVE ITEM
  ===================================================== */
  const removeFromCart = async (productId) => {
    // optimistic update
    setCartItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );

    try {
      await removeCartItem(productId);
    } catch (err) {
      console.error("Remove failed → reverting");
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        shippingCost,
        loading,
        addToCart,
        fetchCart,
        incrementQty,
        decrementQty,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);