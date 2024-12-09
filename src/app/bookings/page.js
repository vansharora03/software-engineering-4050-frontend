"use client";
import React, { useEffect, useState } from 'react';
import withAuth from '@/components/authGuard';


const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/v1/bookings/get', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem("token")}`
                    }}
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const tempBookings = [];
                const result = await response.json();
                for (let i = 0; i < result.bookings.length; i++) {
                    const booking = result.bookings[i];
                    tempBookings.push({id: booking.id});
                }
                console.log(tempBookings)
                setBookings(tempBookings);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [])



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Your Bookings</h1>
            <ul>
                {bookings.map(booking => (
                    <li key={booking.id}>{booking.id}</li>
                ))}
            </ul>
        </div>
    );
};

export default withAuth(BookingsPage);