import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { deleteEvent, getOrganizerEvents, getPastOrganizerEvents } from "./EventCalendarProvider";

export const OrganizerEvents = ({ events, setEvents }) => {
    const history = useHistory()
    const [pastEvents, setPastEvents] = useState([])
    const [viewPast, setPast] = useState(false)


    return (
        <>
            <div className="events-header">
                <h1>Upcoming Events</h1>
                <button onClick={() => history.push("/createevent")}>
                    Create Event
                </button>
            </div>
            <h3>
                {events?.length > 0 ?
                    `${events[0]?.days_until} days til ${events[0]?.name}!`
                    :
                    "Events you create will display here!"}
            </h3>


            {events.length > 0 ?
                <table className="user-events">
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
                            <td>
                                <button style={{ cursor: 'default' }}>⚙️</button>
                                <button style={{ cursor: 'default' }}>🗑️</button>
                            </td>
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
                                        <button onClick={() => history.push(`/editEvent/${event.id}`)}>
                                            ⚙️</button>
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

            {!viewPast ?
                <button className="view-past" onClick={() => {
                    setPast(true);
                    getPastOrganizerEvents().then(e => setPastEvents(e))
                }}>
                    View Past Events</button>
                :
                <button className="view-past" onClick={() => { setPast(false) }}>Hide Past Events</button>
            }

            {viewPast ?
                <>
                    <h2>Past Events</h2>
                    {pastEvents.length > 0 ?
                        <table className="user-events">
                            <thead>
                                <tr>
                                    <td>Event</td>
                                    <td>Date</td>
                                    <td>Start Time</td>
                                    <td>Sport</td>
                                    <td>Distance</td>
                                    <td>Elevation Gain</td>
                                    <td>Participants</td>
                                    <td>
                                        <button style={{ cursor: 'default' }}>⚙️</button>
                                        <button style={{ cursor: 'default' }}>🗑️</button>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {pastEvents.map(event => {
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
                                            <td>{event.max_participants - event.spots_remaining}</td>
                                            <td>
                                                <button onClick={() => history.push(`/editEvent/${event.id}`)}>
                                                    ⚙️</button>
                                                <button onClick={() => {
                                                    deleteEvent(event.id).then(res => {
                                                        if (res.ok) {
                                                            getPastOrganizerEvents().then(e => setPastEvents(e))
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
                : ""}
        </>
    )
}