"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/components/authGuard";

function ManageShowtimes() {
  const [name, setName] = useState("");
  const [showtimeDate, setShowtimeDate] = useState("");
  const [showtime, setShowtime] = useState("");
  const [showroom, setShowroom] = useState("");
  const [movie, setMovie] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/v1/movies", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch movies");
        }
        const result = await response.json();
        const movies = result.movies;
        const tempMovies = [];
        for (let i = 0; i < movies.length; i++) {
          tempMovies.push(movies[i].title);
        }
        setMovieList(tempMovies);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchMovies();
  }, []);

  const formatDate = (date, time) => {
    const dateParts = date.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `${year}-${month}-${day} ${time}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError(null);

    const data = {
      movie, time: formatDate(showtimeDate, showtime), showroom, duration: 180,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/v1/showtimes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to add showtime");
        return;
      }

      const result = await response.json();
      alert(`Showtime added successfully`);
      router.push("/admin");
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) { 
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6 text-white-800">
          Add Showtime
        </h1>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4 text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
<div className="p-6 min-h-screen">
  <h1 className="text-3xl font-bold text-center mb-6 text-white-800">
    Add Showtime
  </h1>
  <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
    <form onSubmit={handleSubmit}>
      {/* Movie Dropdown */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-semibold mb-2"
          htmlFor="movie"
        >
          Select Movie
        </label>
        <select
          id="movie"
          value={movie? movie : ""}
          onChange={(e) => setMovie(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-black"
          required
        >
          <option value="" disabled>
            Choose a movie
          </option>
          {movieList.map((movie) => (
            <option key={movie.id} value={movie}>
              {movie}
            </option>
          ))}
        </select>
      </div>

    {/* Showroom Name */}
    <div className="mb-4">
        <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="showroom"
        >
            Showroom Name
        </label>
        <input
            type="text"
            id="showroom"
            value={showroom? showroom : ""}
            onChange={(e) => setShowroom(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
            required
        />
    </div>

      {/* Showtime Date */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1 text-black">
          Showtime Date
        </label>
        <input
          type="date"
          name="release_date"
          className="w-full p-2 border rounded text-black"
          required
          onChange={(e) => setShowtimeDate(e.target.value)}
        />
      </div>

      {/* Showtime Dropdown */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-semibold mb-2"
          htmlFor="showtime"
        >
          Select Showtime
        </label>
        <select
          id="showtime"
          value={showtime? showtime : ""}
          onChange={(e) => setShowtime(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-black"
          required
        >
          <option value="" disabled>
            Choose a showtime
          </option>
          <option value="12:00:00">12:00 PM</option>
          <option value="15:00:00">3:00 PM</option>
          <option value="18:00:00">6:00 PM</option>
          <option value="21:00:00">9:00 PM</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* Submit Button */}
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
export default withAuth(ManageShowtimes);
