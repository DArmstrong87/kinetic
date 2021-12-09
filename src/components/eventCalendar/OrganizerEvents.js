import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { deleteEvent, getOrganizerEvents } from "./EventCalendarProvider";

export const OrganizerEvents = ({ events, setEvents }) => {
    const history = useHistory()

    return (
        <>
            <h1>Upcoming Events</h1>
            <h3>
                {events?.length > 0 ?
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
                            <td>⚙️🗑️</td>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => {
                            const [date, time] = event.date?.split(" ")
                            return <>
                                <tr>
                                    <Link to={`events/${event.id}`}>
                                        <td>{event.name}</td>
                                    </Link>
                                    <td>{date}</td>
                                    <td>{time}</td>
                                    <td>
                                        {
                                            event.event_sports?.length > 1 ?
                                                event.event_sports?.map(es => {
                                                    return es.sport?.name
                                                }).join(", ")
                                                :
                                                event.event_sports[0]?.sport.name
                                        }
                                    </td>
                                    <td>{event.total_distance}mi</td>
                                    <td>{event.total_elev_gain}ft</td>
                                    <td>{event.days_until}</td>
                                    <td>{event.max_participants - event.spots_remaining}</td>
                                    <td>
                                        <button>⚙️</button>
                                        <button onClick={() => {
                                            deleteEvent(event.id).then(res => {
                                                if (res.ok) {
                                                    getOrganizerEvents().then(e => { setEvents(e) })
                                                }
                                            })
                                        }}>
                                            🗑️</button>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
                : ""}
        </>
    )
}