import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createEvent, createEventSport, getSports, statesList, getEvent, updateEvent, updateEventSport, deleteEventSport } from "./EventsProvider";
import "./CreateEvent.css"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export const EventForm = ({ editMode }) => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const [newEvent, setEvent] = useState({})
    const [eventSport, setEventSport] = useState({ sportId: 0 })
    const [eventSportIds, setEsIds] = useState([])
    const [fields, toggleFields] = useState({})
    const [eventSports, setEventSports] = useState([])
    const { eventId } = useParams()
    const states = statesList()
    const history = useHistory()

    const convertDate = (eventDate) => {
        const [date, time] = eventDate.split(" ")
        const dateArr = date.split("/")
        const newDate = [dateArr[2], dateArr[0], dateArr[1]].join("-")
        const newDateTime = [newDate, time].join("T")
        return newDateTime
    }

    const convertEventSports = (evSp) => {
        // Each existing event sport is stored in the event sport array.
        for (const es of evSp) {
            const index = evSp.indexOf(es)
            const copy = eventSports
            const ces = {
                sportId: es.sport.id,
                distance: es.distance,
                elevGain: es.elev_gain,
                id: es.id
            }
            copy[index] = ces
            setEventSports(copy)

            //Set separate ES id array for updating or deleting based on new input.
            let esid = eventSportIds
            esid.push(es.id)
            setEsIds(esid)

            // Set toggle switches for dist and elevGain fields for each sport.
            let field = fields
            let fvalue = `f${es.sport.id}`
            field[fvalue] = true
            toggleFields(field)
        }
    }

    useEffect(() => {
        getSports().then(sports => setSports(sports))
        if (editMode) {
            getEvent(eventId).then(e => {
                if (e.event_sports.length > 1) {
                    setMulti(true)
                }
                const date = convertDate(e.date)
                convertEventSports(e.event_sports)
                setEvent({
                    city: e.city,
                    courseUrl: e.course_url,
                    date: date,
                    description: e.description,
                    eventLogo: e.event_logo,
                    maxParticipants: e.max_participants,
                    name: e.name,
                    state: e.state,
                    id: e.id
                })
            })

        }
    }, [eventId, editMode])

    const handleInput = (e) => {
        const event = { ...newEvent }
        event[e.target.name] = e.target.value
        setEvent(event)
    }

    const handleSports = (e) => {
        const es = { ...eventSport }
        es[e.target.name] = parseInt(e.target.value)
        setEventSport(es)
    }

    const handleEvent = (e) => {
        // Before event creation, confirm if a sport has been selected and that all fields are filled out.
        e.preventDefault()
        createEvent(newEvent)
            .then(res => res.json())
            .then(createdEvent => {
                // Confirm event was created by checking for an id.
                // If single sport, check id and push to event page.
                if (createdEvent.hasOwnProperty("id") && multiSport === false) {
                    const es = { ...eventSport }
                    es.eventId = createdEvent.id
                    createEventSport(es).then(history.push(`/events/${createdEvent.id}`))
                } else if (createdEvent.hasOwnProperty("id") && multiSport === true) {
                    for (const es of eventSports) {
                        if (es.hasOwnProperty('sportId')) {
                            const e = { ...es }
                            e.eventId = createdEvent.id
                            // If multi sport, check id wait til last event sport is created before pushing to event page.
                            createEventSport(e).then(createdEventSport => {
                                if (createdEventSport.sport.id === eventSports[eventSports.length - 1].sportId) {
                                    history.push(`/events/${createdEvent.id}`)
                                }
                            })
                        }
                    }
                }
            })
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        // Determine which event sport ids were left out and delete those event sports
        const newIds = []
        for (const es of eventSports) { newIds.push(es.id) }
        const idsToDelete = eventSportIds.filter(id => !newIds.includes(id))
        for (const id of idsToDelete) { deleteEventSport(id) }
        const idsToCreate = newIds.filter(id => !eventSportIds.includes(id))
        for (const id of idsToCreate) {
            let foundES = eventSports.find(es => es.id === id)
            foundES.eventId = parseInt(eventId)
            createEventSport(foundES)
        }
        updateEvent(newEvent, eventId)

        for (const es of eventSports) {
            if (eventSportIds.includes(es.id)) {
                updateEventSport(es).then(createdEventSport => {
                    debugger
                    // Redirect after the last event sport is created
                    if (createdEventSport.sport.id ===
                        eventSports[eventSports.length - 1].sportId) {
                        history.push(`/events/${eventId}`)
                    }
                })
            }
        }
    }



    return (
        <>
            <h2>{editMode ? "Edit Event" : "Create Event"}</h2>

            <form onSubmit={editMode ? handleUpdate : handleEvent}>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="name">Event Name </label>
                    <input type="text" name="name" className="create-event-input" placeholder={editMode ? newEvent.name : "Event name"} required={!newEvent.name} autofocus onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="date">
                        Date and Start Time
                    </label>
                    <input type="datetime-local" defaultValue={newEvent.date} name="date" className="create-event-input" required={!newEvent.date} onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="city">City</label>
                    <input type="text" name="city" className="create-event-input" placeholder={editMode ? newEvent.city : "City"} required={!newEvent.city} onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="state">
                        {editMode ? `Current state: ${newEvent?.state}` : "State"}
                    </label>
                    <select defaultValue={""} name="state" className="create-event-input" required={!newEvent.state} onChange={handleInput}>
                        <option value="" disabled>{editMode ? "Change State" : "Select State"}</option>
                        {states.map(state => {
                            return <option name="state" value={state}>{state}</option>
                        })}
                    </select>
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="description">Description </label>
                    <textarea cols={50} name="description" className="create-event-input" placeholder={editMode ? newEvent.description : "Details about the event"} required={!newEvent.description} onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="maxParticipants">Participant Limit </label>
                    <input type="number" name="maxParticipants" className="create-event-input" placeholder={editMode ? newEvent.maxParticipants : ""} required={!newEvent.maxParticipants} onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="courseUrl">Course Map URL </label>
                    <input type="text" name="courseUrl" className="create-event-input" placeholder={editMode ? newEvent.courseUrl : ""} required={!newEvent.courseUrl} onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="eventLogo">Event Logo URL</label>
                    <input type="text" name="eventLogo" className="create-event-input" placeholder={editMode ? newEvent.eventLogo : ""} required={!newEvent.eventLogo} onChange={handleInput} />
                </fieldset>
                <div>
                    <img src={newEvent.eventLogo} alt={`${newEvent.name} logo`} />
                </div>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="multiSport">Multi-sport Event? </label>
                    <input type="radio" checked={multiSport === true} name="yes" className="create-event-input" onChange={() => setMulti(true)} />Yes
                    <input type="radio" checked={multiSport === false || eventSports.length === 0} name="no" className="create-event-input" onChange={() => { setMulti(false) }} />No
                </fieldset>

                {!multiSport ?
                    <>
                        {/* RADIOS FOR SINGLE SPORT */}
                        <fieldset className="event-field">
                            <label className="input-label" htmlFor="sport">Sport </label>
                            {sports.map(sport => {
                                return <>
                                    <input type="radio" checked={eventSport.sportId === sport.id} name='sportId' value={sport.id} required={!multiSport} className="create-event-input" onChange={(e) => handleSports(e)} />{sport.name}
                                </>
                            })}
                        </fieldset>

                        <fieldset className="event-field">
                            <label className="input-label" htmlFor="distance">Distance</label>
                            <input type="number" name="distance" step="0.01" className="create-event-input" required={!multiSport} onChange={handleSports} />
                        </fieldset>

                        <fieldset className="event-field">
                            <label className="input-label" htmlFor="elevGain">Elevation Gain</label>
                            <input type="number" name="elevGain" step="0.01" className="create-event-input" required={!multiSport} onChange={handleSports} />
                        </fieldset>
                    </>
                    :
                    <>
                        {/* CHECKBOXES FOR MULTI SPORT */}
                        <div className="input-label" htmlFor="sport">
                            {multiSport ? "Sports" : "Sport"} </div>

                        {sports?.map(sport => {

                            const existingSport = (id) => {
                                const array = []
                                if (editMode) {
                                    for (const es of eventSports) {
                                        array.push(es.sportId)
                                    }
                                }
                                return array.includes(id)
                            }
                            return <>
                                <div className="sport-checkboxes">
                                    <fieldset className="multisport-fields">
                                        <input type="checkbox" value={sport.id} checked={fields[`f${sport.id}`] || existingSport(sport.id)}
                                            name="sport" className="create-event-input"
                                            required={!Object.values(fields).some(val => val === true)}
                                            onChange={() => {
                                                /*
                                                The fields object controls turning the corresponding sport id distance and elev_gain fields on and off.
                                                1. Copy fields object
                                                2. Check if current field key exists, if not, create one and set value to false.
                                                3. If the value exists and is false, set to true.
                                                4. If true, set to false and set the eventSport object to empty. 
                                                5. Set toggle fields.
                                                */
                                                const field = { ...fields }
                                                let fvalue = field[`f${sport.id}`]
                                                const es = [...eventSports]
                                                const index = sport.id - 1
                                                if (!fvalue) {
                                                    field[`f${sport.id}`] = true
                                                    es[index] = { sportId: sport.id }
                                                    setEventSports(es)
                                                }
                                                else if (fvalue === false) {
                                                    field[`f${sport.id}`] = true
                                                    if (es[index]) {
                                                        es[index] = { sportId: sport.id }
                                                        setEventSports(es)
                                                    }
                                                }
                                                else {
                                                    field[`f${sport.id}`] = false;
                                                    es[sport.id - 1] = {}
                                                    setEventSports(es)
                                                }
                                                toggleFields(field)
                                            }} />

                                        <label htmlFor="sport" className="sport-label">{sport.name}</label>
                                        {
                                            /* Dynamically render distance and elevation gain fields
                                            // Each fieldset should save as its own object with distance, elevGain and sportId.*/
                                            fields[`f${sport.id}`] ?
                                                <>
                                                    <fieldset className="multisport-fields">
                                                        <input type="number" name="distance" step="0.01" className="create-event-input ms-input" placeholder={editMode ?
                                                            eventSports[sport.id - 1]?.distance : "Distance (mi)"
                                                        }
                                                            required={eventSports.some(es => es?.hasOwnProperty('sportId')
                                                                && es.sportId === sport.id)
                                                                && !eventSports[sport.id - 1].sportId === sport.id}
                                                            onChange={(e) => {
                                                                const es = [...eventSports]
                                                                const index = sport.id - 1
                                                                es[index]['distance'] = parseFloat(e.target.value)
                                                                setEventSports(es)
                                                            }} />
                                                    </fieldset>

                                                    <fieldset className="multisport-fields">
                                                        <input type="number" name="elevGain" step="0.01"
                                                            className="create-event-input ms-input" placeholder={editMode ?
                                                                eventSports[sport.id - 1]?.elevGain : "Elevation gain (ft)"
                                                            } required={eventSports.some(es => es?.hasOwnProperty('sportId')
                                                                && es.sportId === sport.id)
                                                                && !eventSports[sport.id - 1].sportId === sport.id
                                                            }
                                                            onChange={(e) => {
                                                                const es = [...eventSports]
                                                                const index = sport.id - 1
                                                                if (!es[index]) { es[index] = {} }
                                                                es[index]['elevGain'] = parseFloat(e.target.value)
                                                                setEventSports(es)
                                                            }} />
                                                    </fieldset>
                                                </>
                                                : ""
                                        }
                                    </fieldset>
                                </div>
                            </>
                        })}

                    </>
                }
                <fieldset>
                    <button type="submit">{editMode ? "Save" : "Create"}</button>
                    <button onClick={() => history.push("/myevents")}>Cancel</button>
                </fieldset>
            </form>
        </>
    )
}