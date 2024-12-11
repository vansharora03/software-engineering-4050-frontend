"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelectedSeats } from "@/context/selectedSeatsContext";
import withAuth from "@/components/authGuard";
import { set } from "date-fns";

function CheckoutPage() {
  const router = useRouter();
  const { selectedSeats } = useSelectedSeats();
  const params = useParams();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");
  const seats = searchParams.get("seats").split(",");
  const id = params.id;
  const [movie, setMovie] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [childCount, setChildCount] = useState(
    parseInt(searchParams.get("childCount")) || 0
  );
  const [adultCount, setAdultCount] = useState(
    parseInt(searchParams.get("adultCount")) || 0
  );
  const [seniorCount, setSeniorCount] = useState(
    parseInt(searchParams.get("seniorCount")) || 0
  );

  // States for payment information
  const [cardHolderName, setCardHolderName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentCards, setPaymentCards] = useState([]); // State to store payment cards
  const [selectedCard, setSelectedCard] = useState(""); // State to store selected card
  const [isAddingCard, setIsAddingCard] = useState(false); // State to track if adding new card
  const [paymentCardId, setPaymentCardId] = useState(0);
  const [bookingId, setBookingId] = useState(0);
  const childPrice = 8.0;
  const adultPrice = 12.0;
  const seniorPrice = 10.0;

  useEffect(() => {
    const getMovie = async () => {
      const response = await fetch(`http://127.0.0.1:8000/v1/movies/${id}`);
      const result = await response.json();
      setMovie(result.movie);
    };
    getMovie();
  }, [id]);

  useEffect(() => {
    if (paymentCardId === 0) {
      return;
    }
    const createBooking = async () => {
      const response = await fetch("http://127.0.0.1:8000/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          showtime: localStorage.getItem("selectedShowtimeId"),
          card: paymentCardId,
        }),
      });

      const data = await response.json();
      console.log("Booking Response:", data);
      if (response.ok) {
        console.log("Booking ID:", data.booking.id);
        setBookingId(data.booking.id); // Set the booking ID
      } else {
        alert("Failed to create booking. Please try again.");
      }
    };
    createBooking();
  }, [paymentCardId]);

  useEffect(() => {
    const fetchPaymentCards = async () => {
      const response = await fetch("http://127.0.0.1:8000/v1/payment-cards", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
        },
      });
      const data = await response.json();
      console.log("Fetched Payment Cards:", data); // Log the response data

      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setPaymentCards(data); // Set the user's payment cards
      } else {
        console.error("Expected an array, but got:", data); // Log if the format is unexpected
        setPaymentCards([]); // Fallback to an empty array
      }
    };
    fetchPaymentCards();
  }, []);

  useEffect(() => {
    const total =
      childPrice * childCount +
      adultPrice * adultCount +
      seniorPrice * seniorCount;
    setTotalPrice(total);
  }, []);

  useEffect(() => {
    if (bookingId === 0) {
      return;
    }
    const addTickets = async () => {
      console.log("bookingId", bookingId);
      let tempChildCount = childCount;
      let tempAdultCount = adultCount;
      let tempSeniorCount = seniorCount;
      for (let i = 0; i < seats.length; i++) {
        let ticketTypeId = 1;
        if (tempChildCount > 0) {
          tempChildCount--;
        } else if (tempAdultCount > 0) {
          tempAdultCount--;
          ticketTypeId = 2;
        } else if (tempSeniorCount > 0) {
          tempSeniorCount--;
          ticketTypeId = 3;
        }

        const response = await fetch(`http://127.0.0.1:8000/v1/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            booking: bookingId,
            seat_number: seats[i],
            ticket_type: ticketTypeId,
            showtime: localStorage.getItem("selectedShowtimeId"),
          }),
        });
      }
      const emailResponse = await fetch(
        "http://127.0.0.1:8000/send_order_email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
          }),
        }
      );

      const emailData = await emailResponse.json();
      console.log("Email Response:", emailData);
      if (!emailResponse.ok) {
        alert("Failed to send order confirmation email. Please try again.");
      }
    };
    addTickets();
  }, [bookingId]);

  const handleConfirmCheckout = async (e) => {
    e.preventDefault();
    // You can send the selected card information to the backend here
    if (isAddingCard) {
      const response = await fetch(
        "http://127.0.0.1:8000/v1/payment-cards/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            cardholder_name: cardHolderName,
            card_number: cardNumber,
            expiry_date: expiry,
            billing_address: billingAddress,
            last_four_digits: cardNumber.slice(-4),
          }),
        }
      );
      const data = await response.json();
      console.log("Added Payment Card:", data); // Log the response data
      if (response.ok) {
        setPaymentCards([...paymentCards, data]); // Add the new card to the list of cards
        setPaymentCardId(data.id); // Select the newly added card
        setIsAddingCard(false); // Hide the new card form
      } else {
        alert("Failed to add payment card. Please try again.");
      }
    } else if (selectedCard) {
      setPaymentCardId(selectedCard);
    } else {
      alert("Please select or add a payment card.");
    }
    console.log("paymentCardId", paymentCardId);

    router.push("/confirmation");
  };

  const handleCancelCheckout = () => {
    router.push(`/movies/${id}`);
  };

  const handleCardSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedCard(value);
    if (value === "add_card") {
      setIsAddingCard(true); // Show new card input fields
    } else {
      setIsAddingCard(false); // Hide new card input fields
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="mb-6 text-blue-400">
        {selectedDate} at {selectedTime}
      </p>

      <h2 className="text-2xl font-bold text-white-800 mb-4">
        Selected Seats:
      </h2>
      <ul className="mb-4 text-lg text-white-800">
        {seats.map((seatId) => (
          <li key={seatId}>Seat {seatId}</li>
        ))}
      </ul>

      <div className="mb-4 text-lg font-bold text-blue-600">
        {childCount > 0 && (
          <p>
            Child Tickets: {childCount} x ${childPrice.toFixed(2)}
          </p>
        )}
        {adultCount > 0 && (
          <p>
            Adult Tickets: {adultCount} x ${adultPrice.toFixed(2)}
          </p>
        )}
        {seniorCount > 0 && (
          <p>
            Senior Tickets: {seniorCount} x ${seniorPrice.toFixed(2)}
          </p>
        )}
        <p className="mt-4 text-lg font-bold">
          Total Price: ${totalPrice.toFixed(2)}
        </p>
      </div>

      <form
        onSubmit={handleConfirmCheckout}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
      >
        {/* Payment Cards Selection */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Select Payment Card:
          </label>
          <select
            value={selectedCard}
            onChange={handleCardSelectionChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select a card</option>
            {paymentCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.cardholder_name} ending in {card.last_four_digits}
              </option>
            ))}
            <option value="add_card">Add New Card</option>
          </select>
        </div>

        {/* Add Card Form */}
        {isAddingCard && (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Cardholder Name:
              </label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Card Number:
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Card Number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="YYYY-MM-DD"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Billing Address:
              </label>
              <input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Billing Address"
                required
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
            onClick={handleConfirmCheckout}
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

export default withAuth(CheckoutPage);
