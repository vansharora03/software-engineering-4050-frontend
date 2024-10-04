'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { movies } from "@/lib/movieData";
export default function SelectSeats() {
    const params = useParams(); // Dynamic route param
    const searchParams = useSearchParams(); // Query parameters
    const id = params.id; // Movie ID from the URL
    const selectedDate = searchParams.get('date'); // Extract 'date' from the query string
    const selectedTime = searchParams.get('time'); // Extract 'time' from the query string
    const movie = movies.find((movie) => movie.id === parseInt(id)); // Find the movie by `id`
    console.log(`Date is: ${selectedDate}`)
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Select Seats for {movie.title}</h1>
            <p>{selectedDate} at {selectedTime}</p>

            {/* Seat selection grid goes here */}
            <div className="mt-4">
                <p>Seat selection grid will go here.</p>
            </div>

            {/* Button to confirm seat selection */}
            <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded">
                Confirm Seats
            </button>
        </div>
    );
}
