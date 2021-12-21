import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { getPastAthleteEvents } from "./EventCalendarProvider";

export const AthleteEvents = ({ athleteEvents }) => {
    const history = useHistory()
    const [pastEvents, setPastEvents] = useState([])
    const [viewPast, setPast] = useState(false)


    return (
        <>
            <h1>My Upcoming Events</h1>
            <h3>
                {athleteEvents.length > 0 ?
                    `${athleteEvents[0]?.event.days_until} days til ${athleteEvents[0]?.event.name}!`
                    :
                    "Events you sign up for will display here!"}
            </h3>

            {athleteEvents.length > 0 ?
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
                        </tr>
                    </thead>
                    <tbody>
                        {athleteEvents?.map(ae => {
                            const [date, time] = ae.event.date?.split(" ")
                            return <>
                                <tr>
                                    <td>
                                        <Link to={`events/${ae.event.id}`}>
                                            {ae.event.name}
                                        </Link>
                                    </td>
                                    <td>{date}</td>
                                    <td>{time}{time >= 12 ? 'pm' : 'am'}</td>
                                    <td>{
                                        ae.event.event_sports.length > 1 ?
                                            ae.event.event_sports.map(es => {
                                                return es.sport.name
                                            }).join(", ")
                                            :
                                            ae.event.event_sports[0].sport?.name
                                    }  </td>
                                    <td>{ae.event.total_distance}mi</td>
                                    <td>{ae.event.total_elev_gain}ft</td>
                                    <td>{ae.event.days_until}</td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
                :
                <button onClick={() => { history.push("/events") }}>
                    Check out upcoming events!</button>}

            {!viewPast ?
                <button className="view-past" onClick={() => {
                    setPast(true);
                    getPastAthleteEvents().then(e => setPastEvents(e))
                }}>
                    View Past Events</button>
                :
                <button className="view-past" onClick={() => { setPast(false) }}>Hide Past Events</button>
            }

            {viewPast ?
                <>
                    {pastEvents.length > 0 ?
                        <>
                            <h2>Past Events</h2>
                            <table className="user-events">
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
                                    {pastEvents?.map(ae => {
                                        const [date, time] = ae.event.date?.split(" ")
                                        return <>
                                            <tr>
                                                <Link to={`events/${ae.event.id}`}>
                                                    <td>{ae.event.name}</td>
                                                </Link>
                                                <td>{date}</td>
                                                <td>{time}{time >= 12 ? 'pm' : 'am'}</td>
                                                <td>{
                                                    ae.event.event_sports.length > 1 ?
                                                        ae.event.event_sports.map(es => {
                                                            return es.sport.name
                                                        }).join(", ")
                                                        :
                                                        ae.event.event_sports[0].sport?.name
                                                }  </td>
                                                <td>{ae.event.total_distance}mi</td>
                                                <td>{ae.event.total_elev_gain}ft</td>
                                            </tr>
                                        </>
                                    })}
                                </tbody>
                            </table>
                        </>
                        : <p>No Past Events</p>}
                </>
                : ""}
        </>
    )
}