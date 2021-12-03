import React, { useState } from "react";

export const RegisterAthlete = ({ handleUser, handleRadios, newUser }) => {

    const [unknown, setUnknown] = useState({
        VO2max:false,
        fluidLoss:false,
        sodiumLoss:false
    })

    const handleUnknown = (e) => {
        const [, name] = e.target.name.split('-')
        const copy = { ...unknown }
        if (copy[name] === true) {
            copy[name] = false
            setUnknown(copy)
        } else {
            copy[name] = true
            setUnknown(copy)
        }
    }

    return (
        <>
            <fieldset>
                <label htmlFor="firstName"> First Name </label>
                <input type="text" name="firstName" className="form-control" placeholder="First name" required autoFocus onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="lastName"> Last Name </label>
                <input type="text" name="lastName" className="form-control" placeholder="Last name" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="inputUsername">Username</label>
                <input type="text" name="username" className="form-control" placeholder="Username" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="inputEmail">Email </label>
                <input type="text" name="email" className="form-control" placeholder="email@email.com" required onChange={handleUser}/>
            </fieldset>
            <fieldset>
                <label htmlFor="inputPassword">Password </label>
                <input type="password" name="password" className="form-control" placeholder="Password" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="verifyPassword">Verify Password </label>
                <input type="password" name="verifyPassword" className="form-control" placeholder="Verify password" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="dob">DOB </label>
                <input type="date" name="dob" className="form-control" placeholder="Verify password" required onChange={handleUser} />
            </fieldset>
            <fieldset>
                <label htmlFor="bio">Bio </label>
                <textarea name="bio" className="form-control" placeholder="What sports are you into? What are your goals?" required onChange={handleUser}/>
            </fieldset>
            <fieldset>

                <label htmlFor="sex"> Sex </label>
                <input type="radio" name="M" checked={newUser.sex === "M" ? true : false} onChange={handleRadios} />
                <label htmlFor="M">Male</label>
                <input type="radio" name="F" checked={newUser.sex === "F" ? true : false} onChange={handleRadios} />
                <label htmlFor="F">Female</label> (Required for VO2max calculations)
            </fieldset>
            <fieldset>
                <label htmlFor="rhr">Resting Heart Rate </label>
                <input type="number" name="rhr" onChange={handleUser} /> bpm
            </fieldset>
            <fieldset>
                <label htmlFor="vo2"> Vo2Max </label>
                {unknown.VO2max === false ?
                    <>
                        <input type="number" name="VO2max" step="0.01" onChange={handleUser} />
                        <input type="checkbox" checked={false} name="unknown-VO2max" onChange={handleUnknown} /> I don't know
                    </>
                    : <>
                        <input type="checkbox" name="unknown-VO2max" onChange={handleUnknown} checked={true} />
                        I don't know. | Kinetic can help determine this later.
                    </>
                }
            </fieldset>
            <fieldset>
                <label htmlFor="fluidLoss">Fluid loss</label>
                {unknown.fluidLoss === false ?
                    <>
                        <input type="number" name="fluidLoss" step="0.01" onChange={handleUser} /> L/hr
                        <input type="checkbox" checked={false} name="unknown-fluidLoss" onChange={handleUnknown} /> I don't know
                    </>
                    :
                    <>
                        <input type="checkbox" name="unknown-fluidLoss" step="0.01" onChange={handleUnknown} checked={true} />
                        I don't know. | Kinetic can help determine this later.
                    </>
                }
            </fieldset>
            <fieldset>
                <label htmlFor="sodiumLoss">Sodium Loss</label>
                {unknown.sodiumLoss === false ?
                    <>
                        <input type="number" name="sodiumLoss" onChange={handleUser} /> mg/hr
                        <input type="checkbox" checked={false} name="unknown-sodiumLoss" onChange={handleUnknown} /> I don't know
                    </>
                    : <>
                        <input type="checkbox" name="unknown-sodiumLoss" onChange={handleUnknown} checked={true} />
                        I don't know. | Kinetic can help determine this later.
                    </>
                }
            </fieldset>
            <fieldset>
                <label htmlFor="weight">Weight </label>
                <input type="number" name="weight" onChange={handleUser} /> lbs
            </fieldset>
            <fieldset>
                <label htmlFor="height">Height </label>
                <input type="number" name="height" onChange={handleUser} /> inches
            </fieldset>
            <fieldset style={{
                textAlign: "center"
            }}>
                <button className="btn btn-1 btn-sep icon-send" type="submit">Register</button>
            </fieldset>
        </>
    )
}