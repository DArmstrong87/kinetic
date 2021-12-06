import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export const OrganizerEvents = ({ events }) => {
    const history = useHistory()

    return (
        <>
            <h1>Upcoming Events</h1>
            <h3>
                {events.length > 0 ?
                    `${events[0]?.days_until} days til ${events[0]?.name}!`
                    :
                    "Events you create will display here!"}
            </h3>

            <button onClick={() => history.push("/createevent")}>
                Create Event
            </button>

            {events.length > 0 ?
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
                            <td>Participants</td>
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
                                    <td>
                                        {
                                            event.event_sports.length > 1 ?
                                                event.event_sports.map(es => {
                                                    return es.sport?.name
                                                }).join(", ")
                                                :
                                                event.event_sport[0]?.sport.name
                                        }
                                    </td>
                                    <td>{event.total_distance}mi</td>
                                    <td>{event.total_elev_gain}ft</td>
                                    <td>{event.days_until}</td>
                                    <td>{event.max_participants - event.spots_remaining}</td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
                :
                <button onClick={() => { history.push("/events") }}>
                    Check out upcoming events!</button>}
        </>
    )
}