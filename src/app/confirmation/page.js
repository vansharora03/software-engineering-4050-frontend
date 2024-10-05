'use client'
import {useRouter} from 'next/navigation'
export default function OrderConfirmation() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
            <p className="mt-4 text-lg">
                Thank you for your purchase! Your order has been successfully confirmed.
            </p>
            <p className="mt-4 text-lg">
                An email with your order summary, including seat details, showtime, and payment information, has been sent to your provided email address.
            </p>
            <p className="mt-4 text-lg">
                Please arrive at least 15 minutes before the scheduled showtime. Enjoy the movie!
            </p>
            <button 
                className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                onClick={() => router.push('/')}
            >
                Return to Home
            </button>
        </div>
    );
}
