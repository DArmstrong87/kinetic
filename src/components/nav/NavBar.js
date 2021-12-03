import React from "react"
import { Link, useHistory } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const history = useHistory()
    return (<>
        <h1>KINETIC</h1>
        <ul className="navbar">
            <li className="navbar__item active">
                <Link className="navbar__link" to="/home">Home</Link>
            </li>
            <li className="navbar__item active">
                <Link className="navbar__link" to="/myevents">Event Calendar</Link>
            </li>
            <li className="navbar__item active">
                <Link className="navbar__link" to="/events">Events</Link>
            </li>
            <li className="navbar__item active">
                <Link className="navbar__link" to="/profile">Profile</Link>
            </li>
            <li className="navbar__item active">
                <button className="nav-link fakeLink"
                    onClick={() => {
                        localStorage.removeItem("kinetic_token")
                        history.push({ pathname: "/" })
                    }}
                >Logout</button>
            </li>
        </ul>
    </>)
}