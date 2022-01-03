import React, { useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import "./Auth.css"
import "../nav/NavBar.css"
import { registerUser } from "./AuthProvider"
import { RegisterAthlete } from "./RegisterAthlete"
import { RegisterOrganizer } from "./RegisterOrganizer"
import loading from "../../Infinity.gif"


export const Register = () => {
    const [newUser, setUser] = useState({})
    const [isAthlete, setAthlete] = useState(true)
    const passwordDialog = useRef()
    const history = useHistory()
    const savingModal = useRef()

    const handleRadios = (e) => {
        if (e.target.name === "athlete") {
            setAthlete(true)
        } else if (e.target.name === "organizer") { setAthlete(false) }
        else if (e.target.name === "M" || e.target.name === "F") {
            const user = { ...newUser }
            user.sex = e.target.name
            setUser(user)
        }
    }

    const handleUser = (e) => {
        const user = { ...newUser }
        user[e.target.name] = e.target.value
        setUser(user)
    }

    const handleRegister = (e) => {
        e.preventDefault()

        if (newUser.password === newUser.verifyPassword && isAthlete) {
            savingModal.current.showModal()
            const new_user = { ...newUser }
            new_user.rhr = parseInt(newUser.rhr)
            new_user.VO2max = parseFloat(newUser.VO2max)
            new_user.fluidLoss = parseFloat(newUser.fluidLoss)
            new_user.sodiumLoss = parseFloat(newUser.sodiumLoss)
            new_user.weight = parseInt(newUser.weight)
            new_user.height = parseInt(newUser.height)
            new_user.isAthlete = true
            registerUser(new_user)
                .then(res => {
                    if ("token" in res) {
                        localStorage.setItem("kinetic_token", res.token)
                        localStorage.setItem("is_athlete", true)
                        localStorage.setItem("kinetic_username", new_user.username)
                        setTimeout(() => history.push("/"), 1500)
                    }
                })
        }
        else if (newUser.password === newUser.verifyPassword && !isAthlete) {
            savingModal.current.showModal()
            const new_user = { ...newUser }
            new_user.isAthlete = false
            registerUser(new_user)
                .then(res => {
                    if ("token" in res) {
                        localStorage.setItem("kinetic_token", res.token)
                        localStorage.setItem("is_athlete", false)
                        localStorage.setItem("kinetic_username", new_user.username)
                        setTimeout(() => history.push("/"), 1500)
                    }
                })
        }
        else { passwordDialog.current.showModal() }
    }

    return (
        <>
            <dialog ref={savingModal} className="fs-modal">
                <div className="loading-icon">
                    <img src={loading} alt="loading"/><br />
                    <span>Creating User</span>
                </div>
            </dialog>
            <main style={{ textAlign: "center" }}>

                <h2 className="kinetic">Kinetic</h2>

                <dialog className="dialog dialog--password" ref={passwordDialog}>
                    <div>Passwords do not match</div>
                    <button className="button--close" onClick={e => passwordDialog.current.close()}>Close</button>
                </dialog>

                <form className="form--login" onSubmit={handleRegister}>

                    <h1 className="h3 mb-3 font-weight-normal">
                        Register {isAthlete === true ? "Athlete" : "Event Organizer"}</h1>
                    <div className="user_type">
                        <fieldset>
                            <input type="radio" name="athlete" checked={isAthlete === true ? true : false} onChange={handleRadios} />
                            <label htmlFor="athlete">Athlete</label>
                            <input type="radio" name="organizer" checked={isAthlete === false ? true : false} onChange={handleRadios} />
                            <label htmlFor="organizer">Event Organizer</label>
                        </fieldset>
                    </div>

                    {isAthlete ?
                        <RegisterAthlete handleUser={handleUser} handleRadios={handleRadios} newUser={newUser} />
                        :
                        <RegisterOrganizer handleUser={handleUser} />
                    }

                </form>
                <section className="link--register">
                    Already registered? <Link to="/login">Login</Link>
                </section>
            </main>
        </>
    )
}