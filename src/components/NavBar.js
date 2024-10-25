"use client";
/** This component renders the NavBar **/
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState("");
    const [displayedMovies, setDisplayedMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('http://127.0.0.1:8000/v1/movies');
            const result = await response.json();
            setMovies(result.movies);
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        if (searchInput === "") {
            setDisplayedMovies([]);
        } else {
            setDisplayedMovies(movies.filter(movie => 
                movie.title.toLowerCase().includes(searchInput.toLowerCase())
            ));
        }
    }, [searchInput, movies]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        // !! converts a value to a boolean so if token exists !!token evaluates to true
        setIsLoggedIn(!!token);
    }, []);

    const handleSearchClick = () => {
        const searchField = document.querySelector(".searchField");
        const dropdown = document.querySelector(".moviesDropdown");
        searchField.style.display = searchField.style.display === 'none' ? 'block' : 'none';
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    };

    const handleLogout = () => {
        // take out token from local storage
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <div className="navbar">
            <div className="buttonRow">
                <a className="navbutton" href="/">Home</a>
                <a className="navbutton" href="/booking">Bookings</a>
                <a className="navbutton" onClick={handleSearchClick}>Search</a>
                {isLoggedIn ? (
                    <a className="navbutton" href="/profile">Profile</a>
                ) : (
                    <a className="navbutton" href="/login">Login</a>
                )}
            </div>
            <input 
                type="text" 
                className="searchField" 
                placeholder="Begin typing movie title..." 
                onChange={e => setSearchInput(e.target.value)}
            />
            <div className="moviesDropdown">
                {displayedMovies.map(m => (
                    <a key={m.id} href={`/movies/${m.id}`}>
                        <div className="moviesDropdownItem">{m.title}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
