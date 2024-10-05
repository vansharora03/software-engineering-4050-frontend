'use client'
import { createContext, useContext, useState } from 'react';

// Create a context for selected seats
const SelectedSeatsContext = createContext();

// Provider component to wrap your application
export const SelectedSeatsProvider = ({ children }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    return (
        <SelectedSeatsContext.Provider value={{ selectedSeats, setSelectedSeats }}>
            {children}
        </SelectedSeatsContext.Provider>
    );
};

// Custom hook to use the context
export const useSelectedSeats = () => {
    return useContext(SelectedSeatsContext);
};
