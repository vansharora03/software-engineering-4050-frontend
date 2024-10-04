'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { movies } from "@/lib/movieData";
import { useState } from 'react';
import { useSelectedSeats } from '@/context/selectedSeatsContext';

export default function SelectAges() {
    const {selectedSeats} = useSelectedSeats();
    return (
        <div>
            <h2>Selected Seats:</h2>
            <ul>
                {selectedSeats.map((seatId) => (
                    <li key={seatId}>Seat {seatId}</li>
                ))}
            </ul>
        </div>
    );
}