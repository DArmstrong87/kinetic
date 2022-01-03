import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseMap } from "./CourseMap";
import { getAthleteEvent, getEvent, incompleteEvent, leaveEvent, signUp } from "./EventsProvider";
import "./Event.css"
import { useHistory } from "react-router-dom";

export const Event = () => {
    const [event, setEvent] = useState([])
    const [athleteEvent, setAE] = useState([])
    const { eventId } = useParams()
    const date = new Date(event.date).toDateString()
    const time = event.date?.split(" ")[1]
    const history = useHistory()

    useEffect(
        () => {
            getEvent(eventId).then(event => setEvent(event))
            if (localStorage.getItem("is_athlete") === "true") {
                getAthleteEvent(eventId).then(ae => setAE(ae))
            }
        }, [eventId]
    )

    const eventSignUp = (id) => {
        signUp(id)
            .then(res => {
                if (res.ok) {
                    getEvent(eventId).then(e => setEvent(e)).then(
                        getAthleteEvent(eventId).then(ae => setAE(ae))
                    )
                }
            })
    }

    const eventLeave = (id) => {
        leaveEvent(id)
            .then(res => {
                if (res.ok) {
                    getEvent(eventId).then(e => setEvent(e)).then(
                        setAE([])
                    )
                }
            })
    }


    return (
        <>
            <article className="event-article">
                <section className="e-side">
                    <div className="e-logo">
                        <img src={event.event_logo} alt="Event logo" />
                    </div>
                    {event.event_sports?.map(es => {
                        return <div className="e-sport">
                            {es.sport.name}
                        </div>
                    })}
                    {localStorage.getItem("is_athlete") === "true" ?
                        <>
                            <p className="e-signup">Spots remaining:<br />{event.spots_remaining}</p>
                            {event.spots_remaining !== 0 ?
                                <>
                                    <div className="e-signup">
                                        {athleteEvent?.length === 0 ?
                                            <button onClick={() => eventSignUp(event.id)}>
                                                Sign Up!
                                            </button>
                                            :
                                            <>
                                                {event.completed ? <>You completed this event!<br />🏆
                                                    <br />
                                                    <span onClick={() => incompleteEvent(athleteEvent.id).then(getEvent(eventId).then(e => setEvent(e)))} style={{ cursor: 'pointer' }}>Mark Incomplete</span>
                                                </>

                                                    :
                                                    <>
                                                        You are signed up for<br />{event.name}!<br />
                                                        <button onClick={() => eventLeave(event.id)}>
                                                            Leave Event</button>
                                                        <button onClick={() => history.push(`/createactivity/${event.id}`)}>
                                                            Complete</button>
                                                    </>
                                                }
                                            </>
                                        }
                                    </div>
                                </>
                                :
                                "Event registration closed. Maximum participants met."
                            }
                        </>
                        : ""}
                </section>

                <section className="e-details">
                    <h1>{event.name} {event.completed ? '🏆' : ""}</h1>

                    <div className="e-sub-details">
                        <p>
                            {date} | {event.city}, {event.state}<br />
                            Start time: {time}{time >= 12 ? 'pm' : 'am'}
                        </p>
                        <table className="event-sports-table">
                            <thead>
                                <tr>
                                    {event.event_sports?.length > 1 ? "" :
                                        <td>Sport</td>}
                                    <td>Distance (mi)</td>
                                    <td>Elevation gain (ft)</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {event.event_sports?.length > 1 ? "" :
                                        <td>{event.event_sports ? event.event_sports[0].sport.name : ""} </td>
                                    }
                                    <td>{event.total_distance?.toFixed(1).toLocaleString()}</td>
                                    <td>{event.total_elev_gain?.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>{event.description}</p>

                    {event.event_sports?.length > 1 ? <>
                        <h4>Multi-Sport Breakdown</h4>

                        <table className="event-sports-table">
                            <thead>
                                <tr>
                                    <td>Sport</td>
                                    <td>Distance (mi)</td>
                                    <td>Elevation gain (ft)</td>
                                </tr>
                            </thead>
                            <tbody>
                                {event.event_sports?.map(es => {
                                    return <>
                                        <tr>
                                            <td>{es.sport.name}</td>
                                            <td>{es.distance}</td>
                                            <td>{es.sport.name === "Swimming" ? "--" : es.elev_gain}</td>
                                        </tr>
                                    </>
                                })}
                            </tbody>
                        </table>
                    </>
                        : ""}




                    <div className="course">
                        {event?.course_url ?
                            <>
                                Course Map
                                <br />
                                < CourseMap event={event} />
                            </>
                            : ""}
                    </div>
                </section>
            </article>
        </>
    )
}