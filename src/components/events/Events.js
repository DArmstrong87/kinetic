import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, monthsList, searchEvents, statesList } from "./EventsProvider";
import "./Events.css"
import { debounce } from "debounce";

export const Events = () => {
    const [events, setEvents] = useState([])
    const [filters, toggleFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState({})
    const states = statesList()
    const months = monthsList()

    useEffect(
        () => {
            getEvents().then(events => setEvents(events))
        }, []
    )

    useEffect(() => {
        debounce(searchEvents('q', searchTerm).then(e => setEvents(e)), 1000)
    }, [searchTerm])

    const handleFilter = (e) => {
        searchEvents(e.target.name, e.target.value).then(events => setEvents(events))
    }

    const handleSearch = (e) => { setSearchTerm(e.target.value) }

    const renderFilters = () => {
        if (filters === false) { toggleFilters(true) }
        else { toggleFilters(false) }
    }


    return (
        <>
            <div className="events-header">
                <h1>
                    All Events
                </h1>
                <div className="filter-container">
                    <div>
                        Filter <button onClick={renderFilters}>{filters ? "➖" : "➕"}</button>
                    </div>
                </div>


                {filters ?
                    <>
                        <div className="filters">
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
                    </>
                    : ""}
                <fieldset className="search">
                    <label htmlFor="q">Search</label>
                    <input name="q" type="text" onChange={handleSearch} />
                </fieldset>
            </div>

            <article className="events">
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
            </article>
        </>
    )
}