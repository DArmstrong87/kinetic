import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createEvent, createEventSport, getSports, statesList } from "./EventsProvider";
import "./CreateEvent.css"

export const CreateEvent = () => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const states = statesList()
    const [newEvent, setEvent] = useState({
        city: "Chattanooga",
        courseUrl: "asdf",
        date: "2022-09-16T07:00",
        description: "Multisport Event",
        eventLogo: "safde",
        maxParticipants: 2000,
        name: "Chattanooga Iron Man",
        state: "TN"
    })
    const [eventSport, setEventSport] = useState({
        sportId: 0,
        name: ""
    })
    const [sportIds, setSportIds] = useState([])
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
        es.sportId = parseInt(e.target.value)
        es.name = e.target.name
        setEventSport(es)
    }

    const getSportName = (id) => {
        const sport = sports.find(sport => sport.id = id)
        return sport.name
    }

    const submitEvent = () => {
        createEvent(newEvent)
            .then(res => res.json())
            .then(createdEvent => {
                if (createdEvent.hasOwnProperty("id") && multiSport === false) {
                    const es = { ...eventSport }
                    es.eventId = createdEvent.id
                    createEventSport(es).then(
                        history.push(`/events/${createdEvent.id}`)
                    )
                }
            })
    }


    return (
        <>
            <h2>Create Event</h2>

            <form>
                <fieldset className="event-field">
                    <label className="input-label" htmlFor="name">Event Name </label>
                    <input type="text" name="name" className="create-event-input" placeholder="Event name" required onChange={handleInput} />
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
                    <select defaultValue={0} name="state" className="create-event-input"
                        onChange={handleInput}>
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
                    <input type="radio" checked={multiSport === true} name="yes" className="create-event-input" required onChange={() => setMulti(true)} />Yes
                    <input type="radio" checked={multiSport === false} name="no" className="create-event-input" required onChange={() => { setMulti(false) }} />No
                </fieldset>
            </form>

            {!multiSport ?
                <>
                    {/* RADIOS FOR SINGLE SPORT */}
                    <fieldset className="event-field">
                        <label className="input-label" htmlFor="sport">Sport </label>
                        {sports.map(sport => {
                            return <>
                                <input type="radio" checked={eventSport.sportId === sport.id} name={sport.name} value={sport.id} className="create-event-input" required onChange={(e) => handleSports(e)} />{sport.name}
                            </>
                        })}
                    </fieldset>
                    <fieldset className="event-field">
                        <label className="input-label" htmlFor="distance">Distance</label>
                        <input type="number" name="distance" className="create-event-input" required onChange={handleSports} />
                    </fieldset>
                    <fieldset className="event-field">
                        <label className="input-label" htmlFor="elevGain">Elevation Gain</label>
                        <input type="number" name="elevGain" className="create-event-input" required onChange={handleSports} />
                    </fieldset>
                </>
                :
                <>
                    {/* CHECKBOXES FOR MULTI SPORT */}
                    <div className="input-label" htmlFor="sport">
                        {multiSport ? "Sports" : "Sport"} </div>
                    < form className="multiSportForm">
                        {sports?.map(sport => {
                            return <>
                                <fieldset>
                                    <input type="checkbox" value={sport.id} checked={fields[`f${sport.id}`]}
                                        name="sport" className="create-event-input" required
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
                                        fields[`f${sport.id}`] ?
                                            <>
                                                <fieldset>
                                                    <input type="number" name="distance" className="create-event-input ms-input" placeholder="Distance (mi)" required onChange={(e) => {
                                                        const es = [...eventSports]
                                                        const index = sport.id - 1
                                                        if (!es[index]) { es[index] = { sportId: sport.id } }
                                                        es[index]['distance'] = parseInt(e.target.value)
                                                        setEventSports(es)
                                                    }} />
                                                </fieldset>
                                                <fieldset>
                                                    <input type="number" name="elevGain"
                                                        className="create-event-input ms-input" placeholder="Elevation Gain (ft)" required onChange={(e) => {
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
                    </form>
                </>
            }


            {/* Dynamically render distance and elevation gain fields
                        // Each fieldset should save as its own object with dist, elevGain and sportId, then saved to the eventSports array.*/}

            <button onClick={submitEvent}>Create</button>
        </>
    )
}