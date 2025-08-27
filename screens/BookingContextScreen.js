// BookingContext.js
import React, { createContext, useContext, useState } from "react";

// Create Context
const BookingContext = createContext();

// Provider Component
export const BookingProvider = ({ children }) => {
  const initialBookingState = {
    eventType: "",
    eventDateTime: "",
    eventLocation: "",
    furniture: null,
    utensils: null,
    decoration: null,
    cartItems: [], // Each item: { id, name, price, quantity, image }

    // Track if categories have been visited
    visitedFurniture: false,
    visitedUtensils: false,
    visitedDecoration: false,
  };

  const [booking, setBooking] = useState(initialBookingState);

  /** ✅ Update multiple booking fields including visited flags */
  const updateBooking = (updates) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  /** ✅ Add item to cart (increment quantity if exists) */
  const addToCart = (newItem) => {
    const itemWithQuantity = {
      ...newItem,
      quantity: newItem.quantity ?? 1, // fallback to 1 if undefined
    };

    setBooking((prev) => {
      const existingItemIndex = prev.cartItems.findIndex(
        (item) => item.id === itemWithQuantity.id
      );

      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = [...prev.cartItems];
        updatedCart[existingItemIndex].quantity += itemWithQuantity.quantity;
      } else {
        updatedCart = [...prev.cartItems, itemWithQuantity];
      }

      return { ...prev, cartItems: updatedCart };
    });
  };

  /** ✅ Remove item from cart */
  const removeFromCart = (itemId) => {
    setBooking((prev) => ({
      ...prev,
      cartItems: prev.cartItems.filter((item) => item.id !== itemId),
    }));
  };

  /** ✅ Update quantity of an item in cart */
  const updateCartQuantity = (itemId, quantity) => {
    setBooking((prev) => {
      const updatedCart = prev.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return { ...prev, cartItems: updatedCart };
    });
  };

  /** ✅ Reset booking to initial state (e.g., after successful booking) */
  const resetBooking = () => {
    setBooking(initialBookingState);
  };

  /** ✅ Check if booking is complete (all three categories selected) */
  const isBookingComplete = () =>
    booking.furniture && booking.utensils && booking.decoration;

  /** ✅ Check if all categories have been visited */
  const allVisited =
    booking.visitedFurniture &&
    booking.visitedUtensils &&
    booking.visitedDecoration;

  return (
    <BookingContext.Provider
      value={{
        booking,
        updateBooking,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        resetBooking,
        isBookingComplete,
        allVisited,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// ✅ Custom hook to use booking context safely
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
