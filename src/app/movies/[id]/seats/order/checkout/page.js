'use client';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { movies } from "@/lib/movieData";
import { useState, useEffect } from 'react';
import { useSelectedSeats } from '@/context/selectedSeatsContext';

export default function CheckoutPage() {
    const router = useRouter();
    const { selectedSeats } = useSelectedSeats();
    const params = useParams();
    const searchParams = useSearchParams();
    const selectedDate = searchParams.get('date');
    const selectedTime = searchParams.get('time');
    const seats = searchParams.get('seats').split(',');
    const id = params.id;
    const movie = movies.find((movie) => movie.id === parseInt(id));

    const [totalPrice, setTotalPrice] = useState(0);
    const childPrice = 8.00;
    const adultPrice = 12.00;
    const seniorPrice = 10.00;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [paymentInfo, setPaymentInfo] = useState('');

    const [childCount] = useState(parseInt(searchParams.get('childCount')) || 0);
    const [adultCount] = useState(parseInt(searchParams.get('adultCount')) || 0);
    const [seniorCount] = useState(parseInt(searchParams.get('seniorCount')) || 0);

    useEffect(() => {
        const total = (childPrice * childCount) + (adultPrice * adultCount) + (seniorPrice * seniorCount);
        setTotalPrice(total);
    }, [childCount, adultCount, seniorCount]);

    const handleConfirmCheckout = (e) => {
        e.preventDefault();
        router.push('/confirmation');
    };

    const handleCancelCheckout = () => {
        router.push(`/movies/${id}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="mb-6 text-blue-400">{selectedDate} at {selectedTime}</p>

            <h2 className="text-2xl font-bold text-white-800 mb-4">Selected Seats:</h2>
            <ul className="mb-4 text-lg text-white-800">
                {seats.map((seatId) => (
                    <li key={seatId}>Seat {seatId}</li>
                ))}
            </ul>

            <div className="mb-4 text-lg font-bold text-blue-600">
                {childCount > 0 && (
                    <p>Child Tickets: {childCount} x ${childPrice.toFixed(2)}</p>
                )}
                {adultCount > 0 && (
                    <p>Adult Tickets: {adultCount} x ${adultPrice.toFixed(2)}</p>
                )}
                {seniorCount > 0 && (
                    <p>Senior Tickets: {seniorCount} x ${seniorPrice.toFixed(2)}</p>
                )}
                <p className="mt-4 text-lg font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
            </div>

            <form onSubmit={handleConfirmCheckout} className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Payment Info:</label>
                    <input
                        type="text"
                        value={paymentInfo}
                        onChange={(e) => setPaymentInfo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Card Number"
                        required
                    />
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
                    >
                        Confirm Checkout
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelCheckout}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
