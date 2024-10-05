'use client';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { movies } from "@/lib/movieData";
import { useState, useEffect } from 'react';
import { useSelectedSeats } from '@/context/selectedSeatsContext';

export default function SelectAges() {
    const router = useRouter();
    const { selectedSeats } = useSelectedSeats();
    const [childCount, setChildCount] = useState(0);
    const [adultCount, setAdultCount] = useState(0);
    const [seniorCount, setSeniorCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const params = useParams();
    const searchParams = useSearchParams();
    const selectedDate = searchParams.get('date');
    const selectedTime = searchParams.get('time');
    const id = params.id;
    const movie = movies.find((movie) => movie.id === parseInt(id)); // Find the movie by `id`

    const childPrice = 8.00;
    const adultPrice = 12.00;
    const seniorPrice = 10.00;

    useEffect(() => {
        const total = (childPrice * childCount) + (adultPrice * adultCount) + (seniorPrice * seniorCount);
        setTotalPrice(total);
    }, [childCount,adultCount,seniorCount])

    useEffect(() => {
        setChildCount(0);
        setAdultCount(0);
        setSeniorCount(0);
    }, [selectedSeats]);

    const totalSelectedSeats = selectedSeats.length;
    const totalSelectedTickets = childCount + adultCount + seniorCount;
    const isButtonDisabled = totalSelectedSeats === 0 || totalSelectedTickets !== totalSelectedSeats;

    const incrementCount = (setCount) => {
        if (totalSelectedSeats > (childCount + adultCount + seniorCount)) {
            setCount(prev => prev + 1);
        }
    };

    const decrementCount = (setCount) => {
        setCount(prev => Math.max(prev - 1, 0));
    };

    const continueToCheckout = () => {
        if (selectedSeats.length > 0) {
            const orderUrl = `/movies/${id}/seats/order`;
            const queryParams = new URLSearchParams({
                date: selectedDate,
                time: selectedTime,
                seats: selectedSeats.join(','),
                childCount: childCount,
                adultCount: adultCount,
                seniorCount: seniorCount
            }).toString();
    
            router.push(`${orderUrl}/checkout?${queryParams}`);
        } else {
            alert('Please select at least one seat to confirm.');
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <p className='mb-6 text-blue-400'>{selectedDate} at {selectedTime}</p>
            <h2 className="text-2xl font-bold text-white-800 mb-6">Selected Seats:</h2>
            <ul className="mb-6 text-white-800 text-lg">
                {selectedSeats.map((seatId) => (
                    <li key={seatId}>Seat {seatId}</li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold text-white-800 mb-6">Select Age for Tickets</h2>
            <div className="flex flex-col items-center my-4 bg-white rounded-lg shadow-lg p-6">
                {[
                    { label: 'Child', count: childCount, setCount: setChildCount, price: childPrice},
                    { label: 'Adult', count: adultCount, setCount: setAdultCount, price: adultPrice},
                    { label: 'Senior', count: seniorCount, setCount: setSeniorCount, price: seniorPrice},
                ].map(({ label, count, setCount }) => (
                    <div key={label} className="mb-6 flex items-center justify-between w-full max-w-xs">
                        <p className="mr-4 text-lg font-medium">{label}:</p>
                        <div className="flex items-center">
                            <button 
                                onClick={() => incrementCount(setCount)} 
                                className="bg-gray-400 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-500 transition duration-200 mr-2">
                                +
                            </button>
                            <span className="text-lg font-bold">{count}</span>
                            <button 
                                onClick={() => decrementCount(setCount)} 
                                className="bg-gray-400 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-500 transition duration-200 ml-2">
                                -
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-white-800 text-lg">
                <p>Total Selected Tickets: <span className="font-bold">{totalSelectedTickets}</span></p>
                {totalSelectedSeats > 0 && totalSelectedTickets > totalSelectedSeats && (
                    <p className="text-red-300">Total tickets selected cannot exceed the number of seats!</p>
                )}
            </div>
            <div className="mt-4 text-lg font-bold text-blue-600">
                <p>Total Price: ${totalPrice.toFixed(2)}</p>
            </div>
            <button
                onClick={() => continueToCheckout()}
                disabled={isButtonDisabled}
                className={`mt-6 px-6 py-2 rounded-lg text-white transition duration-200 ${
                    !isButtonDisabled
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                Continue to Checkout
            </button>
        </div>
    );
}
