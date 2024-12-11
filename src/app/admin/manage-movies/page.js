"use client";
import React, { useState, useEffect } from "react";
import withAuth from "@/components/authGuard";
import { useRouter } from "next/navigation";

function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (
      localStorage.getItem("token") !==
      "2f2250ae1519456de4a6506d1a6172e41313b642"
    ) {
      router.push("/movies");
    }
  }, [router]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch("http://127.0.0.1:8000/v1/movies");
      const result = await response.json();
      setMovies(result.movies);
    };
    fetchMovies();
  }, []);

  const handleEditMovie = (id) => {
    // Navigate to movie editing screen
    router.push(`/admin/manage-movies/edit-movie/${id}`);
  };

  const handleDeleteMovie = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/v1/delete-movie/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete movie");
        return;
      }

      const result = await response.json();
      if (result.success) {
        // Re-fetch the movies list after deletion
        const updatedResponse = await fetch("http://127.0.0.1:8000/v1/movies");
        const updatedResult = await updatedResponse.json();
        setMovies(updatedResult.movies);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleNextPage = () => {
    router.push("/admin/manage-movies/add-movie");
  };

  return (
    <div className="manage-movies p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-white-800">
        Manage Movies
      </h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <ul className="movies-list space-y-4">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300"
            >
              <span className="text-lg font-semibold text-gray-700">
                {movie.title}
              </span>
              <div className="flex space-x-4">
                <button
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                  onClick={() => handleEditMovie(movie.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                  onClick={() => handleDeleteMovie(movie.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <button
            className="bg-green-500 text-white p-3 rounded-full text-xl hover:bg-green-600 transition duration-300"
            onClick={() => handleNextPage()}
          >
            Add Movie
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ManageMovies);
