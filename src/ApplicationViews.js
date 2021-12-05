import React from "react";
import { Route } from "react-router-dom"
import { Event } from "./components/events/Event";
import { Events } from "./components/events/Events";

export const ApplicationViews = () => {
    return <>
        <Route exact path="/events">
            <Events />
        </Route>
        <Route exact path="/events/:eventId(\d+)">
            <Event />
        </Route>
    </>
}