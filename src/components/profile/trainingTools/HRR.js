import React from "react";

export const HRR = ({ age, rhr }) => {

    const maxHR = 220 - age
    const hrr = maxHR - rhr
    const z1_min = Math.ceil(hrr * 0.5) + rhr
    const z1_max = Math.ceil(hrr * 0.6) + rhr
    const z2_min = Math.ceil(hrr * 0.61) + rhr
    const z2_max = Math.ceil(hrr * 0.7) + rhr
    const z3_min = Math.ceil(hrr * 0.71) + rhr
    const z3_max = Math.ceil(hrr * 0.8) + rhr
    const z4_min = Math.ceil(hrr * 0.81) + rhr
    const z4_max = Math.ceil(hrr * 0.9) + rhr
    const z5_min = Math.ceil(hrr * 0.91) + rhr
    const z5_max = Math.ceil(hrr * 1) + rhr

    return (
        <>
            <section className="HR-table-about">
                <div className="HR-table">
                    <table className="hr-zones">
                        <thead>
                            <th colSpan="4">
                                Target Zones - Heart Rate Reserve
                            </th>
                            <tr className="hr-heading">
                                <td>Zone</td>
                                <td>Intensity</td>
                                <td>HR range</td>
                                <td>% of HRR</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="z1">
                                <td>Zone 1</td>
                                <td> Very light</td>
                                <td>{z1_min} - {z1_max} bpm</td>
                                <td>50-60%</td>
                            </tr>
                            <tr className="z2">
                                <td>Zone 2</td>
                                <td>Light</td>
                                <td>{z2_min} - {z2_max} bpm</td>
                                <td>61-70%</td>
                            </tr>
                            <tr className="z3">
                                <td>Zone 3</td>
                                <td>Moderate</td>
                                <td>{z3_min} - {z3_max} bpm</td>
                                <td>71-80%</td>
                            </tr>
                            <tr className="z4">
                                <td>Zone 4</td>
                                <td>Hard</td>
                                <td>{z4_min} - {z4_max} bpm</td>
                                <td>81-90%</td>
                            </tr>
                            <tr className="z5">
                                <td>Zone 5</td>
                                <td>Max Effort</td>
                                <td>{z5_min} - {z5_max} bpm</td>
                                <td>91-100%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="HR-about">
                <b>Heart Rate Reserve</b> accounts for resting HR along with max HR and is a more accurate measure of training intensity vs standard HR zones.
                <br/>Heart Rate Reserve (HRR) = HRmax - HRrest
                </div>
            </section>
        </>
    )
}