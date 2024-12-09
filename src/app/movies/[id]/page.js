'use client';
import { useParams, useRouter } from 'next/navigation'; // For dynamic route params
import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns'; // For date formatting
import {utcToZonedTime, zonedTimeToUtc} from 'date-fns-tz';

export default function MovieInfo() {
    const router = useRouter();
    const params = useParams(); // Get the dynamic route param
    const id = params.id; // Extract the `id` from the URL
    const [movie, setMovie] = useState({});
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        const getMovie = async () => {
            const response = await fetch(`http://127.0.0.1:8000/v1/movies/${id}`);
            const result = await response.json();
            setMovie(result.movie);
        };

        const getShowtimes = async () => {
            const response = await fetch(`http://127.0.0.1:8000/v1/movies/${id}/showtimes`);
            const result = await response.json();
            setShowtimes(result.showtimes);
        };

        getMovie();
        getShowtimes();
    }, [id]);

    // Calculate available dates
    const availableDates = Array.from({ length: 7 }, (_, index) => {
        const date = addDays(new Date(), index);
        return format(date, 'EEE MMM d'); // Format: "Thu Oct 10"
    });

    const availableTimes = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

    // Handle case when movie is not found
    if (Object.keys(movie).length === 0) {
        return <div>Movie not found</div>;
    }

    // Toggle the selected date
    const toggleDate = (date) => {
        if (selectedDate === date) {
            setSelectedDate(''); // If the date is already selected, unselect it
            setSelectedTime(''); // Reset the time when the date is unselected
        } else {
            setSelectedDate(date); // Otherwise, select the date
        }
    };

    // Toggle the selected time
    const toggleTime = (time) => {
        if (selectedDate === '') {
            return; // Don't allow selecting a time without a date
        }

        // Check if the time is available for the selected date
        if (isTimeAvailable(time)) {
            setSelectedTime(selectedTime === time ? '' : time); // Toggle the time
        }
    };

    // Handle the "Select Seats" button click
    const handleSelectSeats = () => {
        if (!selectedDate || !selectedTime) {
            return; // Don't proceed if either date or time is not selected
        }

        // Find the showtime that matches the selected date and time
        const selectedShowtime = showtimes.find(showtime => {
            const showtimeDate = format(new Date(showtime.time), 'EEE MMM d');
            const showtimeTime = new Date(showtime.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });

            // Create a date object for the selected date and time
            const selectedDateTime = new Date(`${selectedDate} ${selectedTime} UTC`);
            const selectedTimeFormatted = selectedDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });

            return showtimeDate === selectedDate && showtimeTime === selectedTimeFormatted && showtime.showroom;
        });

        if (selectedShowtime) {
            localStorage.setItem('selectedShowtimeId', selectedShowtime.id);
            const queryParams = new URLSearchParams({
                date: selectedDate,
                time: selectedTime
            }).toString();

            router.push(`/movies/${id}/seats?${queryParams}`);
        }
    };

    // Check if the time is available for the selected date
    const isTimeAvailable = (time) => {
        if (!selectedDate) {
            return false; // Don't allow time selection if no date is selected
        }

        return showtimes.some(showtime => {
            const showtimeDate = format(new Date(showtime.time), 'EEE MMM d');
            const showtimeTime = new Date(showtime.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });

            const selectedDateTimeUTC = new Date(`${selectedDate} ${time} UTC`);
            const selectedTimeFormatted = selectedDateTimeUTC.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });

            return showtimeDate === selectedDate && showtimeTime === selectedTimeFormatted && showtime.showroom;
        });
    };

    // Check if the date has showtimes available
    const isDateAvailable = (date) => {
        return showtimes.some(showtime => {
            const showtimeDate = format(new Date(showtime.time), 'EEE MMM d');
            return showtimeDate === date && showtime.showroom; // Check if showroom exists
        });
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
                        disabled={!isDateAvailable(date)} // Disable date if no showtimes available for the date
                        className={`px-3 py-2 rounded ${selectedDate === date ? 'bg-blue-500' : 'bg-gray-500'} text-white ${!isDateAvailable(date) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        disabled={!selectedDate || !isTimeAvailable(time)} // Disable if no date is selected or time is not available
                        className={`px-3 py-2 rounded ${selectedTime === time ? 'bg-blue-500' : 'bg-gray-500'} text-white ${(!selectedDate || !isTimeAvailable(time)) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
