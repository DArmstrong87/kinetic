import React from "react"
import "./Home.css"
import { Link } from "react-router-dom"

export const Home = () => {

    return (
        <><article className="home">
            <h2 className="h">Welcome to Kinetic!</h2>
            <h4 className="h">Sign up for races, train and be better than yesterday!</h4>

            <section className="home-section">
                <div className="train">
                    <h1 className="kinetic">Train</h1>
                    <Link className="train-item" to="/vo2max">
                        <div>VO2max</div></Link>
                    <Link className="train-item" to="/race-simulator">
                        <div>Race Simulator</div></Link>
                    <Link className="train-item" to="/profile">
                        <div>Profile</div></Link>
                </div>
                <div className="race">
                    <h1 className="kinetic">Race</h1>
                    <Link className="race-item" to="/myevents">
                        <div>Event Calendar</div></Link>
                    <Link className="race-item" to="/events">
                        <div>All Events</div></Link>
                </div>
            </section>
        </article>
        </>
    )
}