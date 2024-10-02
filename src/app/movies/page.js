import MovieCard from "@/components/MovieCard";

const movie1 = {
    id: 1,
    title: "Dhoom 2",
    trailer: "https://www.youtube.com/embed/oRIIeyIa6nE?si=2x9VP1D0Hn5UE-33"
}

export default function Movies() {
    return (
        <MovieCard movie={movie1}></MovieCard>
    )
}