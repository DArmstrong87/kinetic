import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filterEvents, getEvents, getSports, monthsList, statesList } from "./EventsProvider";
import "./Events.css"

export const Events = () => {
    const [events, setEvents] = useState([])
    const [sports, setSports] = useState([])
    const [filters, toggleFilters] = useState(false)
    const [request, setRequest] = useState("https://kinetic--server.herokuapp.com/events")
    const states = statesList()
    const months = monthsList()

    useEffect(
        () => {
            getEvents().then(events => setEvents(events))
            getSports().then(sports => {
                sports.sort((a, b) => {
                    if (a.name > b.name) { return 1 }
                    else { return -1 }
                });
                setSports(sports)
            })
        }, []
    )

    const handleFilter = (e) => {
        // Function adds a filter if it doesn't exist in the url or alters it if it has been applied.

        // Disallow some special characters in search bar.
        const disallowed = ['&', '?', '/', ':', '-']
        if (disallowed.some(char => e.target.value.includes(char))) {
            e.preventDefault()
            e.target.value = e.target.value.replace(e.target.value, "")
            return
        }

        let req = request
        if (req.includes('?') && req.includes(e.target.name)) {
            let [, value] = req.split(e.target.name)
            if (value.includes('&')) {
                [value,] = value.split('&')
            }
            req = req.replace(value, `=${e.target.value}`)
        }
        else if (req.includes('?') && !req.includes(e.target.name)) {
            req = req = req.concat('&')
            req = req.concat(`${e.target.name}=${e.target.value}`)
        }
        else {
            req = req.concat('?')
            req = req.concat(`${e.target.name}=${e.target.value}`)
        }
        setRequest(req)
        filterEvents(req).then(events => setEvents(events))
    }
    const handleCheck = (e) => {
        const name = e.target.name
        // Adds or removes ?past or ?multi based on where it is located in the url.
        let req = request
        if (req.includes(`?${name}&`)) { req = req.replace(`${name}&`, "") }
        else if (req.includes(`?${name}`)) { req = req.replace(`?${name}`, "") }
        else if (req.includes(`&${name}`)) { req = req.replace(`&${name}`, "") }
        else if (req.includes(`?`) && !req.includes(`${name}`)) { req = req.concat(`&${name}`) }
        else { req = req.concat(`?${name}`) }
        setRequest(req)
        filterEvents(req).then(events => setEvents(events))
    }

    const renderFilters = () => {
        if (filters === false) { toggleFilters(true) }
        else { toggleFilters(false) }
    }

    return (
        <>
            <div className="events-header">
                <h1>
                    Events
                </h1>

                {filters ?
                    <>
                        <form className="filters">
                            <div className="all">
                                <button type="reset" onClick={() => {
                                    setRequest('https://kinetic--server.herokuapp.com/events');
                                    getEvents().then(events => setEvents(events))
                                }}>Reset</button>
                            </div>

                            <fieldset>
                                <select name="sport"
                                    defaultValue={0} onChange={handleFilter}>
                                    <option value={0} disabled>Sport</option>
                                    {sports.map(sport => {
                                        return <option value={sport.name}>{sport.name}</option>
                                    })}
                                </select>
                            </fieldset>
                            <div className="min-max-dist">
                                <fieldset>
                                    <select name="maxdist"
                                        defaultValue={0} onChange={handleFilter}>
                                        <option value={0} disabled>Max. Distance</option>
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
                                    <select name="mindist"
                                        defaultValue={0} onChange={handleFilter}>
                                        <option value={0} disabled>Min. Distance</option>
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
                            </div>
                            <fieldset>
                                <select name="state"
                                    defaultValue={0} onChange={handleFilter}>
                                    <option value={0} disabled>State</option>
                                    {states.map(state => {
                                        return <option value={state}>{state}</option>
                                    })}
                                </select>
                            </fieldset>
                            <fieldset>
                                <select name="month"
                                    defaultValue={0} onChange={handleFilter}>
                                    <option value={0} disabled>Month</option>
                                    {months.map(month => {
                                        return <option value={month.num}>{month.name}</option>
                                    })}
                                </select>
                            </fieldset>
                            <div className="min-max-dist">
                                <fieldset>
                                    <input type="checkbox" name="past" onChange={handleCheck} />
                                    Past Events
                                </fieldset>
                                <fieldset>
                                    <input type="checkbox" name="multi" onChange={handleCheck} />
                                    Multisport
                                </fieldset>
                            </div>
                        </form>
                    </>
                    : ""}

                <div className="filter-container">
                    <div className="filter">
                        Filter <button onClick={renderFilters}>{filters ? "➖" : "➕"}</button>
                    </div>
                </div>

            </div>
            <fieldset className="search">
                <input name="q" type="text" placeholder="Search" onChange={handleFilter} />
            </fieldset>

            <article className="events">
                {events.length === 0 ? <h3>No events found.</h3> :
                    <>
                        <h3>{events.length} {events.length === 1 ? 'Event' : 'Events'}</h3>
                        {events?.map(event => {
                            const date = new Date(event.date).toDateString()
                            const time = event.date?.split(" ")[1]
                            return <>
                                <section className="event-container">
                                    <div className="event-logo">
                                        <img src={event.event_logo} />
                                    </div>
                                    <div className="event-details-div">
                                        <h2 className="event-title">
                                            <Link to={`events/${event.id}`}>
                                                {event.name}
                                            </Link>
                                        </h2>
                                        <div className="date-location">
                                            <div>
                                                {date} @ {time}{time >= 12 ? 'pm' : 'am'}
                                            </div>
                                            <div>{event.city}, {event.state}</div>
                                        </div>

                                        <div className="event-details">
                                            <div>
                                                <div className="distance">
                                                    <div>Distance: {event.total_distance}mi</div>
                                                    <div>Elevation Gain: {event.total_elev_gain}ft</div>
                                                </div>
                                                <div className="sports">
                                                    {
                                                        event.event_sports?.length > 1 ?
                                                            event.event_sports?.map(es => {
                                                                return es.sport?.name
                                                            }).join(", ")
                                                            :
                                                            event.event_sports[0]?.sport.name
                                                    }
                                                </div>
                                            </div>
                                            <Link className="details-button" to={`events/${event.id}`}>
                                                <div>
                                                    Event<br />Details<br />{`>>>`}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </section>
                            </>
                        })}
                    </>
                }
            </article>
        </>
    )
}