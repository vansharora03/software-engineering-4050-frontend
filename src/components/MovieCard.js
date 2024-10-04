export default function MovieCard({movie}) {
    return (
        <div className="movieCard" id={`movie-${movie.id}`}>
            <h2 className="movieCardTitle" id={`movie-${movie.id}-title`}>{movie.title}</h2>
            <iframe className="movieCardtTrailer" id={`movie-${movie.id}-video`} src={movie.trailer}></iframe>
            <a href={`/movies/${movie.id}`} id={`movie-${movie.id}-link`}>
            <button className="movieCardBookButton">View</button>
            </a>
        </div>
    )
}