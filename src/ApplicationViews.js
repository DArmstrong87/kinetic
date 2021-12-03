import React from "react";
import { Route } from "react-router-dom"
import { Events } from "./components/events/Events";

export const ApplicationViews = () => {
    return <>
        <Route path="/events">
            <Events />
        </Route>
    </>
}