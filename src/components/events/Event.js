import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseMap } from "./CourseMap";
import { getEvent, getEventSports } from "./EventsProvider";

export const Event = () => {
    const [event, setEvent] = useState([])
    const [eventSports, setEventSports] = useState([])
    const { eventId } = useParams()
    const date = new Date(event.date).toDateString()
    const [, time] = event.date.split(" ")

    useEffect(
        () => {
            getEvent(eventId).then(event => setEvent(event))
            getEventSports(eventId).then(es => setEventSports(es))
        }, []
    )

    return (
        <>
            <h1>{event.name}</h1>
            <img src={event.event_logo} alt="Event logo" />
            <p>
                {date} | {event.city}, {event.state}<br />
                Start time: {time}{time >= 12 ? 'pm' : 'am'}
            </p>
            <p>
                Distance: {event.total_distance}mi
            </p>
            <p>
                Elevation Gain: {event.total_elev_gain}ft
            </p>
            <p>
                {event.description}
            </p>
            <p>
                There are {event.spots_remaining} spots remaining!
            </p>
            {event.spots_remaining !== 0 ?
                <div>
                    <button>
                        Sign Up!
                    </button>
                </div>
                :
                "Event registration closed. Maximum participants met."
            }

            <div>
                {event?.course_url ?
                    <>
                        Course Map
                        <br />
                        < CourseMap event={event} />
                    </>
                    : ""}
            </div>

            {
                eventSports.length > 1 ?
                    eventSports.map(es => {
                        return es.sport?.name
                    }).join(", ")
                    :
                    event.sport?.name
            }
        </>
    )
}