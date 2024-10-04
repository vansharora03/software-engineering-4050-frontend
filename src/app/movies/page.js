import MovieCard from "@/components/MovieCard";
import { movies } from "@/lib/movieData";
import Link from 'next/link';
export default function Movies() {
    return (
        <div>
            {movies.map((movie) => (
                <div key={movie.id}>
                    <Link href={`/movies/${movie.id}`}/>
                    <a>
                        <MovieCard movie={movie} ></MovieCard>
                    </a>
                </div>
            ))}
        </div>
    )
}