"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "@/components/authGuard";
function EditMovieForm() {
  const params = useParams(); // Get the dynamic route param
  const movieId = params.id; // Extract the `id` from the URL
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trailer_link: "",
    img_link: "",
    duration: "",
    release_date: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!movieId) return;

    async function fetchMovie() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/v1/movies/${movieId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const data = await response.json();
        console.log(data); // Log the response to verify the structure
        const movie = data.movie || {}; // Ensure you're accessing the movie object

        // Format the release date to YYYY-MM-DD
        const formattedReleaseDate = movie.release_date
          ? movie.release_date.split("T")[0] // Get the date part (YYYY-MM-DD)
          : "";

        setFormData({
          title: movie.title || "",
          description: movie.description || "",
          trailer_link: movie.trailer_link || "",
          img_link: movie.img_link || "",
          duration: movie.duration || "",
          release_date: formattedReleaseDate || "",
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setErrorMessage("Failed to load movie details.");
      }
    }
    fetchMovie();
  }, [movieId]); // Ensure movieId is used as a dependency

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/v1/update-movie/${movieId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to update movie");
        return;
      }

      const result = await response.json();
      setSuccessMessage(`Movie "${result.movie.title}" updated successfully!`);
      setTimeout(() => router.push("/movies"), 1000);
    } catch (error) {
      console.error("Error updating movie:", error);
      setErrorMessage("An error occurred while updating the movie.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Movie</h1>
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Trailer Link
            </label>
            <input
              type="url"
              name="trailer_link"
              value={formData.trailer_link || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image Link</label>
            <input
              type="url"
              name="img_link"
              value={""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Release Date
            </label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Update Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditMovieForm);
