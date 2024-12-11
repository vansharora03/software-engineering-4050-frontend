"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelectedSeats } from "@/context/selectedSeatsContext";
import { useRouter } from "next/navigation";

export default function SelectSeats() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id; // Get the showroom ID from the URL parameters
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");
  const [showroom, setShowroom] = useState({});

  // Fetch showroom details when the component mounts
  useEffect(() => {
    const getShowroom = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/v1/showrooms/${id}`
        );
        if (response.ok) {
          const result = await response.json();
          setShowroom(result.showroom);
        } else {
          console.error("Failed to fetch showroom data");
        }
      } catch (error) {
        console.error("Error fetching showroom data:", error);
      }
    };
    getShowroom();
  }, [id]);

  const initialSeatMap = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    status: "available",
  }));
  const { selectedSeats, setSelectedSeats } = useSelectedSeats();
  const [seats, setSeats] = useState(initialSeatMap);

  // Fetch seat availability
  useEffect(() => {
    const seatAvailability = async () => {
      const tempSeats = [...seats];
      for (let i = 0; i < tempSeats.length; i++) {
        const response = await fetch(
          `http://127.0.0.1:8000/v1/showtimes/${localStorage.getItem(
            "selectedShowtimeId"
          )}/seats/${tempSeats[i].id}`
        );
        const result = await response.json();
        if (!result.available) {
          tempSeats[i].status = "red";
        }
      }
      setSeats(tempSeats);
      setSelectedSeats([]);
    };

    seatAvailability();
  }, [seats, setSelectedSeats]);

  // Toggle seat selection
  const toggleSeat = (seatId) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          if (seat.status === "red") {
            return seat;
          }
          const newStatus = seat.status === "available" ? "taken" : "available";
          if (newStatus === "taken") {
            setSelectedSeats((prev) => [...new Set([...prev, seatId])]);
          } else {
            setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
          }
          return { ...seat, status: newStatus };
        }
        return seat;
      })
    );
  };

  // Confirm selected seats
  const confirmSeats = () => {
    if (selectedSeats.length > 0) {
      const orderUrl = `/movies/${id}/seats/order`;
      const queryParams = new URLSearchParams({
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats.join(","),
      }).toString();
      router.push(`${orderUrl}?${queryParams}`);
    } else {
      alert("Please select at least one seat to confirm.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Select Seats for {showroom.name}</h1>
      <p>Seat Count: {showroom.seat_count}</p>
      <p>
        {selectedDate} at {selectedTime}
      </p>

      <div className="flex items-center justify-center mb-4">
        <div className="mt-10 mb-10 bg-gray-400 w-1/2 h-6 flex items-center justify-center">
          <span className="text-white font-bold">SCREEN</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
        {seats.map((seat) => (
          <div
            key={seat.id}
            onClick={() => toggleSeat(seat.id)}
            className={`w-full h-20 flex items-center justify-center cursor-pointer 
                        ${
                          seat.status === "available"
                            ? "bg-green-500"
                            : seat.status === "red"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
          >
            {seat.id}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-2 text-white rounded"
          style={{ backgroundColor: "#4c7c92" }}
          onClick={confirmSeats}
          disabled={selectedSeats.length === 0}
        >
          Confirm Seats
        </button>
      </div>
    </div>
  );
}
