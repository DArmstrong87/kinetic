import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createEvent, createEventSport, getSports, statesList } from "./EventsProvider";
import "./CreateEvent.css"

export const CreateEvent = () => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const states = statesList()
    const [newEvent, setEvent] = useState({

    })
    const [eventSport, setEventSport] = useState({ sportId: 0 })
    const [fields, toggleFields] = useState({})
    const [eventSports, setEventSports] = useState([])
    const history = useHistory()

    useEffect(() => {
        getSports().then(sports => setSports(sports))
    }, [])

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
        e.preventDefault()
        // Before event creation, confirm if a sport has been selected and that all fields are filled out.
        if ((eventSport.sportId !== 0 && multiSport === false) ||
            (eventSports.some(es => es.hasOwnProperty('sportId')))
            && eventSports.some(es => es.hasOwnProperty('distance'))
            && eventSports.some(es => es.hasOwnProperty('elevGain'))
            && multiSport === true) {
            createEvent(newEvent)
                .then(res => res.json())
                .then(createdEvent => {
                    // Confirm event was created by checking for an id.
                    // if multisport
                    if (createdEvent.hasOwnProperty("id") && multiSport === false) {
                        const es = { ...eventSport }
                        es.eventId = createdEvent.id
                        createEventSport(es).then(
                            history.push(`/events/${createdEvent.id}`)
                        )
                    } else if (createdEvent.hasOwnProperty("id") && multiSport === true) {
                        for (const es of eventSports) {
                            if (es.hasOwnProperty('sportId')) {
                                const e = { ...es }
                                e.eventId = createdEvent.id
                                createEventSport(e).then(createdEventSport => {
                                    if (createdEventSport.sport.id === eventSports[eventSports.length - 1].sportId) {
                                        history.push(`/events/${createdEvent.id}`)
                                    }
                                })
                            }
                        }
                    }
                })
        } else {
            // Display modal for selecting a sport or sports.
        }
    }


    return (
        <>
            <h2>Create Event</h2>

            <form onSubmit={handleEvent}>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="name">Event Name </label>
                    <input type="text" name="name" className="create-event-input" placeholder="Event name" required autofocus onChange={handleInput} />
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="date"> Date and Start Time </label>
                    <input type="datetime-local" name="date" className="create-event-input" required onChange={handleInput} />
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="city">City</label>
                    <input type="text" name="city" className="create-event-input" placeholder="City" required onChange={handleInput} />
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="state">State </label>
                    <select defaultValue={0} name="state" className="create-event-input" required onChange={handleInput}>
                        <option value={0} disabled>Select State</option>
                        {states.map(state => {
                            return <option name="state">{state}</option>
                        })}
                    </select>
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="description">Description </label>
                    <input type="text" name="description" className="create-event-input" placeholder="Details about the event" required onChange={handleInput} />
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="maxParticipants">Participant Limit </label>
                    <input type="number" name="maxParticipants" className="create-event-input" required onChange={handleInput} />
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="courseUrl">Course Map URL </label>
                    <input type="text" name="courseUrl" className="create-event-input" required onChange={handleInput} />
                </fieldset>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="eventLogo">Event Logo URL</label>
                    <input type="text" name="eventLogo" className="create-event-input" required onChange={handleInput} />
                </fieldset>

                <fieldset className="event-field">
                    <label className="input-label" htmlFor="multiSport">Multi-sport Event? </label>
                    <input type="radio" checked={multiSport === true} name="yes" className="create-event-input" onChange={() => setMulti(true)} />Yes
                    <input type="radio" checked={multiSport === false} name="no" className="create-event-input" onChange={() => { setMulti(false) }} />No
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
                            <input type="number" name="distance" className="create-event-input" required={!multiSport} onChange={handleSports} />
                        </fieldset>
                        <fieldset className="event-field">
                            <label className="input-label" htmlFor="elevGain">Elevation Gain</label>
                            <input type="number" name="elevGain" className="create-event-input" required={!multiSport} onChange={handleSports} />
                        </fieldset>
                    </>
                    :
                    <>
                        {/* CHECKBOXES FOR MULTI SPORT */}
                        <div className="input-label" htmlFor="sport">
                            {multiSport ? "Sports" : "Sport"} </div>

                        {sports?.map(sport => {
                            return <>
                                <fieldset>
                                    <input type="checkbox" value={sport.id} checked={fields[`f${sport.id}`]}
                                        name="sport" className="create-event-input" required={fields.hasOwnProperty(`f${sport.id}`)}
                                        onChange={() => {
                                            /*
                                            1. Copy fields object
                                            2. Check if current field key exists, if not, create one and set value to false.
                                            3. If the value exists and is false, set to true.
                                            4. If true, set to false and set the eventSport object to empty. 
                                            5. Set toggle fields.
                                            */
                                            const field = { ...fields }
                                            let fvalue = field[`f${sport.id}`]
                                            // debugger
                                            if (!fvalue) { field[`f${sport.id}`] = true }
                                            else if (fvalue === false) {
                                                field[`f${sport.id}`] = true
                                            }
                                            else {
                                                field[`f${sport.id}`] = false;
                                                let es = [...eventSports]
                                                es[sport.id - 1] = {}
                                                setEventSports(es)
                                            }
                                            toggleFields(field)
                                        }} />
                                    <label htmlFor="sport" className="sport-label">{sport.name}</label>
                                    {
                                        /* Dynamically render distance and elevation gain fields
                                        // Each fieldset should save as its own object with distance, elevGain and sportId, then saved to the eventSports array.*/
                                        fields[`f${sport.id}`] ?
                                            <>
                                                <fieldset>
                                                    <input type="number" name="distance" className="create-event-input ms-input" placeholder="Distance (mi)"
                                                        required={eventSports.some(es => es.hasOwnProperty('sportId') && es.sportId === sport.id)}
                                                        onChange={(e) => {
                                                            const es = [...eventSports]
                                                            const index = sport.id - 1
                                                            if (!es[index]) { es[index] = { sportId: sport.id } }
                                                            es[index]['distance'] = parseInt(e.target.value)
                                                            setEventSports(es)
                                                        }} />
                                                </fieldset>
                                                <fieldset>
                                                    <input type="number" name="elevGain"
                                                        className="create-event-input ms-input" placeholder="Elevation Gain (ft)" required={eventSports.some(es => es.hasOwnProperty('sportId') && es.sportId === sport.id)}
                                                        onChange={(e) => {
                                                            const es = [...eventSports]
                                                            const index = sport.id - 1
                                                            if (!es[index]) { es[index] = {} }
                                                            es[index]['elevGain'] = parseInt(e.target.value)
                                                            setEventSports(es)
                                                        }} />
                                                </fieldset>
                                            </>
                                            : ""
                                    }
                                </fieldset>
                            </>
                        })}

                    </>
                }
                <fieldset>
                    <button type="submit">Create</button>
                </fieldset>
            </form>
        </>
    )
}