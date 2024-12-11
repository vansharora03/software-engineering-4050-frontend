"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/components/authGuard";

function ManageShowrooms() {
  const [name, setName] = useState("");
  const [seatCount, setSeatCount] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError(null);

    const data = {
      name,
      seat_count: 20,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/v1/add-showroom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to add showroom");
        return;
      }

      const result = await response.json();
      alert(`Showroom added successfully: ${result.showroom.name}`);
      router.push("/admin/manage-showrooms");
    } catch (error) {
      setError("Error adding showroom. Please try again later.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-white-800">
        Add Showroom
      </h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Showroom Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
              placeholder="Enter showroom name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="seatCount"
            >
              Seat Count
            </label>
            <input
              type="number"
              id="seatCount"
              value={20}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
              placeholder="Seat count is 20"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600">
              <p>{error}</p>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-500 text-white p-3 rounded-lg text-xl hover:bg-green-600 transition duration-300"
            >
              Add Showroom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(ManageShowrooms);
