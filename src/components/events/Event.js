import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseMap } from "./CourseMap";
import { getAthleteEvent, getEvent, leaveEvent, signUp } from "./EventsProvider";

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
            <h1>{event.name}</h1>
            <img src={event.event_logo} alt="Event logo" />
            <p>
                {date} | {event.city}, {event.state}<br />
                Start time: {time}{time >= 12 ? 'pm' : 'am'}
            </p>
            <p>Distance: {event.total_distance?.toFixed(1)}mi</p>
            <p>Elevation Gain: {event.total_elev_gain}ft</p>

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

            {localStorage.getItem("is_athlete") === "true" ?
                <>
                    <p>There are {event.spots_remaining} spots remaining!</p>
                    {event.spots_remaining !== 0 ?
                        <>
                            {athleteEvent?.length === 0 ?
                                <div>
                                    <button onClick={() => eventSignUp(event.id)}>
                                        Sign Up!
                                    </button>
                                </div>
                                :
                                <>
                                    You are signed up for {event.name}!
                                    <button onClick={() => eventLeave(event.id)}>
                                        Leave Event</button>
                                </>
                            }
                        </>
                        :
                        "Event registration closed. Maximum participants met."
                    }
                </>
                : ""}

            <div>
                {event?.course_url ?
                    <>
                        Course Map
                        <br />
                        < CourseMap event={event} />
                    </>
                    : ""}
            </div>
        </>
    )
}