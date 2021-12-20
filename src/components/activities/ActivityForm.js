import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getSports } from "../events/EventsProvider";
import { useParams } from "react-router-dom";
import { createActivity, createActivitySport, deleteActivitySport, getActivity, updateActivity, updateActivitySport } from "./ActivityProvider";
import "./ActivityForm.css"
import loading from "../../Infinity.gif"

export const ActivityForm = ({ editMode }) => {
    const [multiSport, setMulti] = useState(false)
    const [sports, setSports] = useState([])
    const [newActivity, setActivity] = useState({})
    const [activitySport, setActivitySport] = useState({ sportId: 0 })
    const [activitySportIds, setAsIds] = useState([])
    const [activitySports, setActivitySports] = useState([])
    const [saving, setSaving] = useState(false)
    const { activityId } = useParams()
    const history = useHistory()

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
        if (editMode) {
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
    }, [activityId, editMode])

    const handleInput = (e) => {
        const activity = { ...newActivity }
        activity[e.target.name] = e.target.value
        setActivity(activity)
    }

    const handleSport = (e) => {
        if (e.target.name === "sportId") {
            const as = { sportId: parseInt(e.target.value) }
            setActivitySport(as)
        } else {
            const as = { ...activitySport }
            as[e.target.name] = parseInt(e.target.value)
            setActivitySport(as)
        }
    }

    const handleMultiSwitch = () => {
        if (multiSport) {
            setMulti(false)
        } else {
            setMulti(true)
            const index = activitySport.sportId - 1
            const aSports = activitySports
            aSports[index] = activitySport
            setActivitySports(aSports)
        }
    }

    const handleActivity = (e) => {
        setSaving(true)
        // Before activity creation, confirm if a sport has been selected and that all fields are filled out.
        e.preventDefault()
        createActivity(newActivity)
            .then(res => res.json())
            .then(createdActivity => {
                // Confirm activity was created by checking for an id.
                // If single sport, check id and push to activity page.
                if (createdActivity.hasOwnProperty("id") && multiSport === false) {
                    const as = { ...activitySport }
                    as.activityId = createdActivity.id
                    createActivitySport(as).then(setTimeout(() => history.push(`/activities/${createdActivity.id}`), 1500))
                } else if (createdActivity.hasOwnProperty("id") && multiSport === true) {
                    for (const as of activitySports) {
                        if (as.hasOwnProperty('sportId')) {
                            const a = { ...as }
                            a.activityId = createdActivity.id
                            // If multi sport, check id wait til last activity sport is created before pushing to activity page.
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
        setSaving(true)
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
        setSaving(true)

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
            <h2 className="create-activity-h">{editMode ? `Edit Activity` : "Create Activity"}</h2>

            <form onSubmit={editMode ? handleUpdate : handleActivity} className="activity-form">

                <div className="name-date">
                    <fieldset className="a-name">
                        <input type="text" name="name" placeholder={editMode ? newActivity.name : "Activity name"} required={!newActivity.name} autofocus onChange={handleInput} />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="date">
                            Date
                        </label>
                        <input type="date" defaultValue={newActivity.createdOn} name="createdOn" required={!newActivity.createdOn} onChange={handleInput} />
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
                                <input type="number" name="distance"
                                    step="0.01" required={!multiSport && activitySport.distance === null} placeholder={activitySport.hasOwnProperty("distance") ? `${activitySport?.distance}mi` : ""} onChange={handleSport} />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="elevGain">Elevation Gain</label>
                                <input type="number" name="elevGain" step="0.01" required={!multiSport || activitySport.elevGain === null} placeholder={activitySport.hasOwnProperty("elevGain") ? `${activitySport.elevGain}ft` : ""} onChange={handleSport} />
                            </fieldset>
                        </div>
                    </>
                    :
                    <>
                        <div className="sports-label" htmlFor="sport">
                            Sports:</div>

                        {/* CHECKBOXES FOR MULTI SPORT */}
                        <div className="sports-container">

                            {sports?.map(sport => {

                                return <>
                                    <div className="ms-checkboxes">
                                        <fieldset className="ms-fields">
                                            <input type="checkbox" value={sport.id} checked={activitySports[sport.id - 1]?.hasOwnProperty("sportId")}
                                                name="sport"
                                                required={Object.values(activitySports).some(val => val === sport.id)}
                                                onChange={() => {
                                                    /*
                                                    Distance and elevation fields are controlled by checking for a sportId property on an object in the same index as the sport id.
                                                    - If there's an existing object with a sportId, reset it.
                                                    - If there's no object or sportId at that index, create one and set the sportID.
                                                    */
                                                    const index = sport.id - 1
                                                    const as = [...activitySports]
                                                    if (activitySports[index]?.hasOwnProperty("sportId")) {
                                                        as[index] = {}
                                                        setActivitySports(as)
                                                    }
                                                    else {
                                                        as[index] = { sportId: sport.id }
                                                        setActivitySports(as)
                                                    }
                                                }} />

                                            <label htmlFor="sport" className="sport-label">{sport.name}</label>
                                            {
                                                /* Dynamically render distance and elevation gain fields
                                                // Each fieldset should save as its own object with distance, elevGain and sportId.*/
                                                activitySports[sport.id - 1]?.hasOwnProperty("sportId") ?
                                                    <>
                                                        <fieldset className="ms-fields">
                                                            <input type="number" name="distance" step="0.01" className="create-activity-input ms-input" placeholder={editMode && activitySports[sport.id - 1].hasOwnProperty("distance") ?
                                                                activitySports[sport.id - 1]?.distance : "Distance (mi)"
                                                            }
                                                                required={activitySports.some(as => as?.hasOwnProperty('sportId')
                                                                    && as.sportId === sport.id)
                                                                    && !activitySports[sport.id - 1].sportId === sport.id}
                                                                onChange={(e) => {
                                                                    const as = [...activitySports]
                                                                    const index = sport.id - 1
                                                                    as[index]['distance'] = parseFloat(e.target.value)
                                                                    setActivitySports(as)
                                                                }} />
                                                        </fieldset>

                                                        <fieldset className="ms-fields">
                                                            <input type="number" name="elevGain" step="0.01"
                                                                className="create-activity-input ms-input" placeholder={editMode && activitySports[sport.id - 1].hasOwnProperty("elevGain") ?
                                                                    activitySports[sport.id - 1]?.elevGain : "Elevation gain (ft)"
                                                                } required={activitySports.some(as => as?.hasOwnProperty('sportId')
                                                                    && as.sportId === sport.id)
                                                                    && !activitySports[sport.id - 1].sportId === sport.id
                                                                }
                                                                onChange={(e) => {
                                                                    const as = [...activitySports]
                                                                    const index = sport.id - 1
                                                                    if (!as[index]) { as[index] = {} }
                                                                    as[index]['elevGain'] = parseFloat(e.target.value)
                                                                    setActivitySports(as)
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
                {saving ?
                    <div className="loading-icon">
                        <img src={loading} /><br />
                        <span>Saving</span>
                    </div>
                    :
                    <>
                        <fieldset>
                            <button type="submit">{editMode ? "Save" : "Create"}</button>
                            <button onClick={() => {
                                editMode ? history.push(`/activities/${activityId}`) :
                                    history.push(`/activities`)
                            }}>Cancel</button>
                        </fieldset>
                    </>
                }
            </form>
        </>
    )
}