"use client";
import React, { useEffect, useState } from "react";
import withAuth from "@/components/authGuard";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/v1/bookings/get", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const tempBookings = [];
        const result = await response.json();
        for (let i = 0; i < result.bookings.length; i++) {
          const bookingId = result.bookings[i].id;
          const response = await fetch(
            `http://127.0.0.1:8000/v1/bookings/${bookingId}/tickets`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );
          const tickets_result = await response.json();
          const tickets = tickets_result.tickets;
          tempBookings.push({ id: bookingId, tickets: tickets });
        }
        console.log(tempBookings);
        setBookings(tempBookings);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 bg-gray-900 font-sans text-gray-200">
      <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">
        Your Bookings
      </h1>
      <ul className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 bg-gray-800 shadow-md rounded-lg border border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-300 mb-4">
              Booking ID: {booking.id}
            </h2>
            <ul className="space-y-4">
              {booking.tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="p-3 bg-gray-700 rounded-md border border-gray-600"
                >
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-100">Movie:</span>{" "}
                    {ticket.showtime.movie.title}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-100">Time:</span>{" "}
                    {new Intl.DateTimeFormat("en-GW", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(ticket.showtime.time))}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-100">Type:</span>{" "}
                    {ticket.ticket_type.name}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-100">Seat:</span>{" "}
                    {ticket.seat_number}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default withAuth(BookingsPage);
