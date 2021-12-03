import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "./EventsProvider";

export const Events = () => {
    const [events, setEvents] = useState([])

    useEffect(
        () => {
            getEvents().then(events => setEvents(events))
        }, []
    )

    return (
        <>
            <h1>Events</h1>
            <table>
                <thead>
                    <tr>
                        <td>Event</td>
                        <td>Date</td>
                        <td>Sport</td>
                        <td>Distance</td>
                        <td>Elevation Gain</td>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => {
                        const [date, time] = event.date.split("T")
                        return <>
                            <tr>
                                <Link to={`events/${event.id}`}>
                                    <td>{event.name}</td>
                                </Link>
                                <td>{date}</td>
                                <td>Sports</td>
                                <td>Distance</td>
                                <td>Elevation Gain</td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
        </>
    )
}