import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAthlete } from "./AthleteProvider";
import { HRZones } from "./trainingTools/HeartRateZones";
import { HRR } from "./trainingTools/HRR";
import "./AthleteProfile.css"

export const AthleteProfile = () => {
    const [athlete, setAthlete] = useState({})
    const [hrTable, setHRtable] = useState({})
    const history = useHistory()

    useEffect(() => {
        getAthlete()
            .then(athlete => setAthlete(athlete))
    }, []
    )

    return (
        <>
            <article className="profile">

                <h1 className="athlete-title">{athlete.user?.first_name} {athlete.user?.last_name} {`// Athlete Profile`}
                    <button className="gear-button" onClick={() => history.push("/editProfile")}> ⚙️
                    </button>
                </h1>

                <div className="profile-div">
                    <h3>About me</h3>
                    {athlete.bio}
                </div>

                <hr />
                <h3>Training Tools</h3>
                <section className="profile-div training-tools">
                    <div className="training-stats">
                        <div>
                            <b className="profile-detail">{"VO2 Max: "}</b>
                            {athlete.VO2_max !== "" ?
                                <>
                                    {athlete.VO2_max} mL/kg/min
                                    <button className="raceSim"
                                        onClick={() => { history.push("/vo2max") }}>
                                        Take Test
                                    </button>
                                </>
                                :
                                <button className="raceSim">
                                    Take Test
                                </button>
                            }
                        </div>
                        <div>
                            <b className="profile-detail">Fluid Loss: </b>
                            {athlete.fluid_loss} L/hr
                        </div>
                        <div>
                            <b className="profile-detail">Sodium Loss: </b>
                            {athlete.sodium_loss} mg/hr
                        </div>
                        <div>
                            <b className="profile-detail">Resting heart rate: </b>
                            {athlete.rhr} bpm
                        </div>
                        <div>
                            <b className="profile-detail">HRmax: </b>
                            {220 - athlete.age} bpm
                        </div>
                    </div>

                    <div className="HR-div">
                        <div>
                            <h3>
                                Upcoming Race?
                                <br />Discover fueling and hydration strategies using Kinetic's
                                <button className="raceSim" onClick={() => history.push("/race-simulator")}>
                                    Race Simulator</button>
                            </h3>
                        </div>

                        <div>
                            Training or racing by heart rate zones, combined with perceived exertion is a more objective way of gauging exercise intensity.
                        </div>

                        <div className="HR-radio-div">
                            <input type="radio" className="HR-radio" checked={hrTable.hr} onChange={() => setHRtable({ hr: true })} />
                            <label htmlFor="HR">Standard HR Zones</label>
                            <input type="radio" className="HR-radio" checked={hrTable.hrr} onChange={() => setHRtable({ hrr: true })} />
                            <label htmlFor="HRR">Heart Rate Reserve Target Zones</label>
                        </div>

                        {hrTable.hr ? <HRZones age={athlete.age} /> : ""}
                        {hrTable.hrr ? <HRR age={athlete.age} rhr={athlete.rhr} /> : ""}
                    </div>

                </section>

            </article>
        </>
    )
}