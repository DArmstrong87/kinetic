import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAthlete, updateAthlete } from "./AthleteProvider";

export const EditProfile = () => {
    const [athlete, setAthlete] = useState({})
    console.log(athlete)
    const history = useHistory()

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
        if (e.target.name === "VO2max" || e.target.name === "fluidLoss" || e.target.name === "sodiumLoss") {
            user[e.target.name] = parseFloat(e.target.value)
        }
        else if (e.target.name === "rhr" || e.target.name === "weight") {
            user[e.target.name] = parseInt(e.target.value)
        }
        else { user[e.target.name] = e.target.value }
        setAthlete(user)
    }

    const handleUpdate = () => {
        const a = { ...athlete }
        updateAthlete(a, a.id).then(res => {
            if (res.ok) { history.push('/profile') }
        })
    }

    return (
        <>
            <h2>Edit Profile</h2>

            <fieldset>
                <label htmlFor="firstName"> First Name </label>
                <input type="text" name="firstName" className="form-control" placeholder={athlete.firstName} required autoFocus onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="lastName"> Last Name </label>
                <input type="text" name="lastName" placeholder={athlete.lastName} className="form-control" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="inputPassword">New Password </label>
                <input type="password" name="password" className="form-control" placeholder="Password" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="verifyPassword">Verify New Password </label>
                <input type="password" name="verifyPassword" className="form-control" placeholder="Verify password" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="bio">Bio </label>
                <textarea name="bio" className="form-control" className="form-control" placeholder={athlete.bio} required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="rhr">Resting Heart Rate </label>
                <input type="number" name="rhr" className="form-control" placeholder={athlete.rhr} onChange={handleUser} /> bpm
            </fieldset>
            <fieldset>
                <label htmlFor="vo2"> Vo2Max </label>
                <input type="number" placeholder={athlete.VO2max} className="form-control" name="VO2max" step="0.01" onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="fluidLoss">Fluid loss</label>
                <input type="number" placeholder={athlete.fluidLoss} className="form-control" name="fluidLoss" step="0.01" onChange={handleUser} /> L/hr
            </fieldset>
            <fieldset>
                <label htmlFor="sodiumLoss">Sodium Loss</label>
                <input type="number" placeholder={athlete.sodiumLoss} className="form-control" name="sodiumLoss" onChange={handleUser} /> mg/hr
            </fieldset>
            <fieldset>
                <label htmlFor="weight">Weight </label>
                <input type="number" placeholder={athlete.weight} className="form-control" name="weight" onChange={handleUser} /> lbs
            </fieldset>
            <fieldset style={{
                textAlign: "center"
            }}>
                <button type="submit" onClick={handleUpdate}>Save</button>
            </fieldset>
        </>
    )
}