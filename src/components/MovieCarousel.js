"use client";
import MovieCard from "./MovieCard";
import { useState } from "react";
export default function MovieCarousel({type, movies, carouselWidth=4}) {
    const [start, setStart] = useState(0)
    function wrapAroundSlice(arr, start, end) {
        const length = arr.length;
        if (length === 0) return []; 
    
        start = ((start % length) + length) % length; 
        end = ((end % length) + length) % length; 
    
        if (start < end) {
            return arr.slice(start, end);
        } else {
            return arr.slice(start).concat(arr.slice(0, end));
        }
    }
    const handleLeftArrowClick =  () => {
        setStart((start - 1) % movies.length)
    }
    const handleRightArrowClick =  () => {
        setStart((start + 1) % movies.length)
    }
    return (
        <div className="movieCarousel">
            <h1>{type}</h1>
            <div className="movies">
            <div class="arrow left-arrow" onClick={handleLeftArrowClick}>&#10094;</div>
            {wrapAroundSlice(movies, start, start + carouselWidth).map(movie => {
                return <MovieCard movie={movie}></MovieCard>
            })}
            <div class="arrow right-arrow" onClick={handleRightArrowClick}>&#10095;</div>
            </div>
        </div>
    )
}