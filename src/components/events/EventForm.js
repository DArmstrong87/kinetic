import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { createEvent, createEventSport, getSports, statesList, getEvent, updateEvent, updateEventSport, deleteEventSport } from "./EventsProvider";
import "./EventForm.css"
import { useParams } from "react-router-dom";
import loading from "../../Infinity.gif"

export const EventForm = ({ editMode }) => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const [newEvent, setEvent] = useState({})
    const [eventSport, setEventSport] = useState({ sportId: 0 })
    const [eventSportIds, setEsIds] = useState([])
    const [eventSports, setEventSports] = useState([])
    const { eventId } = useParams()
    const states = statesList()
    const history = useHistory()
    const savingModal = useRef()

    const convertDate = (eventDate) => {
        const [date, time] = eventDate.split(" ")
        const dateArr = date.split("/")
        const newDate = [dateArr[2], dateArr[0], dateArr[1]].join("-")
        const newDateTime = [newDate, time].join("T")
        return newDateTime
    }

    const convertEventSports = (eSp) => {
        // For existing data to edit, it will be placed in the same arrays in how they are originally created.
        if (eSp.length === 1) {
            const as = {
                sportId: eSp[0].sport.id,
                distance: eSp[0].distance,
                elevGain: eSp[0].elev_gain,
                id: eSp[0].id
            }
            let esid = eventSportIds
            esid.push(eSp[0].id)
            setEsIds(esid)
            setEventSport(as)
        } else {
            eSp.sort((a, b) => {
                let first = a.sport.id
                let second = b.sport.id
                return first - second
            })
            // Each existing activity sport is stored in the activity sport array.
            for (const as of eSp) {
                const index = as.sport?.id - 1
                const copy = eventSports
                const eSp_Copy = {
                    sportId: as.sport.id,
                    distance: as.distance,
                    elevGain: as.elev_gain,
                    id: as.id
                }
                copy[index] = eSp_Copy
                setEventSports(copy)

                //Set separate ES id array for updating or deleting based on new input.
                let esid = eventSportIds
                esid.push(as.id)
                setEsIds(esid)
            }
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

    const handleSport = (e) => {
        if (e.target.name === "sportId") {
            const es = { sportId: parseInt(e.target.value) }
            setEventSport(es)
        } else {
            const es = { ...eventSport }
            es[e.target.name] = parseInt(e.target.value)
            setEventSport(es)
        }
    }

    const handleMultiSwitch = () => {
        if (multiSport) {
            setMulti(false)
        } else {
            setMulti(true)
            const index = eventSport.sportId - 1
            const eSports = eventSports
            eSports[index] = eventSport
            setEventSports(eSports)
        }
    }

    const handleEvent = (e) => {
        e.preventDefault()
        savingModal.current.showModal()
        // Before event creation, confirm if a sport has been selected and that all fields are filled out.
        createEvent(newEvent)
            .then(res => res.json())
            .then(createdEvent => {
                // Confirm event was created by checking for an id.
                // If single sport, check id and push to event page.
                if (createdEvent.hasOwnProperty("id") && multiSport === false) {
                    const es = { ...eventSport }
                    es.eventId = createdEvent.id
                    createEventSport(es).then(setTimeout(() => history.push(`/events/${createdEvent.id}`), 1500))
                } else if (createdEvent.hasOwnProperty("id") && multiSport === true) {
                    for (const es of eventSports) {
                        if (es.hasOwnProperty('sportId')) {
                            const e = { ...es }
                            e.eventId = createdEvent.id
                            // If multi sport, check id wait til last event sport is created before pushing to event page.
                            createEventSport(e).then(setTimeout(() => history.push(`/events/${createdEvent.id}`), 1500))
                        }
                    }
                }
            })
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        savingModal.current.showModal()
        if (multiSport) { handleMultiUpdate() }
        else { handleSingleSportUpdate(e) }
    }

    const handleSingleSportUpdate = () => {
        // Handle change from multi to single sport.
        // Delete all in multisports.
        for (const es of eventSports) {
            if (es?.hasOwnProperty("id")) { deleteEventSport(es?.id) }
        }
        if (eventSport.hasOwnProperty("id")) {
            updateEventSport(eventSport)
        } else {
            eventSport.eventId = parseInt(eventId)
            deleteEventSport(eventSportIds[0])
            createEventSport(eventSport)
        }
        updateEvent(newEvent).then(setTimeout(() => history.push(`/events/${eventId}`), 1500))
    }

    const handleMultiUpdate = () => {
        // DELETE
        const idsToKeep = []
        for (const es of eventSports) { idsToKeep.push(es?.id) }
        // Mark ids to delete from original list that are left out of to keep ids.
        const idsToDelete = eventSportIds.filter(id => !idsToKeep.includes(id))
        // Iterate through the chopping block and delete those activity sports.
        for (const id of idsToDelete) {
            deleteEventSport(id)
        }
        // If a new id is not recognized in the keep list, set it to create.
        // Find the object with that id, assign an eventId property, then create it.

        // CREATE
        // If the activity sport has an id and is not undefined, create it.
        for (const es of eventSports) {
            if (!es?.hasOwnProperty("id") && es !== undefined) {
                es.eventId = parseInt(eventId)
                createEventSport(es)
            }
        }

        // UPDATE
        // If a kept id is included in the original list, update that sport.
        for (const id of eventSportIds) {
            const foundES = eventSports.find(es => es?.id === id)
            updateEventSport(foundES)
        }
        updateEvent(newEvent).then(setTimeout(() => history.push(`/events/${eventId}`), 1500))
    }

    return (
        <>
            <dialog ref={savingModal} className="fs-modal">
                <div className="loading-icon">
                    <img src={loading} /><br />
                    <span>Saving</span>
                </div>
            </dialog>
            <h2 className="create-event-h">{editMode ? "Edit Event" : "Create Event"}</h2>

            <form onSubmit={editMode ? handleUpdate : handleEvent} className="event-form">
                <div className="name-date">
                    <fieldset className="e-name">
                        <input type="text" name="name" className="create-event-input" placeholder={editMode ? newEvent.name : "Event name"} required={!newEvent.name} autofocus onChange={handleInput} />
                    </fieldset>

                    <fieldset>
                        <label htmlFor="date">
                            Date and Start Time
                        </label>
                        <input type="datetime-local" defaultValue={newEvent.date} name="date" className="create-event-input" required={!newEvent.date} onChange={handleInput} />
                    </fieldset>
                </div>

                <div className="e-inputs">

                    <fieldset>
                        <input type="text" name="city" className="create-event-input" placeholder={editMode ? newEvent.city : "City"} required={!newEvent.city} onChange={handleInput} />
                    </fieldset>

                    <fieldset>
                        <select defaultValue={""} name="state" className="create-event-input" required={!newEvent.state} onChange={handleInput}>
                            <option value="" disabled>{editMode ? "Change State" : "Select State"}</option>
                            {states.map(state => {
                                return <option name="state" value={state}>{state}</option>
                            })}
                        </select>
                    </fieldset>

                    <fieldset>
                        <input type="text" name="courseUrl" className="create-event-input" placeholder={editMode ? newEvent.courseUrl : "Course Map URL"} required={!newEvent.courseUrl} onChange={handleInput} />
                    </fieldset>

                    <fieldset>
                        <input type="text" name="eventLogo" className="create-event-input" placeholder={editMode ? newEvent.eventLogo : "Event Logo URL"} required={!newEvent.eventLogo} onChange={handleInput} />
                    </fieldset>
                </div>
                {!newEvent.eventLogo ? "" :
                    <div className="e-form-logo">
                        <img src={newEvent.eventLogo} alt={`${newEvent.name} logo`} />
                    </div>
                }

                <fieldset>
                    <textarea cols={50} name="description" className="create-event-input" placeholder={editMode ? newEvent.description : "Details about the event"} required={!newEvent.description} onChange={handleInput} />
                </fieldset>

                <fieldset className="part-limit">
                    <label htmlFor="maxParticipants">Participant Limit </label>
                    <input type="number" name="maxParticipants" className="create-event-input" placeholder={editMode ? newEvent.maxParticipants : ""} required={!newEvent.maxParticipants} onChange={handleInput} />
                </fieldset>


                <fieldset className="ms-radios">
                    <label htmlFor="multiSport">Multi-sport Event? </label>
                    <input type="radio" checked={multiSport === true} name="yes" className="create-event-input" onChange={handleMultiSwitch} />Yes
                    <input type="radio" checked={multiSport === false} name="no" className="create-event-input" onChange={handleMultiSwitch} />No
                </fieldset>

                {!multiSport ?
                    <>
                        {/* RADIOS FOR SINGLE SPORT */}
                        <fieldset className="ms-radios ss">
                            <label htmlFor="sport">Sport </label>
                            {sports.map(sport => {
                                return <>
                                    <input type="radio" checked={eventSport.sportId === sport.id} name='sportId' value={sport.id} required={!multiSport} className="create-event-input" onChange={(e) => handleSport(e)} />{sport.name}
                                </>
                            })}
                        </fieldset>

                        <div className="single-sport">
                            <fieldset>
                                <label htmlFor="distance">Distance</label>
                                <input type="number" name="distance" step="0.01" className="create-event-input"
                                    required={!multiSport && eventSport.distance === null}
                                    placeholder={eventSport.hasOwnProperty("distance") ? `${eventSport?.distance}mi` : ""}
                                    onChange={handleSport} />
                            </fieldset>

                            <fieldset>
                                <label htmlFor="elevGain">Elevation Gain</label>
                                <input type="number" name="elevGain" step="0.01" className="create-event-input"
                                    required={!multiSport && eventSport.elevGain === null}
                                    placeholder={eventSport.hasOwnProperty("elevGain") ? `${eventSport.elevGain}ft` : ""}
                                    onChange={handleSport} />
                            </fieldset>
                        </div>
                    </>
                    :
                    <>
                        {/* CHECKBOXES FOR MULTI SPORT */}
                        <div className="sports-label" htmlFor="sport">
                            {multiSport ? "Sports" : "Sport"} </div>

                        <div className="sports-container">
                            {sports?.map(sport => {

                                return <>
                                    <div className="ms-checkboxes">
                                        <fieldset className="ms-fields">
                                            <input type="checkbox" value={sport.id} checked={eventSports[sport.id - 1]?.hasOwnProperty("sportId")}
                                                name="sport" className="create-event-input"
                                                required={Object.values(eventSports).some(val => val === sport.id)}
                                                onChange={() => {
                                                    /*
                                                    Distance and elevation fields are controlled by checking for a sportId property on an object in the same index as the sport id.
                                                    - If there's an existing object with a sportId, reset it.
                                                    - If there's no object or sportId at that index, create one and set the sportID.
                                                    */
                                                    const index = sport.id - 1
                                                    const es = [...eventSports]
                                                    if (eventSports[index]?.hasOwnProperty("sportId")) {
                                                        es[index] = {}
                                                        setEventSports(es)
                                                    }
                                                    else {
                                                        es[index] = { sportId: sport.id }
                                                        setEventSports(es)
                                                    }
                                                }} />

                                            <label htmlFor="sport" className="sport-label">{sport.name}</label>
                                            {
                                                /* Dynamically render distance and elevation gain fields
                                                // Each fieldset should save as its own object with distance, elevGain and sportId.*/
                                                eventSports[sport.id - 1]?.hasOwnProperty("sportId") ?
                                                    <>
                                                        <fieldset className="ms-fields">
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

                                                        <fieldset className="ms-fields">
                                                            <input type="number" name="elevGain" step="0.01"
                                                                className="create-event-input ms-input" placeholder={editMode && eventSports[sport.id - 1].hasOwnProperty("elevGain") ?
                                                                    eventSports[sport.id - 1]?.elevGain : "Elevation gain (ft)"
                                                                } required={eventSports.some(as => as?.hasOwnProperty('sportId')
                                                                    && as.sportId === sport.id)
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
                        </div>
                    </>
                }
                <fieldset>
                    <div className="e-a-buttons">
                        <button type="submit">{editMode ? "Save" : "Create"}</button>
                        <button onClick={() => {
                            editMode ? history.push(`/events/${eventId}`) :
                                history.push(`/events`)
                        }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    )
}