import React, { useEffect, useState } from "react";
import { getOrganizerEvents } from "../events/EventsProvider";
import { AthleteEvents } from "./AthleteEvents";
import { getAthleteEvents } from "./EventCalendarProvider";
import { OrganizerEvents } from "./OrganizerEvents";

export const EventCalendar = () => {
    const [events, setEvents] = useState([])
    const athlete = localStorage.getItem("is_athlete")

    useEffect(
        () => {
            if (localStorage.getItem("is_athlete") === "false") {
                getOrganizerEvents().then(e => setEvents(e))
            } else { getAthleteEvents().then(ae => setEvents(ae)) }
        }, []
    )

    return (
        <>
        {athlete === true ? 
            <AthleteEvents athleteEvents={events} />
        : <OrganizerEvents events={events}/>
        }
        </>
    )
}