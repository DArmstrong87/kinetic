import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { getEvent, getSports } from "../events/EventsProvider";
import { useParams } from "react-router-dom";
import { completeEvent, createActivity, createActivitySport, deleteActivitySport, getActivity, getAE, updateActivity, updateActivitySport } from "./ActivityProvider";
import "./ActivityForm.css"
import loading from "../../Infinity.gif"

export const ActivityForm = ({ fromEvent }) => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const [newActivity, setActivity] = useState({})
    const [activitySport, setActivitySport] = useState({ sportId: 0 })
    const [activitySportIds, setAsIds] = useState([])
    const [activitySports, setActivitySports] = useState([])
    const [athleteEvent, setAE] = useState({})
    const { activityId } = useParams()
    const { eventId } = useParams()
    const history = useHistory()
    const savingModal = useRef()

    const convertActivitySports = (aSp) => {
        // For existing data to edit, it will be placed in the same arrays in how they are originally created.
        if (aSp.length === 1) {
            const as = {
                sportId: aSp[0].sport.id,
                distance: aSp[0].distance,
                elevGain: aSp[0].elev_gain,
                id: aSp[0].id
            }
            let asid = activitySportIds
            asid.push(aSp[0].id)
            setAsIds(asid)
            setActivitySport(as)
        } else {
            aSp.sort((a, b) => {
                let first = a.sport.id
                let second = b.sport.id
                return first - second
            })
            // Each existing activity sport is stored in the activity sport array.
            for (const as of aSp) {
                const index = as.sport?.id - 1
                const copy = activitySports
                const aSp_Copy = {
                    sportId: as.sport.id,
                    distance: as.distance,
                    elevGain: as.elev_gain,
                    id: as.id
                }
                copy[index] = aSp_Copy
                setActivitySports(copy)

                //Set separate ES id array for updating or deleting based on new input.
                let asid = activitySportIds
                asid.push(as.id)
                setAsIds(asid)
            }
        }
    }

    useEffect(() => {
        getSports().then(sports => setSports(sports))
        if (activityId && !fromEvent) {
            getActivity(activityId).then(a => {
                if (a.activity_sports?.length > 1) {
                    setMulti(true)
                }
                convertActivitySports(a.activity_sports)
                setActivity({
                    name: a.name,
                    createdOn: a.created_on,
                    id: a.id
                })
            })
        }
        else if (fromEvent) {
            getEvent(eventId).then(e => {
                if (e.event_sports?.length > 1) { setMulti(true) }
                convertActivitySports(e.event_sports)
                let date = e.date.split(" ")[0].split("/")
                date = [date[2], date[0], date[1]].join('-')
                setActivity({
                    name: e.name,
                    createdOn: date,
                })
            })
            getAE(eventId).then(ae => setAE(ae))
        }
    }, [activityId, fromEvent])

    const handleActivityInput = (e) => {
        const activity = { ...newActivity }
        activity[e.target.name] = e.target.value
        setActivity(activity)
    }

    const handleSport = (e) => {
        if (e.target.name === "sportId") {
            let aS = {}
            if (e.target.value === '3') {
                aS = { sportId: parseInt(e.target.value), elevGain: 0 }
            }
            else {
                aS = { sportId: parseInt(e.target.value) }
            }
            setActivitySport(aS)
        } else {
            const aS = { ...activitySport }
            aS[e.target.name] = parseInt(e.target.value)
            setActivitySport(aS)
        }
    }

    const handleSportsInput = (sportId, e) => {
        const aS = [...activitySports]
        const index = sportId - 1
        if (!aS[index]) { aS[index] = {} }
        if (e.target.name === 'sport') {
            /*
            Distance and elevation fields are controlled by checking for a sportId property on an object in the same index as the sport id.
            - If there's an existing object with a sportId, reset it.
            - If there's no object or sportId at that index, create one and set the sportID.
            */
            if (activitySports[index]?.hasOwnProperty("sportId")) {
                aS[index] = {}
                setActivitySports(aS)
            }
            else {
                if (sportId === 3) {
                    aS[index] = { sportId: sportId, elevGain: 0 }
                }
                else {
                    aS[index] = { sportId: sportId }
                }
                setActivitySports(aS)
            }
        } else {
            aS[index][e.target.name] = parseFloat(e.target.value)
            setActivitySports(aS)
        }
    }

    const handleMultiSwitch = () => {
        if (multiSport) { setMulti(false); setActivitySport({}) }
        else { setMulti(true) }
    }

    const handleActivity = (e) => {
        e.preventDefault()
        savingModal.current.showModal()
        // Before activity creation, confirm if a sport has been selected and that all fields are filled out.
        if (fromEvent) { completeEvent(athleteEvent.id) }
        createActivity(newActivity)
            .then(res => res.json())
            .then(createdActivity => {
                // Confirm activity was created by checking for an id before assigning activityId to activity Sport objects.
                if (createdActivity.hasOwnProperty("id") && multiSport === false) {
                    const as = { ...activitySport }
                    as.activityId = createdActivity.id
                    createActivitySport(as).then(setTimeout(() => history.push(`/activities/${createdActivity.id}`), 1500))
                } else if (createdActivity.hasOwnProperty("id") && multiSport === true) {
                    for (const as of activitySports) {
                        if (as.hasOwnProperty('sportId')) {
                            const a = { ...as }
                            a.activityId = createdActivity.id
                            createActivitySport(a).then(setTimeout(() => history.push(`/activities/${createdActivity.id}`), 1500))
                        }
                    }
                }
            })
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        if (multiSport) { handleMultiUpdate() }
        else { handleSingleSportUpdate(e) }
    }

    const handleSingleSportUpdate = () => {
        savingModal.current.showModal()
        // Handle change from multi to single sport.
        // Delete all in multisports.
        for (const as of activitySports) {
            if (as?.hasOwnProperty("id")) { deleteActivitySport(as?.id) }
        }
        if (activitySport.hasOwnProperty("id")) {
            updateActivitySport(activitySport)
        } else {
            activitySport.activityId = parseInt(activityId)
            deleteActivitySport(activitySportIds[0])
            createActivitySport(activitySport)
        }
        updateActivity(newActivity).then(setTimeout(() => history.push(`/activities/${activityId}`), 1500))
    }

    const handleMultiUpdate = () => {
        savingModal.current.showModal()

        // DELETE
        const idsToKeep = []
        for (const as of activitySports) { idsToKeep.push(as?.id) }
        // Mark ids to delete from original list that are left out of to keep ids.
        const idsToDelete = activitySportIds.filter(id => !idsToKeep.includes(id))
        // Iterate through the chopping block and delete those activity sports.
        for (const id of idsToDelete) {
            deleteActivitySport(id)
        }
        // If a new id is not recognized in the keep list, set it to create.
        // Find the object with that id, assign an activityId property, then create it.

        // CREATE
        // If the activity sport has an id and is not undefined, create it.
        for (const as of activitySports) {
            if (!as?.hasOwnProperty("id") && as !== undefined) {
                as.activityId = parseInt(activityId)
                createActivitySport(as)
            }
        }

        // UPDATE
        // If a kept id is included in the original list, update that sport.
        for (const id of activitySportIds) {
            const foundAS = activitySports.find(as => as?.id === id)
            updateActivitySport(foundAS)
        }
        updateActivity(newActivity).then(setTimeout(() => history.push(`/activities/${activityId}`), 1500))
    }


    return (
        <>
            <dialog ref={savingModal} className="fs-modal">
                <div className="loading-icon">
                    <img src={loading} /><br />
                    <span>Saving</span>
                </div>
            </dialog>
            <h2 className="create-activity-h">{activityId && !fromEvent ? `Edit Activity` : "Create Activity"}</h2>

            <form onSubmit={activityId && !fromEvent ? handleUpdate : handleActivity} className="activity-form">

                <div className="name-date">
                    <fieldset className="a-name">
                        <input type="text" name="name" placeholder={activityId ? newActivity.name : "Activity name"}
                        value={newActivity.hasOwnProperty('name') ? newActivity.name : ""}
                        required={!newActivity.name} autofocus onChange={handleActivityInput} />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="date">
                            Date
                        </label>
                        <input type="date" defaultValue={newActivity.createdOn} name="createdOn" required={!newActivity.createdOn} onChange={handleActivityInput} />
                    </fieldset>
                </div>

                <fieldset className="ms-radios">
                    <label htmlFor="multiSport">Multi-sport Activity? </label>
                    <input type="radio" checked={multiSport === true} name="yes" onChange={handleMultiSwitch} />Yes
                    <input type="radio" checked={multiSport === false} name="no" onChange={handleMultiSwitch} />No
                </fieldset>

                {!multiSport ?
                    <>
                        {/* RADIOS FOR SINGLE SPORT */}

                        <fieldset className="ms-radios ss">
                            <label htmlFor="sport">Sport: </label>
                            {sports.map(sport => {
                                return <>
                                    <input type="radio" checked={activitySport.sportId === sport.id} name='sportId' value={sport.id} required={!multiSport} onChange={(e) => { handleSport(e) }} />
                                    <label htmlFor="sport">{sport.name}</label>
                                </>
                            })}
                        </fieldset>

                        {/* Single Sport Inputs */}
                        <div className="single-sport">
                            <fieldset>
                                <label htmlFor="distance">Distance</label>
                                <input type="number" name="distance" value={activitySport.hasOwnProperty('distance') ? activitySport.distance : ""}
                                    step="0.01" required={!multiSport} placeholder={"mi"} onChange={handleSport} />
                            </fieldset>
                            {activitySport.sportId === 3 ? "" :
                                <fieldset>
                                    <label htmlFor="elevGain">Elevation Gain</label>
                                    <input type="number" name="elevGain" step="0.01"
                                        value={activitySport.hasOwnProperty('elevGain') ? activitySport.elevGain : ""}
                                        required={!multiSport} placeholder={"ft"} onChange={handleSport} />
                                </fieldset>
                            }
                        </div>
                    </>
                    :
                    <>
                        <div className="sports-label" htmlFor="sport">
                            Sports:</div>

                        {/* CHECKBOXES FOR MULTI SPORT */}
                        <div className="sports-container">

                            {sports?.map(sport => {
                                const index = sport.id - 1
                                return <>
                                    <div className="ms-checkboxes">
                                        <fieldset className="ms-fields">
                                            <input type="checkbox" value={sport.id} checked={activitySports[index]?.hasOwnProperty("sportId")}
                                                name="sport"
                                                required={!activitySports.some(aS => aS.hasOwnProperty('sportId'))}
                                                onChange={(e) => { handleSportsInput(sport.id, e) }} />

                                            <label htmlFor="sport" className="sport-label">{sport.name}</label>
                                            {
                                                /* Dynamically render distance and elevation gain fields
                                                // Each fieldset should save as its own object with distance, elevGain and sportId.*/
                                                activitySports[index]?.hasOwnProperty("sportId") ?
                                                    <>
                                                        <fieldset className="ms-fields">
                                                            <input type="number" name="distance" step="0.01" 
                                                            value={activitySports[index].hasOwnProperty('distance') ? activitySports[index].distance : ""}
                                                            className="create-activity-input ms-input"
                                                                placeholder={"Distance (mi)"
                                                                }
                                                                required={activitySports[index].hasOwnProperty('sportId')}
                                                                onChange={(e) => { handleSportsInput(sport.id, e) }} />
                                                        </fieldset>
                                                        {sport.id === 3 ? "" :
                                                            <fieldset className="ms-fields">
                                                                <input type="number" name="elevGain" step="0.01"
                                                                value={activitySports[index].hasOwnProperty('elevGain') ? activitySports[index].elevGain : ""}
                                                                    className="create-activity-input ms-input" placeholder={activityId && activitySports[index].hasOwnProperty("elevGain") ?
                                                                        activitySports[index]?.elevGain : "Elevation gain (ft)"
                                                                    } required={activitySports[index].hasOwnProperty('sportId')
                                                                    }
                                                                    onChange={(e) => { handleSportsInput(sport.id, e) }} />
                                                            </fieldset>
                                                        }
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
                        <button type="submit">{activityId ? "Save" : "Create"}</button>
                        <button onClick={() => {
                            activityId && !fromEvent ? history.push(`/activities/${activityId}`)
                                : fromEvent ? history.push(`/events/${eventId}`)
                                    : history.push(`/activities`)
                        }}>Cancel</button>
                    </div>
                </fieldset>
            </form>
        </>
    )
}