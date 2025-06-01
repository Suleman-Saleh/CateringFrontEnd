import React, { createContext, useContext, useState } from 'react';

// Create Context
const BookingContext = createContext();

// Provider Component
export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    eventType: '',
    eventDateTime: '',
    eventLocation: null,
    furniture: null,
    utensils: null,
    decoration: null,
    cartItems: [], // Each item: { id, name, price, quantity, image }

    // Track if categories have been visited
    visitedFurniture: false,
    visitedUtensils: false,
    visitedDecoration: false,
  });

  // Update multiple booking fields including visited flags
  const updateBooking = (updates) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  // Add item to cart (increment quantity if exists)
  const addToCart = (item, quantity) => {
    setBooking((prev) => {
      const existingIndex = prev.cartItems.findIndex(ci => ci.id === item.id);
      let newCart;
      if (existingIndex !== -1) {
        newCart = [...prev.cartItems];
        const existingItem = newCart[existingIndex];
        newCart[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
      } else {
        newCart = [...prev.cartItems, { ...item, quantity }];
      }
      return { ...prev, cartItems: newCart };
    });
  };

  // Check if booking is complete (all three categories selected)
  const isBookingComplete = () =>
    booking.furniture && booking.utensils && booking.decoration;

  // Check if all categories have been visited once
  const allVisited = booking.visitedFurniture && booking.visitedUtensils && booking.visitedDecoration;

  return (
    <BookingContext.Provider
      value={{
        booking,
        updateBooking,
        addToCart,
        isBookingComplete,
        allVisited,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use booking context safely
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
