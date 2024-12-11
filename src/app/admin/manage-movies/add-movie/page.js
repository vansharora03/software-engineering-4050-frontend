"use client";
import React, { useState } from "react";
import withAuth from "@/components/authGuard";
function CreateMovieForm() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/v1/create-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create movie");
        return;
      }

      const result = await response.json();
      setSuccessMessage(
        `Movie \"${result.movie.title}\" created successfully!`
      );
      setFormData({
        title: "",
        description: "",
        trailer_link: "",
        img_link: "",
        duration: "",
        release_date: "",
      });
    } catch (error) {
      console.error("Error creating movie:", error);
      setErrorMessage("An error occurred while creating the movie.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Create Movie
        </h1>
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
            <label className="block text-sm font-medium mb-1 text-black">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Trailer Link
            </label>
            <input
              type="url"
              name="trailer_link"
              value={formData.trailer_link}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Image Link
            </label>
            <input
              type="url"
              name="img_link"
              value={formData.img_link}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Release Date
            </label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Create Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateMovieForm);
