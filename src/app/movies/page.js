"use client";
import MovieCard from "@/components/MovieCard";
import { useState, useEffect } from "react";
import MovieCarousel from "@/components/MovieCarousel";
// import {movies}  from "@/lib/movieData";
import Link from 'next/link';
export default function Movies() {
    const [movies, setMovies] = useState([])
    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('http://127.0.0.1:8000/v1/movies')
            const result = await response.json()
            setMovies(result.movies)
        }
        fetchMovies()
    }, [])
    return (
        <div>
            <MovieCarousel type={"Currently Showing"} movies={movies}></MovieCarousel>
            <MovieCarousel type={"Coming Soon"} movies={movies}></MovieCarousel>
        </div>
    )
}