import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAthlete } from "./AthleteProvider";
import { HRZones } from "./trainingTools/HeartRateZones";
import { HRR } from "./trainingTools/HRR";

export const AthleteProfile = () => {
    const [athlete, setAthlete] = useState({})
    const history = useHistory()

    useEffect(() => {
        getAthlete()
            .then(athlete => setAthlete(athlete))
    }, []
    )

    return (
        <>
            <h2>My Profile</h2>

            <div>
                About me: {athlete.bio}
            </div>
            <div>
                <button>
                    Edit Profile
                </button>
            </div>

            <div>
                <h3>Training Tools</h3>
                <div>
                    {"VO2 Max: "}
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
                    Fluid Loss: {athlete.fluid_loss} L/hr
                </div>
                <div>
                    Sodium Loss: {athlete.sodium_loss} mg/hr
                </div>


                <HRZones age={athlete.age} />
                <HRR age={athlete.age} rhr={athlete.rhr} />

            </div>
        </>
    )
}