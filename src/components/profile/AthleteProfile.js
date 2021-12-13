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

                <div className="profile-div">
                    <hr />
                    <h3>Training Tools</h3>
                    <div>
                        <b className="profile-detail">{"VO2 Max: "}</b>
                        {athlete.VO2_max !== "" ?
                            <>
                                {athlete.VO2_max} mL/kg/min
                                <button onClick={() => { history.push("/vo2max") }}>
                                    Take Test
                                </button>
                            </>
                            :
                            <button>
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

                    <input type="radio" checked={hrTable.hr} onChange={() => setHRtable({ hr: true })} />
                    <label htmlFor="HR">Standard HR Zones</label>
                    <input type="radio" checked={hrTable.hrr} onChange={() => setHRtable({ hrr: true })} />
                    <label htmlFor="HRR">Heart Rate Reserve Target Zones</label>

                    {hrTable.hr ? <HRZones age={athlete.age} /> : ""}
                    {hrTable.hrr ? <HRR age={athlete.age} rhr={athlete.rhr} /> : ""}

                </div>

            </article>
        </>
    )
}