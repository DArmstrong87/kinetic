import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseMap } from "./CourseMap";
import { getAthleteEvent, getEvent, leaveEvent, signUp } from "./EventsProvider";
import "./Event.css"

export const Event = () => {
    const [event, setEvent] = useState([])
    const [athleteEvent, setAE] = useState([])
    const { eventId } = useParams()
    const date = new Date(event.date).toDateString()
    const time = event.date?.split(" ")[1]


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

                                                You are signed up for<br />{event.name}!<br />
                                                <button onClick={() => eventLeave(event.id)}>
                                                    Leave Event</button>
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
                    <h1>{event.name}</h1>
                    <p>
                        {date} | {event.city}, {event.state}<br />
                        Start time: {time}{time >= 12 ? 'pm' : 'am'}
                    </p>
                    <p>Distance: {event.total_distance?.toFixed(1).toLocaleString()}mi || 
                    Elevation Gain: {event.total_elev_gain?.toLocaleString()}ft</p>

                    {event.event_sports?.length > 1 ? <>
                        <h4>Multi-Sport Event</h4>
                        {event.event_sports?.map(es => {
                            return <>
                                <div>
                                    {es.sport.name} | Distance: {es.distance}mi | Elevation Gain: {es.elev_gain}ft
                                </div>
                            </>
                        })}
                    </>
                        : ""}

                    <p>{event.description}</p>



                    <div>
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