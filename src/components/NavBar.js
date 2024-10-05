"use client";
/** This component renders the NavBar
 **/
import { useEffect, useState } from "react";

export default function NavBar() {
    const handleSearchClick = () => {
        const searchField = document.querySelector(".searchField")
        const dropdown = document.querySelector(".moviesDropdown")
        searchField.style.display = searchField.style.display === 'none' ? 'block' : 'none';
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';

    }
    const [searchInput, setSearchInput] = useState("")
    const [displayedMovies, setDisplayedMovies] = useState([])
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('http://127.0.0.1:8000/v1/movies')
            const result = await response.json()
            setMovies(result.movies)
        }
        fetchMovies()
    }, [])

    useEffect(() => {
        if (searchInput === "") {
            setDisplayedMovies([])
        } else {
            setDisplayedMovies(movies.filter(movie => movie.title.toLowerCase().includes(searchInput.toLowerCase())))
        }
    }, [searchInput])
    return (
    <div className="navbar">
        <div className="buttonRow">
        <a className="navbutton" href="/">Home</a>
        <a className="navbutton" href="/booking">Bookings</a>
        <a className="navbutton" onClick={handleSearchClick}>Search</a>
        <a className="navbutton" href="/login">Login</a>
        </div>
        <input type="text" className="searchField" placeholder="Begin typing movie title..." onChange={e => setSearchInput(e.target.value)}></input>
        <div className="moviesDropdown">
            {displayedMovies.map(m => <a href={`/movies/${m.id}`}><div className="moviesDropdownItem">{m.title}</div></a>)}
        </div>
    </div>
    )
}