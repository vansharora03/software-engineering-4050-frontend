import MovieCard from "@/components/MovieCard";
import MovieCarousel from "@/components/MovieCarousel";
import {movies}  from "@/lib/movieData";
import Link from 'next/link';
export default function Movies() {
    return (
        <div>
            <MovieCarousel type={"Currently Showing"} movies={movies}></MovieCarousel>
            <MovieCarousel type={"Currently Showing"} movies={movies}></MovieCarousel>
        </div>
    )
}