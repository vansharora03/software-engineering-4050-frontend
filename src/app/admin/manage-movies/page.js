
"use client";
import React, { useState, useEffect } from 'react';

export default function ManageMovies() {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        if (localStorage.getItem("token") !== "2df46f907c53c66c1220a0da60e64527da9f3519") {
            redirect("/movies")
        }
    })
    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('http://127.0.0.1:8000/v1/movies');
            const result = await response.json();
            setMovies(result.movies);
        };
        fetchMovies();
    }, []);

    const handleEditMovie = (id) => {
        // Navigate to movie editing screen
        console.log(`Edit movie with ID: ${id}`);
    };


    return (
        <div className="manage-movies p-4">
            <h1 className="text-2xl font-bold">Manage Movies</h1>
            <ul className="movies-list mt-4">
                {movies.map(movie => (
                    <li key={movie.id} className="flex justify-between my-2">
                        <span>{movie.title}</span>
                        <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={() => handleEditMovie(movie.id)}
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
