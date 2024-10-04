import MovieCard from "@/components/MovieCard";
import MovieCarousel from "@/components/MovieCarousel";

const movie1 = {
    id: 1,
    title: "Dhoom 2",
    trailer: "https://www.youtube.com/embed/oRIIeyIa6nE?si=2x9VP1D0Hn5UE-33"
};

const movie2 = {
    id: 2,
    title: "Inception",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0"
};

const movie3 = {
    id: 3,
    title: "The Dark Knight",
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY"
};

const movie4 = {
    id: 4,
    title: "Interstellar",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E"
};

const movie5 = {
    id: 5,
    title: "The Shawshank Redemption",
    trailer: "https://www.youtube.com/embed/6hB3S9bIaco"
};

const movie6 = {
    id: 6,
    title: "Parasite",
    trailer: "https://www.youtube.com/embed/5xH0HfJHsaY?si=2vsYfzxtr6_dc3g8"
};

// Array of movies
const movies = [movie1, movie2, movie3, movie4, movie5, movie6];


export default function Movies() {
    return (
        <>
        <MovieCarousel type={"Currently Showing"} movies={movies}></MovieCarousel>
        <MovieCarousel type={"Coming Soon"} movies={movies}></MovieCarousel>
        </>
    )
}