import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAthleteEvents } from "./EventCalendarProvider";

export const EventCalendar = () => {
    const [athleteEvents, setEvents] = useState([])

    useEffect(
        () => {
            getAthleteEvents().then(ae => setEvents(ae))
        }, []
    )

    return (
        <>
            <h1>My Upcoming Events</h1>
            <h3>
                {athleteEvents ?
                    `${athleteEvents[0]?.event.days_until} days til ${athleteEvents[0]?.event.name}!`
                    :
                    "Events you sign up for will display here!"}
            </h3>

            <table>
                <thead>
                    <tr>
                        <td>Event</td>
                        <td>Date</td>
                        <td>Start Time</td>
                        <td>Sport</td>
                        <td>Distance</td>
                        <td>Elevation Gain</td>
                        <td>Days Until</td>
                    </tr>
                </thead>
                <tbody>
                    {athleteEvents.map(ae => {
                        const [date, time] = ae.event.date.split(" ")
                        return <>
                            <tr>
                                <Link to={`events/${ae.event.id}`}>
                                    <td>{ae.event.name}</td>
                                </Link>
                                <td>{date}</td>
                                <td>{time}</td>
                                <td>{ae.event.event_sport.sport.name}</td>
                                <td>{ae.event.total_distance}mi</td>
                                <td>{ae.event.total_elev_gain}ft</td>
                                <td>{ae.event.days_until}</td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
        </>
    )
}