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

    // Handle seat click
    const toggleSeat = (seatId) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.id === seatId
                    ? { ...seat, status: seat.status === 'available' ? 'taken' : 'available' }
                    : seat
            )
        );
        console.log(seatId);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Select Seats for {movie.title}</h1>
            <p>{selectedDate} at {selectedTime}</p>

            {/* Screen representation */}
            <div className="flex items-center justify-center mb-4">
                <div className="mb-10 bg-gray-400 w-full h-6 flex items-center justify-center">
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
                >
                    Confirm Seats
                </button>
            </div>
        </div>
    );
}
