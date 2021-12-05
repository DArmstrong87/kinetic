import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseMap } from "./CourseMap";
import { getEvent, getEventSports } from "./EventsProvider";

export const Event = () => {
    const [event, setEvent] = useState([])
    const [eventSports, setEventSports] = useState([])
    const { eventId } = useParams()


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
            <div>
                <button>
                    Sign Up!
                </button>
            </div>

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