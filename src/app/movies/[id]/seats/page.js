'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { movies } from "@/lib/movieData";
import { useState } from 'react';

export default function SelectSeats() {
    const params = useParams(); // Dynamic route param
    const searchParams = useSearchParams(); // Query parameters
    const id = params.id; // Movie ID from the URL
    const selectedDate = searchParams.get('date'); // Extract 'date' from the query string
    const selectedTime = searchParams.get('time'); // Extract 'time' from the query string
    const movie = movies.find((movie) => movie.id === parseInt(id)); // Find the movie by `id`

    // Initialize the seat map with 20 available seats
    const initialSeatMap = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, status: 'available' }));
    const [seats, setSeats] = useState(initialSeatMap); // Use React state to manage seat status
    const [selectedSeats, setSelectedSeats] = useState([]); // State to track selected seat IDs

    // Handle seat click
    const toggleSeat = (seatId) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) => {
                if (seat.id === seatId) {
                    const newStatus = seat.status === 'available' ? 'taken' : 'available';
                    // Update selected seats based on new status
                    if (newStatus === 'taken') {
                        // Add to selected
                        setSelectedSeats((prev) => [...new Set([...prev, seatId])]);
                    } else {
                        // Remove from selected
                        setSelectedSeats((prev) => prev.filter(id => id !== seatId));
                    }
                    return { ...seat, status: newStatus };
                }
                return seat;
            })
        );
        console.log(seatId)
    };

    // Handle confirm seats click
    const confirmSeats = () => {
        if (selectedSeats.length > 0) {
            // Save or use the selected seats as needed
            console.log('# of seats selected:', selectedSeats.length)
            console.log('Seats purchased:', selectedSeats);
            // Here you can redirect to another page or pass the data
        } else {
            console.log('Please select at least one seat to confirm.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Select Seats for {movie.title}</h1>
            <p>{selectedDate} at {selectedTime}</p>

            {/* Screen representation */}
            <div className="flex items-center justify-center mb-4">
                <div className="mt-10 mb-10 bg-gray-400 w-1/2 h-6 flex items-center justify-center">
                    <span className="text-white font-bold">SCREEN</span>
                </div>
            </div>

            {/* Seat selection grid */}
            <div className="grid grid-cols-5 gap-4 max-w-md mx-auto"> 
                {seats.map((seat) => (
                    <div
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id)}
                        className={`w-full h-20 flex items-center justify-center cursor-pointer 
                        ${seat.status === 'available' ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                        {seat.id}
                    </div>
                ))}
            </div>

            {/* Button to confirm seat selection */}
            <div className="flex justify-center mt-4"> {/* Centering the button */}
                <button 
                    className="px-6 py-2 text-white rounded" 
                    style={{ backgroundColor: '#4c7c92' }} // Applying the background color
                    onClick={confirmSeats} // Handle button click
                    disabled={selectedSeats.length === 0} // Disable if no seats are selected
                >
                    Confirm Seats
                </button>
            </div>
        </div>
    );
}
