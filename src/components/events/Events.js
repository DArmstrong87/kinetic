import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, getSports, monthsList, searchEvents, statesList } from "./EventsProvider";

export const Events = () => {
    const [events, setEvents] = useState([])
    const [sports, setSports] = useState([])
    const states = statesList()
    const months = monthsList()
    useEffect(
        () => {
            getEvents().then(events => setEvents(events))
            getSports().then(sports => setSports(sports))
        }, []
    )

    const handleFilter = (e) => {
        searchEvents(e.target.name, e.target.value).then(events => setEvents(events))
    }


    return (
        <>
            <h1>All Events</h1>
            <fieldset>
                <label htmlFor="q">Search</label>
                <input name="q" type="text" onChange={handleFilter} />
            </fieldset>

            <div className="filter">
                Filter 🔽
                <fieldset>
                    <select name="dist" defaultValue={0} onChange={handleFilter}>
                        <option value={0}>Distance</option>
                        <option value={3.1}>5k -- 3.1mi</option>
                        <option value={6.2}>10k -- 6.2mi</option>
                        <option value={13.1}>Half Marathon -- 13.1mi</option>
                        <option value={26.2}>Marathon -- 26.2mi</option>
                        <option value={62}>Metric Century -- 62mi</option>
                        <option value={70.3}>Half Iron Man -- 70.3mi</option>
                        <option value={100}>Century -- 100mi</option>
                        <option value={140.6}>Full Iron Man -- 140.6mi</option>
                    </select>
                </fieldset>
                <fieldset>
                    <select name="state" defaultValue={0} onChange={handleFilter}>
                        <option value={0} disabled>State</option>
                        {states.map(state => {
                            return <option value={state}>{state}</option>
                        })}
                    </select>
                </fieldset>
                <fieldset>
                    <select name="month" defaultValue={0} onChange={handleFilter}>
                        <option value={0} disabled>Month</option>
                        {months.map(month => {
                            return <option value={month.num}>{month.name}</option>
                        })}
                    </select>
                </fieldset>
            </div>

            <table>
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
                    {events.map(event => {
                        const [date, time] = event.date.split(" ")
                        return <>
                            <tr>
                                <Link to={`events/${event.id}`}>
                                    <td>{event.name}</td>
                                </Link>
                                <td>{date}</td>
                                <td>{time}</td>
                                <td>            {
                                    event.event_sports?.length > 1 ?
                                        event.event_sports?.map(es => {
                                            return es.sport?.name
                                        }).join(", ")
                                        :
                                        event.event_sport[0]?.sport.name
                                }</td>
                                <td>{event.total_distance}mi</td>
                                <td>{event.total_elev_gain}ft</td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
        </>
    )
}