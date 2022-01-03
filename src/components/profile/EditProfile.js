import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { getAthlete, updateAthlete } from "./AthleteProvider";
import "./EditProfile.css"
import loading from "../../Infinity.gif"

export const EditProfile = () => {
    const [athlete, setAthlete] = useState({})
    const history = useHistory()
    const savingModal = useRef()

    useEffect(() => {
        getAthlete().then(a => setAthlete(
            {
                firstName: a?.user.first_name,
                lastName: a?.user.last_name,
                bio: a.bio,
                VO2max: a.VO2_max,
                rhr: a.rhr,
                fluidLoss: a.fluid_loss,
                sodiumLoss: a.sodium_loss,
                weight: a.weight,
                id: a.id
            }
        ))
    }, [])


    const handleUser = (e) => {
        const user = { ...athlete }
        if (e.target.name === "VO2max"
            || e.target.name === "fluidLoss"
            || e.target.name === "sodiumLoss") {
            user[e.target.name] = parseFloat(e.target.value)
        }
        else if (e.target.name === "rhr" || e.target.name === "weight") {
            user[e.target.name] = parseInt(e.target.value)
        }
        else { user[e.target.name] = e.target.value }
        setAthlete(user)
    }

    const handleUpdate = () => {
        savingModal.current.showModal()
        const a = { ...athlete }
        updateAthlete(a, a.id)
            .then(setTimeout(() => history.push('/profile'), 1000))
    }

    return (
        <>
            <dialog ref={savingModal} className="fs-modal">
                <div className="loading-icon">
                    <img src={loading} alt="loading"/><br />
                    <span>Saving</span>
                </div>
            </dialog>
            <h2 className="edit-h">Edit Profile</h2>
            <div className="editProfile">
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input type="text" name="firstName" className="form-control" value={athlete.firstName} required autoFocus onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input type="text" name="lastName" value={athlete.lastName} className="form-control" required onChange={handleUser} />
                </fieldset>
                {/* <fieldset>
                    <label htmlFor="inputPassword">New Password </label>
                    <input type="password" name="password" className="form-control" value="Password" required onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="verifyPassword">Verify New Password </label>
                    <input type="password" name="verifyPassword" className="form-control" value="Verify password" required onChange={handleUser} />
                </fieldset> */}
                <fieldset>
                    <label htmlFor="bio">Bio </label>
                    <textarea name="bio" className="form-control" value={athlete.bio} required onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="rhr">Resting Heart Rate - bpm</label>
                    <input type="number" name="rhr" className="form-control" value={athlete.rhr} onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="vo2"> Vo2Max - mL/kg/min</label>
                    <input type="number" value={athlete.VO2max} className="form-control" name="VO2max" step="0.01" onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="fluidLoss">Fluid loss - L/hr</label>
                    <input type="number" value={athlete.fluidLoss} className="form-control" name="fluidLoss" step="0.01" onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="sodiumLoss">Sodium Loss - mg/hr</label>
                    <input type="number" value={athlete.sodiumLoss} className="form-control" name="sodiumLoss" onChange={handleUser} />
                </fieldset>
                <fieldset>
                    <label htmlFor="weight">Weight - lbs</label>
                    <input type="number" value={athlete.weight} className="form-control" name="weight" onChange={handleUser} />
                </fieldset>
                <fieldset style={{
                    textAlign: "center"
                }}>
                    <button className="save-profile" onClick={handleUpdate}>Save</button>
                    <button className="save-profile" onClick={() => history.push("/profile")}>Cancel</button>
                </fieldset>
            </div>
        </>
    )
}