"use client";
import MovieCard from "./MovieCard";
import { useState } from "react";

export default function MovieCarousel({ type, movies, carouselWidth = 4 }) {
  const [currentRow, setCurrentRow] = useState(0);

  const totalRows = Math.ceil(movies.length / carouselWidth);

  const handleLeftArrowClick = () => {
    if (currentRow > 0) {
      setCurrentRow(currentRow - 1);
    }
  };

  const handleRightArrowClick = () => {
    if (currentRow < totalRows - 1) {
      setCurrentRow(currentRow + 1);
    }
  };

  // Get the movies for the current row
  const getCurrentRowMovies = () => {
    const startIndex = currentRow * carouselWidth;
    const endIndex = startIndex + carouselWidth;
    return movies.slice(startIndex, endIndex);
  };

  return (
    <div className="movieCarousel">
      <h1>{type}</h1>
      <div className="movies">
        <div
          className={`arrow left-arrow ${currentRow === 0 ? "disabled" : ""}`}
          onClick={handleLeftArrowClick}
        >
          &#10094;
        </div>
        {getCurrentRowMovies().map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
        <div
          className={`arrow right-arrow ${
            currentRow === totalRows - 1 ? "disabled" : ""
          }`}
          onClick={handleRightArrowClick}
        >
          &#10095;
        </div>
      </div>
    </div>
  );
}
