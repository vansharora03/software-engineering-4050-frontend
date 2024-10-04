import MovieCard from "@/components/MovieCard";
import MovieCarousel from "@/components/MovieCarousel";
import movies from "../../resources/movies.json"






export default function Movies() {
    return (
        <>
        <MovieCarousel type={"Currently Showing"} movies={movies}></MovieCarousel>
        <MovieCarousel type={"Coming Soon"} movies={movies}></MovieCarousel>
        </>
    )
}