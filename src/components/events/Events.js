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
            <h1>All Events</h1>
            <table>
                <thead>
                    <tr>
                        <td>Event</td>
                        <td>Date</td>
                        <td>Start Time</td>
                        <td>Sport</td>
                        <td>Distance</td>
                        <td>Elevation Gain</td>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => {
                        const [date, time] = event.date.split(" ")
                        return <>
                            <tr>
                                <Link to={`events/${event.id}`}>
                                    <td>{event.name}</td>
                                </Link>
                                <td>{date}</td>
                                <td>{time}</td>
                                <td>{event.event_sport.sport.name}</td>
                                <td>{event.total_distance}mi</td>
                                <td>{event.total_elev_gain}ft</td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
        </>
    )
}