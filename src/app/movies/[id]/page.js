'use client';
import { useParams, useRouter } from 'next/navigation'; // For dynamic route params
import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns'; // For date formatting

export default function MovieInfo() {
    const router = useRouter();
    const params = useParams(); // Get the dynamic route param
    const id = params.id; // Extract the `id` from the URL
    const [movie, setMovie] = useState({})
    useEffect(() => {
        const getMovie = async () => {
            const response = await fetch(`http://127.0.0.1:8000/v1/movies/${id}`)
            const result = await response.json()
            setMovie(result.movie)
        }
        getMovie()
    })
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Calculate available dates
    const availableDates = Array.from({ length: 7 }, (_, index) => {
        const date = addDays(new Date(), index);
        return format(date, 'EEE MMM d'); // Format: "Thu Oct 10"
    });

    const availableTimes = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];


    // Handle case when movie is not found
    if (movie == {}) {
        return <div>Movie not found</div>;
    }

    const toggleDate = (date) => {
        setSelectedDate(selectedDate === date ? '' : date);
        if (selectedDate === date) {
            setSelectedTime(''); // Reset selected time when date is unselected
        }
    };

    const toggleTime = (time) => {
        setSelectedTime(selectedTime === time ? '' : time);
    };


    const handleSelectSeats = () => {
        // Go to the seats page 
        const queryParams = new URLSearchParams({
            date: selectedDate,
            time: selectedTime
        }).toString();

        router.push(`/movies/${id}/seats?${queryParams}`);
    };
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{movie.title}</h1>

            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-4">
                    <p className="mt-2">{movie.description}</p>
                    
                </div>

                <div className="md:w-1/2 my-4">
                    <iframe
                        className="w-full h-64 md:h-96"
                        src={movie.trailer_link}
                        title={`${movie.title} trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <h2 className="text-xl font-semibold mt-4">Buy Tickets</h2>

            <div className="flex gap-2 my-4">
                {availableDates.map((date) => (
                    <button
                        key={date}
                        onClick={() => toggleDate(date)}
                        className={`px-3 py-2 rounded ${selectedDate === date ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        {date}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 my-4">
                {availableTimes.map((time) => (
                    <button
                        key={time}
                        onClick={() => toggleTime(time)}
                        disabled={!selectedDate} // Disable if no date is selected
                        className={`px-3 py-2 rounded ${selectedTime === time ? 'bg-blue-500' : 'bg-gray-500'} text-white ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            {selectedDate && selectedTime && (
                <div className="mt-4">
                    <p>You selected {selectedDate} at {selectedTime}</p>
                    <button onClick={handleSelectSeats} className="mt-2 px-6 py-2 bg-green-500 text-white rounded cursor-pointer">
                        Select Seats
                    </button>
                </div>
            )}
        </div>
    );
}
