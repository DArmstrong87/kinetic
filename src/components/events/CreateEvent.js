import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createEvent, createEventSport, getSports } from "./EventsProvider";

export const CreateEvent = () => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const [newEvent, setEvent] = useState({
        city: "sdaf",
        courseUrl: "asdf",
        date: "0003-03-31T15:03",
        description: "safd",
        event_logo: "safde",
        maxParticipants: 33,
        name: "33",
        state: "TN",
        eventLogo: "asdfasfd"
    })
    const [eventSport, setEventSport] = useState({
        sportId: 0,
        name: ""
    })
    const history = useHistory()
    console.log(newEvent)

    const handleInput = (e) => {
        const event = { ...newEvent }
        event[e.target.name] = e.target.value
        setEvent(event)
    }

    const handleSports = (e) => {
        if (!multiSport) {
            // debugger
            const es = { ...eventSport }
            es.sportId = parseInt(e.target.value)
            es.name = e.target.name
            setEventSport(es)
        } else { }
    }
    console.log(eventSport)

    useEffect(() => {
        getSports().then(sports => setSports(sports))
    }, [])

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
                <fieldset>
                    <label htmlFor="name">Event Name </label>
                    <input type="text" name="name" className="form-control" placeholder="Event name" required autoFocus onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="date"> Date and Start Time </label>
                    <input type="datetime-local" name="date" className="form-control" required onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="city">City</label>
                    <input type="text" name="city" className="form-control" placeholder="City" required onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="state">State </label>
                    <input type="text" name="state" className="form-control" required onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="description">Description </label>
                    <input type="text" name="description" className="form-control" placeholder="Details about the event" required onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="maxParticipants">Participant Limit </label>
                    <input type="number" name="maxParticipants" className="form-control" required onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="courseUrl">Course Map URL </label>
                    <input type="text" name="courseUrl" className="form-control" required onChange={handleInput} />
                </fieldset>
                <fieldset>
                    <label htmlFor="eventLogo">Event Logo URL</label>
                    <input type="text" name="eventLogo" className="form-control" required onChange={handleInput} />
                </fieldset>

                <fieldset>
                    <label htmlFor="multiSport">Multi-sport Event? </label>
                    <input type="radio" checked={multiSport === true} name="yes" className="form-control" required onChange={() => setMulti(true)} />Yes
                    <input type="radio" checked={multiSport === false} name="no" className="form-control" required onChange={() => { setMulti(false) }} />No
                </fieldset>

                {!multiSport ?
                    <>
                        <fieldset>
                            <label htmlFor="sport">Sport </label>
                            {sports.map(sport => {
                                return <>
                                    <input type="radio" checked={eventSport.sportId === sport.id} name={sport.name} value={sport.id} className="form-control" required onChange={(e) => handleSports(e)} />{sport.name}
                                </>
                            })}
                        </fieldset>
                        <fieldset>
                            <label htmlFor="distance">Distance</label>
                            <input type="number" name="distance" className="form-control" required onChange={handleSports} />
                        </fieldset>
                    </>
                    :
                    <fieldset>
                        <label htmlFor="sport">Sport </label>
                        {sports.map(sport => {
                            return <>
                                <input type="checkbox" checked={sport === sport.name} value={sport.name} name="sport" className="form-control" required onChange={() => setMulti(true)} />{sport.name}
                            </>
                        })}
                    </fieldset>}
            </form>
            <button onClick={submitEvent}>Create</button>
        </>
    )
}