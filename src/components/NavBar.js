"use client";
/** This component renders the NavBar
 **/
export default function NavBar() {
    const handleSearchClick = () => {
        const searchField = document.querySelector(".searchField")
        searchField.style.display = searchField.style.display === 'none' ? 'block' : 'none';
    }
    return (
    <div className="navbar">
        <div className="buttonRow">
        <a className="navbutton" href="/404">Bookings</a>
        <a className="navbutton" onClick={handleSearchClick}>Search</a>
        <a className="navbutton" href="/login">Login</a>
        </div>
        <input type="text" className="searchField" placeholder="Begin typing movie title..."></input>
    </div>
    )
}