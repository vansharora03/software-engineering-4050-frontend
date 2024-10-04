"use client";
/** This component renders the NavBar
 **/
import { useEffect, useState } from "react";
import movies from "../resources/movies.json"

export default function NavBar() {
    const handleSearchClick = () => {
        const searchField = document.querySelector(".searchField")
        const dropdown = document.querySelector(".moviesDropdown")
        searchField.style.display = searchField.style.display === 'none' ? 'block' : 'none';
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';

    }
    const [searchInput, setSearchInput] = useState("")
    const [displayedMovies, setDisplayedMovies] = useState([])


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
        <a className="navbutton" href="/404">Bookings</a>
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