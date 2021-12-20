import React from "react"
import { Link, useHistory } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const [protocol, domain] = window.location.href.split("//")
    const [, path] = domain.split("/")

    const history = useHistory()
    return (<>
        <div className="kinetic-header">
            <h1 className="kinetic">KINETIC</h1>
            <div className="welcome-logout">
                <div>
                    Welcome, {localStorage.getItem("kinetic_username")}!
                </div>
                <button className="logout"
                    onClick={() => {
                        localStorage.removeItem("kinetic_token")
                        localStorage.removeItem("kinetic_username")
                        localStorage.removeItem("is_athlete")
                        history.push({ pathname: "/" })
                    }}
                >Logout</button>
            </div>
        </div>

        {path !== "" ?
            <ul className="navbar">
                <li className="navbar__item">
                    <Link className="navbar__link" to="/">Home</Link>
                </li>
                <li className="navbar__item">
                    <Link className="navbar__link" to="/myevents">Event Calendar</Link>
                </li>
                <li className="navbar__item">
                    <Link className="navbar__link" to="/events">Events</Link>
                </li>
                {localStorage.getItem("is_athlete") === "true" ?
                    <>
                        <li className="navbar__item">
                            <Link className="navbar__link" to="/activities">Activities</Link>
                        </li>
                        <li className="navbar__item">
                            <Link className="navbar__link" to="/profile">Profile</Link>
                        </li>
                    </>
                    : ""}
            </ul>
            : ""}
    </>)
}