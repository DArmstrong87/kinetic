import React from "react";
import { Route } from "react-router-dom"
import { EventCalendar } from "./components/eventCalendar/EventCalendar";
import { Event } from "./components/events/Event";
import { Events } from "./components/events/Events";
import { AthleteProfile } from "./components/profile/AthleteProfile";

export const ApplicationViews = () => {
    return <>
        <Route exact path="/events">
            <Events />
        </Route>
        <Route exact path="/events/:eventId(\d+)">
            <Event />
        </Route>
        <Route path="/myevents">
            <EventCalendar />
        </Route>
        <Route path="/profile">
            <AthleteProfile />
        </Route>
    </>
}