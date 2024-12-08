"use client";
/** This component renders the NavBar
 **/
import { useEffect, useState } from "react";
import { movies } from "@/lib/movieData";

export default function NavBar() {
    const [isSignedIn, setIsSignedIn] = useState(false); // Tracks if the user is signed in
    const [searchInput, setSearchInput] = useState("");
    const [displayedMovies, setDisplayedMovies] = useState([]);

    // Handle Search Toggle
    const handleSearchClick = () => {
        const searchField = document.querySelector(".searchField");
        const dropdown = document.querySelector(".moviesDropdown");
        searchField.style.display = searchField.style.display === "none" ? "block" : "none";
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    };

    // Simulate Signing In and Signing Out
    const handleSignIn = () => setIsSignedIn(true);
    const handleSignOut = () => setIsSignedIn(false);

    // Filter Movies Based on Search Input
    useEffect(() => {
        if (searchInput === "") {
            setDisplayedMovies([]);
        } else {
            setDisplayedMovies(movies.filter((movie) =>
                movie.title.toLowerCase().includes(searchInput.toLowerCase())
            ));
        }
    }, [searchInput]);

    return (
        <div className="navbar">
            <div className="buttonRow">
                <a className="navbutton" href="/">Home</a>
                <a className="navbutton" href="/booking">Bookings</a>
                <a className="navbutton" onClick={handleSearchClick}>Search</a>
                {!isSignedIn ? (
                    <a className="navbutton" href="/login" onClick={handleSignIn}>Login</a>
                ) : (
                    <>
                        <a className="navbutton" onClick={handleSignOut}>Sign Out</a>
                    </>
                )}
            </div>
            <input
                type="text"
                className="searchField"
                placeholder="Begin typing movie title..."
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ display: "none" }} // Hidden by default
            />
            <div className="moviesDropdown" style={{ display: "none" }}>
                {displayedMovies.map((m) => (
                    <a key={m.id} href={`/movies/${m.id}`}>
                        <div className="moviesDropdownItem">{m.title}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
